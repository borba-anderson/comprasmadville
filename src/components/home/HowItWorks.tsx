import { Zap, ShieldCheck, BarChart3, Clock } from "lucide-react";

export const FeaturesGrid = () => {
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
    <section className="py-12 border-t bg-slate-50/50">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-foreground">Por que centralizar suas compras?</h2>
        <p className="text-muted-foreground text-sm mt-2">Mais eficiência para sua operação.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border shadow-sm hover:border-primary/20 transition-colors"
          >
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
              <feature.icon size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
