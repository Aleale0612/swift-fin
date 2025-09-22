import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Jan", income: 8500000, expense: 6200000 },
  { month: "Feb", income: 9200000, expense: 5800000 },
  { month: "Mar", income: 7800000, expense: 6500000 },
  { month: "Apr", income: 10200000, expense: 7200000 },
  { month: "Mei", income: 11500000, expense: 6800000 },
  { month: "Jun", income: 9800000, expense: 7500000 },
];

const expenseData = [
  { name: "Makanan", value: 3200000, color: "#06b6d4" },
  { name: "Transportasi", value: 1500000, color: "#10b981" },
  { name: "Hiburan", value: 800000, color: "#f59e0b" },
  { name: "Tagihan", value: 2200000, color: "#ef4444" },
  { name: "Lainnya", value: 900000, color: "#8b5cf6" },
];

interface OverviewChartProps {
  type: "line" | "pie";
  height?: number;
}

export function OverviewChart({ type, height = 300 }: OverviewChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (type === "line") {
    return (
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
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
                color: "hsl(var(--card-foreground))"
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
              color: "hsl(var(--card-foreground))"
            }}
            formatter={(value: number) => [formatCurrency(value), "Jumlah"]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}