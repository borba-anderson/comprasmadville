import { Store } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FornecedorSelectorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function FornecedorSelector({ value, onChange, disabled, className }: FornecedorSelectorProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Store className="w-4 h-4" />
        Fornecedor
      </label>
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nome do fornecedor..."
        disabled={disabled}
        className="bg-background"
      />
    </div>
  );
}
