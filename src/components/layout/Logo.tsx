import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}
const sizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};
const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-9 h-9',
  xl: 'w-14 h-14'
};
const textSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-4xl'
};
export function Logo({
  className,
  size = 'md',
  showText = true
}: LogoProps) {
  return <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg', sizes[size])}>
        <ShoppingCart className={cn('text-primary-foreground', iconSizes[size])} />
      </div>
      {showText && <div>
          <h1 className={cn('font-extrabold text-foreground', textSizes[size])}>Central de Compras GMAD (Joinville/Curitiba)</h1>
          {size !== 'sm' && <p className="text-xs text-muted-foreground font-medium">
              Sistema de Requisições
            </p>}
        </div>}
    </div>;
}