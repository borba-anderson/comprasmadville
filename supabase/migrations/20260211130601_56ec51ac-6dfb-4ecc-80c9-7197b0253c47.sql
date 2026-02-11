-- Add payment method column to requisicoes
ALTER TABLE public.requisicoes
ADD COLUMN forma_pagamento text;

-- Add a comment for documentation
COMMENT ON COLUMN public.requisicoes.forma_pagamento IS 'Payment method: PIX, Boleto, Cartão Corporativo, Transferência, Dinheiro, or custom';