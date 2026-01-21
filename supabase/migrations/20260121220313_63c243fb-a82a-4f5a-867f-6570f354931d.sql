-- Add empresa column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS empresa text;

-- Comment for documentation
COMMENT ON COLUMN public.profiles.empresa IS 'Empresa do usuário para pré-preenchimento de requisições';