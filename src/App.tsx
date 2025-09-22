import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            {/* Future routes for transactions, debts, reports, etc. */}
            <Route path="transactions" element={<div className="p-8">Halaman Transaksi (Coming Soon)</div>} />
            <Route path="debts" element={<div className="p-8">Halaman Utang (Coming Soon)</div>} />
            <Route path="reports" element={<div className="p-8">Halaman Laporan (Coming Soon)</div>} />
            <Route path="categories" element={<div className="p-8">Halaman Kategori (Coming Soon)</div>} />
            <Route path="settings" element={<div className="p-8">Halaman Pengaturan (Coming Soon)</div>} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
