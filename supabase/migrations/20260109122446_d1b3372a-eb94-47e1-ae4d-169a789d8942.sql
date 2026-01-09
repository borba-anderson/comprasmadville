-- Add empresa field for solicitante
ALTER TABLE public.requisicoes 
ADD COLUMN IF NOT EXISTS solicitante_empresa text;

-- Add observacao_comprador field for buyer notes
ALTER TABLE public.requisicoes 
ADD COLUMN IF NOT EXISTS observacao_comprador text;