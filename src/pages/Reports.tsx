import React, { useState, useEffect, useRef } from "react";
import { Download, Calendar, TrendingUp, TrendingDown, PieChart, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from "date-fns";

interface ReportData {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  transactionCount: number;
  categories: Array<{
    name: string;
    total: number;
    count: number;
    color: string;
  }>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
}

export default function Reports() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<ReportData>({
    totalIncome: 0,
    totalExpense: 0,
    netIncome: 0,
    transactionCount: 0,
    categories: [],
    monthlyTrend: [],
  });
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("current-month");
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      generateReport();
    }
  }, [user, period]);

  const getPeriodDates = () => {
    const now = new Date();
    
    switch (period) {
      case "current-month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "last-month":
        return { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) };
      case "current-year":
        return { start: startOfYear(now), end: endOfYear(now) };
      case "last-year":
        return { start: startOfYear(subYears(now, 1)), end: endOfYear(subYears(now, 1)) };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const { start, end } = getPeriodDates();
      
      // Fetch transactions for the period
      const { data: transactions, error } = await supabase
        .from("transactions")
        .select(`
          *,
          categories (
            name,
            color,
            icon
          )
        `)
        .eq("user_id", user?.id)
        .gte("date", start.toISOString().split('T')[0])
        .lte("date", end.toISOString().split('T')[0])
        .order("date", { ascending: true });

      if (error) throw error;

      const income = transactions?.filter(t => t.type === "income") || [];
      const expenses = transactions?.filter(t => t.type === "expense") || [];

      const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

      // Category breakdown
      const categoryMap = new Map();
      expenses.forEach(transaction => {
        const category = transaction.categories?.name || "Uncategorized";
        const color = transaction.categories?.color || "#gray";
        
        if (categoryMap.has(category)) {
          const existing = categoryMap.get(category);
          categoryMap.set(category, {
            ...existing,
            total: existing.total + transaction.amount,
            count: existing.count + 1,
          });
        } else {
          categoryMap.set(category, {
            name: category,
            total: transaction.amount,
            count: 1,
            color: color,
          });
        }
      });

      const categories = Array.from(categoryMap.values()).sort((a, b) => b.total - a.total);

      setReportData({
        totalIncome,
        totalExpense,
        netIncome: totalIncome - totalExpense,
        transactionCount: transactions?.length || 0,
        categories,
        monthlyTrend: [], // Would need more complex logic for monthly trends
      });

    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    if (!reportRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      // Add title
      pdf.setFontSize(20);
      pdf.text("Financial Report", 20, position);
      position += 15;

      // Add period
      pdf.setFontSize(12);
      pdf.text(`Period: ${getPeriodLabel()}`, 20, position);
      pdf.text(`Generated: ${format(new Date(), "PPP")}`, 20, position + 5);
      position += 20;

      // Add the chart image
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, Math.min(imgHeight, 250));
      
      if (heightLeft > 250) {
        position = 280;
        pdf.addPage();
        position = 20;
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, heightLeft - 250);
      }

      pdf.save(`financial-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
      toast.success("Report exported successfully!");
      
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "current-month": return "Current Month";
      case "last-month": return "Last Month";
      case "current-year": return "Current Year";
      case "last-year": return "Last Year";
      default: return "Current Month";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Financial Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyze your financial performance and trends
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="current-year">Current Year</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={exportToPDF}
            disabled={isExporting}
            className="bg-gradient-primary shadow-glow hover:shadow-glow/70 transition-all duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="space-y-6 bg-background p-6 rounded-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Financial Report</h2>
          <p className="text-muted-foreground">{getPeriodLabel()}</p>
          <p className="text-sm text-muted-foreground">Generated on {format(new Date(), "PPP")}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-card-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(reportData.totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-card-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(reportData.totalExpense)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-card-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <BarChart3 className={cn(
                "h-4 w-4",
                reportData.netIncome >= 0 ? "text-success" : "text-destructive"
              )} />
            </CardHeader>
            <CardContent>
              <div className={cn(
                "text-2xl font-bold",
                reportData.netIncome >= 0 ? "text-success" : "text-destructive"
              )}>
                {formatCurrency(reportData.netIncome)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-card-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {reportData.transactionCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-card-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OverviewChart type="pie" height={300} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-card-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Income vs Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OverviewChart type="line" height={300} />
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="bg-gradient-card border-card-border shadow-card">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading categories...</div>
            ) : reportData.categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No expense categories found for this period.
              </div>
            ) : (
              <div className="space-y-4">
                {reportData.categories.map((category, index) => {
                  const percentage = reportData.totalExpense > 0 
                    ? (category.total / reportData.totalExpense * 100).toFixed(1)
                    : "0";
                    
                  return (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {category.count} transactions
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-destructive">
                          {formatCurrency(category.total)}
                        </p>
                        <Badge variant="outline">
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-gradient-card border-card-border shadow-card">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Period:</span>
              <span className="font-medium">{getPeriodLabel()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Transactions:</span>
              <span className="font-medium">{reportData.transactionCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Savings Rate:</span>
              <span className={cn(
                "font-medium",
                reportData.totalIncome > 0 && reportData.netIncome >= 0 ? "text-success" : "text-destructive"
              )}>
                {reportData.totalIncome > 0 
                  ? `${((reportData.netIncome / reportData.totalIncome) * 100).toFixed(1)}%`
                  : "N/A"
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Largest Expense Category:</span>
              <span className="font-medium">
                {reportData.categories.length > 0 
                  ? reportData.categories[0].name 
                  : "N/A"
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}