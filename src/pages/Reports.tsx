
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartBar, FileText, Download, Calendar } from "lucide-react";
import { mockEquipment, getCategoryLabel } from "@/utils/equipment";
import { EquipmentCategory } from "@/types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Reports = () => {
  const [reportType, setReportType] = useState<string>("status");
  const [reportPeriod, setReportPeriod] = useState<string>("all");

  // Prepare data for status report
  const statusData = [
    { name: "В работе", value: mockEquipment.filter(item => item.status === "active").length },
    { name: "На ремонте", value: mockEquipment.filter(item => item.status === "repair").length },
    { name: "На складе", value: mockEquipment.filter(item => item.status === "storage").length },
    { name: "Списано", value: mockEquipment.filter(item => item.status === "written-off").length }
  ];

  // Prepare data for category report
  const categoryData = [
    { name: getCategoryLabel("computer"), value: mockEquipment.filter(item => item.category === "computer").length },
    { name: getCategoryLabel("printer"), value: mockEquipment.filter(item => item.category === "printer").length },
    { name: getCategoryLabel("network"), value: mockEquipment.filter(item => item.category === "network").length },
    { name: getCategoryLabel("peripheral"), value: mockEquipment.filter(item => item.category === "peripheral").length },
    { name: getCategoryLabel("mobile"), value: mockEquipment.filter(item => item.category === "mobile").length },
    { name: getCategoryLabel("other"), value: mockEquipment.filter(item => item.category === "other").length }
  ];

  // Get the data based on the selected report type
  const getReportData = () => {
    switch (reportType) {
      case "status":
        return statusData;
      case "category":
        return categoryData;
      default:
        return [];
    }
  };

  // Get the report title based on the selected report type
  const getReportTitle = () => {
    switch (reportType) {
      case "status":
        return "по статусам оборудования";
      case "category":
        return "по категориям оборудования";
      default:
        return "";
    }
  };

  // Format the current date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const currentDate = formatDate(new Date());

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Отчеты</h1>
            <p className="text-muted-foreground">
              Статистика и аналитика по оборудованию
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => console.log("Экспорт отчета")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Экспортировать отчеты
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Параметры отчета</CardTitle>
            <CardDescription>
              Выберите тип отчета и период для анализа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Тип отчета</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип отчета" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">Статусы оборудования</SelectItem>
                    <SelectItem value="category">Категории оборудования</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Период</label>
                <Select value={reportPeriod} onValueChange={setReportPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите период" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все время</SelectItem>
                    <SelectItem value="month">Последний месяц</SelectItem>
                    <SelectItem value="quarter">Последний квартал</SelectItem>
                    <SelectItem value="year">Последний год</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <ChartBar className="h-5 w-5 mr-2" />
                <span>Отчет {getReportTitle()}</span>
              </div>
            </CardTitle>
            <CardDescription>
              Дата формирования: {currentDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getReportData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Количество" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                История отчетов
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Скачать отчет
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Детализация отчета</CardTitle>
            <CardDescription>
              Подробная информация по выбранному отчету
            </CardDescription>
          </CardHeader>
          <CardContent>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Количество
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Процент
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getReportData().map((item) => {
                  const total = getReportData().reduce((acc, curr) => acc + curr.value, 0);
                  const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
                  
                  return (
                    <tr key={item.name}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.value}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{percentage}%</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
