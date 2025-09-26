import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  PiggyBank,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Wallet,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    category: "main"
  },
  {
    title: "Transaksi",
    url: "/transactions",
    icon: CreditCard,
    category: "main"
  },
  {
    title: "Utang & Piutang",
    url: "/debts",
    icon: PiggyBank,
    category: "main"
  },
  {
    title: "Laporan",
    url: "/reports",
    icon: BarChart3,
    category: "main"
  },
  {
    title: "Kategori",
    url: "/categories",
    icon: Receipt,
    category: "manage"
  },
  {
    title: "Pengaturan",
    url: "/settings",
    icon: Settings,
    category: "manage"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (active: boolean) =>
    cn(
      "group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300",
      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      "relative overflow-hidden",
      active
        ? "bg-gradient-primary text-primary-foreground shadow-glow font-medium"
        : "text-sidebar-foreground"
    );

  const mainItems = menuItems.filter(item => item.category === "main");
  const manageItems = menuItems.filter(item => item.category === "manage");

  return (
    <Sidebar className={cn(
      "bg-gradient-sidebar border-r border-sidebar-border shadow-sidebar",
      "transition-all duration-300 ease-smooth",
      collapsed ? "w-14" : "w-72"
    )}>
      <SidebarContent className="px-3 py-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="font-display font-bold text-lg text-sidebar-foreground">
                FinDash
              </h1>
              <p className="text-xs text-muted-foreground">Personal Finance</p>
            </div>
          )}
        </div>

        {/* Quick Stats - Only show when not collapsed */}
        {!collapsed && (
          <div className="mx-3 mb-6 p-4 bg-card border border-card-border rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-card-foreground">Status Keuangan</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saldo Total</span>
                <span className="font-medium text-card-foreground">Rp 12.5M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bulan ini</span>
                <span className="font-medium text-success">+Rp 2.1M</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            {!collapsed ? "Menu Utama" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive: active }) => getNavClassName(active || isActive(item.url))}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="font-medium truncate">{item.title}</span>
                      )}
                      {/* Active indicator */}
                      {(isActive(item.url)) && (
                        <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-lg" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs font-medium uppercase tracking-wider mt-6">
            {!collapsed ? "Kelola" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {manageItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive: active }) => getNavClassName(active || isActive(item.url))}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="font-medium truncate">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Alert Section */}
        {!collapsed && (
          <div className="mt-auto mx-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
              <div className="text-xs text-warning">
                <p className="font-medium mb-1">Reminder</p>
                <p>3 utang akan jatuh tempo minggu ini</p>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="mt-6 mx-3">
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:text-destructive transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="font-medium">Keluar</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}