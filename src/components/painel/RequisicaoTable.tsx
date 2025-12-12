import { FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Requisicao, ValorHistorico } from '@/types';
import { ExpandableRow } from './ExpandableRow';
import { ViewMode } from './types';
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
}: RequisicaoTableProps) {
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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className={cn(
            'bg-muted/30 hover:bg-muted/30',
            isCompact ? 'text-xs' : 'text-sm'
          )}>
            <TableHead className="w-10" />
            <TableHead>Item</TableHead>
            <TableHead>Solicitante</TableHead>
            <TableHead className="text-center w-20">Qtd</TableHead>
            <TableHead className="text-center w-24">Prioridade</TableHead>
            <TableHead className="text-center w-28">Status</TableHead>
            <TableHead className="text-center w-24">Comprador</TableHead>
            <TableHead className="text-center w-28">Previsão</TableHead>
            <TableHead className="text-center w-24">SLA</TableHead>
            <TableHead className="text-right w-28">Valor</TableHead>
            <TableHead className="text-center w-24">Data</TableHead>
            <TableHead className="text-right w-16">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
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
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
