// ============================================
// TYPES - SISTEMA DE REQUISIÇÕES MADVILLE
// ============================================

export type AppRole = "admin" | "comprador" | "gerente" | "solicitante";

export type RequisicaoStatus =
  | "pendente"
  | "em_analise"
  | "aprovado"
  | "cotando"
  | "comprado"
  | "em_entrega"
  | "recebido"
  | "rejeitado"
  | "cancelado";

export type RequisicaoPrioridade = "ALTA" | "MEDIA" | "BAIXA";

export interface Profile {
  id: string;
  auth_uid: string;
  nome: string;
  email: string;
  telefone?: string;
  setor?: string;
  empresa?: string;
  gestor_id?: string;
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
  solicitante_empresa?: string;
  centro_custo?: string;
  item_nome: string;
  quantidade: number;
  unidade: string;
  especificacoes?: string;
  justificativa: string;
  motivo_compra?: string;
  prioridade: RequisicaoPrioridade;
  status: RequisicaoStatus;
  motivo_rejeicao?: string;
  observacao_comprador?: string;
  aprovado_por?: string;
  comprador_id?: string;
  comprador_nome?: string;
  fornecedor_nome?: string;
  arquivo_url?: string;
  arquivo_nome?: string;
  created_at: string;
  updated_at: string;
  aprovado_em?: string;
  comprado_em?: string;
  recebido_em?: string;
  entregue_em?: string;
  previsao_entrega?: string;
  valor?: number;
  valor_orcado?: number;
}

export interface ValorHistorico {
  id: string;
  requisicao_id: string;
  valor_anterior: number | null;
  valor_novo: number;
  alterado_por: string;
  created_at: string;
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
  solicitante_telefone: string;
  solicitante_setor: string;
  solicitante_empresa: string;
  centro_custo?: string;
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

// Compradores fixos
export const COMPRADORES = [
  { id: "anderson", nome: "Anderson" },
  { id: "mariana", nome: "Mariana" },
  { id: "geovani", nome: "Geovani" },
  { id: "ruan", nome: "Ruan" },
] as const;

export type CompradorId = (typeof COMPRADORES)[number]["id"];

// Constants
export const EMPRESAS = [
  "GMAD Madville",
  "GMAD Madville (CD)",
  "GMAD Madville (Soluções)",
  "GMAD Curitiba",
] as const;

// Quick view presets
export const QUICK_VIEWS = {
  minhasPendencias: {
    label: "Pendências",
    icon: "📋",
    statuses: ["pendente", "em_analise", "cotando", "aprovado"] as RequisicaoStatus[],
  },
  aguardandoFornecedor: {
    label: "Aguardando",
    icon: "🚚",
    statuses: ["comprado", "em_entrega"] as RequisicaoStatus[],
  },
  finalizados: {
    label: "Finalizados",
    icon: "✅",
    statuses: ["recebido", "cancelado", "rejeitado"] as RequisicaoStatus[],
  },
} as const;

export const SETORES = [
  "Almoxarifado",
  "Comercial",
  "Compras",
  "Diretoria",
  "Eventos",
  "Financeiro",
  "Logística",
  "Manutenção Predial",
  "Marketing",
  "Recursos Humanos",
  "SAC",
  "Showroom",
  "TI",
  "Uso/Consumo",
] as const;

export const UNIDADES = ["unidade", "peça", "kit", "litro", "metro", "kg", "par", "rolo"] as const;

// Unidades with labels and abbreviations for display
export const UNIDADES_CONFIG = [
  { value: "unidade", label: "Unidade", sigla: "un" },
  { value: "peça", label: "Peça", sigla: "pç" },
  { value: "kit", label: "Kit", sigla: "kit" },
  { value: "litro", label: "Litro", sigla: "L" },
  { value: "metro", label: "Metro", sigla: "m" },
  { value: "kg", label: "Quilograma", sigla: "kg" },
  { value: "par", label: "Par", sigla: "par" },
  { value: "rolo", label: "Rolo", sigla: "rolo" },
] as const;

// Helper to get abbreviation from unit value
export const getUnidadeSigla = (unidade: string): string => {
  const config = UNIDADES_CONFIG.find((u) => u.value === unidade);
  return config?.sigla || unidade;
};

export const MOTIVOS_COMPRA = [
  "Reposição de estoque",
  "Demanda de produção",
  "Manutenção/Reparos",
  "Uso administrativo",
  "Projeto especial",
  "Melhoria de processo",
  "Outros",
] as const;

export const STATUS_CONFIG: Record<RequisicaoStatus, { label: string; icon: string; color: string; dotColor: string }> =
  {
    pendente: { label: "Pendente", icon: "⏳", color: "yellow", dotColor: "bg-amber-500" },
    em_analise: { label: "Em Análise", icon: "🔍", color: "blue", dotColor: "bg-blue-500" },
    aprovado: { label: "Aprovado", icon: "✅", color: "green", dotColor: "bg-emerald-500" },
    cotando: { label: "Cotando", icon: "💰", color: "purple", dotColor: "bg-violet-500" },
    comprado: { label: "Comprado", icon: "🛒", color: "cyan", dotColor: "bg-cyan-500" },
    em_entrega: { label: "Em Entrega", icon: "🚚", color: "blue", dotColor: "bg-blue-500" },
    recebido: { label: "Recebido", icon: "📦", color: "green", dotColor: "bg-emerald-500" },
    rejeitado: { label: "Rejeitado", icon: "❌", color: "red", dotColor: "bg-red-500" },
    cancelado: { label: "Cancelado", icon: "🚫", color: "gray", dotColor: "bg-gray-500" },
  };

export const PRIORIDADE_CONFIG: Record<RequisicaoPrioridade, { label: string; icon: string; prazo: string }> = {
  ALTA: { label: "Alta", icon: "🔴", prazo: "Máximo 24h" },
  MEDIA: { label: "Média", icon: "🟡", prazo: "Até 3 dias" },
  BAIXA: { label: "Baixa", icon: "🟢", prazo: "Planejamento semanal" },
};
