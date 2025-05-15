
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HardDrive, Package, Search, Filter } from "lucide-react";
import { mockEquipment, getCategoryLabel } from "@/utils/equipment";
import StatusBadge from "@/components/StatusBadge";
import { EquipmentStatus } from "@/types";
import { useNavigate } from "react-router-dom";

const Storage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Фильтрация только оборудования на складе
  const storageEquipment = mockEquipment.filter(equipment => {
    // Базовая фильтрация по статусу "на складе"
    const statusMatch = equipment.status === "storage";

    // Поиск
    const searchMatch = searchTerm ? 
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.inventoryNumber.toLowerCase().includes(searchTerm.toLowerCase()) :
      true;

    // Категория
    const categoryMatch = categoryFilter ? equipment.category === categoryFilter : true;

    return statusMatch && searchMatch && categoryMatch;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Склад</h1>
            <p className="text-muted-foreground">
              Управление оборудованием на складе
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => navigate("/add")}
            variant="outline"
          >
            Добавить на склад
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Фильтры</CardTitle>
            <CardDescription>
              Поиск оборудования на складе
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию, номеру..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select 
                value={categoryFilter ?? ""} 
                onValueChange={(value) => setCategoryFilter(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  <SelectItem value="computer">Компьютеры</SelectItem>
                  <SelectItem value="printer">Принтеры</SelectItem>
                  <SelectItem value="network">Сетевое оборудование</SelectItem>
                  <SelectItem value="peripheral">Периферия</SelectItem>
                  <SelectItem value="mobile">Мобильные устройства</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Сбросить фильтры
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                <span>Оборудование на складе ({storageEquipment.length})</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {storageEquipment.length > 0 ? (
              <div className="table-container">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Название
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Инв. номер
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Категория
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата помещения
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {storageEquipment.map((item) => (
                      <tr 
                        key={item.id} 
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{item.inventoryNumber}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {getCategoryLabel(item.category)}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={item.status as EquipmentStatus} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {item.history && item.history.length > 0
                              ? new Date(item.history[item.history.length - 1].date).toLocaleDateString('ru-RU')
                              : new Date(item.purchaseDate).toLocaleDateString('ru-RU')
                            }
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/equipment/${item.id}`)}
                            >
                              Подробнее
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/edit/${item.id}`)}
                            >
                              Изменить
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-10 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">На складе нет оборудования</p>
                <p className="text-muted-foreground">Используйте кнопку "Добавить на склад" для добавления оборудования</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Storage;
