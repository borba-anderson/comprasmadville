CREATE OR REPLACE FUNCTION public.can_edit_own_requisicao(_solicitante_email text, _status text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.auth_uid = auth.uid()
      AND p.email = _solicitante_email
  )
  AND _status IN ('pendente', 'em_analise', 'aprovado', 'cotando', 'comprado', 'em_entrega');
$function$;