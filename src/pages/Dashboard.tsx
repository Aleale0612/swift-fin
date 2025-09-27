import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransactionModal } from "@/components/modals/TransactionModal";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [upcomingDebts, setUpcomingDebts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    saldo: 0,
    income: 0,
    expense: 0,
    totalTransactions: 0,
  });

  // Formatters
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    }).format(new Date(dateString));

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    // Transaksi terbaru
    const { data: trxData } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    // Hutang yang akan jatuh tempo
    const { data: debtData } = await supabase
      .from("debts")
      .select("*")
      .order("due_date", { ascending: true })
      .limit(5);

    // Hitung statistik
    const { data: statsData } = await supabase
      .from("transactions")
      .select("amount, type");

    let income = 0;
    let expense = 0;
    statsData?.forEach((trx) => {
      if (trx.type === "income") income += trx.amount;
      if (trx.type === "expense") expense += trx.amount;
    });

    setRecentTransactions(trxData || []);
    setUpcomingDebts(debtData || []);
    setStats({
      saldo: income - expense,
      income,
      expense,
      totalTransactions: statsData?.length || 0,
    });
  }, []);

  useEffect(() => {
    fetchData();

    // 🔹 Realtime subscription Supabase
    const channel = supabase
      .channel("dashboard-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => {
          fetchData();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "debts" },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Dashboard TrekFi
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back Boss !
          </p>
        </div>

        {/* Add Transaction Button */}
        <Button
          onClick={() => setIsTransactionModalOpen(true)}
          className="bg-gradient-primary shadow-glow hover:shadow-glow/70 transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Added Transactions
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={formatCurrency(stats.saldo)}
          change="+8.2%"
          changeType="positive"
          icon={Wallet}
          gradient={true}
        />

        <StatCard
          title="Income This Month"
          value={formatCurrency(stats.income)}
          change="+12.5%"
          changeType="positive"
          icon={TrendingUp}
        />

        <StatCard
          title="Expense This Month"
          value={formatCurrency(stats.expense)}
          change="-3.2%"
          changeType="negative"
          icon={TrendingDown}
        />

        <StatCard
          title="Transactions This Month"
          value={stats.totalTransactions.toString()}
          change="+5.1%"
          changeType="positive"
          icon={CreditCard}
        />
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 bg-card border-card-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Newest Transactions
            </CardTitle>
            <CardDescription>Newest Activity Transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      transaction.type === "income"
                        ? "bg-success/20 text-success"
                        : "bg-destructive/20 text-destructive"
                    )}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground text-sm">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(transaction.created_at)}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {transaction.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <span
                  className={cn(
                    "font-semibold text-sm",
                    transaction.type === "income"
                      ? "text-success"
                      : "text-destructive"
                  )}
                >
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
             Debts Reminder 
            </CardTitle>
            <CardDescription>Debt is due</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-64 overflow-y-auto pr-2">
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
                    {Math.max(
                      0,
                      Math.ceil(
                        (new Date(debt.due_date).getTime() - Date.now()) /
                          (1000 * 60 * 60 * 24)
                      )
                    )}{" "}
                    hari
                  </Badge>
                </div>
                <p className="text-warning font-semibold text-sm">
                  {formatCurrency(debt.amount)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Due: {formatDate(debt.due_date)}
                </p>
              </div>
            ))}

            {/* Link ke semua utang */}
            <Button asChild variant="outline" size="sm" className="w-full mt-3">
              <Link to="/debts">See Full Debts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSuccess={fetchData} // auto refresh setelah tambah transaksi
      />
    </div>
  );
}
