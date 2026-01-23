import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import {
  UserGreeting,
  QuickStats,
  ActionCards,
  LogoMarquee,
  HeroFlowDiagram,
  WorkflowTimeline,
} from "@/components/home";

// --- TYPEWRITER (Ajustado para evitar pulos de layout) ---
const TypewriterEffect = ({
  text,
  speed = 40,
  initialDelay = 0,
  className = "",
  hideCursorOnFinish = false,
}: {
  text: string;
  speed?: number;
  initialDelay?: number;
  className?: string;
  hideCursorOnFinish?: boolean;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setShowCursor(initialDelay === 0);

    const startTimeout = setTimeout(() => {
      setShowCursor(true);
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          if (hideCursorOnFinish) {
            setShowCursor(false);
          }
        }
      }, speed);

      return () => clearInterval(interval);
    }, initialDelay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, initialDelay, hideCursorOnFinish]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span className="ml-1 border-r-4 border-slate-900 animate-pulse inline-block align-middle h-[0.9em]">
          &nbsp;
        </span>
      )}
    </span>
  );
};

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-x-hidden font-sans selection:bg-blue-100">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      {/* Background Decorativo Sutil */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-slate-100/50 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="relative z-10">
        <Header />

        <main className="max-w-[1440px] mx-auto px-6 md:px-12 pt-8 pb-16">
          {/* HERO SECTION - Grid de 2 Colunas Balanceado */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20 md:mb-32 min-h-[500px]">
            {/* COLUNA ESQUERDA: Texto (5 colunas) */}
            <div className="lg:col-span-5 text-center lg:text-left relative z-10">
              <h1 className="font-jakarta text-[2.75rem] sm:text-5xl md:text-[3.5rem] leading-[1.1] font-extrabold text-[#0F172A] mb-6 tracking-tight">
                <div className="block min-h-[1.1em]">
                  <TypewriterEffect text="Portal de Solicitações" speed={40} hideCursorOnFinish={true} />
                </div>
                <div className="block min-h-[1.1em]">
                  <TypewriterEffect text="de Suprimentos." speed={40} initialDelay={1100} hideCursorOnFinish={false} />
                </div>
              </h1>

              <p
                className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 animate-fade-in opacity-0"
                style={{ animationDelay: "2s", animationFillMode: "forwards" }}
              >
                Centralize seus pedidos de compra em um único lugar. Mais agilidade, transparência e controle para sua
                gestão.
              </p>
            </div>

            {/* COLUNA DIREITA: Diagrama (7 colunas) */}
            <div
              className="lg:col-span-7 w-full flex justify-center lg:justify-end animate-fade-in opacity-0"
              style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
            >
              {/* Container do diagrama com padding para acomodar os itens flutuantes */}
              <div className="w-full max-w-[800px] pl-0 lg:pl-12">
                <HeroFlowDiagram />
              </div>
            </div>
          </section>

          <div className="border-t border-slate-200 pt-10 mb-16">
            <LogoMarquee />
          </div>

          {user && (
            <section className="mb-16 animate-fade-in">
              <UserGreeting />
              <QuickStats />
            </section>
          )}

          <div className="mb-20">
            <ActionCards />
          </div>

          <WorkflowTimeline />

          <footer className="py-10 text-center border-t border-slate-200 mt-20">
            <p className="text-slate-500 text-sm font-medium">© 2026 GMAD Madville | Curitiba</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;
