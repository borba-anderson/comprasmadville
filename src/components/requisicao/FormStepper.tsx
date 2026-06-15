import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepConfig {
  id: number;
  title: string;
  description: string;
}

interface FormStepperProps {
  steps: StepConfig[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const FormStepper = ({ steps, currentStep, onStepClick }: FormStepperProps) => {
  const progress = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <div className="space-y-4">
      {/* Header line: etapa N de X • % concluído */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground tracking-wide uppercase">
          Etapa {currentStep} <span className="text-muted-foreground normal-case">de {steps.length}</span>
        </span>
        <span className="font-semibold text-primary tabular-nums">
          {progress}% concluído
        </span>
      </div>

      {/* Stepper rail */}
      <div className="relative pt-2">
        <div className="absolute top-[22px] left-5 right-5 h-[2px] bg-border rounded-full" />
        <div
          className="absolute top-[22px] left-5 h-[2px] bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_hsl(var(--primary)/0.4)]"
          style={{ width: `calc(${progress}% - ${progress > 0 ? '0px' : '0px'})`, maxWidth: 'calc(100% - 40px)' }}
        />

        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isClickable = onStepClick && isCompleted;

            return (
              <div
                key={step.id}
                className={cn(
                  'flex flex-col items-center group',
                  isClickable && 'cursor-pointer'
                )}
                onClick={() => isClickable && onStepClick(step.id)}
              >
                <div
                  className={cn(
                    'relative w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 border-2 bg-background',
                    isCompleted && 'bg-primary border-primary text-primary-foreground shadow-md',
                    isCurrent && 'border-primary text-primary ring-4 ring-primary/15 scale-110 shadow-lg shadow-primary/20',
                    !isCompleted && !isCurrent && 'border-border text-muted-foreground',
                    isClickable && 'group-hover:border-primary/60'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 animate-scale-in" strokeWidth={3} />
                  ) : (
                    <span className={cn(isCurrent && 'animate-fade-in')}>{step.id}</span>
                  )}
                  {isCurrent && (
                    <span className="absolute -inset-1 rounded-full border-2 border-primary/30 animate-pulse" />
                  )}
                </div>

                <div className="mt-3 text-center min-h-[2.5rem]">
                  <p
                    className={cn(
                      'text-sm font-semibold transition-colors',
                      isCurrent && 'text-foreground',
                      isCompleted && 'text-foreground/80',
                      !isCurrent && !isCompleted && 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 hidden md:block max-w-[120px] leading-tight">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
