import { Zap, ShieldCheck, BarChart3, Clock } from "lucide-react";

export const WorkflowTimeline = () => {
  // O nome do componente continua WorkflowTimeline, mas o conteúdo é de Benefícios
  const features = [
    {
      icon: Zap,
      title: "Agilidade Total",
      desc: "Reduza o tempo de aprovação de dias para horas com notificações automáticas.",
    },
    {
      icon: ShieldCheck,
      title: "Compliance Fiscal",
      desc: "Garanta que nenhuma compra seja feita sem a classificação fiscal correta.",
    },
    {
      icon: BarChart3,
      title: "Controle de Budget",
      desc: "Bloqueios automáticos para requisições que excedem o orçamento do setor.",
    },
    {
      icon: Clock,
      title: "Histórico Completo",
      desc: "Rastreabilidade total de quem pediu, quem aprovou e quando chegou.",
    },
  ];

  return (
    <section className="py-16 border-t bg-slate-50/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Por que centralizar suas compras?</h2>
          <p className="text-muted-foreground mt-3 text-lg">Mais eficiência e controle para sua operação.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="p-4 rounded-full bg-primary/5 text-primary mb-5 group-hover:scale-110 transition-transform">
                <feature.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
