
import { useState } from "react";
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
import { getEquipmentById } from "@/utils/equipment";
import { toast } from "@/components/ui/sonner";

const EquipmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Получаем данные оборудования, если это режим редактирования
  const existingEquipment = isEditMode ? getEquipmentById(id) : null;
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: existingEquipment?.name || "",
    inventoryNumber: existingEquipment?.inventoryNumber || "",
    category: existingEquipment?.category || "computer",
    status: existingEquipment?.status || "active",
    purchaseDate: existingEquipment?.purchaseDate || new Date().toISOString().split('T')[0],
    responsiblePerson: existingEquipment?.responsiblePerson || "",
    location: existingEquipment?.location || "",
    description: existingEquipment?.description || ""
  });
  
  // Обработка изменения полей формы
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  // Обработка отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // В реальном приложении здесь был бы API-запрос
    console.log("Форма отправлена:", formData);
    
    // Уведомление об успешной операции
    toast.success(
      isEditMode 
        ? "Информация об оборудовании успешно обновлена" 
        : "Оборудование успешно добавлено"
    );
    
    // Перенаправление после успешной операции
    navigate(isEditMode ? `/equipment/${id}` : "/catalog");
  };

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
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
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
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="inventoryNumber">Инвентарный номер*</Label>
                  <Input
                    id="inventoryNumber"
                    value={formData.inventoryNumber}
                    onChange={(e) => handleChange("inventoryNumber", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <Label htmlFor="category">Категория*</Label>
                    <Select 
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
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
                      onValueChange={(value) => handleChange("status", value)}
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
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="location">Расположение*</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    required
                  />
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
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Дополнительная информация</CardTitle>
                <CardDescription>
                  Изображение и другие детали
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="image">Фотография оборудования</Label>
                  <div className="mt-1 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="text-gray-500">
                        <svg 
                          className="mx-auto h-12 w-12"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex text-sm text-gray-500">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90"
                        >
                          <span>Загрузить файл</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">или перетащите сюда</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG до 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Автоматическая генерация QR-кода</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    QR-код будет автоматически сгенерирован после сохранения и будет содержать ссылку на карточку оборудования
                  </p>
                  <div className="border rounded-md p-4 flex items-center justify-center">
                    <img 
                      src="/placeholder.svg" 
                      alt="QR Code Placeholder" 
                      className="w-32 h-32 opacity-50"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {isEditMode ? "Сохранить изменения" : "Добавить оборудование"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EquipmentForm;
