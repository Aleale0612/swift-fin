import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DebtModal } from "@/components/modals/DebtModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { differenceInDays, format } from "date-fns";

interface Debt {
  id: string;
  name: string;
  type: string;
  amount: number;
  description?: string;
  due_date?: string;
  status: string;
  created_at: string;
}

export default function Debts() {
  const { user } = useAuth();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [filteredDebts, setFilteredDebts] = useState<Debt[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  useEffect(() => {
    if (user) {
      fetchDebts();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [debts, searchTerm, typeFilter, statusFilter]);

  const fetchDebts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("debts")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDebts(data || []);
    } catch (error) {
      console.error("Error fetching debts:", error);
      toast.error("Failed to load debts");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = debts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(debt =>
        debt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (debt.description && debt.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(debt => debt.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(debt => debt.status === statusFilter);
    }

    setFilteredDebts(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this debt/receivable?")) return;

    try {
      const { error } = await supabase
        .from("debts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Debt/Receivable deleted successfully");
      fetchDebts();
    } catch (error) {
      console.error("Error deleting debt:", error);
      toast.error("Failed to delete debt/receivable");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const getDaysUntilDue = (dueDate: string) => {
    return differenceInDays(new Date(dueDate), new Date());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "success";
      case "partial": return "warning";
      case "unpaid": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return CheckCircle;
      case "partial": return Clock;
      case "unpaid": return AlertCircle;
      default: return Clock;
    }
  };

  const getTotalsByType = (type: string) => {
    return debts
      .filter(debt => debt.type === type)
      .reduce((total, debt) => total + debt.amount, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Debts & Receivables
          </h1>
          <p className="text-muted-foreground mt-1">
            Track what you owe and what others owe you
          </p>
        </div>
        
        <Button 
          onClick={() => {
            setSelectedDebt(null);
            setIsModalOpen(true);
          }}
          className="bg-gradient-primary shadow-glow hover:shadow-glow/70 transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Debt/Receivable
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-card-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debts</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(getTotalsByType("debt"))}
            </div>
            <p className="text-xs text-muted-foreground">
              Money you owe
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-card-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receivables</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(getTotalsByType("receivable"))}
            </div>
            <p className="text-xs text-muted-foreground">
              Money owed to you
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-card-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Position</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              getTotalsByType("receivable") - getTotalsByType("debt") >= 0 
                ? "text-success" 
                : "text-destructive"
            )}>
              {formatCurrency(getTotalsByType("receivable") - getTotalsByType("debt"))}
            </div>
            <p className="text-xs text-muted-foreground">
              Overall balance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search debts and receivables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="debt">Debts</SelectItem>
                <SelectItem value="receivable">Receivables</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="partial">Partially Paid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Debts Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Debt & Receivable List ({filteredDebts.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading debts...</div>
          ) : filteredDebts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No debts or receivables found. Add your first entry to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDebts.map((debt) => {
                  const StatusIcon = getStatusIcon(debt.status);
                  const daysUntilDue = debt.due_date ? getDaysUntilDue(debt.due_date) : null;
                  
                  return (
                    <TableRow key={debt.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{debt.name}</div>
                          {debt.description && (
                            <div className="text-sm text-muted-foreground">
                              {debt.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={debt.type === "receivable" ? "default" : "secondary"}
                          className={cn(
                            debt.type === "receivable" 
                              ? "bg-success/20 text-success hover:bg-success/30" 
                              : "bg-destructive/20 text-destructive hover:bg-destructive/30"
                          )}
                        >
                          {debt.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={cn(
                            "h-4 w-4",
                            debt.status === "paid" && "text-success",
                            debt.status === "partial" && "text-warning",
                            debt.status === "unpaid" && "text-destructive"
                          )} />
                          <Badge variant="outline" className={cn(
                            debt.status === "paid" && "border-success text-success",
                            debt.status === "partial" && "border-warning text-warning",
                            debt.status === "unpaid" && "border-destructive text-destructive"
                          )}>
                            {debt.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {debt.due_date ? (
                          <div>
                            <div>{formatDate(debt.due_date)}</div>
                            {daysUntilDue !== null && (
                              <div className={cn(
                                "text-xs",
                                daysUntilDue < 0 && "text-destructive",
                                daysUntilDue >= 0 && daysUntilDue <= 7 && "text-warning",
                                daysUntilDue > 7 && "text-muted-foreground"
                              )}>
                                {daysUntilDue < 0 
                                  ? `${Math.abs(daysUntilDue)} days overdue` 
                                  : daysUntilDue === 0 
                                  ? "Due today"
                                  : `${daysUntilDue} days left`
                                }
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No due date</span>
                        )}
                      </TableCell>
                      <TableCell className={cn(
                        "text-right font-semibold",
                        debt.type === "receivable" ? "text-success" : "text-destructive"
                      )}>
                        {formatCurrency(debt.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedDebt(debt);
                              setIsModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(debt.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Debt Modal */}
      <DebtModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        debt={selectedDebt}
        onSuccess={fetchDebts}
      />
    </div>
  );
}