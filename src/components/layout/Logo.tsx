import { cn } from '@/lib/utils';
import logoImage from '@/assets/logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const imageSizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
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
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img 
        src={logoImage} 
        alt="GMAD Madville Logo" 
        className={cn('rounded-lg', imageSizes[size])}
      />
      {showText && (
        <div>
          <h1 className={cn('font-extrabold text-foreground', textSizes[size])}>
            GMAD Madville
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-muted-foreground font-medium">
              Sistema de Requisições
            </p>
          )}
        </div>
      )}
    </div>
  );
}
