INSERT INTO storage.buckets (id, name, public)
VALUES ('imported-prints', 'imported-prints', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "imported-prints select own"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'imported-prints' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "imported-prints insert own"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'imported-prints' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "imported-prints update own"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'imported-prints' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "imported-prints delete own"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'imported-prints' AND auth.uid()::text = (storage.foldername(name))[1]);