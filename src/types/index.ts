// ============================================
// TYPES - SISTEMA DE REQUISIÇÕES MADVILLE
// ============================================

export type AppRole = 'admin' | 'comprador' | 'gerente' | 'solicitante';

export type RequisicaoStatus = 
  | 'pendente' 
  | 'em_analise' 
  | 'aprovado' 
  | 'cotando' 
  | 'comprado' 
  | 'em_entrega'
  | 'recebido'
  | 'rejeitado' 
  | 'cancelado';

export type RequisicaoPrioridade = 'ALTA' | 'MEDIA' | 'BAIXA';

export interface Profile {
  id: string;
  auth_uid: string;
  nome: string;
  email: string;
  telefone?: string;
  setor?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Requisicao {
  id: string;
  protocolo: string;
  solicitante_nome: string;
  solicitante_email: string;
  solicitante_telefone?: string;
  solicitante_setor: string;
  item_nome: string;
  quantidade: number;
  unidade: string;
  especificacoes?: string;
  justificativa: string;
  motivo_compra?: string;
  prioridade: RequisicaoPrioridade;
  status: RequisicaoStatus;
  motivo_rejeicao?: string;
  aprovado_por?: string;
  comprador_id?: string;
  arquivo_url?: string;
  arquivo_nome?: string;
  created_at: string;
  updated_at: string;
  aprovado_em?: string;
  comprado_em?: string;
  recebido_em?: string;
  valor?: number;
}

export interface AuditLog {
  id: string;
  usuario_id?: string;
  requisicao_id?: string;
  acao: string;
  dados_anteriores?: Record<string, unknown>;
  dados_novos?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export interface Comentario {
  id: string;
  requisicao_id: string;
  usuario_id?: string;
  usuario_nome?: string;
  conteudo: string;
  created_at: string;
}

// Form Types
export interface RequisicaoFormData {
  solicitante_nome: string;
  solicitante_email: string;
  solicitante_telefone?: string;
  solicitante_setor: string;
  item_nome: string;
  quantidade: number;
  unidade: string;
  especificacoes?: string;
  justificativa: string;
  motivo_compra: string;
  prioridade: RequisicaoPrioridade;
}

// Stats
export interface RequisicaoStats {
  total: number;
  pendente: number;
  em_analise: number;
  aprovado: number;
  cotando: number;
  comprado: number;
  rejeitado: number;
}

// Auth context
export interface AuthUser {
  id: string;
  email: string;
  profile: Profile;
  roles: AppRole[];
}

// Constants
export const SETORES = [
  'Administrativo',
  'Compras',
  'Financeiro',
  'Marketing',
  'Operações',
  'Produção',
  'Qualidade',
  'RH',
  'TI',
  'Vendas',
  'Logística',
  'Manutenção',
  'Outros',
] as const;

export const UNIDADES = [
  'unidade',
  'peça',
  'caixa',
  'pacote',
  'kit',
  'conjunto',
  'litro',
  'metro',
  'kg',
  'par',
  'dúzia',
  'rolo',
] as const;

export const MOTIVOS_COMPRA = [
  'Reposição de estoque',
  'Demanda de produção',
  'Manutenção/Reparos',
  'Uso administrativo',
  'Projeto especial',
  'Melhoria de processo',
  'Outros',
] as const;

export const STATUS_CONFIG: Record<RequisicaoStatus, { label: string; icon: string; color: string }> = {
  pendente: { label: 'Pendente', icon: '⏳', color: 'yellow' },
  em_analise: { label: 'Em Análise', icon: '🔍', color: 'blue' },
  aprovado: { label: 'Aprovado', icon: '✅', color: 'green' },
  cotando: { label: 'Cotando', icon: '💰', color: 'purple' },
  comprado: { label: 'Comprado', icon: '🛒', color: 'cyan' },
  em_entrega: { label: 'Em Entrega', icon: '🚚', color: 'blue' },
  recebido: { label: 'Recebido', icon: '📦', color: 'green' },
  rejeitado: { label: 'Rejeitado', icon: '❌', color: 'red' },
  cancelado: { label: 'Cancelado', icon: '🚫', color: 'gray' },
};

export const PRIORIDADE_CONFIG: Record<RequisicaoPrioridade, { label: string; icon: string; prazo: string }> = {
  ALTA: { label: 'Alta', icon: '🔴', prazo: 'Máximo 24h' },
  MEDIA: { label: 'Média', icon: '🟡', prazo: 'Até 3 dias' },
  BAIXA: { label: 'Baixa', icon: '🟢', prazo: 'Planejamento semanal' },
};
