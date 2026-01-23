import { ClipboardList, Search, Calculator, CheckCircle2, ShoppingCart, PackageCheck } from "lucide-react";

export const HeroFlowDiagram = () => {
  const steps = [
    {
      id: "1",
      icon: ClipboardList,
      title: "Solicite",
      desc: "Preencha o formulário.",
      // Laranja (Igual img)
      colors: "bg-orange-50 text-orange-600 border-orange-200 badge-bg:bg-orange-100",
    },
    {
      id: "2",
      icon: Search,
      title: "Análise",
      desc: "Revisão da compra.",
      // Azul (Igual img)
      colors: "bg-blue-50 text-blue-600 border-blue-200 badge-bg:bg-blue-100",
    },
    {
      id: "3",
      icon: Calculator,
      title: "Cotação",
      desc: "Busca de preços.",
      // Roxo (Igual img)
      colors: "bg-purple-50 text-purple-600 border-purple-200 badge-bg:bg-purple-100",
    },
    {
      id: "4",
      icon: CheckCircle2,
      title: "Aprovação",
      desc: "Validação da gestão.",
      // Verde (Igual img)
      colors: "bg-green-50 text-green-600 border-green-200 badge-bg:bg-green-100",
    },
    {
      id: "5",
      icon: ShoppingCart,
      title: "Compra",
      desc: "Pedido ao fornecedor.",
      // Ciano (Igual img)
      colors: "bg-cyan-50 text-cyan-600 border-cyan-200 badge-bg:bg-cyan-100",
    },
    {
      id: "6",
      icon: PackageCheck,
      title: "Entrega",
      desc: "Recebimento fiscal.",
      // Esmeralda (Igual img)
      colors: "bg-emerald-50 text-emerald-600 border-emerald-200 badge-bg:bg-emerald-100",
    },
  ];

  return (
    <div className="w-full max-w-[420px]">
      {/* Grid 2x3 Compacto */}
      <div className="grid grid-cols-2 gap-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            {/* Ícone com Badge Numérico estilo 'Como Funciona' */}
            <div
              className={`relative flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl border ${step.colors} bg-opacity-40`}
            >
              <step.icon size={22} strokeWidth={2} />

              {/* Badge com Número Flutuante */}
              <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-white border shadow-sm text-[10px] font-bold text-muted-foreground">
                {step.id}
              </div>
            </div>

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-foreground leading-tight mb-0.5">{step.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-tight truncate">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
