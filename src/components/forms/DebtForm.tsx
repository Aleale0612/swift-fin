import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const debtSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  type: z.enum(["debt", "receivable"]),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
  due_date: z.date().optional(),
  status: z.enum(["unpaid", "partial", "paid"]),
});

type DebtFormData = z.infer<typeof debtSchema>;

interface DebtFormProps {
  debt?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DebtForm({ debt, onSuccess, onCancel }: DebtFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<DebtFormData>({
    resolver: zodResolver(debtSchema),
    defaultValues: debt ? {
      name: debt.name,
      type: debt.type,
      amount: debt.amount,
      description: debt.description || "",
      due_date: debt.due_date ? new Date(debt.due_date) : undefined,
      status: debt.status,
    } : {
      name: "",
      type: "debt",
      amount: 0,
      description: "",
      due_date: undefined,
      status: "unpaid",
    },
  });

  const onSubmit = async (data: DebtFormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const debtData = {
        name: data.name,
        type: data.type,
        amount: data.amount,
        description: data.description || null,
        due_date: data.due_date ? data.due_date.toISOString().split('T')[0] : null, // Convert Date to string
        status: data.status,
        user_id: user.id,
      };

      if (debt) {
        // Update existing debt
        const { error } = await supabase
          .from("debts")
          .update(debtData)
          .eq("id", debt.id);

        if (error) throw error;
        toast.success("Debt/Receivable updated successfully!");
      } else {
        // Create new debt
        const { error } = await supabase
          .from("debts")
          .insert(debtData);

        if (error) throw error;
        toast.success("Debt/Receivable added successfully!");
      }
      
      onSuccess?.();
    } catch (error) {
      console.error("Error saving debt:", error);
      toast.error("Failed to save debt/receivable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter debt/receivable name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="debt">Debt (Money I Owe)</SelectItem>
                  <SelectItem value="receivable">Receivable (Money Owed to Me)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (IDR)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter additional details..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="partial">Partially Paid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date (optional)</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : debt ? "Update" : "Add"} {form.watch("type") === "debt" ? "Debt" : "Receivable"}
          </Button>
          
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}