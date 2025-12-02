-- Adicionar coluna valor na tabela requisicoes
ALTER TABLE public.requisicoes ADD COLUMN valor numeric DEFAULT NULL;

-- Criar índices para otimizar queries do dashboard
CREATE INDEX idx_requisicoes_solicitante_nome ON public.requisicoes(solicitante_nome);
CREATE INDEX idx_requisicoes_solicitante_setor ON public.requisicoes(solicitante_setor);
CREATE INDEX idx_requisicoes_created_at ON public.requisicoes(created_at);