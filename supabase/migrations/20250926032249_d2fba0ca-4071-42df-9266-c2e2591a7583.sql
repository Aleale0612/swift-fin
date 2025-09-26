-- Clear existing categories and add our new ones
DELETE FROM categories;

-- Drop the old constraint and add new one
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_type_check;
ALTER TABLE categories ADD CONSTRAINT categories_type_check CHECK (type IN ('expense', 'income', 'both'));

-- Now populate with useful financial categories
INSERT INTO categories (name, type, color, icon) VALUES 
  ('Food & Dining', 'expense', '#FF6B6B', 'UtensilsCrossed'),
  ('Transportation', 'expense', '#4ECDC4', 'Car'),
  ('Entertainment', 'expense', '#45B7D1', 'Gamepad2'),
  ('Shopping', 'expense', '#96CEB4', 'ShoppingBag'),
  ('Utilities & Bills', 'expense', '#FECA57', 'Zap'),
  ('Healthcare', 'expense', '#FF9FF3', 'Heart'),
  ('Education', 'expense', '#54A0FF', 'BookOpen'),
  ('Travel', 'expense', '#5F27CD', 'Plane'),
  ('Salary', 'income', '#00D2D3', 'Wallet'),
  ('Freelance', 'income', '#FF9F43', 'Laptop'),
  ('Investment', 'income', '#10AC84', 'TrendingUp'),
  ('Business', 'income', '#EE5A24', 'Briefcase'),
  ('Gift', 'income', '#0984e3', 'Gift'),
  ('Others', 'both', '#636e72', 'MoreHorizontal');