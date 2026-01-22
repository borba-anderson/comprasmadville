import { useState } from 'react';
import {
  Calendar,
  Building2,
  Building,
  Save,
  Star,
  X,
  Trash2,
  Filter,
  Wallet,
} from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { SETORES, EMPRESAS, STATUS_CONFIG } from '@/types';
import { cn } from '@/lib/utils';

export interface DashboardFiltersState {
  periodo: '7d' | '30d' | 'mes' | '3m' | '6m' | '1y' | 'all';
  empresas: string[];
  setores: string[];
  status: string[];
  centrosCusto: string[];
  dateFrom: string;
  dateTo: string;
}

export interface SavedDashboardFilter {
  id: string;
  name: string;
  filters: DashboardFiltersState;
}

export const DEFAULT_DASHBOARD_FILTERS: DashboardFiltersState = {
  periodo: '30d',
  empresas: [],
  setores: [],
  status: [],
  centrosCusto: [],
  dateFrom: '',
  dateTo: '',
};

const PERIODO_LABELS: Record<DashboardFiltersState['periodo'], string> = {
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias',
  'mes': 'Este mês',
  '3m': 'Últimos 3 meses',
  '6m': 'Últimos 6 meses',
  '1y': 'Último ano',
  'all': 'Todo período',
};

interface MultiSelectDropdownProps {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  options: { value: string; label: string; dotColor?: string }[];
  value: string[];
  onChange: (value: string[]) => void;
}

function MultiSelectDropdown({
  label,
  icon: Icon,
  options,
  value,
  onChange,
}: MultiSelectDropdownProps) {
  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 gap-1.5 min-w-[140px] bg-card border-border/60 rounded-xl">
          {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
          {label}
          {value.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {value.length}
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
              <span className="text-sm flex items-center gap-2">
                {option.dotColor && (
                  <span className={cn('w-2 h-2 rounded-full', option.dotColor)} />
                )}
                {option.label}
              </span>
            </div>
          ))}
        </div>
        {value.length > 0 && (
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

interface DashboardFiltersProps {
  filters: DashboardFiltersState;
  onChange: (filters: DashboardFiltersState) => void;
  savedFilters: SavedDashboardFilter[];
  onSaveFilter: (name: string) => void;
  onLoadFilter: (id: string) => void;
  onDeleteFilter: (id: string) => void;
  onReset: () => void;
  centrosCustoOptions?: string[];
}

export function DashboardFilters({
  filters,
  onChange,
  savedFilters,
  onSaveFilter,
  onLoadFilter,
  onDeleteFilter,
  onReset,
  centrosCustoOptions = [],
}: DashboardFiltersProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');

  const handleSave = () => {
    if (filterName.trim()) {
      onSaveFilter(filterName.trim());
      setFilterName('');
      setSaveDialogOpen(false);
    }
  };

  const hasActiveFilters =
    filters.empresas.length > 0 ||
    filters.setores.length > 0 ||
    filters.status.length > 0 ||
    filters.centrosCusto.length > 0 ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';
  
  const centroCustoOptions = centrosCustoOptions.map((cc) => ({
    value: cc,
    label: cc,
  }));

  const empresaOptions = EMPRESAS.map((empresa) => ({
    value: empresa,
    label: empresa,
  }));

  const setorOptions = SETORES.map((setor) => ({
    value: setor,
    label: setor,
  }));

  const statusOptions = Object.entries(STATUS_CONFIG).map(([key, config]) => ({
    value: key,
    label: config.label,
    dotColor: config.dotColor,
  }));

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Período */}
      <Select
        value={filters.periodo}
        onValueChange={(v) =>
          onChange({ ...filters, periodo: v as DashboardFiltersState['periodo'] })
        }
      >
        <SelectTrigger className="w-[180px] h-10 bg-card border-border/60 rounded-xl">
          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(PERIODO_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Empresa Multi-select */}
      <MultiSelectDropdown
        label="Empresas"
        icon={Building}
        options={empresaOptions}
        value={filters.empresas}
        onChange={(empresas) => onChange({ ...filters, empresas })}
      />

      {/* Setor Multi-select */}
      <MultiSelectDropdown
        label="Setores"
        icon={Building2}
        options={setorOptions}
        value={filters.setores}
        onChange={(setores) => onChange({ ...filters, setores })}
      />

      {/* Status Multi-select */}
      <MultiSelectDropdown
        label="Status"
        icon={Filter}
        options={statusOptions}
        value={filters.status}
        onChange={(status) => onChange({ ...filters, status })}
      />

      {/* Centro de Custo Multi-select */}
      {centroCustoOptions.length > 0 && (
        <MultiSelectDropdown
          label="Centro Custo"
          icon={Wallet}
          options={centroCustoOptions}
          value={filters.centrosCusto}
          onChange={(centrosCusto) => onChange({ ...filters, centrosCusto })}
        />
      )}

      {/* Saved Filters */}
      {savedFilters.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 gap-1.5 rounded-xl">
              <Star className="w-4 h-4" />
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

      {/* Actions */}
      {hasActiveFilters && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1.5 text-muted-foreground h-10"
          >
            <X className="w-3.5 h-3.5" />
            Limpar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSaveDialogOpen(true)}
            className="gap-1.5 h-10"
          >
            <Save className="w-3.5 h-3.5" />
            Salvar
          </Button>
        </>
      )}

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
