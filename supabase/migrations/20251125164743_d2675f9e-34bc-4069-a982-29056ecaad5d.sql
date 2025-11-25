-- ============================================
-- SISTEMA DE REQUISIÇÕES MADVILLE - SCHEMA
-- ============================================

-- 1. Enum para roles de usuário
CREATE TYPE public.app_role AS ENUM ('admin', 'comprador', 'gerente', 'solicitante');

-- 2. Enum para status de requisição
CREATE TYPE public.requisicao_status AS ENUM (
  'pendente', 
  'em_analise', 
  'aprovado', 
  'cotando', 
  'comprado', 
  'em_entrega',
  'recebido',
  'rejeitado', 
  'cancelado'
);

-- 3. Enum para prioridade
CREATE TYPE public.requisicao_prioridade AS ENUM ('ALTA', 'MEDIA', 'BAIXA');

-- 4. Tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_uid UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  setor TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Tabela de roles (separada por segurança)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'solicitante',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 6. Tabela de requisições
CREATE TABLE public.requisicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo TEXT UNIQUE,
  
  -- Dados do solicitante (para requisições públicas sem login)
  solicitante_nome TEXT NOT NULL,
  solicitante_email TEXT NOT NULL,
  solicitante_telefone TEXT,
  solicitante_setor TEXT NOT NULL,
  
  -- Dados do item
  item_nome TEXT NOT NULL,
  quantidade DECIMAL(10,2) NOT NULL DEFAULT 1,
  unidade TEXT NOT NULL DEFAULT 'unidade',
  especificacoes TEXT,
  
  -- Justificativa
  justificativa TEXT NOT NULL,
  motivo_compra TEXT,
  prioridade requisicao_prioridade NOT NULL DEFAULT 'MEDIA',
  
  -- Status e workflow
  status requisicao_status NOT NULL DEFAULT 'pendente',
  motivo_rejeicao TEXT,
  
  -- Responsáveis
  aprovado_por UUID REFERENCES public.profiles(id),
  comprador_id UUID REFERENCES public.profiles(id),
  
  -- Arquivo anexo
  arquivo_url TEXT,
  arquivo_nome TEXT,
  
  -- Datas
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  aprovado_em TIMESTAMP WITH TIME ZONE,
  comprado_em TIMESTAMP WITH TIME ZONE,
  recebido_em TIMESTAMP WITH TIME ZONE
);

-- 7. Tabela de logs de auditoria
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES public.profiles(id),
  requisicao_id UUID REFERENCES public.requisicoes(id) ON DELETE CASCADE,
  acao TEXT NOT NULL,
  dados_anteriores JSONB,
  dados_novos JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Tabela de comentários
CREATE TABLE public.comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicao_id UUID REFERENCES public.requisicoes(id) ON DELETE CASCADE NOT NULL,
  usuario_id UUID REFERENCES public.profiles(id),
  usuario_nome TEXT,
  conteudo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_requisicoes_status ON public.requisicoes(status);
CREATE INDEX idx_requisicoes_prioridade ON public.requisicoes(prioridade);
CREATE INDEX idx_requisicoes_created ON public.requisicoes(created_at DESC);
CREATE INDEX idx_requisicoes_solicitante_email ON public.requisicoes(solicitante_email);
CREATE INDEX idx_audit_logs_requisicao ON public.audit_logs(requisicao_id);
CREATE INDEX idx_comentarios_requisicao ON public.comentarios(requisicao_id);

-- ============================================
-- FUNÇÕES
-- ============================================

-- Função para verificar role do usuário (security definer para evitar recursão RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.profiles p ON p.id = ur.user_id
    WHERE p.auth_uid = _user_id
      AND ur.role = _role
  )
$$;

-- Função para verificar se usuário tem qualquer role admin/comprador/gerente
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.profiles p ON p.id = ur.user_id
    WHERE p.auth_uid = _user_id
      AND ur.role IN ('admin', 'comprador', 'gerente')
  )
$$;

-- Função para gerar protocolo automático
CREATE OR REPLACE FUNCTION public.generate_protocolo()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.protocolo := 'REQ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(NEW.id::TEXT, 1, 6));
  RETURN NEW;
END;
$$;

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (auth_uid, nome, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger para gerar protocolo
CREATE TRIGGER tr_generate_protocolo
  BEFORE INSERT ON public.requisicoes
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_protocolo();

-- Trigger para updated_at em requisicoes
CREATE TRIGGER tr_requisicoes_updated
  BEFORE UPDATE ON public.requisicoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Trigger para updated_at em profiles
CREATE TRIGGER tr_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Trigger para criar perfil após signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- RLS POLICIES
-- ============================================

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requisicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;

-- PROFILES: Usuários veem próprio perfil, staff vê todos
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = auth_uid);

CREATE POLICY "Staff can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = auth_uid);

-- USER_ROLES: Apenas admins gerenciam
CREATE POLICY "Staff can view roles"
  ON public.user_roles FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Admin can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- REQUISICOES: Público pode criar, staff pode ver todas
CREATE POLICY "Anyone can create requisicoes"
  ON public.requisicoes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can view all requisicoes"
  ON public.requisicoes FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Public can view own requisicoes by email"
  ON public.requisicoes FOR SELECT
  USING (solicitante_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Staff can update requisicoes"
  ON public.requisicoes FOR UPDATE
  USING (public.is_staff(auth.uid()));

-- AUDIT_LOGS: Staff pode ver
CREATE POLICY "Staff can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

-- COMENTARIOS: Staff pode gerenciar, público pode ver próprios
CREATE POLICY "Anyone can create comentarios"
  ON public.comentarios FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can view all comentarios"
  ON public.comentarios FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can delete comentarios"
  ON public.comentarios FOR DELETE
  USING (public.is_staff(auth.uid()));