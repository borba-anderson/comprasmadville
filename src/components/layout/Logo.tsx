import { cn } from '@/lib/utils';
import gmadLogo from '@/assets/gmad-logo.png';
interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}
const sizes = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
  xl: 'w-28 h-28'
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
      <img alt="GMAD Logo" className={cn('object-contain', sizes[size])} src="/lovable-uploads/90e07f8d-0f0d-44f4-b552-1973a3a1c498.png" />
      {showText && <div>
          <h1 className={cn('font-extrabold text-foreground', textSizes[size])}>Central de Compras GMAD Madville | Curitiba</h1>
          {size !== 'sm' && <p className="text-xs text-muted-foreground font-medium">
              Sistema de Requisições
            </p>}
        </div>}
    </div>;
}