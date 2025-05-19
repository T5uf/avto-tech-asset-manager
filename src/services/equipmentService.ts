
import { supabase } from "@/integrations/supabase/client";
import { Equipment, EquipmentCategory, EquipmentStatus } from "@/types";

// Получение списка всего оборудования
export const fetchAllEquipment = async (): Promise<Equipment[]> => {
  const { data, error } = await supabase
    .from('equipment')
    .select(`
      *,
      category:category_id(name),
      status:status_id(name, color)
    `);

  if (error) {
    console.error("Error fetching equipment:", error);
    throw error;
  }

  return data.map(item => mapDbEquipmentToModel(item));
};

// Получение оборудования по ID
export const fetchEquipmentById = async (id: string): Promise<Equipment | null> => {
  // Проверяем, имеет ли ID формат UUID
  if (!isValidUuid(id)) {
    console.error(`Invalid UUID format for equipment ID: ${id}`);
    return null;
  }

  const { data, error } = await supabase
    .from('equipment')
    .select(`
      *,
      category:category_id(name),
      status:status_id(name, color)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching equipment with id ${id}:`, error);
    return null;
  }

  return mapDbEquipmentToModel(data);
};

// Функция для проверки валидности UUID
function isValidUuid(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Получение отфильтрованного оборудования
export const fetchFilteredEquipment = async (
  searchTerm: string = "",
  category: EquipmentCategory | "all" = "all",
  status: EquipmentStatus | "all" = "all"
): Promise<Equipment[]> => {
  let query = supabase
    .from('equipment')
    .select(`
      *,
      category:category_id(name),
      status:status_id(name, color)
    `);

  // Поиск по названию, инвентарному номеру, местоположению или описанию
  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,inventory_number.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }

  // Фильтр по категории
  if (category && category !== "all") {
    const { data: categoryData } = await supabase
      .from('equipment_categories')
      .select('id')
      .eq('name', category)
      .single();
    
    if (categoryData) {
      query = query.eq('category_id', categoryData.id);
    }
  }

  // Фильтр по статусу
  if (status && status !== "all") {
    const { data: statusData } = await supabase
      .from('equipment_statuses')
      .select('id')
      .eq('name', status)
      .single();
    
    if (statusData) {
      query = query.eq('status_id', statusData.id);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching filtered equipment:", error);
    throw error;
  }

  return data.map(item => mapDbEquipmentToModel(item));
};

// Сохранение оборудования (создание или обновление)
export const saveEquipmentToDb = async (equipment: Partial<Equipment>): Promise<Equipment> => {
  try {
    // Получаем ID категории
    const { data: categoryData } = await supabase
      .from('equipment_categories')
      .select('id')
      .eq('name', equipment.category)
      .single();

    // Получаем ID статуса
    const { data: statusData } = await supabase
      .from('equipment_statuses')
      .select('id')
      .eq('name', equipment.status)
      .single();

    if (!categoryData || !statusData) {
      throw new Error("Категория или статус не найдены");
    }

    const equipmentData = {
      name: equipment.name,
      inventory_number: equipment.inventoryNumber,
      category_id: categoryData.id,
      status_id: statusData.id,
      purchase_date: equipment.purchaseDate,
      responsible_person: equipment.responsiblePerson,
      location: equipment.location,
      description: equipment.description,
      image_url: equipment.imageUrl || "/placeholder.svg",
    };

    let result;

    if (equipment.id && isValidUuid(equipment.id)) {
      // Обновление существующего оборудования
      const { data, error } = await supabase
        .from('equipment')
        .update(equipmentData)
        .eq('id', equipment.id)
        .select(`
          *,
          category:category_id(name),
          status:status_id(name, color)
        `)
        .single();

      if (error) throw error;
      result = data;

      // Добавляем запись в историю об обновлении
      await supabase.from('equipment_history').insert({
        equipment_id: equipment.id,
        action: 'update',
        description: 'Обновлена информация об оборудовании',
        performed_by: equipment.responsiblePerson || 'Система'
      });
    } else {
      // Создание нового оборудования
      const { data, error } = await supabase
        .from('equipment')
        .insert(equipmentData)
        .select(`
          *,
          category:category_id(name),
          status:status_id(name, color)
        `)
        .single();

      if (error) throw error;
      result = data;

      // Добавляем запись в историю о создании
      await supabase.from('equipment_history').insert({
        equipment_id: result.id,
        action: 'create',
        description: 'Добавлено новое оборудование',
        performed_by: equipment.responsiblePerson || 'Система'
      });
    }

    return mapDbEquipmentToModel(result);
  } catch (error) {
    console.error("Error saving equipment:", error);
    throw error;
  }
};

// Получение истории оборудования
export const fetchEquipmentHistory = async (equipmentId: string) => {
  // Проверяем, имеет ли ID формат UUID
  if (!isValidUuid(equipmentId)) {
    console.error(`Invalid UUID format for equipment ID: ${equipmentId}`);
    return [];
  }
  
  const { data, error } = await supabase
    .from('equipment_history')
    .select('*')
    .eq('equipment_id', equipmentId)
    .order('performed_at', { ascending: false });

  if (error) {
    console.error(`Error fetching history for equipment ${equipmentId}:`, error);
    throw error;
  }

  return data;
};

// Добавление записи в историю
export const addHistoryEntry = async (
  equipmentId: string,
  action: string,
  description: string,
  performedBy: string
) => {
  if (!isValidUuid(equipmentId)) {
    console.error(`Invalid UUID format for equipment ID: ${equipmentId}`);
    return null;
  }
  
  const { data, error } = await supabase
    .from('equipment_history')
    .insert({
      equipment_id: equipmentId,
      action,
      description,
      performed_by: performedBy
    })
    .select();

  if (error) {
    console.error("Error adding history entry:", error);
    throw error;
  }

  return data;
};

// Функции для получения статистики
export const getEquipmentCounts = async () => {
  // Получаем данные по статусам
  const { data: statusData, error: statusError } = await supabase
    .from('equipment_statuses')
    .select('name, id');

  if (statusError) {
    console.error("Error fetching statuses:", statusError);
    throw statusError;
  }

  // Получаем количество оборудования по каждому статусу
  const countsPromises = statusData.map(async (status) => {
    const { count, error } = await supabase
      .from('equipment')
      .select('*', { count: 'exact', head: true })
      .eq('status_id', status.id);

    if (error) {
      console.error(`Error counting equipment with status ${status.name}:`, error);
      throw error;
    }

    return { status: status.name, count: count || 0 };
  });

  const counts = await Promise.all(countsPromises);

  // Получаем общее количество оборудования
  const { count: total, error: totalError } = await supabase
    .from('equipment')
    .select('*', { count: 'exact', head: true });

  if (totalError) {
    console.error("Error counting total equipment:", totalError);
    throw totalError;
  }

  // Преобразуем в нужный формат
  const result = {
    active: counts.find(c => c.status === 'active')?.count || 0,
    repair: counts.find(c => c.status === 'repair')?.count || 0,
    storage: counts.find(c => c.status === 'storage')?.count || 0,
    'written-off': counts.find(c => c.status === 'written-off')?.count || 0,
    total: total || 0
  };

  return result;
};

export const getCategoryCounts = async () => {
  // Получаем данные по категориям
  const { data: categoryData, error: categoryError } = await supabase
    .from('equipment_categories')
    .select('name, id');

  if (categoryError) {
    console.error("Error fetching categories:", categoryError);
    throw categoryError;
  }

  // Получаем количество оборудования по каждой категории
  const countsPromises = categoryData.map(async (category) => {
    const { count, error } = await supabase
      .from('equipment')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', category.id);

    if (error) {
      console.error(`Error counting equipment with category ${category.name}:`, error);
      throw error;
    }

    return { category: category.name, count: count || 0 };
  });

  const counts = await Promise.all(countsPromises);

  // Преобразуем в нужный формат
  return {
    computer: counts.find(c => c.category === 'computer')?.count || 0,
    printer: counts.find(c => c.category === 'printer')?.count || 0,
    network: counts.find(c => c.category === 'network')?.count || 0,
    peripheral: counts.find(c => c.category === 'peripheral')?.count || 0,
    mobile: counts.find(c => c.category === 'mobile')?.count || 0,
    other: counts.find(c => c.category === 'other')?.count || 0
  };
};

// Вспомогательная функция для преобразования данных из БД в модель приложения
function mapDbEquipmentToModel(dbEquipment: any): Equipment {
  if (!dbEquipment) return {} as Equipment;

  return {
    id: dbEquipment.id,
    name: dbEquipment.name,
    inventoryNumber: dbEquipment.inventory_number,
    category: dbEquipment.category?.name || 'other',
    status: dbEquipment.status?.name || 'active',
    purchaseDate: dbEquipment.purchase_date,
    responsiblePerson: dbEquipment.responsible_person,
    location: dbEquipment.location,
    description: dbEquipment.description,
    imageUrl: dbEquipment.image_url,
    image: dbEquipment.image_url || "/placeholder.svg",
    qrCode: dbEquipment.qr_code
  };
}
