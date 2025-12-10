import { Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DeliveryDatePickerProps {
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function DeliveryDatePicker({ value, onChange, disabled, className }: DeliveryDatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const deliveryDate = value ? new Date(value) : null;
  
  let status: 'ontime' | 'warning' | 'overdue' | null = null;
  let daysLeft = 0;
  
  if (deliveryDate) {
    deliveryDate.setHours(0, 0, 0, 0);
    daysLeft = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      status = 'overdue';
    } else if (daysLeft <= 3) {
      status = 'warning';
    } else {
      status = 'ontime';
    }
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'overdue':
        return {
          icon: AlertTriangle,
          text: `Atrasado ${Math.abs(daysLeft)} dia(s)`,
          className: 'text-red-600 bg-red-50 dark:bg-red-950/30',
        };
      case 'warning':
        return {
          icon: Clock,
          text: daysLeft === 0 ? 'Entrega hoje!' : `Faltam ${daysLeft} dia(s)`,
          className: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
        };
      case 'ontime':
        return {
          icon: CheckCircle,
          text: `Faltam ${daysLeft} dia(s)`,
          className: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
        };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig?.icon;

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Previsão de Entrega
      </label>
      <Input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        min={new Date().toISOString().split('T')[0]}
        className="bg-background"
      />
      {statusConfig && StatusIcon && (
        <div className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
          statusConfig.className
        )}>
          <StatusIcon className="w-4 h-4" />
          {statusConfig.text}
        </div>
      )}
    </div>
  );
}
