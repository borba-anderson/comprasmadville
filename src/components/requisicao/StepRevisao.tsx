import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Package, 
  Hash, 
  FileText, 
  MessageSquare, 
  Tag, 
  AlertTriangle,
  Paperclip,
  Edit3,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RequisicaoPrioridade } from '@/types';
import { cn } from '@/lib/utils';

interface StepRevisaoProps {
  formData: {
    solicitante_nome: string;
    solicitante_email: string;
    solicitante_telefone: string;
    solicitante_setor: string;
    solicitante_empresa: string;
    item_nome: string;
    quantidade: number;
    unidade: string;
    especificacoes: string;
    justificativa: string;
    motivo_compra: string;
    prioridade: RequisicaoPrioridade;
  };
  files: File[];
  onEditStep: (step: number) => void;
}

const prioridadeLabels: Record<RequisicaoPrioridade, { label: string; class: string }> = {
  ALTA: { label: 'Alta Prioridade', class: 'bg-destructive/10 text-destructive border-destructive/30' },
  MEDIA: { label: 'Média Prioridade', class: 'bg-warning/10 text-warning border-warning/30' },
  BAIXA: { label: 'Planejada', class: 'bg-success/10 text-success border-success/30' },
};

export const StepRevisao = ({ formData, files, onEditStep }: StepRevisaoProps) => {
  const prioridadeConfig = prioridadeLabels[formData.prioridade];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-1">Revisão da Requisição</h2>
        <p className="text-sm text-muted-foreground">
          Confira os dados antes de enviar
        </p>
      </div>

      {/* Confirmation Banner */}
      <div className="p-4 bg-success/10 border border-success/30 rounded-lg flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
        <p className="text-sm text-foreground">
          Todos os campos obrigatórios foram preenchidos. Revise e confirme o envio.
        </p>
      </div>

      {/* Section: Solicitante */}
      <div className="bg-muted/30 rounded-xl p-5 border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Solicitante
          </h3>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => onEditStep(1)}
            className="text-xs h-7"
          >
            <Edit3 className="w-3 h-3 mr-1" />
            Editar
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Nome:</span>
            <span className="font-medium">{formData.solicitante_nome}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{formData.solicitante_email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Telefone:</span>
            <span className="font-medium">{formData.solicitante_telefone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Empresa:</span>
            <span className="font-medium">{formData.solicitante_empresa}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Setor:</span>
            <span className="font-medium">{formData.solicitante_setor}</span>
          </div>
        </div>
      </div>

      {/* Section: Item */}
      <div className="bg-muted/30 rounded-xl p-5 border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            Item Solicitado
          </h3>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => onEditStep(2)}
            className="text-xs h-7"
          >
            <Edit3 className="w-3 h-3 mr-1" />
            Editar
          </Button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Item:</span>
            <p className="font-medium mt-0.5">{formData.item_nome}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Quantidade:</span>
              <span className="font-medium">{formData.quantidade} {formData.unidade}</span>
            </div>
          </div>
          {formData.especificacoes && (
            <div>
              <span className="text-muted-foreground flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Especificações:
              </span>
              <p className="font-medium mt-0.5 whitespace-pre-wrap bg-background/50 p-2 rounded border text-xs">
                {formData.especificacoes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section: Justificativa */}
      <div className="bg-muted/30 rounded-xl p-5 border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Justificativa
          </h3>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => onEditStep(3)}
            className="text-xs h-7"
          >
            <Edit3 className="w-3 h-3 mr-1" />
            Editar
          </Button>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border",
              prioridadeConfig.class
            )}>
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              {prioridadeConfig.label}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Tag className="w-4 h-4" />
              {formData.motivo_compra}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Justificativa:</span>
            <p className="font-medium mt-0.5 whitespace-pre-wrap bg-background/50 p-3 rounded border">
              {formData.justificativa}
            </p>
          </div>
        </div>
      </div>

      {/* Section: Anexos */}
      {files.length > 0 && (
        <div className="bg-muted/30 rounded-xl p-5 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-primary" />
              Anexos ({files.length})
            </h3>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => onEditStep(4)}
              className="text-xs h-7"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Alterar
            </Button>
          </div>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center gap-3 text-sm">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
