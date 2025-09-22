-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('need', 'want', 'unexpected')),
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  category_id UUID REFERENCES public.categories(id),
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create debts table
CREATE TABLE public.debts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid')),
  type TEXT NOT NULL CHECK (type IN ('debt', 'receivable')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (global access for now)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Categories can be created by anyone" 
ON public.categories FOR INSERT WITH CHECK (true);

-- Create policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
ON public.transactions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
ON public.transactions FOR DELETE USING (auth.uid() = user_id);

-- Create policies for debts
CREATE POLICY "Users can view their own debts" 
ON public.debts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own debts" 
ON public.debts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own debts" 
ON public.debts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own debts" 
ON public.debts FOR DELETE USING (auth.uid() = user_id);

-- Create update triggers
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_debts_updated_at
BEFORE UPDATE ON public.debts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, type, icon, color) VALUES
-- Needs (Kebutuhan)
('Makanan & Minuman', 'need', '🍽️', 'emerald'),
('Transportasi', 'need', '🚗', 'blue'),
('Tagihan Rutin', 'need', '⚡', 'yellow'),
('Kesehatan', 'need', '🏥', 'red'),
('Pendidikan', 'need', '📚', 'indigo'),

-- Wants (Kepentingan)
('Hiburan', 'want', '🎬', 'purple'),
('Belanja', 'want', '🛍️', 'pink'),
('Investasi', 'want', '📈', 'green'),
('Traveling', 'want', '✈️', 'cyan'),
('Hobi', 'want', '🎨', 'orange'),

-- Unexpected (Tak Terduga)
('Perbaikan', 'unexpected', '🔧', 'gray'),
('Darurat', 'unexpected', '🚨', 'red'),
('Hadiah', 'unexpected', '🎁', 'rose');