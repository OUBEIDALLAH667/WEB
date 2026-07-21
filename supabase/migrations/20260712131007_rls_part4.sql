/*
# RLS — diagnostics, appointments, storage
*/

-- diagnostics
DROP POLICY IF EXISTS "public_insert_diagnostics" ON diagnostics;
CREATE POLICY "public_insert_diagnostics" ON diagnostics FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_diagnostics" ON diagnostics;
CREATE POLICY "admin_read_diagnostics" ON diagnostics FOR SELECT
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "admin_update_diagnostics" ON diagnostics;
CREATE POLICY "admin_update_diagnostics" ON diagnostics FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "admin_delete_diagnostics" ON diagnostics;
CREATE POLICY "admin_delete_diagnostics" ON diagnostics FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- appointments
DROP POLICY IF EXISTS "read_own_appointments" ON appointments;
CREATE POLICY "read_own_appointments" ON appointments FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "public_insert_appointments" ON appointments;
CREATE POLICY "public_insert_appointments" ON appointments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_appointments" ON appointments;
CREATE POLICY "admin_update_appointments" ON appointments FOR UPDATE
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "admin_delete_appointments" ON appointments;
CREATE POLICY "admin_delete_appointments" ON appointments FOR DELETE
  TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- storage policies
DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
CREATE POLICY "public_read_product_images" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "admin_insert_product_images" ON storage.objects;
CREATE POLICY "admin_insert_product_images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "admin_delete_product_images" ON storage.objects;
CREATE POLICY "admin_delete_product_images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));