import { Zap, ShieldCheck, BarChart3, Clock } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Agilidade Total",
    description: "Reduza o tempo de aprovação de dias para horas com notificações automáticas.",
    // Estilo Laranja (Solicite)
    style: "bg-gradient-to-br from-orange-400 to-orange-500 shadow-orange-300/50",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Fiscal",
    description: "Garanta que nenhuma compra seja feita sem a classificação fiscal correta.",
    // Estilo Azul (Análise)
    style: "bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-300/50",
  },
  {
    icon: BarChart3,
    title: "Controle de Budget",
    description: "Bloqueios automáticos para requisições que excedem o orçamento do setor.",
    // Estilo Roxo (Cotação)
    style: "bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-300/50",
  },
  {
    icon: Clock,
    title: "Histórico Completo",
    description: "Rastreabilidade total de quem pediu, quem aprovou e quando chegou.",
    // Estilo Verde (Aprovação)
    style: "bg-gradient-to-br from-green-400 to-green-600 shadow-green-300/50",
  },
];

export const WorkflowTimeline = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-50/50 border-t border-slate-100">
      <div className="page-container">
        {/* Título da Seção */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold font-jakarta tracking-tight text-slate-900 mb-4">
            Por que centralizar suas compras?
          </h2>
          <p className="text-lg text-slate-600 font-medium font-jakarta">
            Mais eficiência e controle para sua operação.
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-[2rem] p-8 flex flex-col items-center text-center shadow-xl shadow-slate-200/40 border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60 animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Ícone Colorido com Gradiente e Sombra */}
                <div
                  className={`
                  flex items-center justify-center 
                  w-20 h-20 mb-6 rounded-full text-white shadow-lg 
                  transition-transform duration-300 group-hover:scale-110
                  ${item.style}
                `}
                >
                  <Icon size={36} strokeWidth={2} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-jakarta mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
