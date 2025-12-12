// Types for the Panel system
import { Requisicao, RequisicaoPrioridade, RequisicaoStatus } from '@/types';

export type ViewMode = 'compact' | 'detailed';
export type DeliveryFilterType = 'all' | 'ontime' | 'today' | 'overdue';

export interface PainelFilters {
  search: string;
  status: string;
  comprador: string;
  setor: string;
  prioridade: string;
  dateFrom: string;
  dateTo: string;
  deliveryFilter: DeliveryFilterType;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: PainelFilters;
}

export interface SLAInfo {
  sinceApproval: number | null;
  sinceQuoting: number | null;
  untilDelivery: number | null;
  isOverdue: boolean;
  overdueBy: number | null;
}

export interface DeliveryStatus {
  status: 'ontime' | 'today' | 'overdue' | null;
  daysRemaining: number | null;
  tooltipText: string;
}

export const DEFAULT_FILTERS: PainelFilters = {
  search: '',
  status: 'all',
  comprador: 'all',
  setor: 'all',
  prioridade: 'all',
  dateFrom: '',
  dateTo: '',
  deliveryFilter: 'all',
};

// SLA Limits in days
export const SLA_LIMITS = {
  approval: 2, // 2 days to approve
  quoting: 5, // 5 days to finish quoting
  delivery: 7, // 7 days after purchase
};
