import { useNavigate } from 'react-router-dom';
import { Plus, Clock, AlertTriangle, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AcoesRapidas() {
  const navigate = useNavigate();

  const handleExportPDF = () => {
    // TODO: Implementar exportação PDF
    window.print();
  };

  const handleExportExcel = () => {
    // TODO: Implementar exportação Excel
    alert('Funcionalidade de exportação Excel em desenvolvimento.');
  };

  const acoes = [
    {
      label: 'Nova Requisição',
      icon: Plus,
      variant: 'default' as const,
      onClick: () => navigate('/requisicao'),
    },
    {
      label: 'Ver Pendentes',
      icon: Clock,
      variant: 'outline' as const,
      onClick: () => {
        // Scroll to table or filter
        const element = document.querySelector('[data-status-filter]');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      },
    },
    {
      label: 'Ver Atrasadas',
      icon: AlertTriangle,
      variant: 'outline' as const,
      onClick: () => {
        // Scroll to table or filter
        const element = document.querySelector('[data-status-filter]');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      },
    },
    {
      label: 'Exportar PDF',
      icon: FileText,
      variant: 'outline' as const,
      onClick: handleExportPDF,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {acoes.map((acao) => {
        const Icon = acao.icon;
        return (
          <Button
            key={acao.label}
            variant={acao.variant}
            size="sm"
            onClick={acao.onClick}
            className={`h-9 px-4 rounded-lg gap-2 ${
              acao.variant === 'default' 
                ? 'bg-primary hover:bg-primary/90 shadow-sm' 
                : 'bg-card border-border/60 hover:bg-muted/50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {acao.label}
          </Button>
        );
      })}
    </div>
  );
}
