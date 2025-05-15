
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bell, 
  Search,
  User
} from "lucide-react";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        <SidebarTrigger />
        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex md:w-80">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск..."
                className="w-full pl-8 bg-background"
              />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
          </Button>
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
