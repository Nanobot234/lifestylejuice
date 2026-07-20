
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_number TEXT;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  alphabet TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  candidate TEXT;
  i INT;
  exists_already BOOLEAN;
BEGIN
  LOOP
    candidate := '';
    FOR i IN 1..6 LOOP
      candidate := candidate || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;
    SELECT EXISTS (SELECT 1 FROM public.orders WHERE order_number = candidate) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN candidate;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_set_order_number ON public.orders;
CREATE TRIGGER orders_set_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_order_number();

UPDATE public.orders SET order_number = public.generate_order_number() WHERE order_number IS NULL;

ALTER TABLE public.orders ALTER COLUMN order_number SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_key ON public.orders (order_number);
