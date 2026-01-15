-- Add budgeted value column to requisicoes table
ALTER TABLE public.requisicoes 
ADD COLUMN valor_orcado numeric NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.requisicoes.valor_orcado IS 'Valor orçado/estimado inicial da compra';