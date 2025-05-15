
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        <div className="flex flex-col flex-grow min-h-screen">
          <Navbar />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
          <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
            © 2023-2024 Информационные технологии-авто. Все права защищены.
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
