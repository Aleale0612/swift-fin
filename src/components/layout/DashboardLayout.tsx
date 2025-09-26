import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Section */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="h-full px-6 flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-foreground hover:bg-accent p-2 rounded-lg transition-colors" />

                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari transaksi, kategori..."
                    className="pl-10 w-80 bg-input border-border focus:ring-primary"
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                <ThemeToggle />

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-accent"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-[10px] flex items-center justify-center text-white">
                    3
                  </span>
                </Button>

                {/* Profile */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent"
                >
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
