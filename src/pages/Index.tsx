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

// --- TYPEWRITER (Mantido) ---
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
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-x-hidden font-sans">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      {/* Shapes de Fundo Sutis e Compactos */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl opacity-60"></div>
        <svg
          className="absolute top-[5%] left-[-2%] w-[200px] h-[200px] text-slate-100 rotate-12"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <path d="M 50 0 L 100 100 L 0 100 Z" />
        </svg>
      </div>

      <div className="relative z-10">
        <Header />

        <main className="max-w-[1280px] mx-auto px-6 md:px-8 pt-4 pb-12">
          {/* HERO SECTION - Mais compacta */}
          <section className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 mb-12 md:mb-16 min-h-[380px]">
            {/* Texto */}
            <div className="flex-1 text-center lg:text-left max-w-[500px]">
              <h1 className="font-jakarta text-[2.5rem] sm:text-4xl md:text-[2.75rem] leading-[1.1] font-extrabold text-[#0F172A] mb-4 tracking-tight">
                <div className="block min-h-[1.1em]">
                  <TypewriterEffect text="Portal de Solicitações" speed={40} hideCursorOnFinish={true} />
                </div>
                <div className="block min-h-[1.1em]">
                  <TypewriterEffect text="de Suprimentos." speed={40} initialDelay={1100} hideCursorOnFinish={false} />
                </div>
              </h1>

              <p
                className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-md mx-auto lg:mx-0 animate-fade-in opacity-0"
                style={{ animationDelay: "2s", animationFillMode: "forwards" }}
              >
                Centralize seus pedidos de compra em um único lugar. Mais agilidade, transparência e controle para sua
                gestão.
              </p>
            </div>

            {/* Diagrama - Agora perfeitamente ajustado */}
            <div
              className="flex-1 w-full flex justify-center lg:justify-end animate-fade-in opacity-0 scale-95 origin-right"
              style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
            >
              <HeroFlowDiagram />
            </div>
          </section>

          <div className="border-t border-slate-100 pt-6 mb-10">
            <LogoMarquee />
          </div>

          {user && (
            <section className="mb-10 animate-fade-in">
              <UserGreeting />
              <QuickStats />
            </section>
          )}

          <div className="mb-12">
            <ActionCards />
          </div>

          <WorkflowTimeline />

          <footer className="py-8 text-center mt-12 border-t border-slate-100">
            <p className="text-slate-500 text-xs font-semibold font-jakarta uppercase tracking-wide">
              © 2026 GMAD Madville | Curitiba
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;
