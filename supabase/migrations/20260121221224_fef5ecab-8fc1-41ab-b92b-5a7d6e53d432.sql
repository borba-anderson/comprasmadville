-- Add gestor_id column to profiles table to link users to their manager
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gestor_id uuid REFERENCES public.profiles(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_gestor_id ON public.profiles(gestor_id);

-- Comment for documentation
COMMENT ON COLUMN public.profiles.gestor_id IS 'ID do gestor/gerente responsável por este usuário';

-- Create function to check if user can view requisicao based on hierarchy
CREATE OR REPLACE FUNCTION public.can_view_requisicao(req_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    -- Is admin? Can see all
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.profiles p ON p.id = ur.user_id
      WHERE p.auth_uid = auth.uid() AND ur.role = 'admin'
    )
    OR
    -- Is the owner of the requisicao?
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_uid = auth.uid() AND p.email = req_email
    )
    OR
    -- Is staff (comprador/gerente) and manages the person who made the requisition?
    EXISTS (
      SELECT 1 
      FROM public.profiles managed_user
      JOIN public.profiles manager ON managed_user.gestor_id = manager.id
      WHERE manager.auth_uid = auth.uid() 
        AND managed_user.email = req_email
    )
    OR
    -- Is staff with comprador role? Can see all (for purchasing workflow)
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.profiles p ON p.id = ur.user_id
      WHERE p.auth_uid = auth.uid() AND ur.role = 'comprador'
    )
$$;

-- Drop existing SELECT policies on requisicoes
DROP POLICY IF EXISTS "Public can view own requisicoes by email" ON public.requisicoes;
DROP POLICY IF EXISTS "Staff can view all requisicoes" ON public.requisicoes;

-- Create new unified SELECT policy using the function
CREATE POLICY "Users can view requisicoes based on hierarchy"
ON public.requisicoes
FOR SELECT
USING (public.can_view_requisicao(solicitante_email));