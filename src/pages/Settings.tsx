import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Save, 
  Shield, 
  Bell, 
  UserCog, 
  Database, 
  Globe
} from "lucide-react";

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "ИТ-Авто",
    email: "info@it-auto.ru",
    phone: "+7 (999) 123-45-67",
    address: "г. Москва, ул. Примерная, д. 123",
    language: "ru",
    darkMode: false,
    enableNotifications: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    minimumPasswordLength: "8"
  });

  const handleGeneralSettingChange = (field: string, value: any) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecuritySettingChange = (field: string, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
            <p className="text-muted-foreground">
              Управление настройками системы
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => console.log("Сохранить настройки")}
          >
            <Save className="mr-2 h-4 w-4" />
            Сохранить изменения
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-5 mb-4">
            <TabsTrigger value="general">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Общие
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Безопасность
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Уведомления
            </TabsTrigger>
            <TabsTrigger value="users">
              <UserCog className="h-4 w-4 mr-2" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="system" className="hidden md:flex">
              <Database className="h-4 w-4 mr-2" />
              Система
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Общие настройки</CardTitle>
                <CardDescription>
                  Основные параметры конфигурации системы
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Название организации</Label>
                    <Input
                      id="companyName"
                      value={generalSettings.companyName}
                      onChange={(e) => handleGeneralSettingChange('companyName', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="email">Email для связи</Label>
                      <Input
                        id="email"
                        type="email"
                        value={generalSettings.email}
                        onChange={(e) => handleGeneralSettingChange('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон для связи</Label>
                      <Input
                        id="phone"
                        value={generalSettings.phone}
                        onChange={(e) => handleGeneralSettingChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Адрес организации</Label>
                    <Input
                      id="address"
                      value={generalSettings.address}
                      onChange={(e) => handleGeneralSettingChange('address', e.target.value)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Интерфейс</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="language">Язык интерфейса</Label>
                      <Select 
                        value={generalSettings.language} 
                        onValueChange={(value) => handleGeneralSettingChange('language', value)}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Выберите язык" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ru">Русский</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Темная тема</Label>
                      <p className="text-sm text-muted-foreground">
                        Включить темную тему интерфейса
                      </p>
                    </div>
                    <Switch
                      id="darkMode"
                      checked={generalSettings.darkMode}
                      onCheckedChange={(value) => handleGeneralSettingChange('darkMode', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableNotifications">Уведомления</Label>
                      <p className="text-sm text-muted-foreground">
                        Включить системные уведомления
                      </p>
                    </div>
                    <Switch
                      id="enableNotifications"
                      checked={generalSettings.enableNotifications}
                      onCheckedChange={(value) => handleGeneralSettingChange('enableNotifications', value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Отменить</Button>
                <Button>Сохранить</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Настройки безопасности</CardTitle>
                <CardDescription>
                  Параметры безопасности и доступа к системе
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactorAuth">Двухфакторная аутентификация</Label>
                      <p className="text-sm text-muted-foreground">
                        Требовать двухфакторную аутентификацию для всех пользователей
                      </p>
                    </div>
                    <Switch
                      id="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(value) => handleSecuritySettingChange('twoFactorAuth', value)}
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="sessionTimeout">Тайм-аут сессии (минуты)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => handleSecuritySettingChange('sessionTimeout', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Время бездействия до автоматического выхода
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="passwordExpiry">Срок действия пароля (дни)</Label>
                      <Input
                        id="passwordExpiry"
                        type="number"
                        value={securitySettings.passwordExpiry}
                        onChange={(e) => handleSecuritySettingChange('passwordExpiry', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        0 - без ограничения срока действия
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="minimumPasswordLength">Минимальная длина пароля</Label>
                    <Input
                      id="minimumPasswordLength"
                      type="number"
                      value={securitySettings.minimumPasswordLength}
                      onChange={(e) => handleSecuritySettingChange('minimumPasswordLength', e.target.value)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Журнал безопасности</h3>
                  <Button variant="outline">
                    <Shield className="mr-2 h-4 w-4" />
                    Просмотреть журнал безопасности
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Отменить</Button>
                <Button>Сохранить</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Настройки уведомлений</CardTitle>
                <CardDescription>
                  Управление системными уведомлениями
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  Выберите типы уведомлений, которые хотите получать
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Добавление оборудования</Label>
                      <p className="text-sm text-muted-foreground">
                        Уведомления о добавлении нового оборудования
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Изменение статуса оборудования</Label>
                      <p className="text-sm text-muted-foreground">
                        У��едомления об изменении статуса оборудования
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Срок обслуживания</Label>
                      <p className="text-sm text-muted-foreground">
                        Напоминания о приближающемся сроке обслуживания
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Системные уведомления</Label>
                      <p className="text-sm text-muted-foreground">
                        Важные системные уведомления и обновления
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Отменить</Button>
                <Button>Сохранить</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Настройки пользователей</CardTitle>
                <CardDescription>
                  Управление ролями и правами доступа пользователей
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" onClick={() => console.log("Управление ролями")}>
                    <UserCog className="mr-2 h-4 w-4" />
                    Управление ролями
                  </Button>
                  
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Роль
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Описание
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Пользователей
                          </th>
                          <th className="px-4 py-3 w-20"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3">
                            <div className="font-medium">Администратор</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">Полный доступ к системе</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">1</div>
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm">
                              Изменить
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">
                            <div className="font-medium">Техник</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">Доступ к управлению оборудованием</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">1</div>
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm">
                              Изменить
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">
                            <div className="font-medium">Инвентаризатор</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">Доступ к учету оборудования</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">1</div>
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm">
                              Изменить
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">
                            <div className="font-medium">Пользователь</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">Ограниченный доступ</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">2</div>
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm">
                              Изменить
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button>
                  Добавить роль
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>Системные настройки</CardTitle>
                <CardDescription>
                  Дополнительные параметры конфигурации системы
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">База данных</h3>
                  
                  <div className="rounded-md bg-muted p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium">Статус базы данных</h4>
                        <p className="text-xs text-muted-foreground">Подключено</p>
                      </div>
                      <Badge variant="outline">Активна</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline">
                      <Database className="mr-2 h-4 w-4" />
                      Резервное копирование
                    </Button>
                    <Button variant="outline">
                      Очистка данных
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Интеграции</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>API доступ</Label>
                      <p className="text-sm text-muted-foreground">
                        Разрешить доступ к API системы
                      </p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Внешние сервисы</Label>
                      <p className="text-sm text-muted-foreground">
                        Разрешить интеграцию с внешними сервисами
                      </p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  
                  <Button variant="outline">
                    <Globe className="mr-2 h-4 w-4" />
                    Настроить интеграции
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Отменить</Button>
                <Button>Сохранить</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
