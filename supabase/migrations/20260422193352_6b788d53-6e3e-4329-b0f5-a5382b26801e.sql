
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Business owners upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.is_business_owner(auth.uid()));
CREATE POLICY "Business owners update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND public.is_business_owner(auth.uid()));
CREATE POLICY "Business owners delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND public.is_business_owner(auth.uid()));
