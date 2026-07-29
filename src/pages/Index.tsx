import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMarquee, UserGreeting, QuickStats, ActionCards } from "@/components/home";
import { HeroComposition } from "@/components/home/HeroComposition";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden font-sans selection:bg-primary/10 selection:text-primary">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-25%] right-[-12%] w-[720px] h-[720px] bg-primary/[0.035] rounded-full blur-3xl" />
        <div className="absolute bottom-[-30%] left-[-12%] w-[620px] h-[620px] bg-[hsl(var(--surface-3))]/70 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />

        <main>
          {/* HERO */}
          <section className="page-shell pt-16 sm:pt-24 pb-14 grid lg:grid-cols-[1fr_1.05fr] gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-7 px-2.5 py-1 rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-2))] text-[11px] font-medium tracking-[0.06em] text-tertiary-fg uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Procurement Intelligence
              </div>

              <h1 className="text-[2.5rem] sm:text-[3.25rem] font-semibold text-[hsl(var(--text-primary))] mb-6 tracking-[-0.035em] leading-[1.04]">
                Central inteligente<br />de compras.
              </h1>

              <p className="text-secondary-fg text-[16px] sm:text-[17px] leading-relaxed max-w-[30rem] mb-9">
                Mais controle, previsibilidade e inteligência operacional para sua cadeia de compras —
                decisões orientadas por dados em tempo real.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="group">
                  <Link to={user ? "/operacoes" : "/auth"}>
                    Abrir Command Center
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/painel">Ver requisições</Link>
                </Button>
              </div>
            </div>

            <HeroComposition />
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
