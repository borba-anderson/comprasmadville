-- Backfill valor_orcado from valor for consistency in economy calculations
-- This ensures historical records have a budgeted value, even if it equals the final paid value (zero savings).
UPDATE public.requisicoes
SET valor_orcado = valor
WHERE valor_orcado IS NULL
  AND valor IS NOT NULL;

-- Documentation comments for auditability
COMMENT ON COLUMN public.requisicoes.valor_orcado IS 'Valor Orçado — valor de referência estimado na requisição/cotação. Obrigatório antes de finalizar compra. Base do cálculo de Economia.';
COMMENT ON COLUMN public.requisicoes.valor IS 'Valor Pago — valor efetivamente pago ao fornecedor. Obrigatório antes de mudar status para "comprado". Usado para cálculo de gastos e economia (Economia = valor_orcado − valor).';