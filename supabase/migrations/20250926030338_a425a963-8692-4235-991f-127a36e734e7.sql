-- Fix RLS policies and database function security issues

-- 1. Add missing RLS policies for balance_changes table
CREATE POLICY "Users can view their own balance changes" 
ON public.balance_changes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own balance changes" 
ON public.balance_changes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own balance changes" 
ON public.balance_changes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own balance changes" 
ON public.balance_changes 
FOR DELETE 
USING (auth.uid() = user_id);

-- 2. Fix daily_notes RLS policy to remove null user access
DROP POLICY IF EXISTS "Users can view their own daily notes" ON public.daily_notes;
DROP POLICY IF EXISTS "Users can create their own daily notes" ON public.daily_notes;
DROP POLICY IF EXISTS "Users can update their own daily notes" ON public.daily_notes;
DROP POLICY IF EXISTS "Users can delete their own daily notes" ON public.daily_notes;

CREATE POLICY "Users can view their own daily notes" 
ON public.daily_notes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily notes" 
ON public.daily_notes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily notes" 
ON public.daily_notes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily notes" 
ON public.daily_notes 
FOR DELETE 
USING (auth.uid() = user_id);

-- 3. Secure database functions with proper search_path
CREATE OR REPLACE FUNCTION public.add_trade(
  p_user_id uuid, p_pair text, p_direction text, p_entry_price numeric, p_exit_price numeric,
  p_stop_loss numeric, p_take_profit numeric, p_lot_size numeric, p_contract_size numeric,
  p_result_usd numeric, p_pnl_idr numeric, p_pnl_usd_cent numeric, p_pnl_percent numeric,
  p_risk_reward numeric, p_risk_percent numeric, p_notes text, p_emotional_psychology text,
  p_balance_type text, p_result_balance numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  current_idr numeric;
  current_usd numeric;
  current_usd_cent numeric;
  new_idr numeric;
  new_usd numeric;
  new_usd_cent numeric;
  new_trade_id bigint;
begin
  -- 1. Insert trade
  insert into trades(
    user_id, pair, direction, entry_price, exit_price,
    stop_loss, take_profit, lot_size, contract_size,
    result_usd, pnl_idr, pnl_usd_cent, pnl_percent,
    risk_reward, risk_percent, notes,
    emotional_psychology, balance_type, result_balance
  )
  values (
    p_user_id, p_pair, p_direction, p_entry_price, p_exit_price,
    p_stop_loss, p_take_profit, p_lot_size, p_contract_size,
    p_result_usd, p_pnl_idr, p_pnl_usd_cent, p_pnl_percent,
    p_risk_reward, p_risk_percent, p_notes,
    p_emotional_psychology, p_balance_type, p_result_balance
  )
  returning id into new_trade_id;

  -- 2. Get current balance
  select idr_balance, usd_balance, usd_cent_balance
  into current_idr, current_usd, current_usd_cent
  from profiles
  where user_id = p_user_id;

  new_idr := current_idr;
  new_usd := current_usd;
  new_usd_cent := current_usd_cent;

  -- 3. Update balance based on type
  if p_balance_type = 'IDR' then
    new_idr := coalesce(current_idr, 0) + p_result_balance;
  elsif p_balance_type = 'USD' then
    new_usd := coalesce(current_usd, 0) + p_result_balance;
  elsif p_balance_type = 'USD_CENT' then
    new_usd_cent := coalesce(current_usd_cent, 0) + p_result_balance;
  end if;

  update profiles
  set idr_balance = new_idr,
      usd_balance = new_usd,
      usd_cent_balance = new_usd_cent
  where user_id = p_user_id;

  -- 4. Log to balance_changes
  insert into balance_changes(
    user_id, trade_id, balance_type, amount,
    previous_balance, new_balance
  ) values (
    p_user_id, new_trade_id, p_balance_type, p_result_balance,
    jsonb_build_object(
      'idr_balance', current_idr,
      'usd_balance', current_usd,
      'usd_cent_balance', current_usd_cent
    ),
    jsonb_build_object(
      'idr_balance', new_idr,
      'usd_balance', new_usd,
      'usd_cent_balance', new_usd_cent
    )
  );
end;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;