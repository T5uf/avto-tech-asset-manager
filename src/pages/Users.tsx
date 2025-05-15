
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, User, UserPlus, UserCog, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Имитация данных пользователей
const mockUsers = [
  {
    id: 1,
    name: "Иванов Иван",
    email: "ivanov@example.com",
    role: "Администратор",
    department: "ИТ отдел",
    lastActive: "2023-05-19T10:30:00",
    isActive: true
  },
  {
    id: 2,
    name: "Петров Петр",
    email: "petrov@example.com",
    role: "Техник",
    department: "ИТ отдел",
    lastActive: "2023-05-18T14:45:00",
    isActive: true
  },
  {
    id: 3,
    name: "Сидорова Анна",
    email: "sidorova@example.com",
    role: "Инвентаризатор",
    department: "Бухгалтерия",
    lastActive: "2023-05-17T09:20:00",
    isActive: true
  },
  {
    id: 4,
    name: "Кузнецов Алексей",
    email: "kuznetsov@example.com",
    role: "Менеджер",
    department: "Руководство",
    lastActive: "2023-05-15T11:10:00",
    isActive: false
  },
  {
    id: 5,
    name: "Смирнова Елена",
    email: "smirnova@example.com",
    role: "Пользователь",
    department: "Отдел продаж",
    lastActive: "2023-05-16T16:05:00",
    isActive: true
  }
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  
  // Фильтрация пользователей
  const filteredUsers = mockUsers.filter(user => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTerm) || 
      user.email.toLowerCase().includes(searchTerm) || 
      user.role.toLowerCase().includes(searchTerm) ||
      user.department.toLowerCase().includes(searchTerm)
    );
  });

  // Обработка выбора пользователя
  const handleUserSelect = (userId: number) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Обработка выбора всех пользователей
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Пользователи</h1>
            <p className="text-muted-foreground">
              Управление пользователями системы
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => console.log("Добавить пользователя")}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Добавить пользователя
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Список пользователей</CardTitle>
            <CardDescription>
              Всего пользователей: {mockUsers.length}, активных: {mockUsers.filter(u => u.isActive).length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Поиск пользователей..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {selectedUsers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Выбрано: {selectedUsers.length}
                    </span>
                    <Button variant="outline" size="sm">
                      <UserCog className="mr-2 h-4 w-4" />
                      Управление
                    </Button>
                  </div>
                )}
              </div>

              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 w-10">
                        <Checkbox 
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} 
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Пользователь
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Роль
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Отдел
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Последняя активность
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-3">
                            <Checkbox 
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => handleUserSelect(user.id)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{user.role}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{user.department}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{formatDate(user.lastActive)}</div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={user.isActive ? "default" : "outline"}>
                              {user.isActive ? "Активен" : "Неактивен"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                          Пользователи не найдены
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Users;
