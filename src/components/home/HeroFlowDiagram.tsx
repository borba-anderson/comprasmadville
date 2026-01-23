import { FileText, UserCheck, Search, ShieldCheck, Truck, Database } from "lucide-react";

export const HeroFlowDiagram = () => {
  const steps = [
    {
      id: "01",
      icon: FileText,
      title: "Solicitação",
      desc: "Registro da necessidade.",
      color: "text-blue-600",
      bg: "bg-blue-50 hover:bg-blue-100",
      border: "border-blue-100",
    },
    {
      id: "02",
      icon: UserCheck,
      title: "Validação",
      desc: "Revisão do gestor.",
      color: "text-indigo-600",
      bg: "bg-indigo-50 hover:bg-indigo-100",
      border: "border-indigo-100",
    },
    {
      id: "03",
      icon: Search,
      title: "Análise",
      desc: "Cotação e fornecedores.",
      color: "text-purple-600",
      bg: "bg-purple-50 hover:bg-purple-100",
      border: "border-purple-100",
    },
    {
      id: "04",
      icon: ShieldCheck,
      title: "Aprovação",
      desc: "Autorização final.",
      color: "text-amber-600",
      bg: "bg-amber-50 hover:bg-amber-100",
      border: "border-amber-100",
    },
    {
      id: "05",
      icon: Truck,
      title: "Atendimento",
      desc: "Aquisição e entrega.",
      color: "text-emerald-600",
      bg: "bg-emerald-50 hover:bg-emerald-100",
      border: "border-emerald-100",
    },
    {
      id: "06",
      icon: Database,
      title: "Registro",
      desc: "Estoque e fiscal.",
      color: "text-slate-600",
      bg: "bg-slate-50 hover:bg-slate-100",
      border: "border-slate-100",
    },
  ];

  return (
    // Container principal: Card com efeito 'Glass' e sombra suave
    <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[400px]">
      {/* GRID LAYOUT: 2 Colunas (Compacto) */}
      <div className="grid grid-cols-2 gap-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`
              relative flex flex-col p-3 rounded-xl border transition-all duration-300
              ${step.bg} ${step.border} group cursor-default
            `}
          >
            {/* Cabeçalho do Card: Ícone e Número */}
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-lg bg-white shadow-sm ${step.color}`}>
                <step.icon size={16} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-bold opacity-40 font-mono tracking-tighter">{step.id}</span>
            </div>

            {/* Textos compactos */}
            <div>
              <h3 className="font-bold text-sm text-foreground leading-tight mb-0.5">{step.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-tight line-clamp-2">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
