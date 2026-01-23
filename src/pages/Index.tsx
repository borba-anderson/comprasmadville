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

      {/* Shapes de Fundo Sutis */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-bl from-blue-50/50 to-transparent opacity-60"></div>
        {/* Triângulo sutil */}
        <svg
          className="absolute top-[10%] left-[-2%] w-[300px] h-[300px] text-slate-100 rotate-12"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <path d="M 50 0 L 100 100 L 0 100 Z" />
        </svg>
      </div>

      <div className="relative z-10">
        <Header />

        <main className="max-w-[1440px] mx-auto px-6 md:px-12 pt-10 pb-16">
          {/* HERO SECTION */}
          <section className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 mb-20 md:mb-32">
            {/* Texto */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="font-jakarta text-[2.5rem] sm:text-5xl md:text-[3.5rem] leading-[1.1] font-extrabold text-[#0F172A] mb-6 tracking-tight">
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

            {/* Diagrama */}
            <div
              className="flex-1 w-full flex justify-center lg:justify-end animate-fade-in opacity-0"
              style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
            >
              <HeroFlowDiagram />
            </div>
          </section>

          <div className="border-t border-slate-100 pt-10 mb-16">
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

          {/* FOOTER CORRIGIDO - Estilo limpo e texto correto */}
          <footer className="py-12 text-center mt-20 border-t border-slate-100">
            <p className="text-slate-500 text-sm font-semibold font-jakarta">
              © 2026 GMAD Madville | Curitiba - Portal de Solicitações de Suprimentos
            </p>
            <p className="text-slate-400 text-xs mt-2 font-medium font-jakarta">
              Versão Beta 2.1 | Suporte:{" "}
              <a href="https://wa.me/5547992189824" className="hover:text-[#107c50] transition-colors">
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
