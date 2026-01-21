import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Requisicao } from '@/types';
import { exportToCSV, exportToExcel } from './utils/exportData';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonProps {
  requisicoes: Requisicao[];
  disabled?: boolean;
}

export function ExportButton({ requisicoes, disabled }: ExportButtonProps) {
  const { toast } = useToast();

  const handleExportCSV = () => {
    if (requisicoes.length === 0) {
      toast({
        title: 'Nenhum dado para exportar',
        description: 'Aplique filtros ou aguarde os dados carregarem.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      exportToCSV(requisicoes);
      toast({
        title: 'Exportação concluída',
        description: `${requisicoes.length} requisições exportadas para CSV.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Erro na exportação',
        description: 'Não foi possível exportar os dados.',
        variant: 'destructive',
      });
    }
  };

  const handleExportExcel = () => {
    if (requisicoes.length === 0) {
      toast({
        title: 'Nenhum dado para exportar',
        description: 'Aplique filtros ou aguarde os dados carregarem.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      exportToExcel(requisicoes);
      toast({
        title: 'Exportação concluída',
        description: `${requisicoes.length} requisições exportadas para Excel.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Erro na exportação',
        description: 'Não foi possível exportar os dados.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} className="gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover border shadow-lg">
        <DropdownMenuItem onClick={handleExportExcel} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 text-green-600" />
          Exportar para Excel (.xls)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
          <FileText className="w-4 h-4 text-blue-600" />
          Exportar para CSV (.csv)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
