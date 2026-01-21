import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UNIDADES } from '@/types';
import { Package, Hash, Ruler, FileText, Lightbulb } from 'lucide-react';

interface StepItemProps {
  formData: {
    item_nome: string;
    quantidade: number;
    unidade: string;
    especificacoes: string;
  };
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export const StepItem = ({ formData, errors, onChange, onSelectChange }: StepItemProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-1">Detalhes do Item</h2>
        <p className="text-sm text-muted-foreground">
          Descreva o item de forma clara para facilitar a cotação
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <Label htmlFor="item_nome" className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            Nome do Item <span className="text-destructive">*</span>
          </Label>
          <Input
            id="item_nome"
            name="item_nome"
            value={formData.item_nome}
            onChange={onChange}
            placeholder="Ex: Notebook Dell Inspiron 15 | Cadeira Ergonômica | Toner HP 85A"
            className="mt-1.5"
          />
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" />
            Dica: Inclua marca e modelo quando souber
          </p>
          {errors.item_nome && (
            <p className="text-xs text-destructive mt-1">{errors.item_nome}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="quantidade" className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-muted-foreground" />
              Quantidade <span className="text-destructive">*</span>
            </Label>
            <Input
              id="quantidade"
              name="quantidade"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.quantidade}
              onChange={onChange}
              className="mt-1.5"
            />
            {errors.quantidade && (
              <p className="text-xs text-destructive mt-1">{errors.quantidade}</p>
            )}
          </div>

          <div>
            <Label htmlFor="unidade" className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-muted-foreground" />
              Unidade de Medida <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.unidade}
              onValueChange={(value) => onSelectChange('unidade', value)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNIDADES.map((unidade) => (
                  <SelectItem key={unidade.value} value={unidade.value}>
                    {unidade.label} ({unidade.sigla})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="especificacoes" className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            Especificações Técnicas
          </Label>
          <Textarea
            id="especificacoes"
            name="especificacoes"
            value={formData.especificacoes}
            onChange={onChange}
            placeholder="Cor, tamanho, capacidade, voltagem, configurações específicas...&#10;&#10;Exemplo: Memória 16GB, SSD 512GB, Tela 15.6&quot;, Windows 11 Pro"
            rows={4}
            className="mt-1.5"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Quanto mais detalhado, mais precisa será a cotação
          </p>
        </div>
      </div>
    </div>
  );
};
