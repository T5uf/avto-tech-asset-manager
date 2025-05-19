
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { getCategoryLabel, getStatusLabel } from "@/utils/equipment";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { HardDrive, Search, Filter, Loader2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { EquipmentCategory, EquipmentStatus } from "@/types";
import { fetchAllEquipment, fetchFilteredEquipment } from "@/services/equipmentService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";

const Catalog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Загрузка оборудования с помощью React Query
  const { 
    data: equipment = [], 
    isLoading, 
    isError,
    refetch
  } = useQuery({
    queryKey: ['equipment', searchTerm, categoryFilter, statusFilter],
    queryFn: () => {
      if (!searchTerm && !categoryFilter && !statusFilter) {
        return fetchAllEquipment();
      } else {
        return fetchFilteredEquipment(
          searchTerm, 
          categoryFilter as EquipmentCategory | "all", 
          statusFilter as EquipmentStatus | "all"
        );
      }
    }
  });

  // Обработка ошибок загрузки
  useEffect(() => {
    if (isError) {
      toast.error("Ошибка при загрузке данных оборудования");
    }
  }, [isError]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter(null);
    setStatusFilter(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Каталог оборудования</h1>
            <p className="text-muted-foreground">
              Управление всем оборудованием в системе
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => navigate("/add")}
          >
            Добавить оборудование
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Фильтры</CardTitle>
            <CardDescription>
              Используйте фильтры для поиска нужного оборудования
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                onValueChange={(value) => setCategoryFilter(value === "all" ? null : value)}
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
              <Select 
                value={statusFilter ?? ""} 
                onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="active">В работе</SelectItem>
                  <SelectItem value="repair">На ремонте</SelectItem>
                  <SelectItem value="storage">На складе</SelectItem>
                  <SelectItem value="written-off">Списано</SelectItem>
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
                <HardDrive className="h-5 w-5 mr-2" />
                <span>Оборудование ({equipment.length})</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table-container">
              {isLoading ? (
                <div className="py-10 text-center">
                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Загрузка данных...</p>
                </div>
              ) : equipment.length > 0 ? (
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
                        Ответственный
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Расположение
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {equipment.map((item) => (
                      <tr 
                        key={item.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/equipment/${item.id}`)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{item.inventoryNumber}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {getCategoryLabel(item.category as EquipmentCategory)}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={item.status as EquipmentStatus} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{item.responsiblePerson}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{item.location}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">Оборудование не найдено</p>
                  <Button variant="outline" className="mt-2" onClick={clearFilters}>
                    Сбросить фильтры
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Catalog;
