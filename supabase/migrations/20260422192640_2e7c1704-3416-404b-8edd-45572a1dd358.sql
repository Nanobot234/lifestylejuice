-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============= PROFILES =============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile fields, but role changes are blocked by trigger below
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Prevent users from escalating their own role from the client.
-- Role can only be set on INSERT or via service role (which bypasses RLS and triggers off by default? triggers run; we use SECURITY DEFINER bypass via session_user check).
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow if role unchanged
  IF NEW.role IS NOT DISTINCT FROM OLD.role THEN
    RETURN NEW;
  END IF;
  -- Block role changes from authenticated users (only service_role / postgres can change)
  IF current_setting('request.jwt.claims', true)::jsonb->>'role' = 'authenticated' THEN
    RAISE EXCEPTION 'Role changes are not permitted';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_role_escalation_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- Auto-create profile on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'customer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper to check business owner (used in policies below)
CREATE OR REPLACE FUNCTION public.is_business_owner(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = 'business_owner'
  );
$$;

-- Business owners can view all profiles (needed for order/subscription management)
CREATE POLICY "Business owners can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_business_owner(auth.uid()));

-- ============= PRODUCTS =============
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Business owners can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_business_owner(auth.uid()));

CREATE POLICY "Business owners can update products"
  ON public.products FOR UPDATE
  USING (public.is_business_owner(auth.uid()));

CREATE POLICY "Business owners can delete products"
  ON public.products FOR DELETE
  USING (public.is_business_owner(auth.uid()));

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= ORDERS =============
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Business owners can view all orders"
  ON public.orders FOR SELECT
  USING (public.is_business_owner(auth.uid()));

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Business owners can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_business_owner(auth.uid()));

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER TABLE public.orders REPLICA IDENTITY FULL;

-- ============= ORDER ITEMS =============
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_purchase NUMERIC(10,2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items for their own orders"
  ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));

CREATE POLICY "Business owners can view all order items"
  ON public.order_items FOR SELECT
  USING (public.is_business_owner(auth.uid()));

CREATE POLICY "Users can insert items for their own orders"
  ON public.order_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));

-- ============= SUBSCRIPTION PLANS =============
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  frequency TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active subscription plans"
  ON public.subscription_plans FOR SELECT
  USING (is_active = true OR public.is_business_owner(auth.uid()));

CREATE POLICY "Business owners can manage subscription plans"
  ON public.subscription_plans FOR ALL
  USING (public.is_business_owner(auth.uid()))
  WITH CHECK (public.is_business_owner(auth.uid()));

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= USER SUBSCRIPTIONS =============
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  next_delivery_date DATE NOT NULL,
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Business owners can view all subscriptions"
  ON public.user_subscriptions FOR SELECT
  USING (public.is_business_owner(auth.uid()));

CREATE POLICY "Users can create their own subscriptions"
  ON public.user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON public.user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= SUBSCRIPTION ITEMS =============
CREATE TABLE public.subscription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.user_subscriptions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items in their own subscriptions"
  ON public.subscription_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.user_subscriptions s WHERE s.id = subscription_id AND s.user_id = auth.uid()));

CREATE POLICY "Business owners can view all subscription items"
  ON public.subscription_items FOR SELECT
  USING (public.is_business_owner(auth.uid()));

CREATE POLICY "Users can insert items in their own subscriptions"
  ON public.subscription_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_subscriptions s WHERE s.id = subscription_id AND s.user_id = auth.uid()));

CREATE POLICY "Users can update items in their own subscriptions"
  ON public.subscription_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.user_subscriptions s WHERE s.id = subscription_id AND s.user_id = auth.uid()));

CREATE POLICY "Users can delete items in their own subscriptions"
  ON public.subscription_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.user_subscriptions s WHERE s.id = subscription_id AND s.user_id = auth.uid()));

CREATE TRIGGER update_subscription_items_updated_at
  BEFORE UPDATE ON public.subscription_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();