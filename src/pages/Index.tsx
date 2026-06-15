import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { LogoMarquee, UserGreeting, QuickStats, ActionCards } from "@/components/home";
import { HeroComposition } from "@/components/home/HeroComposition";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-success/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] bg-slate-100/60 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="max-w-[1280px] mx-auto">
          {/* HERO */}
          <section className="px-6 md:px-12 pt-12 sm:pt-20 pb-10 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-success/[0.08] border border-success/15 text-[11px] font-semibold tracking-[0.12em] text-success uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Procurement Intelligence
              </div>

              <h1 className="font-jakarta text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] font-bold text-slate-900 mb-6 tracking-[-0.025em] leading-[1.05]">
                Central inteligente<br />de compras.
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
                Mais controle, previsibilidade e inteligência operacional para sua cadeia de compras —
                decisões orientadas por dados em tempo real.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={user ? "/operacoes" : "/auth"}>
                  <button className="group bg-success hover:bg-success/90 text-white text-sm font-semibold px-6 py-3.5 rounded-full shadow-sm transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                    Abrir Command Center
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
                <Link to="/painel">
                  <button className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold px-6 py-3.5 rounded-full transition-all hover:bg-slate-50 w-full sm:w-auto">
                    Ver requisições
                  </button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center group [perspective:1200px]">
              <img
                src={heroDashboard}
                alt="Dashboards do sistema"
                width={1280}
                height={960}
                className="w-full max-w-[640px] h-auto transition-all duration-700 ease-out will-change-transform
                  group-hover:scale-[1.04] group-hover:-translate-y-2
                  group-hover:[transform:perspective(1200px)_rotateX(2deg)_rotateY(-6deg)_scale(1.04)]
                  drop-shadow-[0_25px_45px_rgba(15,23,42,0.18)]
                  group-hover:drop-shadow-[0_35px_60px_rgba(0,134,81,0.25)]"
              />
            </div>
          </section>

          {/* LOGO MARQUEE */}
          <LogoMarquee />

          {/* GREETING + STATS */}
          <section className="px-6 md:px-12 pt-14 pb-6">
            <UserGreeting />
            <QuickStats />
          </section>

          {/* ACTION CARDS */}
          <section className="px-6 md:px-12 pb-16">
            <ActionCards />
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
