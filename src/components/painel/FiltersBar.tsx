import { useState } from 'react';
import {
  Search,
  RefreshCw,
  Filter,
  X,
  Save,
  Star,
  Calendar,
  LayoutList,
  LayoutGrid,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  STATUS_CONFIG, 
  COMPRADORES, 
  SETORES,
  PRIORIDADE_CONFIG 
} from '@/types';
import { PainelFilters, SavedFilter, ViewMode, DEFAULT_FILTERS } from './types';
import { cn } from '@/lib/utils';

interface FiltersBarProps {
  filters: PainelFilters;
  onFilterChange: <K extends keyof PainelFilters>(key: K, value: PainelFilters[K]) => void;
  onReset: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  savedFilters: SavedFilter[];
  onSaveFilter: (name: string) => void;
  onLoadFilter: (id: string) => void;
  onDeleteFilter: (id: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  resultCount: number;
  totalCount: number;
}

export function FiltersBar({
  filters,
  onFilterChange,
  onReset,
  onRefresh,
  isRefreshing,
  savedFilters,
  onSaveFilter,
  onLoadFilter,
  onDeleteFilter,
  viewMode,
  onViewModeChange,
  resultCount,
  totalCount,
}: FiltersBarProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'search') return value !== '';
    return value !== 'all' && value !== '';
  });

  const handleSave = () => {
    if (filterName.trim()) {
      onSaveFilter(filterName.trim());
      setFilterName('');
      setSaveDialogOpen(false);
    }
  };

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="p-3 space-y-3">
        {/* Primary Filters Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar item, solicitante ou protocolo..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="pl-10 h-9"
            />
          </div>

          {/* Status Filter */}
          <Select 
            value={filters.status} 
            onValueChange={(value) => onFilterChange('status', value)}
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                    {config.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Comprador Filter */}
          <Select 
            value={filters.comprador} 
            onValueChange={(value) => onFilterChange('comprador', value)}
          >
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Comprador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {COMPRADORES.map((c) => (
                <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Advanced Filters Toggle */}
          <Button
            variant={showAdvanced ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            Filtros
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </Button>

          {/* Saved Filters */}
          {savedFilters.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Star className="w-3.5 h-3.5" />
                  Favoritos
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <div className="space-y-1">
                  {savedFilters.map((filter) => (
                    <div 
                      key={filter.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer group"
                    >
                      <span 
                        className="text-sm flex-1"
                        onClick={() => onLoadFilter(filter.id)}
                      >
                        {filter.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={() => onDeleteFilter(filter.id)}
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          <div className="flex-1" />

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'compact' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => onViewModeChange('compact')}
            >
              <LayoutList className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'detailed' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => onViewModeChange('detailed')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>

          {/* Refresh */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={onRefresh}
          >
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          </Button>
        </div>

        {/* Advanced Filters Row */}
        {showAdvanced && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t animate-fade-in">
            {/* Setor Filter */}
            <Select 
              value={filters.setor} 
              onValueChange={(value) => onFilterChange('setor', value)}
            >
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Setores</SelectItem>
                {SETORES.map((setor) => (
                  <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Prioridade Filter */}
            <Select 
              value={filters.prioridade} 
              onValueChange={(value) => onFilterChange('prioridade', value)}
            >
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {Object.entries(PRIORIDADE_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span>{config.icon}</span>
                      {config.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range */}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onFilterChange('dateFrom', e.target.value)}
                className="w-[130px] h-9"
              />
              <span className="text-muted-foreground">→</span>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => onFilterChange('dateTo', e.target.value)}
                className="w-[130px] h-9"
              />
            </div>

            {/* Delivery Status Filter */}
            <Select 
              value={filters.deliveryFilter} 
              onValueChange={(value) => onFilterChange('deliveryFilter', value as any)}
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Previsão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Previsões</SelectItem>
                <SelectItem value="ontime">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    No prazo
                  </span>
                </SelectItem>
                <SelectItem value="today">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Vence hoje
                  </span>
                </SelectItem>
                <SelectItem value="overdue">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Atrasado
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Actions */}
            {hasActiveFilters && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  className="gap-1.5 text-muted-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                  Limpar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSaveDialogOpen(true)}
                  className="gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Salvar
                </Button>
              </>
            )}

            <div className="flex-1" />

            {/* Result count */}
            <span className="text-xs text-muted-foreground">
              {resultCount} de {totalCount} requisições
            </span>
          </div>
        )}
      </div>

      {/* Save Filter Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>Salvar Filtro</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="filter-name">Nome do filtro</Label>
            <Input
              id="filter-name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Ex: Pendentes do setor TI"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
