import { User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COMPRADORES } from '@/types';
import { cn } from '@/lib/utils';

interface BuyerSelectorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function BuyerSelector({ value, onChange, disabled, className }: BuyerSelectorProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <User className="w-4 h-4" />
        Comprador Responsável
      </label>
      <Select value={value || ''} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full bg-background">
          <SelectValue placeholder="Selecionar comprador..." />
        </SelectTrigger>
        <SelectContent className="bg-popover border shadow-lg">
          {COMPRADORES.map((comprador) => (
            <SelectItem key={comprador.id} value={comprador.nome}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {comprador.nome.charAt(0)}
                  </span>
                </div>
                {comprador.nome}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
