
import { 
  Sidebar as SidebarComponent, 
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  BarChart,
  Database,
  FileText,
  HardDrive, 
  Home,
  List,
  Plus,
  Settings,
  Users,
  LogOut
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const menuItems = [
    {
      title: "Главная",
      icon: <Home className="w-5 h-5" />,
      path: "/"
    },
    {
      title: "Каталог оборудования",
      icon: <HardDrive className="w-5 h-5" />,
      path: "/catalog"
    },
    {
      title: "Добавить оборудование",
      icon: <Plus className="w-5 h-5" />,
      path: "/add"
    },
    {
      title: "Склад",
      icon: <Database className="w-5 h-5" />,
      path: "/storage"
    },
    {
      title: "Журнал действий",
      icon: <List className="w-5 h-5" />,
      path: "/journal"
    },
    {
      title: "Отчеты",
      icon: <BarChart className="w-5 h-5" />,
      path: "/reports"
    },
    {
      title: "Пользователи",
      icon: <Users className="w-5 h-5" />,
      path: "/users"
    },
    {
      title: "Настройки",
      icon: <Settings className="w-5 h-5" />,
      path: "/settings"
    }
  ];

  const handleLogout = () => {
    // Close the dialog
    setLogoutDialogOpen(false);
    
    // Show success toast
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
    
    // Navigate to login page (or main page in this case since we don't have login)
    navigate("/");
  };

  return (
    <>
      <SidebarComponent>
        <SidebarHeader>
          <div className="flex items-center px-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="ml-2 font-semibold text-lg">ИТ-Авто</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  isActive={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => setLogoutDialogOpen(true)}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Выйти
          </Button>
        </SidebarFooter>
      </SidebarComponent>

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Выход из системы</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите выйти из системы?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Выйти</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Sidebar;
