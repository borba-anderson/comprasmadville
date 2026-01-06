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
  return (
    <div className="relative">
      {/* Progress bar background */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
      
      {/* Progress bar fill */}
      <div 
        className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 ease-out"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />
      
      <div className="relative flex justify-between">
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = onStepClick && (isCompleted || step.id <= currentStep);
          
          return (
            <div 
              key={step.id}
              className={cn(
                "flex flex-col items-center",
                isClickable && "cursor-pointer group"
              )}
              onClick={() => isClickable && onStepClick(step.id)}
            >
              {/* Step circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 border-2",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isCurrent && "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted && !isCurrent && "bg-background border-border text-muted-foreground",
                  isClickable && !isCurrent && "group-hover:border-primary/50"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              
              {/* Step label */}
              <div className="mt-3 text-center">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  (isCurrent || isCompleted) ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block max-w-[100px]">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
