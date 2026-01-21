import { useState, useEffect, useMemo } from 'react';
import { Requisicao, SETORES, QUICK_VIEWS } from '@/types';
import { 
  PainelFilters, 
  SavedFilter, 
  DEFAULT_FILTERS, 
  ViewMode,
  DeliveryFilterType 
} from '../types';

const STORAGE_KEYS = {
  filters: 'madville_saved_filters',
  viewMode: 'madville_view_mode',
};

export function usePainelFilters(requisicoes: Requisicao[]) {
  // Initialize with "Minhas Pendências" filter as default
  const initialFilters: PainelFilters = {
    ...DEFAULT_FILTERS,
    status: QUICK_VIEWS.minhasPendencias.statuses as unknown as string[],
    quickView: 'minhasPendencias',
  };
  
  const [filters, setFilters] = useState<PainelFilters>(initialFilters);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('detailed');

  // Load saved preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.filters);
    if (saved) {
      try {
        setSavedFilters(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved filters:', e);
      }
    }

    const savedViewMode = localStorage.getItem(STORAGE_KEYS.viewMode) as ViewMode;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view mode to localStorage
  const updateViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(STORAGE_KEYS.viewMode, mode);
  };

  // Parse date string correctly to avoid timezone issues
  const parseDateString = (dateString: string): Date => {
    // If it's a date-only string like "2025-01-20", parse without timezone
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    // Otherwise parse as is (for timestamps)
    return new Date(dateString);
  };

  // Calculate delivery status for filtering
  const getDeliveryStatus = (previsao: string | undefined): 'ontime' | 'today' | 'overdue' | null => {
    if (!previsao) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const delivery = parseDateString(previsao);
    delivery.setHours(0, 0, 0, 0);
    const diff = Math.ceil((delivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return 'overdue';
    if (diff === 0) return 'today';
    return 'ontime';
  };

  // Apply quick view preset
  const applyQuickView = (viewId: string) => {
    const view = QUICK_VIEWS[viewId as keyof typeof QUICK_VIEWS];
    if (view) {
      setFilters({
        ...DEFAULT_FILTERS,
        status: view.statuses as unknown as string[],
        quickView: viewId,
      });
    } else {
      setFilters({
        ...filters,
        quickView: '',
      });
    }
  };

  // Apply all filters
  const filteredRequisicoes = useMemo(() => {
    let result = [...requisicoes];

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (req) =>
          req.item_nome.toLowerCase().includes(search) ||
          req.solicitante_nome.toLowerCase().includes(search) ||
          req.solicitante_email.toLowerCase().includes(search) ||
          req.protocolo?.toLowerCase().includes(search)
      );
    }

    // Status filter (multi-select)
    if (filters.status.length > 0) {
      result = result.filter((req) => filters.status.includes(req.status));
    }

    // Comprador filter
    if (filters.comprador && filters.comprador !== 'all') {
      result = result.filter((req) => req.comprador_nome === filters.comprador);
    }

    // Fornecedor filter
    if (filters.fornecedor && filters.fornecedor !== 'all') {
      result = result.filter((req) => req.fornecedor_nome === filters.fornecedor);
    }

    // Setor filter
    if (filters.setor && filters.setor !== 'all') {
      result = result.filter((req) => req.solicitante_setor === filters.setor);
    }

    // Centro de Custo filter
    if (filters.centroCusto && filters.centroCusto !== 'all') {
      result = result.filter((req) => req.centro_custo === filters.centroCusto);
    }

    // Prioridade filter (multi-select)
    if (filters.prioridade.length > 0) {
      result = result.filter((req) => filters.prioridade.includes(req.prioridade));
    }

    // Empresa filter (multi-select)
    if (filters.empresa.length > 0) {
      result = result.filter((req) => 
        req.solicitante_empresa && filters.empresa.includes(req.solicitante_empresa)
      );
    }

    // Date range filter (created_at)
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      result = result.filter((req) => new Date(req.created_at) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((req) => new Date(req.created_at) <= toDate);
    }

    // Delivery date range filter
    if (filters.deliveryDateFrom) {
      const fromDate = new Date(filters.deliveryDateFrom);
      fromDate.setHours(0, 0, 0, 0);
      result = result.filter((req) => 
        req.previsao_entrega && new Date(req.previsao_entrega) >= fromDate
      );
    }

    if (filters.deliveryDateTo) {
      const toDate = new Date(filters.deliveryDateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((req) => 
        req.previsao_entrega && new Date(req.previsao_entrega) <= toDate
      );
    }

    // Delivery status filter
    if (filters.deliveryFilter && filters.deliveryFilter !== 'all') {
      result = result.filter((req) => {
        const status = getDeliveryStatus(req.previsao_entrega);
        return status === filters.deliveryFilter;
      });
    }

    return result;
  }, [requisicoes, filters]);

  // Save current filter as favorite
  const saveFilter = (name: string) => {
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name,
      filters: { ...filters },
    };
    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem(STORAGE_KEYS.filters, JSON.stringify(updated));
  };

  // Load a saved filter
  const loadFilter = (id: string) => {
    const filter = savedFilters.find((f) => f.id === id);
    if (filter) {
      setFilters(filter.filters);
    }
  };

  // Delete a saved filter
  const deleteFilter = (id: string) => {
    const updated = savedFilters.filter((f) => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem(STORAGE_KEYS.filters, JSON.stringify(updated));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Update a single filter
  const updateFilter = <K extends keyof PainelFilters>(key: K, value: PainelFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value, quickView: '' }));
  };

  return {
    filters,
    setFilters,
    updateFilter,
    filteredRequisicoes,
    savedFilters,
    saveFilter,
    loadFilter,
    deleteFilter,
    resetFilters,
    viewMode,
    setViewMode: updateViewMode,
    applyQuickView,
  };
}
