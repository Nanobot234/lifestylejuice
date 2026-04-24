
-- Insert three new juices
INSERT INTO public.products (name, description, price, image_url, category) VALUES
(
  'Strawberry Refresher',
  'Cold-pressed strawberries muddled with fresh lemon, a touch of agave, and crisp filtered water. Light, juicy, and ridiculously refreshing — like summer in a cup.',
  10.00,
  'https://iadhangnqjkyyxuerkyc.supabase.co/storage/v1/object/public/product-images/juice-strawberry-refresher.jpg',
  'juice'
),
(
  'Green Machine',
  'A powerhouse blend of spinach, celery, cucumber, green apple and pineapple with a kick of ginger and lemon. Deeply hydrating and full of greens — your body''s reset button.',
  10.00,
  'https://iadhangnqjkyyxuerkyc.supabase.co/storage/v1/object/public/product-images/juice-green-machine.jpg',
  'juice'
),
(
  'Chia Refresher',
  'Crisp filtered water infused with lemon, mint and a swirl of agave, loaded with chia seeds for a slow-release energy lift. Cooling, hydrating, and great for digestion.',
  10.00,
  'https://iadhangnqjkyyxuerkyc.supabase.co/storage/v1/object/public/product-images/juice-chia-refresher.jpg',
  'juice'
);

-- Rewrite existing juice/smoothie descriptions to be unique and descriptive (not just ingredient lists)
UPDATE public.products SET description = 'Pineapple, beets, orange and carrot pressed into a vibrant ruby blend. Earthy-sweet, immune-boosting, and impossible to ignore — you''ll definitely see it coming.'
  WHERE name = 'Now You See Me';

UPDATE public.products SET description = 'A creamy tropical escape — coconut water, mango and pineapple blended with spinach, agave and a scoop of collagen powder. Glowing skin, glowing mood.'
  WHERE name = 'Glow Up Smoothie';

UPDATE public.products SET description = 'Velvety dragon fruit blended with mango, banana, pineapple, lemon and oat milk. Sweet, tangy and hot-pink gorgeous — antioxidants in their most photogenic form.'
  WHERE name = 'Pink Dragon Smoothie';

UPDATE public.products SET description = 'Rich cacao, banana, dates and peanut butter blended with whey protein and almond milk. Tastes like a milkshake, lifts like a post-workout recovery shake.'
  WHERE name = 'Chocolate Whey Smoothie';

UPDATE public.products SET description = 'Banana, oats and kale blended with peanut butter, almond butter and a drizzle of honey. Thick, hearty and packed with clean fuel — the green hero you need.'
  WHERE name = 'Hulk Smoothie';

UPDATE public.products SET description = 'A tropical island in a cup — banana, mango and pineapple blended with creamy coconut cream, almond milk and a swirl of blue spirulina for that dreamy ocean hue.'
  WHERE name = 'Coconut Dream Smoothie';
