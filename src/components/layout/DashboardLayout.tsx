import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, User, X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  type: "info" | "warning" | "success";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export function DashboardLayout() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fungsi untuk mengambil data transaksi dan utang
  const fetchData = async () => {
    try {
      // Ambil data transaksi bulan ini
      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount, type, date, description")
        .eq("user_id", user?.id)
        .gte("date", startOfMonth(new Date()).toISOString().split('T')[0])
        .lte("date", endOfMonth(new Date()).toISOString().split('T')[0]);

      // Ambil data utang yang sudah jatuh tempo
      const { data: debts } = await supabase
        .from("debts")
        .select("name, due_date, amount, status")
        .eq("user_id", user?.id)
        .neq("status", "paid");

      // Generate notifikasi berdasarkan data
      generateNotifications(transactions || [], debts || []);
    } catch (error) {
      console.error("Error fetching data for notifications:", error);
    }
  };

  // Fungsi untuk membuat notifikasi berdasarkan data transaksi dan utang
  const generateNotifications = (transactions: any[], debts: any[]) => {
    const newNotifications: Notification[] = [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Notifikasi untuk pengeluaran berlebihan
    const expenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    // Jika pengeluaran lebih dari 80% dari pendapatan
    if (income > 0 && expenses > income * 0.8) {
      newNotifications.push({
        id: `overspend-${Date.now()}`,
        title: "High Spending Alert",
        description: `Your expenses this month are ${Math.round((expenses / income) * 100)}% of your income.`,
        type: "warning",
        timestamp: new Date(),
        read: false,
      });
    }

    // Notifikasi untuk utang yang akan jatuh tempo dalam 3 hari
    const today = new Date();
    debts.forEach(debt => {
      if (debt.due_date) {
        const dueDate = new Date(debt.due_date);
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue <= 3 && daysUntilDue >= 0) {
          newNotifications.push({
            id: `due-soon-${debt.id}-${Date.now()}`,
            title: "Payment Due Soon",
            description: `${debt.name} is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}. Amount: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(debt.amount)}`,
            type: "warning",
            timestamp: new Date(),
            read: false,
          });
        }
      }
    });

    // Notifikasi untuk utang yang sudah jatuh tempo
    debts.forEach(debt => {
      if (debt.due_date) {
        const dueDate = new Date(debt.due_date);
        const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysOverdue > 0) {
          newNotifications.push({
            id: `overdue-${debt.id}-${Date.now()}`,
            title: "Payment Overdue",
            description: `${debt.name} is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue. Amount: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(debt.amount)}`,
            type: "warning",
            timestamp: new Date(),
            read: false,
          });
        }
      }
    });

    // Notifikasi untuk transaksi besar (di atas 10 juta)
    const largeTransactions = transactions.filter(t => t.amount > 10000000);
    largeTransactions.forEach(transaction => {
      newNotifications.push({
        id: `large-transaction-${transaction.id}-${Date.now()}`,
        title: "Large Transaction",
        description: `${transaction.type === "income" ? "Received" : "Paid"} ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(transaction.amount)} for ${transaction.description}`,
        type: transaction.type === "income" ? "success" : "info",
        timestamp: new Date(transaction.date),
        read: false,
      });
    });

    // Update notifikasi
    setNotifications(prev => {
      // Gabungkan notifikasi lama yang belum dibaca dengan notifikasi baru
      const existingUnread = prev.filter(n => !n.read);
      const allNotifications = [...existingUnread, ...newNotifications];
      
      // Urutkan berdasarkan timestamp (terbaru dulu)
      return allNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    });
  };

  // Fungsi untuk menandai notifikasi sebagai sudah dibaca
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Fungsi untuk menandai semua notifikasi sebagai sudah dibaca
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setShowNotifications(false);
  };

  // Fungsi untuk menghapus notifikasi
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Update jumlah notifikasi yang belum dibaca
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Ambil data saat komponen dimuat
  useEffect(() => {
    if (user) {
      fetchData();
      
      // Set up interval untuk memeriksa notifikasi baru setiap 5 menit
      const interval = setInterval(() => {
        fetchData();
      }, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

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
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                <ThemeToggle />

                {/* Notifications */}
                <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:bg-accent"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive rounded-full text-[10px] flex items-center justify-center text-white">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 p-0">
                    <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="font-medium">Notifications</h3>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className="text-xs h-auto p-1"
                        >
                          Mark all as read
                        </Button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            className="p-0 focus:bg-accent cursor-pointer"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div
                              className={cn(
                                "flex items-start gap-3 p-4 w-full",
                                !notification.read && "bg-accent/30"
                              )}
                            >
                              <div
                                className={cn(
                                  "mt-0.5 rounded-full p-1",
                                  notification.type === "success" && "bg-green-500/20 text-green-600",
                                  notification.type === "warning" && "bg-yellow-500/20 text-yellow-600",
                                  notification.type === "info" && "bg-blue-500/20 text-blue-600"
                                )}
                              >
                                {notification.type === "success" && <CheckCircle className="h-4 w-4" />}
                                {notification.type === "warning" && <AlertTriangle className="h-4 w-4" />}
                                {notification.type === "info" && <Info className="h-4 w-4" />}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-medium text-sm">{notification.title}</h4>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 -mt-1 -mr-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {notification.description}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {format(notification.timestamp, "MMM d, yyyy 'at' h:mm a")}
                                </p>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile */}
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent"
                >
                  <Link to="/profile">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-1">
            <div className="max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}