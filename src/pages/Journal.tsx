
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileDown } from "lucide-react";
import { mockEquipment } from "@/utils/equipment";
import { DateRangePicker } from "@/components/DateRangePicker";
import { DateRange, formatDatetime } from "@/utils/dateUtils";
import { toast } from "@/components/ui/sonner";

// Mock journal entries
const mockJournalEntries = [
  {
    id: 1,
    date: "2023-05-15T10:30:00",
    user: "Администратор",
    action: "Добавление оборудования",
    description: "Добавлен новый компьютер Dell OptiPlex 7090",
    equipmentId: mockEquipment[0].id
  },
  {
    id: 2, 
    date: "2023-05-16T11:45:00",
    user: "Техник",
    action: "Перемещение оборудования",
    description: "Принтер HP LaserJet Pro MFP перемещен на склад",
    equipmentId: mockEquipment[1].id
  },
  {
    id: 3,
    date: "2023-05-17T09:15:00",
    user: "Администратор",
    action: "Изменение статуса",
    description: "Изменен статус сетевого коммутатора на 'На ремонте'",
    equipmentId: mockEquipment[2].id
  },
  {
    id: 4,
    date: "2023-05-18T14:20:00",
    user: "Инвентаризатор",
    action: "Инвентаризация",
    description: "Проведена инвентаризация оборудования в офисе №301",
    equipmentId: null
  },
  {
    id: 5,
    date: "2023-05-19T16:10:00",
    user: "Техник",
    action: "Ремонт оборудования",
    description: "Завершен ремонт монитора Samsung S24R350",
    equipmentId: mockEquipment[3].id
  }
];

const Journal = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("csv");
  
  // Filter journal entries
  const filteredEntries = mockJournalEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    
    const matchesSearch = 
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === "all" || entry.action === actionFilter;
    
    const matchesDateRange = !dateRange || !dateRange.from || !dateRange.to || 
      (entryDate >= dateRange.from && entryDate <= dateRange.to);
    
    return matchesSearch && matchesAction && matchesDateRange;
  });

  // Get unique action types for filter
  const uniqueActions = [...new Set(mockJournalEntries.map(entry => entry.action))];
  
  // Handle journal export
  const handleExportJournal = () => {
    // In a real app, this would generate and download a file
    // For demo purposes, we'll just show a toast message
    
    const rangeText = dateRange?.from && dateRange?.to
      ? `за период ${formatDatetime(dateRange.from, "dd.MM.yyyy")} - ${formatDatetime(dateRange.to, "dd.MM.yyyy")}`
      : "";
    
    const filterText = actionFilter !== "all"
      ? `, тип: ${actionFilter}`
      : "";
    
    toast.success(
      `Журнал действий ${rangeText}${filterText} экспортирован в формате ${exportFormat.toUpperCase()}`,
      {
        description: `Всего записей: ${filteredEntries.length}`,
      }
    );
    
    console.log("Экспорт журнала", {
      entries: filteredEntries,
      format: exportFormat,
      dateRange,
      actionFilter
    });
  };

  // Fixed the typing issue by properly handling the type conversion
  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Журнал действий</h1>
            <p className="text-muted-foreground">
              История действий пользователей в системе
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Select value={exportFormat} onValueChange={(value: "csv" | "excel" | "pdf") => setExportFormat(value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Формат" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleExportJournal}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Экспортировать
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Фильтры</CardTitle>
            <CardDescription>
              Выберите параметры для фильтрации записей журнала
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Поиск по журналу</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Найти в журнале..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Тип действия</label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип действия" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все действия</SelectItem>
                    {uniqueActions.map((action) => (
                      <SelectItem key={action} value={action}>
                        {action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Период</label>
                <DateRangePicker
                  date={dateRange}
                  onDateChange={handleDateRangeChange} // Use our wrapper function
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Записи журнала ({filteredEntries.length})</CardTitle>
            <CardDescription>
              История действий пользователей в хронологическом порядке
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата и время
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Пользователь
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действие
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Описание
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEntries.length > 0 ? (
                    filteredEntries.map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDatetime(new Date(entry.date))}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{entry.user}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{entry.action}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{entry.description}</div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                        Записи в журнале не найдены
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Journal;
