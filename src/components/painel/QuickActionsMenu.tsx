import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Eye,
  RefreshCw,
  Mail,
  Paperclip,
  History,
  ExternalLink,
} from 'lucide-react';
import { Requisicao } from '@/types';

interface QuickActionsMenuProps {
  requisicao: Requisicao;
  onView: () => void;
  onStatusUpdate: () => void;
  onSendEmail: () => void;
}

export function QuickActionsMenu({
  requisicao,
  onView,
  onStatusUpdate,
  onSendEmail,
}: QuickActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(); }}>
          <Eye className="w-4 h-4 mr-2" />
          Ver detalhes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusUpdate(); }}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar status
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSendEmail(); }}>
          <Mail className="w-4 h-4 mr-2" />
          Enviar e-mail
        </DropdownMenuItem>
        {requisicao.arquivo_url && (
          <DropdownMenuItem 
            onClick={(e) => {
              e.stopPropagation();
              window.open(requisicao.arquivo_url!, '_blank');
            }}
          >
            <Paperclip className="w-4 h-4 mr-2" />
            Ver anexo
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(); }}>
          <History className="w-4 h-4 mr-2" />
          Ver histórico
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
