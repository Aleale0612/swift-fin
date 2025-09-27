import { useState, useEffect } from "react";
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
  Wallet,
  TrendingUp,
  AlertCircle,
  TargetIcon,
  RefreshCw,
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
import { supabase } from "@/lib/supabaseClient";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, category: "main" },
  { title: "Transaksi", url: "/transactions", icon: CreditCard, category: "main" },
  { title: "Utang & Piutang", url: "/debts", icon: PiggyBank, category: "main" },
  { title: "Laporan", url: "/reports", icon: BarChart3, category: "main" },
  { title: "Kategori", url: "/categories", icon: Receipt, category: "manage" },
  { title: "Pencapaian", url: "/goals", icon: TargetIcon, category: "manage" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { signOut } = useAuth();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const [saldo, setSaldo] = useState(0);
  const [monthlyChange, setMonthlyChange] = useState(0);
  const [dueDebts, setDueDebts] = useState(0);
  const [loading, setLoading] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
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

  const mainItems = menuItems.filter((item) => item.category === "main");
  const manageItems = menuItems.filter((item) => item.category === "manage");

  // Fetch data from Supabase
  const fetchData = async () => {
    setLoading(true);

    const { data: trxData } = await supabase.from("transactions").select("amount,type,created_at");

    if (trxData) {
      let income = 0;
      let expense = 0;
      trxData.forEach((t) => {
        if (t.type === "income") income += t.amount;
        if (t.type === "expense") expense += t.amount;
      });

      setSaldo(income - expense);

      const currentMonth = new Date().getMonth();
      const monthlyIncome = trxData
        .filter((t) => new Date(t.created_at).getMonth() === currentMonth && t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyExpense = trxData
        .filter((t) => new Date(t.created_at).getMonth() === currentMonth && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      setMonthlyChange(monthlyIncome - monthlyExpense);
    }

    const { data: debtData } = await supabase.from("debts").select("due_date");
    if (debtData) {
      const upcoming = debtData.filter((d) => {
        const due = new Date(d.due_date).getTime();
        const now = Date.now();
        return due >= now && due <= now + 7 * 24 * 60 * 60 * 1000;
      });
      setDueDebts(upcoming.length);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <Sidebar
      className={cn(
        "bg-gradient-sidebar border-r border-sidebar-border shadow-xl z-50",
        "transition-all duration-300 ease-smooth fixed left-0 top-0 h-screen",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarContent className="px-3 py-6 flex flex-col h-full">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="font-display font-bold text-lg text-sidebar-foreground">
                Keuanganku
              </h1>
              <p className="text-xs text-muted-foreground">Dezasters</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {!collapsed && (
          <div className="mx-3 mb-6 p-4 bg-card border border-card-border rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-card-foreground">
                  Status Keuangan
                </span>
              </div>
              {/* Tombol Refresh */}
              <button
                onClick={fetchData}
                className="p-1 rounded-md hover:bg-muted transition-colors"
                disabled={loading}
              >
                <RefreshCw
                  className={cn(
                    "h-4 w-4 text-muted-foreground",
                    loading && "animate-spin text-primary"
                  )}
                />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saldo Total</span>
                <span className="font-medium text-card-foreground">{formatCurrency(saldo)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bulan ini</span>
                <span
                  className={cn(
                    "font-medium",
                    monthlyChange >= 0 ? "text-success" : "text-destructive"
                  )}
                >
                  {monthlyChange >= 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(monthlyChange))}
                </span>
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
                      className={({ isActive: active }) =>
                        getNavClassName(active || isActive(item.url))
                      }
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
                      className={({ isActive: active }) =>
                        getNavClassName(active || isActive(item.url))
                      }
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
        {!collapsed && dueDebts > 0 && (
          <div className="mt-auto mx-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
              <div className="text-xs text-warning">
                <p className="font-medium mb-1">Reminder</p>
                <p>{dueDebts} utang akan jatuh tempo minggu ini</p>
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
