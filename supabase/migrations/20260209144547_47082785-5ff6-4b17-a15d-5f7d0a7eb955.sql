
-- Allow staff to delete requisicoes (for canceled requisitions cleanup)
CREATE POLICY "Staff can delete requisicoes"
ON public.requisicoes
FOR DELETE
USING (is_staff(auth.uid()));

-- Allow staff to delete valor_historico (cascading cleanup)
CREATE POLICY "Staff can delete valor_historico"
ON public.valor_historico
FOR DELETE
USING (is_staff(auth.uid()));

-- Allow staff to delete audit_logs (cascading cleanup)
CREATE POLICY "Staff can delete audit_logs"
ON public.audit_logs
FOR DELETE
USING (is_staff(auth.uid()));
