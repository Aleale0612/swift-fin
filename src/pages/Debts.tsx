import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  // 🔥 State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Tetap 5 baris per halaman dan tidak bisa diubah

  useEffect(() => {
    if (user) fetchDebts();
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

    if (searchTerm) {
      filtered = filtered.filter(
        (debt) =>
          debt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (debt.description &&
            debt.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((debt) => debt.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((debt) => debt.status === statusFilter);
    }

    setFilteredDebts(filtered);
    setCurrentPage(1); // reset halaman kalau filter berubah
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this debt/receivable?")) return;

    try {
      const { error } = await supabase.from("debts").delete().eq("id", id);
      if (error) throw error;
      toast.success("Debt/Receivable deleted successfully");
      fetchDebts();
    } catch (error) {
      console.error("Error deleting debt:", error);
      toast.error("Failed to delete debt/receivable");
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "MMM d, yyyy");

  const getDaysUntilDue = (dueDate: string) =>
    differenceInDays(new Date(dueDate), new Date());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return CheckCircle;
      case "partial":
        return Clock;
      case "unpaid":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  // 🔥 Pagination logic
  const totalPages = Math.ceil(filteredDebts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredDebts.length);
  const currentDebts = filteredDebts.slice(startIndex, endIndex);

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

      {/* Filters Card - Ditambahkan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search debts or receivables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="debt">Debt</SelectItem>
                <SelectItem value="receivable">Receivable</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
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
          ) : currentDebts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No debts or receivables found. Add your first entry to get started.
            </div>
          ) : (
            <>
              {/* Scroll hanya di dalam tabel */}
              <div className="max-h-[500px] overflow-y-auto">
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
                    {currentDebts.map((debt) => {
                      const StatusIcon = getStatusIcon(debt.status);
                      const daysUntilDue = debt.due_date
                        ? getDaysUntilDue(debt.due_date)
                        : null;

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
                              variant={
                                debt.type === "receivable" ? "default" : "secondary"
                              }
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
                              <StatusIcon
                                className={cn(
                                  "h-4 w-4",
                                  debt.status === "paid" && "text-success",
                                  debt.status === "partial" && "text-warning",
                                  debt.status === "unpaid" && "text-destructive"
                                )}
                              />
                              <Badge
                                variant="outline"
                                className={cn(
                                  debt.status === "paid" &&
                                    "border-success text-success",
                                  debt.status === "partial" &&
                                    "border-warning text-warning",
                                  debt.status === "unpaid" &&
                                    "border-destructive text-destructive"
                                )}
                              >
                                {debt.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {debt.due_date ? (
                              <div>
                                <div>{formatDate(debt.due_date)}</div>
                                {daysUntilDue !== null && (
                                  <div
                                    className={cn(
                                      "text-xs",
                                      daysUntilDue < 0 && "text-destructive",
                                      daysUntilDue >= 0 &&
                                        daysUntilDue <= 7 &&
                                        "text-warning",
                                      daysUntilDue > 7 && "text-muted-foreground"
                                    )}
                                  >
                                    {daysUntilDue < 0
                                      ? `${Math.abs(daysUntilDue)} days overdue`
                                      : daysUntilDue === 0
                                      ? "Due today"
                                      : `${daysUntilDue} days left`}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">
                                No due date
                              </span>
                            )}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-right font-semibold",
                              debt.type === "receivable"
                                ? "text-success"
                                : "text-destructive"
                            )}
                          >
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
              </div>

              {/* Pagination controls - Diperbaiki */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {endIndex} of {filteredDebts.length} entries
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Prev
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
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