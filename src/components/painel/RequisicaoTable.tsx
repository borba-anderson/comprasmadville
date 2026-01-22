import { FileText, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Requisicao, ValorHistorico } from '@/types';
import { ExpandableRow } from './ExpandableRow';
import { ViewMode } from './types';
import { SortConfig, SortField } from './hooks/useSorting';
import { cn } from '@/lib/utils';

interface RequisicaoTableProps {
  requisicoes: Requisicao[];
  isLoading: boolean;
  viewMode: ViewMode;
  selectedId: string | null;
  valorHistoryMap: Record<string, ValorHistorico[]>;
  onSelect: (requisicao: Requisicao) => void;
  onViewDetails: (requisicao: Requisicao) => void;
  onSendEmail: (requisicao: Requisicao) => void;
  formatCurrency: (value: number | null | undefined) => string;
  hasFilters: boolean;
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  // Multi-select props
  isItemSelected?: (id: string) => boolean;
  onToggleItem?: (id: string) => void;
  onToggleAll?: () => void;
  allSelected?: boolean;
  someSelected?: boolean;
  // Read-only mode for solicitantes
  readOnly?: boolean;
}

interface SortableHeaderProps {
  field: SortField;
  label: string;
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  className?: string;
}

function SortableHeader({ field, label, sortConfig, onSort, className }: SortableHeaderProps) {
  const isActive = sortConfig.field === field;
  
  return (
    <TableHead 
      className={cn(
        'font-semibold text-foreground/80 cursor-pointer select-none hover:bg-muted/70 transition-colors',
        className
      )}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1 justify-center">
        <span>{label}</span>
        {isActive ? (
          sortConfig.direction === 'desc' ? (
            <ArrowDown className="w-3 h-3 text-primary" />
          ) : (
            <ArrowUp className="w-3 h-3 text-primary" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 text-muted-foreground/50" />
        )}
      </div>
    </TableHead>
  );
}

export function RequisicaoTable({
  requisicoes,
  isLoading,
  viewMode,
  selectedId,
  valorHistoryMap,
  onSelect,
  onViewDetails,
  onSendEmail,
  formatCurrency,
  hasFilters,
  sortConfig,
  onSort,
  isItemSelected,
  onToggleItem,
  onToggleAll,
  allSelected = false,
  someSelected = false,
  readOnly = false,
}: RequisicaoTableProps) {
  const hasMultiSelect = isItemSelected && onToggleItem && onToggleAll;
  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="spinner w-10 h-10 mx-auto mb-4 border-primary" />
        <p className="text-muted-foreground">Carregando requisições...</p>
      </div>
    );
  }

  if (requisicoes.length === 0) {
    return (
      <div className="p-12 text-center">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg font-semibold">Nenhuma requisição encontrada</p>
        <p className="text-muted-foreground text-sm">
          {hasFilters ? 'Tente ajustar os filtros' : 'As requisições aparecerão aqui'}
        </p>
      </div>
    );
  }

  const isCompact = viewMode === 'compact';

  return (
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className={cn(
            'bg-muted/50 hover:bg-muted/50 border-b-2 border-border/80',
            isCompact ? 'text-xs' : 'text-sm'
          )}>
            {/* Select All Checkbox */}
            {hasMultiSelect && (
              <TableHead className="w-10 px-2">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) {
                      (el as HTMLButtonElement).dataset.state = someSelected ? 'indeterminate' : allSelected ? 'checked' : 'unchecked';
                    }
                  }}
                  onCheckedChange={onToggleAll}
                  aria-label="Selecionar todos"
                  className="translate-y-[2px]"
                />
              </TableHead>
            )}
            <TableHead className="w-10 px-2" />
            <SortableHeader 
              field="item_nome" 
              label="Item" 
              sortConfig={sortConfig} 
              onSort={onSort}
              className="w-[220px] !justify-start"
            />
            <SortableHeader 
              field="solicitante_nome" 
              label="Solicitante" 
              sortConfig={sortConfig} 
              onSort={onSort}
              className="w-[150px] !justify-start"
            />
            <SortableHeader 
              field="quantidade" 
              label="Qtd" 
              sortConfig={sortConfig} 
              onSort={onSort}
              className="text-center w-20"
            />
            <SortableHeader 
              field="prioridade" 
              label="Prioridade" 
              sortConfig={sortConfig} 
              onSort={onSort}
              className="text-center w-24"
            />
            <SortableHeader 
              field="status" 
              label="Status" 
              sortConfig={sortConfig} 
              onSort={onSort}
              className="text-center w-28"
            />
            <SortableHeader 
              field="comprador_nome" 
              label="Comprador" 
              sortConfig={sortConfig} 
              onSort={onSort}
              className="text-center w-24"
            />
            <SortableHeader 
              field="fornecedor_nome" 
              label="Fornecedor" 
              sortConfig={sortConfig} 
              onSort={onSort}
              className="text-center w-28"
            />
            <SortableHeader 
              field="previsao_entrega" 
              label="Previsão" 
              sortConfig={sortConfig} 
              onSort={onSort}
              className="text-center w-24"
            />
            <TableHead className="text-center w-20 font-semibold text-foreground/80">SLA</TableHead>
            <SortableHeader 
              field="valor" 
              label="Valor" 
              sortConfig={sortConfig} 
              onSort={onSort}
              className="text-right w-28"
            />
            <SortableHeader 
              field="created_at" 
              label="Data" 
              sortConfig={sortConfig} 
              onSort={onSort}
              className="text-center w-24"
            />
            <TableHead className="text-right w-14 font-semibold text-foreground/80">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-sm">
          {requisicoes.map((req) => (
            <ExpandableRow
              key={req.id}
              requisicao={req}
              viewMode={viewMode}
              isSelected={selectedId === req.id}
              valorHistory={valorHistoryMap[req.id]}
              onSelect={() => onSelect(req)}
              onViewDetails={() => onViewDetails(req)}
              onStatusUpdate={() => onViewDetails(req)}
              onSendEmail={() => onSendEmail(req)}
              formatCurrency={formatCurrency}
              isChecked={isItemSelected?.(req.id) ?? false}
              onToggleCheck={onToggleItem ? () => onToggleItem(req.id) : undefined}
              readOnly={readOnly}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
