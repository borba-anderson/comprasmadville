import { useNavigate } from 'react-router-dom';
import { Plus, Clock, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AcoesRapidasProps {
  onFilterPendentes?: () => void;
  onFilterAtrasadas?: () => void;
}

export function AcoesRapidas({ onFilterPendentes, onFilterAtrasadas }: AcoesRapidasProps) {
  const navigate = useNavigate();

  const handleExportPDF = () => {
    // TODO: Implementar exportação PDF
    window.print();
  };

  const handleVerPendentes = () => {
    if (onFilterPendentes) {
      onFilterPendentes();
    } else {
      // Fallback: scroll to table
      const element = document.querySelector('[data-status-filter]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleVerAtrasadas = () => {
    if (onFilterAtrasadas) {
      onFilterAtrasadas();
    } else {
      // Fallback: scroll to table
      const element = document.querySelector('[data-status-filter]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
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
      onClick: handleVerPendentes,
    },
    {
      label: 'Ver Atrasadas',
      icon: AlertTriangle,
      variant: 'outline' as const,
      onClick: handleVerAtrasadas,
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
