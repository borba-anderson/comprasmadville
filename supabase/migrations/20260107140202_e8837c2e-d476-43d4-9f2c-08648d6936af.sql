-- Adicionar campos para arquivo de orçamento/cotação
ALTER TABLE public.requisicoes 
ADD COLUMN IF NOT EXISTS orcamento_url TEXT,
ADD COLUMN IF NOT EXISTS orcamento_nome TEXT;