import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MOTIVOS_COMPRA, RequisicaoPrioridade } from '@/types';
import { 
  MessageSquare, 
  Tag, 
  AlertTriangle, 
  Clock, 
  CheckCircle2,
  Zap,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepJustificativaProps {
  formData: {
    justificativa: string;
    motivo_compra: string;
    prioridade: RequisicaoPrioridade;
  };
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const prioridadeConfig = [
  { 
    value: 'ALTA', 
    label: 'Alta Prioridade', 
    desc: 'SLA: Até 24h para análise', 
    icon: Zap,
    color: 'border-destructive bg-destructive/5 text-destructive',
    selectedColor: 'border-destructive bg-destructive/10 ring-2 ring-destructive/20',
    warning: 'Requer justificativa detalhada do impacto operacional'
  },
  { 
    value: 'MEDIA', 
    label: 'Média Prioridade', 
    desc: 'SLA: Até 3 dias úteis', 
    icon: Clock,
    color: 'border-warning bg-warning/5 text-warning',
    selectedColor: 'border-warning bg-warning/10 ring-2 ring-warning/20',
    warning: null
  },
  { 
    value: 'BAIXA', 
    label: 'Planejada', 
    desc: 'SLA: Compra programada', 
    icon: CheckCircle2,
    color: 'border-success bg-success/5 text-success',
    selectedColor: 'border-success bg-success/10 ring-2 ring-success/20',
    warning: null
  },
];

export const StepJustificativa = ({ formData, errors, onChange, onSelectChange }: StepJustificativaProps) => {
  const isHighPriority = formData.prioridade === 'ALTA';
  const minJustificativaLength = isHighPriority ? 50 : 10;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-1">Justificativa e Prioridade</h2>
        <p className="text-sm text-muted-foreground">
          Explique a necessidade para agilizar a aprovação
        </p>
      </div>

      {/* Prioridade Selection */}
      <div>
        <Label className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          Prioridade da Requisição <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {prioridadeConfig.map((prio) => {
            const isSelected = formData.prioridade === prio.value;
            const Icon = prio.icon;
            
            return (
              <label
                key={prio.value}
                className={cn(
                  "flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all",
                  isSelected ? prio.selectedColor : "border-border hover:border-muted-foreground/40"
                )}
              >
                <input
                  type="radio"
                  name="prioridade"
                  value={prio.value}
                  checked={isSelected}
                  onChange={(e) => onSelectChange('prioridade', e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn("w-5 h-5", isSelected ? prio.color.split(' ')[2] : "text-muted-foreground")} />
                  <span className={cn("font-semibold", isSelected ? "text-foreground" : "text-muted-foreground")}>
                    {prio.label}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{prio.desc}</span>
              </label>
            );
          })}
        </div>
        
        {/* High Priority Warning */}
        {isHighPriority && (
          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-xs text-destructive">
              Prioridade alta exige justificativa detalhada (mínimo 50 caracteres) explicando o impacto operacional e a urgência.
            </p>
          </div>
        )}
      </div>

      {/* Motivo da Compra */}
      <div>
        <Label className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-muted-foreground" />
          Motivo da Compra <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MOTIVOS_COMPRA.map((motivo) => (
            <label
              key={motivo}
              className={cn(
                "flex items-center p-3 border rounded-lg cursor-pointer transition-all",
                formData.motivo_compra === motivo
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border hover:border-primary/40"
              )}
            >
              <input
                type="radio"
                name="motivo_compra"
                value={motivo}
                checked={formData.motivo_compra === motivo}
                onChange={(e) => onSelectChange('motivo_compra', e.target.value)}
                className="sr-only"
              />
              <span className={cn(
                "text-sm font-medium",
                formData.motivo_compra === motivo ? "text-foreground" : "text-muted-foreground"
              )}>
                {motivo}
              </span>
            </label>
          ))}
        </div>
        {errors.motivo_compra && (
          <p className="text-xs text-destructive mt-1">{errors.motivo_compra}</p>
        )}
      </div>

      {/* Justificativa */}
      <div>
        <Label htmlFor="justificativa" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          Justificativa <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="justificativa"
          name="justificativa"
          value={formData.justificativa}
          onChange={onChange}
          placeholder={isHighPriority 
            ? "Explique detalhadamente:\n• Qual o impacto operacional se não comprar?\n• Por que é urgente?\n• Há alguma data limite?"
            : "Por que este item é necessário? Qual será o uso?"}
          rows={isHighPriority ? 5 : 4}
          className={cn(
            "mt-1.5",
            isHighPriority && formData.justificativa.length < minJustificativaLength && "border-destructive/50"
          )}
        />
        <div className="flex justify-between mt-1.5">
          <p className="text-xs text-muted-foreground">
            {isHighPriority 
              ? "Descreva o impacto operacional e a urgência" 
              : "Explique a necessidade de forma clara"}
          </p>
          <p className={cn(
            "text-xs",
            formData.justificativa.length < minJustificativaLength ? "text-destructive" : "text-muted-foreground"
          )}>
            {formData.justificativa.length}/{minJustificativaLength}+ caracteres
          </p>
        </div>
        {errors.justificativa && (
          <p className="text-xs text-destructive mt-1">{errors.justificativa}</p>
        )}
      </div>
    </div>
  );
};
