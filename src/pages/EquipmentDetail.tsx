import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getCategoryLabel, getCategoryIcon } from "@/utils/equipment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, AlertCircle, Loader2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { fetchEquipmentById, fetchEquipmentHistory, isValidUuid, deleteEquipment, addHistoryEntry } from "@/services/equipmentService";
import { Equipment } from "@/types";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const historyFormSchema = z.object({
  action: z.string().min(1, { message: "Необходимо выбрать тип действия" }),
  description: z.string().min(3, { message: "Описание должно содержать минимум 3 символа" }),
  performedBy: z.string().min(2, { message: "Имя исполнителя должно содержать минимум 2 символа" }),
});

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [historyDialog, setHistoryDialog] = useState(false);
  const queryClient = useQueryClient();
  
  // Проверяем валидность ID перед запросом
  const isValidId = id && isValidUuid(id);
  
  // Используем React Query для получения оборудования
  const { 
    data: equipment, 
    isLoading: isLoadingEquipment,
    error: equipmentError,
    isError: isEquipmentError
  } = useQuery({
    queryKey: ['equipment', id],
    queryFn: () => fetchEquipmentById(id || ""),
    enabled: !!isValidId,
    refetchOnWindowFocus: false
  });
  
  // Используем React Query для получения истории оборудования
  const { 
    data: history = [], 
    isLoading: isLoadingHistory,
    refetch: refetchHistory 
  } = useQuery({
    queryKey: ['equipment-history', id],
    queryFn: () => fetchEquipmentHistory(id || ""),
    enabled: !!isValidId && !!equipment,
    refetchOnWindowFocus: false
  });

  // Инициализация формы для добавления истории
  const historyForm = useForm<z.infer<typeof historyFormSchema>>({
    resolver: zodResolver(historyFormSchema),
    defaultValues: {
      action: "move",
      description: "",
      performedBy: "",
    },
  });

  // Мутация для добавления истории
  const addHistoryMutation = useMutation({
    mutationFn: (values: z.infer<typeof historyFormSchema>) => {
      if (!id) throw new Error("ID оборудования не определен");
      return addHistoryEntry(
        id,
        values.action,
        values.description,
        values.performedBy
      );
    },
    onSuccess: () => {
      toast.success("Запись успешно добавлена в историю");
      setHistoryDialog(false);
      historyForm.reset();
      // Обновляем данные истории
      queryClient.invalidateQueries({ queryKey: ['equipment-history', id] });
      refetchHistory();
    },
    onError: (error) => {
      toast.error("Ошибка при добавлении записи в историю");
      console.error("Error adding history:", error);
    },
  });

  // Обработчик отправки формы истории
  const onSubmitHistory = (values: z.infer<typeof historyFormSchema>) => {
    addHistoryMutation.mutate(values);
  };

  // Показываем сообщение об ошибке при неверном формате ID
  if (id && !isValidId) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-xl font-semibold">Неверный формат ID оборудования</p>
          <Button onClick={() => navigate("/catalog")}>
            Вернуться к каталогу
          </Button>
        </div>
      </Layout>
    );
  }

  // Показываем индикатор загрузки
  if (isLoadingEquipment) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Загрузка данных...</p>
        </div>
      </Layout>
    );
  }

  // Показываем сообщение об ошибке
  if (isEquipmentError || !equipment) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-xl font-semibold">Оборудование не найдено</p>
          <p className="text-muted-foreground">
            Возможно, оборудование было удалено или у вас нет прав для его просмотра
          </p>
          <Button onClick={() => navigate("/catalog")}>
            Вернуться к каталогу
          </Button>
        </div>
      </Layout>
    );
  }

  const formattedDate = (dateString: string | undefined) => {
    if (!dateString) return "Не указано";
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
    } catch (error) {
      return dateString;
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteEquipment(id);
      
      if (success) {
        // Инвалидируем кэш React Query
        queryClient.invalidateQueries({ queryKey: ['all-equipment'] });
        queryClient.invalidateQueries({ queryKey: ['equipment-counts'] });
        queryClient.invalidateQueries({ queryKey: ['category-counts'] });
        
        toast.success("Оборудование успешно удалено");
        navigate("/catalog");
      } else {
        toast.error("Не удалось удалить оборудование");
      }
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast.error("Произошла ошибка при удалении оборудования");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
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
              <h1 className="text-3xl font-bold tracking-tight">{equipment?.name}</h1>
              <p className="text-muted-foreground">
                Инвентарный номер: {equipment?.inventoryNumber}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center" onClick={() => navigate(`/edit/${equipment?.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Изменить
            </Button>
            <Button 
              variant="destructive" 
              className="flex items-center"
              onClick={() => setShowDeleteDialog(true)}
            >
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Название</p>
                        <p>{equipment?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Инвентарный номер</p>
                        <p>{equipment?.inventoryNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Категория</p>
                        <div className="flex items-center">
                          <span className="mr-2">{equipment && getCategoryIcon(equipment.category)}</span>
                          <span>{equipment && getCategoryLabel(equipment.category)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Статус</p>
                        <StatusBadge status={equipment?.status || "active"} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Дата покупки</p>
                        <p>{formattedDate(equipment?.purchaseDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Ответственный</p>
                        <p>{equipment?.responsiblePerson}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Расположение</p>
                        <p>{equipment?.location}</p>
                      </div>
                    </div>

                    {equipment?.description && (
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

          {/* История - обновленный блок */}
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
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground mt-2">Загрузка истории...</p>
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
                        <div className="flex gap-2 mb-1">
                          <Badge variant="secondary">
                            {entry.action === 'move' && 'Перемещение'}
                            {entry.action === 'repair' && 'Ремонт'}
                            {entry.action === 'upgrade' && 'Обновление/улучшение'}
                            {entry.action === 'status-change' && 'Изменение статуса'}
                            {entry.action === 'create' && 'Создание'}
                            {entry.action === 'update' && 'Обновление'}
                            {!['move', 'repair', 'upgrade', 'status-change', 'create', 'update'].includes(entry.action) && entry.action}
                          </Badge>
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
                  <Button variant="outline" className="w-full" onClick={() => setHistoryDialog(true)}>
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

      {/* Диалог добавления записи в историю */}
      <Dialog open={historyDialog} onOpenChange={setHistoryDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Добавить запись в историю</DialogTitle>
            <DialogDescription>
              Добавьте новую запись о действии с оборудованием
            </DialogDescription>
          </DialogHeader>
          <Form {...historyForm}>
            <form onSubmit={historyForm.handleSubmit(onSubmitHistory)} className="space-y-4">
              <FormField
                control={historyForm.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип действия</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип действия" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="move">Перемещение</SelectItem>
                        <SelectItem value="repair">Ремонт</SelectItem>
                        <SelectItem value="upgrade">Обновление/улучшение</SelectItem>
                        <SelectItem value="status-change">Изменение статуса</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={historyForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Опишите выполненное действие"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={historyForm.control}
                name="performedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Исполнитель</FormLabel>
                    <FormControl>
                      <Input placeholder="Имя исполнителя" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={addHistoryMutation.isPending}
                >
                  {addHistoryMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    "Сохранить"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
            <AlertDialogDescription>
              Вы действительно хотите удалить оборудование "{equipment?.name}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                'Удалить'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default EquipmentDetail;
