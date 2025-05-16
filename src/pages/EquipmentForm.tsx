
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
import { getEquipmentById, saveEquipment } from "@/utils/equipment";
import { toast } from "@/components/ui/sonner";

const EquipmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Get equipment data if in edit mode
  const existingEquipment = isEditMode ? getEquipmentById(id) : null;
  
  // Form state
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
  
  // Handle form field changes
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare complete data
      const completeEquipmentData = {
        ...formData,
        id: existingEquipment?.id || crypto.randomUUID(),
        // Set default placeholder for image
        image: "/placeholder.svg"
      };
      
      // Save equipment data
      saveEquipment(completeEquipmentData);
      
      console.log("Form submitted:", completeEquipmentData);
      
      toast.success(
        isEditMode 
          ? "Информация об оборудовании успешно обновлена" 
          : "Оборудование успешно добавлено"
      );
      
      // Redirect after successful operation
      navigate(isEditMode ? `/equipment/${id}` : "/catalog");
    } catch (error) {
      console.error("Error saving equipment:", error);
      toast.error("Произошла ошибка при сохранении");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Navigation and title */}
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

        {/* Form */}
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

            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Отмена
              </Button>
              <Button type="submit">
                {isEditMode ? "Сохранить изменения" : "Добавить оборудование"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default EquipmentForm;
