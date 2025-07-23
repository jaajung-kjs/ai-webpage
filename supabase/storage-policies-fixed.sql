-- Storage policies for files bucket
CREATE POLICY "Anyone can view files" ON storage.objects
    FOR SELECT USING (bucket_id = 'files');

CREATE POLICY "Authenticated users can upload files" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'files');

CREATE POLICY "Users can delete own files" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'files' AND owner = (select auth.uid())::text);

-- Storage policies for photos bucket
CREATE POLICY "Anyone can view photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Users can delete own photos" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'photos' AND owner = (select auth.uid())::text);