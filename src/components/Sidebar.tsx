
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
  Users
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
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
                active={location.pathname === item.path}
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
        <Button variant="outline" size="sm" className="w-full">
          <User className="w-4 h-4 mr-2" />
          Выйти
        </Button>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
