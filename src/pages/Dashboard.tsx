import { Wallet, TrendingUp, TrendingDown, CreditCard, AlertCircle, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const recentTransactions = [
  {
    id: "1",
    type: "expense" as const,
    description: "Groceries - Superindo",
    amount: 485000,
    category: "Makanan",
    date: "2024-01-15",
    time: "14:32"
  },
  {
    id: "2", 
    type: "income" as const,
    description: "Freelance Payment",
    amount: 2500000,
    category: "Pendapatan",
    date: "2024-01-15",
    time: "09:15"
  },
  {
    id: "3",
    type: "expense" as const,
    description: "Grab Transport",
    amount: 35000,
    category: "Transportasi",
    date: "2024-01-14",
    time: "18:45"
  },
  {
    id: "4",
    type: "expense" as const,
    description: "Netflix Subscription",
    amount: 186000,
    category: "Hiburan",
    date: "2024-01-14",
    time: "10:00"
  }
];

const upcomingDebts = [
  {
    id: "1",
    name: "Pinjaman Modal",
    amount: 5000000,
    dueDate: "2024-01-20",
    daysLeft: 5,
    type: "debt" as const
  },
  {
    id: "2", 
    name: "Hutang ke Budi",
    amount: 1500000,
    dueDate: "2024-01-25",
    daysLeft: 10,
    type: "debt" as const
  }
];

export default function Dashboard() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Dashboard Keuangan
          </h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang kembali! Berikut ringkasan keuangan Anda.
          </p>
        </div>
        
        <Button className="bg-gradient-primary shadow-glow hover:shadow-glow/70 transition-all duration-300">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Transaksi
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Saldo"
          value={formatCurrency(12500000)}
          change="+8.2%"
          changeType="positive"
          icon={Wallet}
          gradient={true}
        />
        
        <StatCard
          title="Pemasukan Bulan Ini"
          value={formatCurrency(9800000)}
          change="+12.5%"
          changeType="positive"
          icon={TrendingUp}
        />
        
        <StatCard
          title="Pengeluaran Bulan Ini"
          value={formatCurrency(7500000)}
          change="-3.2%"
          changeType="negative"
          icon={TrendingDown}
        />
        
        <StatCard
          title="Transaksi Bulan Ini"
          value="127"
          change="+5.1%"
          changeType="positive"
          icon={CreditCard}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card className="bg-gradient-card border-card-border shadow-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Tren Keuangan</CardTitle>
            <CardDescription>Pemasukan vs Pengeluaran 6 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewChart type="line" height={300} />
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card className="bg-gradient-card border-card-border shadow-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Breakdown Pengeluaran</CardTitle>
            <CardDescription>Kategori pengeluaran bulan ini</CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewChart type="pie" height={300} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 bg-card border-card-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Transaksi Terbaru</CardTitle>
            <CardDescription>Aktivitas keuangan terkini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    transaction.type === "income" 
                      ? "bg-success/20 text-success" 
                      : "bg-destructive/20 text-destructive"
                  )}>
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div>
                    <p className="font-medium text-card-foreground">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatDate(transaction.date)}</span>
                      <span>•</span>
                      <span>{transaction.time}</span>
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <span className={cn(
                  "font-semibold",
                  transaction.type === "income" ? "text-success" : "text-destructive"
                )}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Debts Alert */}
        <Card className="bg-card border-card-border">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Reminder Utang
            </CardTitle>
            <CardDescription>Utang yang akan jatuh tempo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDebts.map((debt) => (
              <div
                key={debt.id}
                className="p-3 rounded-lg bg-warning/10 border border-warning/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-card-foreground text-sm">
                    {debt.name}
                  </p>
                  <Badge 
                    variant="outline" 
                    className="text-xs text-warning border-warning/30"
                  >
                    {debt.daysLeft} hari
                  </Badge>
                </div>
                
                <p className="text-warning font-semibold">
                  {formatCurrency(debt.amount)}
                </p>
                
                <p className="text-xs text-muted-foreground mt-1">
                  Jatuh tempo: {formatDate(debt.dueDate)}
                </p>
              </div>
            ))}
            
            <Button variant="outline" size="sm" className="w-full mt-3">
              Lihat Semua Utang
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}