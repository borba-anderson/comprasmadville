
CREATE SEQUENCE IF NOT EXISTS public.requisicao_protocolo_seq START 1;

-- Renumber existing protocols by creation order
DO $$
DECLARE
  r RECORD;
  i INT := 0;
BEGIN
  PERFORM setval('public.requisicao_protocolo_seq', 1, false);
  FOR r IN SELECT id FROM public.requisicoes ORDER BY created_at ASC LOOP
    i := i + 1;
    UPDATE public.requisicoes SET protocolo = 'REQ-' || LPAD(i::text, 6, '0') WHERE id = r.id;
  END LOOP;
  PERFORM setval('public.requisicao_protocolo_seq', GREATEST(i, 1), true);
END $$;

CREATE OR REPLACE FUNCTION public.generate_protocolo()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.protocolo IS NULL OR NEW.protocolo = '' OR NEW.protocolo LIKE 'REQ-2%' THEN
    NEW.protocolo := 'REQ-' || LPAD(nextval('public.requisicao_protocolo_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$;

GRANT USAGE ON SEQUENCE public.requisicao_protocolo_seq TO authenticated, anon, service_role;
