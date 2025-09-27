import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Plus, Trash2, Edit, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Goals() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 6; // fixed 6 goals per page
  const [total, setTotal] = useState(0);

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    title: "",
    target: "",
    current: "",
    url: "",
    type: "short",
    category: "keinginan",
  });

  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
    });
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  // Fetch total goals count
  const fetchCount = async () => {
    if (!userId) return;
    const { count } = await supabase
      .from("goals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    setTotal(count || 0);
  };

 // Fetch paginated goals
const fetchGoals = async () => {
  if (!userId) return;
  setLoading(true);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
  .from("goals_ordered")
  .select("*")
  .eq("user_id", userId)
  .range(from, to);

  if (!error && data) {
  const priority: Record<string, number> = {
    kebutuhan: 1,
    darurat: 2,
    keinginan: 3,
  };

  const ordered = [...data].sort((a, b) => {
    const categoryDiff =
      (priority[a.category] || 99) - (priority[b.category] || 99);
    if (categoryDiff !== 0) return categoryDiff;

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  setGoals(ordered);
}
setLoading(false);
}


  useEffect(() => {
    fetchCount();
  }, [userId]);

  useEffect(() => {
    fetchGoals();
  }, [userId, page]);

  // Save goal
  const handleSave = async () => {
    if (!form.title || !form.target) return;

    if (form.id) {
      await supabase
        .from("goals")
        .update({
          title: form.title,
          target: Number(form.target),
          current: Number(form.current) || 0,
          url: form.url,
          type: form.type,
          category: form.category,
        })
        .eq("id", form.id)
        .eq("user_id", userId);
    } else {
      await supabase.from("goals").insert([
        {
          title: form.title,
          target: Number(form.target),
          current: Number(form.current) || 0,
          url: form.url,
          type: form.type,
          category: form.category,
          user_id: userId,
        },
      ]);
    }

    setForm({
      id: null,
      title: "",
      target: "",
      current: "",
      url: "",
      type: "short",
      category: "keinginan",
    });
    setIsOpen(false);
    fetchCount();
    fetchGoals();
  };

  // Delete goal
  const handleDelete = async (id: string) => {
    await supabase.from("goals").delete().eq("id", id).eq("user_id", userId);
    fetchCount();
    fetchGoals();
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-7 w-7 text-primary" /> Pencapaian & Goals
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola target keuangan Anda dari jangka pendek hingga jangka panjang.
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="bg-gradient-primary shadow-glow">
          <Plus className="h-4 w-4 mr-2" /> Tambah Pencapaian
        </Button>
      </div>

      <Separator />

      {/* List Goals */}
      {loading ? (
        <p>Loading...</p>
      ) : goals.length === 0 ? (
        <p className="text-muted-foreground">Belum ada goals.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progressValue =
            goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;


            return (
              <Card key={goal.id} className="bg-card border-card-border relative">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {goal.title}
                    {goal.url && (
                      <a href={goal.url} target="_blank" rel="noopener noreferrer">
                        <LinkIcon className="h-4 w-4 text-primary" />
                      </a>
                    )}
                  </CardTitle>
                  <CardDescription>Target: {formatCurrency(goal.target)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={progressValue}
                  className={`mb-2 h-2 overflow-hidden ${
                    progressValue > 0 ? "progress-glow-shimmer" : "bg-muted"
                    }`}/>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(goal.current)} / {formatCurrency(goal.target)} ({progressValue.toFixed(1)}%)
                      </p>

                  <div className="flex justify-between items-center mt-3">
                    <Badge>{goal.type}-term</Badge>
                    <Badge variant="outline">{goal.category}</Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setForm({
                          id: goal.id,
                          title: goal.title,
                          target: goal.target,
                          current: goal.current,
                          url: goal.url,
                          type: goal.type,
                          category: goal.category,
                        });
                        setIsOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(goal.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Modal Add/Edit */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Goal" : "Tambah Goal"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Judul</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Contoh: Beli Laptop Baru"
              />
            </div>
            <div>
              <Label>Target (Rp)</Label>
              <Input
                type="number"
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value })}
              />
            </div>
            <div>
              <Label>Sudah Terkumpul (Rp)</Label>
              <Input
                type="number"
                value={form.current}
                onChange={(e) => setForm({ ...form, current: e.target.value })}
              />
            </div>
            <div>
              <Label>URL Referensi (opsional)</Label>
              <Input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Jangka Waktu</Label>
              <Select value={form.type} onValueChange={(val) => setForm({ ...form, type: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jangka waktu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short Term</SelectItem>
                  <SelectItem value="medium">Medium Term</SelectItem>
                  <SelectItem value="long">Long Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Kategori</Label>
              <Select value={form.category} onValueChange={(val) => setForm({ ...form, category: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keinginan">Keinginan</SelectItem>
                  <SelectItem value="kebutuhan">Kebutuhan</SelectItem>
                  <SelectItem value="darurat">Dana Darurat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} className="bg-gradient-primary shadow-glow">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
