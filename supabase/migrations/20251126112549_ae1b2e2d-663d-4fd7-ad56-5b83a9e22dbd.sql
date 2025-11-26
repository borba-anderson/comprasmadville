-- Create storage bucket for requisition attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('requisicoes-anexos', 'requisicoes-anexos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload files (since requisitions can be created without auth)
CREATE POLICY "Anyone can upload anexos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'requisicoes-anexos');

-- Allow anyone to view anexos (public bucket)
CREATE POLICY "Anyone can view anexos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'requisicoes-anexos');

-- Allow staff to delete anexos
CREATE POLICY "Staff can delete anexos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'requisicoes-anexos');