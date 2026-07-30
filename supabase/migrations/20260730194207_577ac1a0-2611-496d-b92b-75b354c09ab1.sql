ALTER TABLE public.requisicoes
  ADD COLUMN IF NOT EXISTS kanban_stage text,
  ADD COLUMN IF NOT EXISTS checklist jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS public.orcamento_analises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicao_id uuid REFERENCES public.requisicoes(id) ON DELETE SET NULL,
  titulo text NOT NULL DEFAULT 'Comparativo de orçamentos',
  criado_por text,
  fornecedores jsonb NOT NULL DEFAULT '[]'::jsonb,
  resumo jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orcamento_analises TO authenticated;
GRANT ALL ON public.orcamento_analises TO service_role;

ALTER TABLE public.orcamento_analises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view orcamento_analises" ON public.orcamento_analises
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can insert orcamento_analises" ON public.orcamento_analises
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update orcamento_analises" ON public.orcamento_analises
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete orcamento_analises" ON public.orcamento_analises
  FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE TRIGGER orcamento_analises_updated_at
  BEFORE UPDATE ON public.orcamento_analises
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();