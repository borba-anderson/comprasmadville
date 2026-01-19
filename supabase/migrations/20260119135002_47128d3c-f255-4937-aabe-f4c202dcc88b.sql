-- Adicionar campo fornecedor à tabela requisicoes
ALTER TABLE public.requisicoes 
ADD COLUMN IF NOT EXISTS fornecedor_nome TEXT;