
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getCategoryLabel, getCategoryIcon } from "@/utils/equipment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { fetchEquipmentById, fetchEquipmentHistory } from "@/services/equipmentService";
import { Equipment } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Используем React Query для получения оборудования
  const { 
    data: equipment, 
    isLoading: isLoadingEquipment,
    error: equipmentError
  } = useQuery({
    queryKey: ['equipment', id],
    queryFn: () => fetchEquipmentById(id || ""),
    enabled: !!id
  });
  
  // Используем React Query для получения истории оборудования
  const { 
    data: history, 
    isLoading: isLoadingHistory 
  } = useQuery({
    queryKey: ['equipment-history', id],
    queryFn: () => fetchEquipmentHistory(id || ""),
    enabled: !!id
  });

  // Показываем сообщение об ошибке
  useEffect(() => {
    if (equipmentError) {
      toast.error("Не удалось загрузить данные об оборудовании");
      console.error("Error loading equipment:", equipmentError);
    }
  }, [equipmentError]);

  // Показываем индикатор загрузки
  if (isLoadingEquipment) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <p className="text-lg text-muted-foreground">Загрузка данных...</p>
        </div>
      </Layout>
    );
  }

  // Показываем сообщение, если оборудование не найдено
  if (!equipment) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <p className="text-lg text-muted-foreground">Оборудование не найдено</p>
          <Button onClick={() => navigate("/catalog")}>
            Вернуться к каталогу
          </Button>
        </div>
      </Layout>
    );
  }

  const formattedDate = (dateString: string) => {
    if (!dateString) return "Не указано";
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Навигация и заголовок */}
        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{equipment.name}</h1>
              <p className="text-muted-foreground">
                Инвентарный номер: {equipment.inventoryNumber}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center" onClick={() => navigate(`/edit/${equipment.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Изменить
            </Button>
            <Button variant="destructive" className="flex items-center">
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </Button>
          </div>
        </div>

        {/* Основная информация */}
        <Tabs defaultValue="general">
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-3 w-full max-w-lg">
              <TabsTrigger value="general">Основное</TabsTrigger>
              <TabsTrigger value="history">История</TabsTrigger>
              <TabsTrigger value="documents">Документы</TabsTrigger>
            </TabsList>
          </div>
          
          {/* Основная информация */}
          <TabsContent value="general">
            <div className="grid md:grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                  <CardDescription>Подробные сведения об оборудовании</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Название</p>
                        <p>{equipment.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Инвентарный номер</p>
                        <p>{equipment.inventoryNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Категория</p>
                        <div className="flex items-center">
                          <span className="mr-2">{getCategoryIcon(equipment.category)}</span>
                          <span>{getCategoryLabel(equipment.category)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Статус</p>
                        <StatusBadge status={equipment.status} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Дата покупки</p>
                        <p>{formattedDate(equipment.purchaseDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Ответственный</p>
                        <p>{equipment.responsiblePerson}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Расположение</p>
                        <p>{equipment.location}</p>
                      </div>
                    </div>

                    {equipment.description && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Описание</p>
                        <p className="text-sm">{equipment.description}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* История */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>История изменений</CardTitle>
                <CardDescription>
                  Записи о действиях с оборудованием
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">Загрузка истории...</p>
                  </div>
                ) : history && history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((entry) => (
                      <div key={entry.id} className="border rounded-md p-4">
                        <div className="flex justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {formattedDate(entry.performed_at)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Исполнитель: {entry.performed_by}
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm">{entry.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">История изменений пуста</p>
                  </div>
                )}
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    Добавить запись
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Документы */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Документы</CardTitle>
                <CardDescription>
                  Документы, связанные с оборудованием
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Документы не найдены</p>
                  <Button variant="outline" className="mt-4">
                    Загрузить документ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EquipmentDetail;
