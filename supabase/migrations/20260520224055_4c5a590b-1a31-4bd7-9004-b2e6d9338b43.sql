
-- Update existing juices with menu-accurate ingredients and calorie info
UPDATE public.products SET
  description = 'Spinach, cucumber, celery, apple, pineapple, ginger, lemon. 16oz | 238 cal · 24oz | 305 cal',
  price = 10.00
WHERE name = 'Green Machine';

UPDATE public.products SET
  description = 'Carrots, beets, pineapple, orange. 16oz | 392 cal · 24oz | 490 cal',
  price = 10.00
WHERE name = 'Now You See Me';

UPDATE public.products SET
  description = 'Carrot, apple, ginger. 16oz | 242 cal · 24oz | 314 cal',
  price = 10.00
WHERE name = 'Secure Your Energy';

-- Insert missing juices from menu
INSERT INTO public.products (name, category, price, description, image_url) VALUES
('Tropical Bliss', 'juice', 10.00, 'Pineapple, mango, orange, cucumber. 16oz | 313 cal · 24oz | 412 cal', 'https://images.unsplash.com/photo-1622597467836-f3e9ec9f818e?q=80&w=800&auto=format&fit=crop'),
('Relax Your Mind', 'juice', 10.00, 'Papaya, pineapple, strawberry, lemon. 16oz | 288 cal · 24oz | 337 cal', 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd51?q=80&w=800&auto=format&fit=crop'),
('Rise & Grind', 'juice', 10.00, 'Mango, orange, lemon, beet, ginger. 16oz | 288 cal · 24oz | 337 cal', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800&auto=format&fit=crop');

-- Update smoothies: recategorize as superfood smoothie / protein smoothie + correct ingredients & calories
UPDATE public.products SET
  category = 'superfood smoothie',
  description = 'Pink dragon fruit, banana, mango, pineapple, lemon, oat milk. 16oz | 336 cal · 24oz | 442 cal',
  price = 10.00
WHERE name = 'Pink Dragon Smoothie';

UPDATE public.products SET
  category = 'superfood smoothie',
  description = 'Pineapple, mango, blue spirulina, coconut cream, banana, almond milk. 16oz | 424 cal · 24oz | 620 cal',
  price = 10.00
WHERE name = 'Coconut Dream Smoothie';

UPDATE public.products SET
  category = 'superfood smoothie',
  description = 'Spinach, mango, agave, pineapple, coconut water, collagen powder. 16oz | 264 cal · 24oz | 378 cal',
  price = 10.00
WHERE name = 'Glow Up Smoothie';

UPDATE public.products SET
  category = 'superfood smoothie',
  description = 'Banana, creatine, pineapple, strawberry, honey, coconut water. 16oz | 235 cal · 24oz | 262 cal',
  price = 10.00
WHERE name = 'Tropical Gains';

UPDATE public.products SET
  name = 'Berry Good',
  category = 'superfood smoothie',
  description = 'Blackberry, blueberry, raspberry, strawberry, honey, almond milk. 16oz | 280 cal · 24oz | 290 cal',
  price = 10.00
WHERE name = 'Berry Dream';

UPDATE public.products SET
  category = 'superfood smoothie',
  description = 'Matcha, banana, whey protein, vanilla, almond milk. 16oz | 405 cal · 24oz | 450 cal',
  price = 10.00
WHERE name = 'Matcha Smoothie';

UPDATE public.products SET
  name = 'PB & J',
  category = 'protein smoothie',
  description = 'Strawberry, blueberry, banana, peanut butter, whey protein, almond milk. 16oz | 447 cal · 24oz | 530 cal',
  price = 10.00
WHERE name = 'PB&J Smoothie';

UPDATE public.products SET
  name = 'Chocolate Whey',
  category = 'protein smoothie',
  description = 'Cacao powder, dates, banana, peanut butter, whey protein, almond milk. 16oz | 506 cal · 24oz | 623 cal',
  price = 10.00
WHERE name = 'Chocolate Whey Smoothie';

UPDATE public.products SET
  category = 'protein smoothie',
  description = 'Banana, honey, cinnamon, oats, peanut butter, vanilla, whey protein, almond milk. 16oz | 600 cal · 24oz | 700 cal',
  price = 10.00
WHERE name = '78 Grams';

UPDATE public.products SET
  name = 'The Hulk',
  category = 'protein smoothie',
  description = 'Kale, peanut butter, banana, oats, honey, almond milk. 16oz | 447 cal · 24oz | 530 cal',
  price = 10.00
WHERE name = 'Hulk Smoothie';

-- Update bowls: correct price to $13, simpler descriptions
UPDATE public.products SET
  name = 'Blue',
  description = 'Blue spirulina, pineapple, coconut.',
  price = 13.00
WHERE name = 'Blue Base Bowl';

UPDATE public.products SET
  name = 'Mango',
  description = 'Pure blended mango base.',
  price = 13.00
WHERE name = 'Mango Bowl';

UPDATE public.products SET
  name = 'Pitaya',
  description = 'Pink dragon fruit base.',
  price = 13.00
WHERE name = 'Pitaya Bowl';

UPDATE public.products SET
  name = 'Ube',
  description = 'Coconut base, ube. Seasonal feature.',
  price = 13.00
WHERE name = 'Ube Bloom Bowl';

UPDATE public.products SET
  name = 'Custom Base',
  description = 'Build your own base. Choose your fruits and superfoods.',
  price = 13.00
WHERE name = 'Mix It Up Bowl';

-- Add missing bowls
INSERT INTO public.products (name, category, price, description, image_url) VALUES
('Acai', 'bowl', 13.00, 'Pure acai base. Naturally rich in antioxidants.', 'https://images.unsplash.com/photo-1490474504059-bf2db5ab2348?q=80&w=800&auto=format&fit=crop'),
('Coconut', 'bowl', 13.00, 'Coconut base. Seasonal feature.', 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?q=80&w=800&auto=format&fit=crop'),
('Strawberry', 'bowl', 13.00, 'Strawberry base. Seasonal feature.', 'https://images.unsplash.com/photo-1490474504059-bf2db5ab2348?q=80&w=800&auto=format&fit=crop');

-- Add toast products
INSERT INTO public.products (name, category, price, description, image_url) VALUES
('Avocado Toast', 'toast', 9.00, 'Sourdough, smashed avocado, fresh spinach, cherry tomatoes, balsamic glaze, everything seasoning.', NULL),
('PB & Berry Toast', 'toast', 9.00, 'Multigrain bread, peanut butter, banana, raspberries, sliced almonds, hemp seeds, honey drizzle.', NULL);
