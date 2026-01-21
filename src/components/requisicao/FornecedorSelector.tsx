import { useState, useEffect, useCallback, useRef } from 'react';
import { Store, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FornecedorSelectorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function FornecedorSelector({ value, onChange, disabled, className }: FornecedorSelectorProps) {
  const [localValue, setLocalValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local value when prop changes (e.g., when switching requisitions)
  useEffect(() => {
    setLocalValue(value || '');
    setSaved(false);
  }, [value]);

  const debouncedSave = useCallback((newValue: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      // Only save if value actually changed
      if (newValue !== value) {
        setIsSaving(true);
        onChange(newValue);
        setTimeout(() => {
          setIsSaving(false);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }, 500);
      }
    }, 800); // Wait 800ms after user stops typing
  }, [onChange, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setSaved(false);
    debouncedSave(newValue);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Store className="w-4 h-4" />
        Fornecedor
        {isSaving && <span className="text-xs text-primary animate-pulse">Salvando...</span>}
        {saved && <Check className="w-4 h-4 text-emerald-500" />}
      </label>
      <Input
        value={localValue}
        onChange={handleChange}
        placeholder="Nome do fornecedor..."
        disabled={disabled || isSaving}
        className="bg-background"
      />
    </div>
  );
}
