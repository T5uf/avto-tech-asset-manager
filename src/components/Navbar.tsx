
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bell, 
  Search,
  User
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

// Mock notifications data
const mockNotifications = [
  { id: 1, message: "Оборудование #3421 требует внимания", isRead: false, date: "2023-05-19T10:30:00" },
  { id: 2, message: "Завершена инвентаризация отдела продаж", isRead: true, date: "2023-05-18T09:15:00" },
  { id: 3, message: "Новое оборудование добавлено в систему", isRead: false, date: "2023-05-17T14:45:00" }
];

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      toast({
        title: "Поиск",
        description: `Поиск по запросу: ${searchValue}`,
      });
      navigate(`/catalog?search=${encodeURIComponent(searchValue)}`);
    }
  };

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        <SidebarTrigger />
        <div className="ml-auto flex items-center space-x-4">
          <form onSubmit={handleSearch} className="hidden md:flex md:w-80">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск..."
                className="w-full pl-8 bg-background"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </form>
          
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h4 className="font-medium">Уведомления</h4>
                <p className="text-sm text-muted-foreground">
                  {unreadCount > 0 ? `У вас ${unreadCount} непрочитанных уведомлений` : "Нет новых уведомлений"}
                </p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 ${!notification.isRead ? 'bg-muted/50' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start">
                        <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                          {notification.message}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(notification.date)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Нет уведомлений
                  </div>
                )}
              </div>
              <div className="p-2 border-t flex justify-center">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setNotificationsOpen(false)}>
                  Закрыть
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="hidden md:flex items-center space-x-2">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">АИ</AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium">Администратор</div>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
