
-- Function for solicitante to confirm receipt of their own requisition
-- Uses SECURITY DEFINER to bypass RLS safely
CREATE OR REPLACE FUNCTION public.confirmar_recebimento(req_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  req_record RECORD;
  caller_email TEXT;
BEGIN
  -- Get caller's email from profile
  SELECT p.email INTO caller_email
  FROM public.profiles p
  WHERE p.auth_uid = auth.uid();
  
  IF caller_email IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;
  
  -- Get the requisition
  SELECT id, status, solicitante_email INTO req_record
  FROM public.requisicoes
  WHERE id = req_id;
  
  IF req_record IS NULL THEN
    RAISE EXCEPTION 'Requisição não encontrada';
  END IF;
  
  -- Verify ownership
  IF req_record.solicitante_email != caller_email THEN
    RAISE EXCEPTION 'Apenas o solicitante pode confirmar o recebimento';
  END IF;
  
  -- Verify status allows confirmation
  IF req_record.status NOT IN ('comprado', 'em_entrega') THEN
    RAISE EXCEPTION 'Status atual não permite confirmação de recebimento';
  END IF;
  
  -- Update status
  UPDATE public.requisicoes
  SET 
    status = 'recebido',
    recebido_em = NOW(),
    entregue_em = NOW(),
    updated_at = NOW()
  WHERE id = req_id;
  
  RETURN true;
END;
$$;
