import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/lib/supabaseClient"; // 🔥 langsung pakai client global

interface OverviewChartProps {
  type: "line" | "pie";
  height?: number;
}

export function OverviewChart({ type, height = 300 }: OverviewChartProps) {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      // 🔹 Ambil data transaksi (contoh tabel: "transactions")
      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("amount, type, category, created_at");

      if (error) {
        console.error("Error fetching transactions:", error.message);
        return;
      }

      if (transactions) {
        // Grouping bulanan
        const grouped = transactions.reduce((acc: any, trx: any) => {
          const month = new Date(trx.created_at).toLocaleString("id-ID", { month: "short" });
          if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };

          if (trx.type === "income") {
            acc[month].income += trx.amount;
          } else {
            acc[month].expense += trx.amount;
          }

          return acc;
        }, {});

        setMonthlyData(Object.values(grouped));

        // Grouping kategori (buat pie chart)
        const groupedExpense = transactions
          .filter((trx: any) => trx.type === "expense")
          .reduce((acc: any, trx: any) => {
            if (!acc[trx.category]) acc[trx.category] = 0;
            acc[trx.category] += trx.amount;
            return acc;
          }, {});

        setExpenseData(
          Object.keys(groupedExpense).map((key, idx) => ({
            name: key,
            value: groupedExpense[key],
            color: ["#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][idx % 5],
          }))
        );
      }
    };

    fetchData();
  }, []);

  if (type === "line") {
    return (
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `${value / 1000000}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))",
              }}
              formatter={(value: number) => [formatCurrency(value), ""]}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="hsl(var(--success))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 4 }}
              name="Pemasukan"
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="hsl(var(--destructive))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 4 }}
              name="Pengeluaran"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={expenseData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {expenseData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--card-foreground))",
            }}
            formatter={(value: number) => [formatCurrency(value), "Jumlah"]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
