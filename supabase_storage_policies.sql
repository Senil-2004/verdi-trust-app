-- Run this SQL in your Supabase Dashboard > SQL Editor
-- This enables public read/write access to the 'uploads' storage bucket

-- Allow anyone to upload files
CREATE POLICY "Allow public uploads" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'uploads');

-- Allow anyone to update files
CREATE POLICY "Allow public updates" ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'uploads');

-- Allow anyone to read/download files
CREATE POLICY "Allow public reads" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'uploads');

-- Allow anyone to delete files
CREATE POLICY "Allow public deletes" ON storage.objects
    FOR DELETE
    USING (bucket_id = 'uploads');
