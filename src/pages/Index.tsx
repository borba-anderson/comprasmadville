import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      {/* Background sutil */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-success/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] bg-slate-100/60 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="max-w-[1280px] mx-auto">
          {/* HERO EXECUTIVO */}
          <section className="px-6 md:px-12 pt-16 sm:pt-24 pb-12 sm:pb-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-success/[0.08] border border-success/15 text-[11px] font-semibold tracking-[0.12em] text-success uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Procurement Intelligence
              </div>

              <h1 className="font-jakarta text-[2.25rem] sm:text-[3rem] lg:text-[3.75rem] font-semibold text-slate-900 mb-6 tracking-[-0.025em] leading-[1.05]">
                Central estratégica<br />
                <span className="text-slate-500">de compras e decisões operacionais.</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mb-10">
                Visibilidade executiva, alertas inteligentes e ações priorizadas — para a sua cadeia de
                compras operar com previsibilidade, controle e velocidade.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={user ? "/operacoes" : "/auth"}>
                  <button className="group bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-6 py-3.5 rounded-lg shadow-sm transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                    Abrir Command Center
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
                <Link to="/painel">
                  <button className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold px-6 py-3.5 rounded-lg transition-all hover:bg-slate-50 w-full sm:w-auto">
                    Ver requisições
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* RESUMO EXECUTIVO — 4 PILARES */}
          <section className="px-6 md:px-12 pb-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
              {[
                {
                  eyebrow: "Operação",
                  title: "Decisões priorizadas",
                  desc: "Veja o que destrava a cadeia agora — com impacto financeiro e ação rápida.",
                },
                {
                  eyebrow: "Inteligência",
                  title: "Insights de IA contextuais",
                  desc: "Detecção automática de riscos, anomalias e oportunidades de economia.",
                },
                {
                  eyebrow: "Performance",
                  title: "KPIs executivos",
                  desc: "Gasto, economia, SLA e gargalos consolidados em uma única visão.",
                },
                {
                  eyebrow: "Velocidade",
                  title: "Ações em 1 clique",
                  desc: "Aprovar, acionar fornecedor, confirmar entrega — sem trocar de tela.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 sm:p-8">
                  <div className="eyebrow text-[10px] tracking-[0.14em] text-slate-400 mb-3">
                    {item.eyebrow}
                  </div>
                  <h3 className="font-jakarta text-[15px] font-semibold text-slate-900 mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA SECUNDÁRIO */}
          <section className="px-6 md:px-12 pb-20">
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-8 sm:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(156_100%_40%/0.15),transparent_60%)]" />
              <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-1.5 mb-4 text-[11px] font-semibold tracking-[0.12em] text-emerald-300 uppercase">
                    <Sparkles size={12} />
                    IA Operacional
                  </div>
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-semibold text-white mb-3 tracking-tight">
                    Pare de olhar relatórios.<br />Comece a tomar decisões.
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    O Command Center prioriza o que importa: atrasos críticos, fornecedores em risco
                    e oportunidades de economia — com ação imediata.
                  </p>
                </div>
                <Link to={user ? "/operacoes" : "/auth"} className="flex-shrink-0">
                  <button className="bg-white text-slate-900 text-sm font-semibold px-5 py-3 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2">
                    Abrir agora
                    <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </div>
          </section>

          <footer className="py-10 text-center border-t border-slate-100 px-4">
            <p className="text-slate-500 text-xs font-medium">
              © 2026 GMAD Madville | Curitiba — Central de Compras
            </p>
            <p className="text-slate-400 text-[11px] mt-2">
              Versão Beta 2.1 · Suporte:{" "}
              <a
                href="https://wa.me/5547992189824"
                target="_blank"
                rel="noopener noreferrer"
                className="text-success hover:underline font-semibold"
              >
                WhatsApp
              </a>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;
