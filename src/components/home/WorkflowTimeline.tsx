import { 
  ClipboardList, 
  Search, 
  Calculator, 
  CheckCircle, 
  ShoppingCart, 
  PackageCheck,
  ArrowRight
} from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    number: 1,
    title: 'SOLICITE',
    description: 'Preencha o formulário com dados do item',
    color: 'text-info',
    bgColor: 'bg-info/10',
    borderColor: 'border-info/30',
  },
  {
    icon: Search,
    number: 2,
    title: 'ANÁLISE',
    description: 'Equipe de compras revisa a solicitação',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    icon: Calculator,
    number: 3,
    title: 'COTAÇÃO',
    description: 'Busca de fornecedores e melhores preços',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
  },
  {
    icon: CheckCircle,
    number: 4,
    title: 'APROVAÇÃO',
    description: 'Validação pela gestão (se necessário)',
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
  },
  {
    icon: ShoppingCart,
    number: 5,
    title: 'COMPRA',
    description: 'Pedido realizado com fornecedor',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
  },
  {
    icon: PackageCheck,
    number: 6,
    title: 'ENTREGA',
    description: 'Item recebido e confirmado',
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
  },
];

export const WorkflowTimeline = () => {
  return (
    <section className="py-16 max-w-6xl mx-auto px-4">
      <h2 className="text-xl font-semibold text-center text-foreground mb-12 animate-fade-in">
        Como funciona
      </h2>
      
      {/* Desktop: Horizontal Timeline */}
      <div className="hidden md:flex items-start justify-center gap-2">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-start">
            <div
              className={`flex flex-col items-center text-center group animate-stagger-${index + 1}`}
            >
              {/* Ícone com número */}
              <div className="relative mb-4">
                <div
                  className={`w-20 h-20 ${step.bgColor} ${step.borderColor} border-2 rounded-2xl flex items-center justify-center 
                    transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg cursor-pointer`}
                >
                  <step.icon className={`w-8 h-8 ${step.color} animate-float`} style={{ animationDelay: `${index * 0.2}s` }} />
                </div>
                {/* Número da etapa */}
                <div 
                  className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${step.bgColor} ${step.borderColor} border-2 
                    flex items-center justify-center text-xs font-bold ${step.color}`}
                >
                  {step.number}
                </div>
              </div>
              
              {/* Título */}
              <h3 className={`font-bold ${step.color} mb-1 text-xs tracking-wide`}>
                {step.title}
              </h3>
              
              {/* Descrição */}
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[120px]">
                {step.description}
              </p>
            </div>
            
            {/* Seta entre etapas */}
            {index < steps.length - 1 && (
              <div className="flex items-center pt-7 px-1">
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: Vertical Timeline */}
      <div className="md:hidden space-y-6">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`flex items-start gap-4 animate-stagger-${index + 1}`}
          >
            {/* Linha vertical e ícone */}
            <div className="flex flex-col items-center">
              <div
                className={`w-14 h-14 ${step.bgColor} ${step.borderColor} border-2 rounded-xl flex items-center justify-center 
                  transition-all duration-300 hover:scale-110`}
              >
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>
              {index < steps.length - 1 && (
                <div className="w-0.5 h-8 bg-gradient-to-b from-border to-transparent mt-2" />
              )}
            </div>
            
            {/* Conteúdo */}
            <div className="flex-1 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold ${step.color} ${step.bgColor} px-2 py-0.5 rounded-full`}>
                  {step.number}
                </span>
                <h3 className={`font-bold ${step.color} text-sm`}>
                  {step.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
