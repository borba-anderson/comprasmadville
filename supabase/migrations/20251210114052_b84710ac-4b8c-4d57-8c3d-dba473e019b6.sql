-- Add new fields to requisicoes table
ALTER TABLE public.requisicoes 
ADD COLUMN IF NOT EXISTS previsao_entrega DATE,
ADD COLUMN IF NOT EXISTS comprador_nome TEXT,
ADD COLUMN IF NOT EXISTS entregue_em TIMESTAMP WITH TIME ZONE;

-- Create valor_historico table to track value changes
CREATE TABLE IF NOT EXISTS public.valor_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requisicao_id UUID NOT NULL REFERENCES public.requisicoes(id) ON DELETE CASCADE,
  valor_anterior NUMERIC,
  valor_novo NUMERIC NOT NULL,
  alterado_por TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on valor_historico
ALTER TABLE public.valor_historico ENABLE ROW LEVEL SECURITY;

-- Staff can view valor_historico
CREATE POLICY "Staff can view valor_historico" 
ON public.valor_historico 
FOR SELECT 
USING (is_staff(auth.uid()));

-- Staff can insert valor_historico
CREATE POLICY "Staff can insert valor_historico" 
ON public.valor_historico 
FOR INSERT 
WITH CHECK (is_staff(auth.uid()));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_valor_historico_requisicao_id ON public.valor_historico(requisicao_id);
CREATE INDEX IF NOT EXISTS idx_requisicoes_comprador_nome ON public.requisicoes(comprador_nome);
CREATE INDEX IF NOT EXISTS idx_requisicoes_previsao_entrega ON public.requisicoes(previsao_entrega);