
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive, Settings, AlertCircle, Archive, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import StatusBadge from "@/components/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { fetchAllEquipment, getEquipmentCounts, getCategoryCounts } from "@/services/equipmentService";
import { Loader2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  // Fetch equipment statistics
  const { 
    data: equipmentCounts = { total: 0, active: 0, repair: 0, storage: 0, 'written-off': 0 }, 
    isLoading: isLoadingCounts 
  } = useQuery({
    queryKey: ['equipment-counts'],
    queryFn: getEquipmentCounts,
    refetchOnWindowFocus: false
  });
  
  // Fetch category statistics
  const { 
    data: categoryCounts = { computer: 0, printer: 0, network: 0, peripheral: 0, mobile: 0, other: 0 },
    isLoading: isLoadingCategories 
  } = useQuery({
    queryKey: ['category-counts'],
    queryFn: getCategoryCounts,
    refetchOnWindowFocus: false
  });

  // Fetch equipment list for the recent items
  const { 
    data: equipment = [], 
    isLoading: isLoadingEquipment
  } = useQuery({
    queryKey: ['all-equipment'],
    queryFn: fetchAllEquipment,
    refetchOnWindowFocus: false
  });

  // Extract the most recent 5 items
  const recentItems = [...equipment]
    .sort((a, b) => new Date(b.purchaseDate || '').getTime() - new Date(a.purchaseDate || '').getTime())
    .slice(0, 5);

  // Данные для статистики по статусам
  const statusData = [
    { name: "В работе", value: equipmentCounts.active, color: "#10B981" },
    { name: "На ремонте", value: equipmentCounts.repair, color: "#F59E0B" },
    { name: "На складе", value: equipmentCounts.storage, color: "#3B82F6" },
    { name: "Списано", value: equipmentCounts['written-off'], color: "#6B7280" }
  ];

  // Данные для статистики по категориям
  const categoryData = [
    { name: "Компьютеры", value: categoryCounts.computer, color: "#8B5CF6" },
    { name: "Принтеры", value: categoryCounts.printer, color: "#EC4899" },
    { name: "Сеть", value: categoryCounts.network, color: "#14B8A6" },
    { name: "Периферия", value: categoryCounts.peripheral, color: "#F97316" },
    { name: "Мобильные", value: categoryCounts.mobile, color: "#6366F1" },
    { name: "Прочее", value: categoryCounts.other, color: "#9CA3AF" }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
            <p className="text-muted-foreground">
              Добро пожаловать в систему учета оборудования ИТ-Авто
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="outline" onClick={() => navigate("/reports")}>
              Отчеты
            </Button>
            <Button onClick={() => navigate("/add")}>
              Добавить оборудование
            </Button>
          </div>
        </div>

        {/* Карточки статистики */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Всего оборудования"
            value={equipmentCounts.total}
            icon={<HardDrive className="h-4 w-4" />}
            description="Все устройства в системе"
          />
          <StatCard
            title="В работе"
            value={equipmentCounts.active}
            icon={<Settings className="h-4 w-4" />}
            description="Активное оборудование"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="На ремонте"
            value={equipmentCounts.repair}
            icon={<AlertCircle className="h-4 w-4" />}
            description="Требующее внимания"
          />
          <StatCard
            title="На складе"
            value={equipmentCounts.storage}
            icon={<Archive className="h-4 w-4" />}
            description="На хранении"
          />
        </div>

        {/* Графики */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Распределение по статусам</CardTitle>
              <CardDescription>
                Текущее состояние всего оборудования
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
              {isLoadingCounts ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Распределение по категориям</CardTitle>
              <CardDescription>
                Типы оборудования по категориям
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
              {isLoadingCategories ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Недавнее оборудование */}
        <Card>
          <CardHeader>
            <CardTitle>Недавнее оборудование</CardTitle>
            <CardDescription>
              Последние добавленные единицы оборудования
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingEquipment ? (
              <div className="py-10 text-center">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Загрузка данных...</p>
              </div>
            ) : recentItems.length > 0 ? (
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
                        Статус
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Расположение
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentItems.map((item) => (
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
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {item.location || 'Не указано'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-10 text-center">
                <Archive className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">Нет недавно добавленного оборудования</p>
                <p className="text-muted-foreground">Добавьте оборудование, чтобы оно отобразилось здесь</p>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => navigate("/catalog")}>
                Показать все
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
