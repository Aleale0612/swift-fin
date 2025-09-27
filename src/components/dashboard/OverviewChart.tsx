import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { supabase } from "@/lib/supabaseClient";

interface OverviewChartProps {
  type: "line" | "pie";
  height?: number;
  data?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function OverviewChart({ type, height = 300, data }: OverviewChartProps) {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [hoveredSliceIndex, setHoveredSliceIndex] = useState<number | null>(null);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);

  useEffect(() => {
    const fetchData = async () => {
      const { data: transactions } = await supabase.from("transactions").select(`
        amount,
        type,
        created_at,
        categories (id, name, color)
      `);

      if (transactions) {
        const grouped = transactions.reduce((acc: any, trx: any) => {
          const month = new Date(trx.created_at).toLocaleString("id-ID", { month: "short" });
          if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
          trx.type === "income" ? (acc[month].income += trx.amount) : (acc[month].expense += trx.amount);
          return acc;
        }, {});
        setMonthlyData(Object.values(grouped));

        const groupedExpense = transactions
          .filter((trx: any) => trx.type === "expense")
          .reduce((acc: any, trx: any) => {
            const categoryName = trx.categories?.name || "Unknown";
            const categoryColor = trx.categories?.color || "#888888";
            if (!acc[categoryName]) {
              acc[categoryName] = { total: 0, color: categoryColor };
            }
            acc[categoryName].total += trx.amount;
            return acc;
          }, {});
        
        setExpenseData(
          Object.keys(groupedExpense).map((key) => ({
            name: key,
            value: groupedExpense[key].total,
            color: groupedExpense[key].color,
          }))
        );
      }
    };

    // 只有在没有传入数据时才获取数据
    if (!data) {
      fetchData();
    }
  }, [data]);

  // 如果传入了数据，使用传入的数据
  const pieData = data || expenseData;

  if (type === "line") {
    return (
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#374151" fontSize={12} />
            <YAxis stroke="#374151" fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} />
            <RechartsTooltip
              contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }}
              formatter={(value: number) => [formatCurrency(value), ""]}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", r: 5 }}
              activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2 }}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: "#ef4444", r: 5 }}
              activeDot={{ r: 8, stroke: "#ef4444", strokeWidth: 2 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            labelLine={false}
            onMouseEnter={(_, index) => setHoveredSliceIndex(index)}
            onMouseLeave={() => setHoveredSliceIndex(null)}
            animationDuration={800}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke={hoveredSliceIndex === index ? "#fff" : entry.color}
                strokeWidth={hoveredSliceIndex === index ? 3 : 1}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Tooltip muncul di pinggir slice */}
      {hoveredSliceIndex !== null && (
        <div
          className="absolute p-2 rounded-md bg-gray-900 text-white shadow-lg pointer-events-none transition-all duration-200"
          style={{
            top: `calc(50% + ${(hoveredSliceIndex - pieData.length / 2) * 25}px)`,
            left: "calc(50% + 100px)",
            transform: "translateY(-50%)",
            whiteSpace: "nowrap",
            zIndex: 50,
          }}
        >
          <p className="font-semibold">{pieData[hoveredSliceIndex].name}</p>
          <p>{formatCurrency(pieData[hoveredSliceIndex].value)}</p>
        </div>
      )}
    </div>
  );
};