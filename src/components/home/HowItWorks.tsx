import { ClipboardList, Search, PackageCheck, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    title: 'Solicite',
    description: 'Preencha o formulário com os dados do item',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Search,
    title: 'Acompanhe',
    description: 'Sua requisição é analisada e cotada',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    icon: PackageCheck,
    title: 'Receba',
    description: 'Após aprovação, o item é entregue',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-12 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-center text-foreground mb-10">
        Como funciona
      </h2>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-center">
            <div className="flex flex-col items-center text-center group">
              <div
                className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
              >
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-[160px]">
                {step.description}
              </p>
            </div>
            
            {index < steps.length - 1 && (
              <div className="hidden md:flex items-center mx-8">
                <div className="w-12 h-px bg-border" />
                <ArrowRight className="w-4 h-4 text-muted-foreground/50 -ml-1" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
