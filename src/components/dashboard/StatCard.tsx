import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  gradient?: boolean;
  className?: string;
  children?: ReactNode;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon, 
  gradient = false,
  className,
  children
}: StatCardProps) {
  const changeColor = {
    positive: "text-success",
    negative: "text-destructive", 
    neutral: "text-muted-foreground"
  }[changeType];

  return (
    <div className={cn(
      "relative p-6 rounded-xl border border-card-border transition-all duration-300",
      "hover:shadow-card hover:-translate-y-1",
      gradient 
        ? "bg-gradient-card shadow-card" 
        : "bg-card",
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl opacity-50" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-3 rounded-lg",
            gradient 
              ? "bg-primary/20 text-primary" 
              : "bg-muted text-muted-foreground"
          )}>
            <Icon className="h-6 w-6" />
          </div>
          
          {change && (
            <span className={cn("text-sm font-medium", changeColor)}>
              {change}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">
            {title}
          </p>
         <p
  className={cn(
    "text-2xl font-extrabold tracking-tight drop-shadow-sm",
    gradient 
      ? "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" 
      : "text-foreground"
  )}
>
  {value}
</p>
        </div>

        {/* Additional Content */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}