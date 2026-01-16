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
  Building,
  Truck,
  Check,
  ClipboardList,
  Clock,
  CheckCircle2,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  STATUS_CONFIG, 
  COMPRADORES, 
  SETORES,
  PRIORIDADE_CONFIG,
  EMPRESAS,
  QUICK_VIEWS,
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
  onQuickView: (viewId: string) => void;
}

// Multi-select dropdown component
function MultiSelectFilter({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  renderOption,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  options: { value: string; label: string; dotColor?: string; icon?: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  renderOption?: (option: { value: string; label: string; dotColor?: string; icon?: string }) => React.ReactNode;
}) {
  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectedCount = value.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1.5 min-w-[100px]">
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {label}
          {selectedCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {selectedCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
              onClick={() => handleToggle(option.value)}
            >
              <Checkbox
                checked={value.includes(option.value)}
                onCheckedChange={() => handleToggle(option.value)}
              />
              {renderOption ? (
                renderOption(option)
              ) : (
                <span className="text-sm flex items-center gap-2">
                  {option.dotColor && (
                    <span className={cn('w-2 h-2 rounded-full', option.dotColor)} />
                  )}
                  {option.icon && <span>{option.icon}</span>}
                  {option.label}
                </span>
              )}
            </div>
          ))}
        </div>
        {selectedCount > 0 && (
          <div className="pt-2 mt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground"
              onClick={() => onChange([])}
            >
              <X className="w-3.5 h-3.5 mr-2" />
              Limpar seleção
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
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
  onQuickView,
}: FiltersBarProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.status.length > 0 ||
    filters.comprador !== 'all' ||
    filters.setor !== 'all' ||
    filters.prioridade.length > 0 ||
    filters.empresa.length > 0 ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '' ||
    filters.deliveryDateFrom !== '' ||
    filters.deliveryDateTo !== '' ||
    filters.deliveryFilter !== 'all';

  const handleSave = () => {
    if (filterName.trim()) {
      onSaveFilter(filterName.trim());
      setFilterName('');
      setSaveDialogOpen(false);
    }
  };

  const statusOptions = Object.entries(STATUS_CONFIG).map(([key, config]) => ({
    value: key,
    label: config.label,
    dotColor: config.dotColor,
  }));

  const prioridadeOptions = Object.entries(PRIORIDADE_CONFIG).map(([key, config]) => ({
    value: key,
    label: config.label,
    icon: config.icon,
  }));

  const empresaOptions = EMPRESAS.map((empresa) => ({
    value: empresa,
    label: empresa,
  }));

  const quickViewButtons = [
    { id: 'minhasPendencias', icon: ClipboardList, color: 'text-amber-600' },
    { id: 'aguardandoFornecedor', icon: Truck, color: 'text-blue-600' },
    { id: 'finalizados', icon: CheckCircle2, color: 'text-emerald-600' },
  ];

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="p-3 space-y-3">
        {/* Quick View Buttons */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b">
          <span className="text-xs font-medium text-muted-foreground mr-2">Visões rápidas:</span>
          {quickViewButtons.map((btn) => {
            const view = QUICK_VIEWS[btn.id as keyof typeof QUICK_VIEWS];
            const isActive = filters.quickView === btn.id;
            return (
              <Button
                key={btn.id}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={cn('gap-1.5 h-8', isActive && 'shadow-md')}
                onClick={() => onQuickView(isActive ? '' : btn.id)}
              >
                <btn.icon className={cn('w-3.5 h-3.5', !isActive && btn.color)} />
                {view.label}
              </Button>
            );
          })}
          
          <div className="flex-1" />
          
          {/* Result count */}
          <span className="text-sm font-medium">
            <span className="text-primary">{resultCount}</span>
            <span className="text-muted-foreground"> de {totalCount}</span>
          </span>
        </div>

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

          {/* Empresa Filter (Multi-select) */}
          <MultiSelectFilter
            label="Empresa"
            icon={Building}
            options={empresaOptions}
            value={filters.empresa}
            onChange={(value) => onFilterChange('empresa', value)}
          />

          {/* Status Filter (Multi-select) */}
          <MultiSelectFilter
            label="Status"
            options={statusOptions}
            value={filters.status}
            onChange={(value) => onFilterChange('status', value)}
            renderOption={(option) => (
              <span className="flex items-center gap-2 text-sm">
                <span className={cn('w-2 h-2 rounded-full', option.dotColor)} />
                {option.label}
              </span>
            )}
          />

          {/* Prioridade Filter (Multi-select) */}
          <MultiSelectFilter
            label="Prioridade"
            options={prioridadeOptions}
            value={filters.prioridade}
            onChange={(value) => onFilterChange('prioridade', value)}
            renderOption={(option) => (
              <span className="flex items-center gap-2 text-sm">
                <span>{option.icon}</span>
                {option.label}
              </span>
            )}
          />

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
            Mais filtros
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
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Setores</SelectItem>
                {SETORES.map((setor) => (
                  <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range - Requisição */}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Requisição:</span>
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

            {/* Date Range - Previsão de Entrega */}
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Entrega:</span>
              <Input
                type="date"
                value={filters.deliveryDateFrom}
                onChange={(e) => onFilterChange('deliveryDateFrom', e.target.value)}
                className="w-[130px] h-9"
              />
              <span className="text-muted-foreground">→</span>
              <Input
                type="date"
                value={filters.deliveryDateTo}
                onChange={(e) => onFilterChange('deliveryDateTo', e.target.value)}
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
              placeholder="Ex: Curitiba – Pendentes"
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
