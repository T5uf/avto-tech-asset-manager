
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { saveEquipmentToDb, fetchEquipmentById, isValidUuid } from "@/services/equipmentService";
import { toast } from "@/components/ui/sonner";
import { useQuery } from "@tanstack/react-query";
import { EquipmentCategory, EquipmentStatus } from "@/types";

const EquipmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Используем React Query для получения данных оборудования при редактировании
  const { 
    data: existingEquipment, 
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['equipment', id],
    queryFn: () => fetchEquipmentById(id || ""),
    enabled: isEditMode && !!id && isValidUuid(id || ""),
    refetchOnWindowFocus: false
  });
  
  // Форма состояния
  const [formData, setFormData] = useState({
    name: "",
    inventoryNumber: "",
    category: "computer" as EquipmentCategory,
    status: "active" as EquipmentStatus,
    purchaseDate: new Date().toISOString().split('T')[0],
    responsiblePerson: "",
    location: "",
    description: ""
  });

  // Состояние валидации
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Проверяем валидность ID при редактировании
  useEffect(() => {
    if (isEditMode && id && !isValidUuid(id)) {
      toast.error("Неверный формат ID оборудования");
      navigate("/catalog");
    }
  }, [id, isEditMode, navigate]);
  
  // Обновление формы при получении данных
  useEffect(() => {
    if (existingEquipment) {
      setFormData({
        name: existingEquipment.name || "",
        inventoryNumber: existingEquipment.inventoryNumber || "",
        category: existingEquipment.category || "computer" as EquipmentCategory,
        status: existingEquipment.status || "active" as EquipmentStatus,
        purchaseDate: existingEquipment.purchaseDate || new Date().toISOString().split('T')[0],
        responsiblePerson: existingEquipment.responsiblePerson || "",
        location: existingEquipment.location || "",
        description: existingEquipment.description || ""
      });
    }
  }, [existingEquipment]);
  
  // Обработка изменений полей формы
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Очищаем ошибку поля при его изменении
    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: ""
      });
    }
  };
  
  // Валидация формы
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Необходимо указать название";
    }
    
    if (!formData.inventoryNumber.trim()) {
      errors.inventoryNumber = "Необходимо указать инвентарный номер";
    }
    
    if (!formData.responsiblePerson.trim()) {
      errors.responsiblePerson = "Необходимо указать ответственное лицо";
    }
    
    if (!formData.location.trim()) {
      errors.location = "Необходимо указать местоположение";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Подготовка данных для сохранения
      const equipmentData = {
        id: isEditMode ? id : undefined,
        name: formData.name,
        inventoryNumber: formData.inventoryNumber,
        category: formData.category as EquipmentCategory,
        status: formData.status as EquipmentStatus,
        purchaseDate: formData.purchaseDate,
        responsiblePerson: formData.responsiblePerson,
        location: formData.location,
        description: formData.description,
      };
      
      // Сохранение данных оборудования
      const savedEquipment = await saveEquipmentToDb(equipmentData);
      
      toast.success(
        isEditMode 
          ? "Информация об оборудовании успешно обновлена" 
          : "Оборудование успешно добавлено"
      );
      
      // Перенаправление после успешной операции
      navigate(isEditMode ? `/equipment/${savedEquipment.id}` : "/catalog");
    } catch (error) {
      console.error("Error saving equipment:", error);
      toast.error("Произошла ошибка при сохранении");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Показываем индикатор загрузки при получении данных
  if (isEditMode && isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-8">
          <p>Загрузка данных...</p>
        </div>
      </Layout>
    );
  }

  // Показываем сообщение об ошибке
  if (isEditMode && isError) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-red-500 mb-4">Ошибка загрузки данных оборудования</p>
          <Button onClick={() => navigate("/catalog")}>Вернуться к каталогу</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Навигация и заголовок */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditMode ? "Редактирование оборудования" : "Добавление оборудования"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode 
                ? "Измените информацию об оборудовании" 
                : "Введите данные нового оборудования"}
            </p>
          </div>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit}>
          <Card className="lg:max-w-2xl">
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
              <CardDescription>
                Основные характеристики оборудования
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="form-group">
                <Label htmlFor="name">Название*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className={validationErrors.name ? "border-red-500" : ""}
                />
                {validationErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.name}</p>
                )}
              </div>

              <div className="form-group">
                <Label htmlFor="inventoryNumber">Инвентарный номер*</Label>
                <Input
                  id="inventoryNumber"
                  value={formData.inventoryNumber}
                  onChange={(e) => handleChange("inventoryNumber", e.target.value)}
                  required
                  className={validationErrors.inventoryNumber ? "border-red-500" : ""}
                />
                {validationErrors.inventoryNumber && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.inventoryNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <Label htmlFor="category">Категория*</Label>
                  <Select 
                    value={formData.category}
                    onValueChange={(value) => handleChange("category", value as EquipmentCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer">Компьютеры</SelectItem>
                      <SelectItem value="printer">Принтеры</SelectItem>
                      <SelectItem value="network">Сетевое оборудование</SelectItem>
                      <SelectItem value="peripheral">Периферия</SelectItem>
                      <SelectItem value="mobile">Мобильные устройства</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-group">
                  <Label htmlFor="status">Статус*</Label>
                  <Select 
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value as EquipmentStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">В работе</SelectItem>
                      <SelectItem value="repair">На ремонте</SelectItem>
                      <SelectItem value="storage">На складе</SelectItem>
                      <SelectItem value="written-off">Списано</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="form-group">
                <Label htmlFor="purchaseDate">Дата покупки*</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleChange("purchaseDate", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <Label htmlFor="responsiblePerson">Ответственный*</Label>
                <Input
                  id="responsiblePerson"
                  value={formData.responsiblePerson}
                  onChange={(e) => handleChange("responsiblePerson", e.target.value)}
                  required
                  className={validationErrors.responsiblePerson ? "border-red-500" : ""}
                />
                {validationErrors.responsiblePerson && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.responsiblePerson}</p>
                )}
              </div>

              <div className="form-group">
                <Label htmlFor="location">Расположение*</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  required
                  className={validationErrors.location ? "border-red-500" : ""}
                />
                {validationErrors.location && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.location}</p>
                )}
              </div>

              <div className="form-group">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => navigate(-1)} type="button">
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Сохранение..." : isEditMode ? "Сохранить изменения" : "Добавить оборудование"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default EquipmentForm;
