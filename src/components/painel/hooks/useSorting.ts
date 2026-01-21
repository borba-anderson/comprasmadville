import { useState, useMemo, useCallback } from 'react';
import { Requisicao } from '@/types';

export type SortField = 
  | 'item_nome' 
  | 'solicitante_nome' 
  | 'quantidade' 
  | 'prioridade' 
  | 'status' 
  | 'comprador_nome'
  | 'fornecedor_nome'
  | 'previsao_entrega'
  | 'valor'
  | 'created_at';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField | null;
  direction: SortDirection;
}

const PRIORITY_ORDER: Record<string, number> = {
  'ALTA': 3,
  'MEDIA': 2,
  'BAIXA': 1,
};

const STATUS_ORDER: Record<string, number> = {
  'pendente': 1,
  'em_analise': 2,
  'aprovado': 3,
  'cotando': 4,
  'comprado': 5,
  'em_entrega': 6,
  'recebido': 7,
  'rejeitado': 8,
  'cancelado': 9,
};

export function useSorting(requisicoes: Requisicao[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: null,
    direction: 'desc',
  });

  const handleSort = useCallback((field: SortField) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        // Toggle direction or clear
        if (prev.direction === 'desc') {
          return { field, direction: 'asc' };
        }
        // Clear sort
        return { field: null, direction: 'desc' };
      }
      // New field, start with desc
      return { field, direction: 'desc' };
    });
  }, []);

  const sortedRequisicoes = useMemo(() => {
    if (!sortConfig.field) return requisicoes;

    const sorted = [...requisicoes].sort((a, b) => {
      const field = sortConfig.field!;
      let aValue: any = a[field];
      let bValue: any = b[field];

      // Handle special cases
      if (field === 'prioridade') {
        aValue = PRIORITY_ORDER[aValue] || 0;
        bValue = PRIORITY_ORDER[bValue] || 0;
      } else if (field === 'status') {
        aValue = STATUS_ORDER[aValue] || 0;
        bValue = STATUS_ORDER[bValue] || 0;
      } else if (field === 'valor' || field === 'quantidade') {
        aValue = aValue ?? 0;
        bValue = bValue ?? 0;
      } else if (field === 'created_at' || field === 'previsao_entrega') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      } else {
        // String fields
        aValue = (aValue || '').toString().toLowerCase();
        bValue = (bValue || '').toString().toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [requisicoes, sortConfig]);

  return {
    sortConfig,
    handleSort,
    sortedRequisicoes,
  };
}
