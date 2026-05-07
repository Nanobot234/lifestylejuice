
-- Simplify product descriptions to be ingredient-focused

-- Smoothies
UPDATE products SET description = 'Blueberries, blackberries, acai, almond milk.' WHERE name = 'Berry Dream';
UPDATE products SET description = 'Cacao, banana, dates, peanut butter, whey protein, almond milk.' WHERE name = 'Chocolate Whey Smoothie';
UPDATE products SET description = 'Banana, mango, pineapple, coconut cream, almond milk, blue spirulina. A tropical island in a cup.' WHERE name = 'Coconut Dream Smoothie';
UPDATE products SET description = 'Coconut water, mango, pineapple, spinach, agave, collagen powder.' WHERE name = 'Glow Up Smoothie';
UPDATE products SET description = 'Banana, oats, kale, peanut butter, almond butter, honey.' WHERE name = 'Hulk Smoothie';
UPDATE products SET description = 'Matcha, banana, whey protein, vanilla, almond milk.' WHERE name = 'Matcha Smoothie';
UPDATE products SET description = 'Strawberries, blueberries, banana, peanut butter, whey protein, almond milk.' WHERE name = 'PB&J Smoothie';
UPDATE products SET description = 'Dragon fruit, mango, banana, pineapple, lemon, oat milk.' WHERE name = 'Pink Dragon Smoothie';
UPDATE products SET description = 'Strawberries, banana, vanilla, oat milk. Simple and refreshing.' WHERE name = 'Strawberry Bliss Smoothie';

-- Juices
UPDATE products SET description = 'Filtered water, lemon, mint, agave, chia seeds.' WHERE name = 'Chia Refresher';
UPDATE products SET description = 'Spinach, celery, cucumber, green apple, pineapple, ginger, lemon.' WHERE name = 'Green Machine';
UPDATE products SET description = 'Pineapple, beets, orange, carrot. Earthy-sweet and immune-boosting.' WHERE name = 'Now You See Me';
UPDATE products SET description = 'Carrot, red apple, ginger.' WHERE name = 'Secure Your Energy';
UPDATE products SET description = 'Strawberries, lemon, agave, filtered water.' WHERE name = 'Strawberry Refresher';

-- Protein
UPDATE products SET description = 'Banana, peanut butter, whey protein, oats, cinnamon, vanilla, almond milk.' WHERE name = '78 Grams';

-- Bowls
UPDATE products SET description = 'Coconut, pineapple, blue spirulina base. Add your favorite toppings.' WHERE name = 'Blue Base Bowl';
UPDATE products SET description = 'Pure blended mango base. Bright, tropical, and refreshing.' WHERE name = 'Mango Bowl';
UPDATE products SET description = 'Dragon fruit, mango, coconut, pineapple, blue spirulina.' WHERE name = 'Mix It Up Bowl';
UPDATE products SET description = 'Blended pitaya base. Naturally sweet and packed with antioxidants.' WHERE name = 'Pitaya Bowl';
UPDATE products SET description = 'Coconut base, ube.' WHERE name = 'Ube Bloom Bowl';
