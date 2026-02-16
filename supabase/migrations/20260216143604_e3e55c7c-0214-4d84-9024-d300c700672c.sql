
-- Allow solicitantes to update their own requisitions when status allows editing
CREATE OR REPLACE FUNCTION public.can_edit_own_requisicao(_solicitante_email text, _status text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.auth_uid = auth.uid()
      AND p.email = _solicitante_email
  )
  AND _status IN ('pendente', 'em_analise', 'aprovado', 'cotando');
$$;

-- Add policy for solicitantes to update their own requisitions
CREATE POLICY "Solicitantes can update own requisicoes"
ON public.requisicoes
FOR UPDATE
USING (can_edit_own_requisicao(solicitante_email, status::text))
WITH CHECK (can_edit_own_requisicao(solicitante_email, status::text));
