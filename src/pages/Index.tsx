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

// --- COMPONENTE: TYPEWRITER (Mantido) ---
const TypewriterEffect = ({
  text,
  speed = 50,
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
        <span className="ml-1 border-r-4 border-primary animate-pulse inline-block align-middle h-[0.8em]">&nbsp;</span>
      )}
    </span>
  );
};
// ---------------------------------------------

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      {/* --- FUNDO GEOMÉTRICO (Igual à referência) --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Triângulo/Seta Esquerda (Atrás do Texto) */}
        <svg
          className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] text-slate-200/50 rotate-12"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M 40 150 L 100 50 L 160 150 Z" /> {/* Triângulo grande */}
        </svg>

        {/* Círculo/Forma Direita (Atrás do Diagrama) */}
        <svg
          className="absolute top-[5%] right-[-10%] w-[600px] h-[600px] text-blue-100/40"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <circle cx="100" cy="100" r="80" />
        </svg>

        {/* Triângulo Pequeno Flutuante */}
        <svg
          className="absolute top-[40%] left-[45%] w-16 h-16 text-slate-300/60 animate-bounce"
          style={{ animationDuration: "3s" }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M 12 4 L 20 18 L 4 18 Z" />
        </svg>
      </div>

      <div className="relative z-10">
        {" "}
        {/* Conteúdo acima do fundo */}
        <Header />
        <main className="page-container rounded-none shadow-none bg-transparent">
          {/* HERO SECTION */}
          <section className="pt-8 pb-12 md:pt-14 md:pb-20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
              {/* Lado Esquerdo - Texto */}
              <div className="text-center lg:text-left flex-1 max-w-2xl">
                <h1 className="font-jakarta text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 mb-6 leading-[1.1] min-h-[2.4em] md:min-h-[auto]">
                  <TypewriterEffect text="Portal de Solicitações" speed={50} hideCursorOnFinish={true} />
                  <br className="hidden md:block" />
                  <TypewriterEffect
                    text="de Suprimentos."
                    speed={50}
                    initialDelay={1150}
                    className="text-[#107c50]" // Verde da marca
                    hideCursorOnFinish={false}
                  />
                </h1>

                <p
                  className="text-slate-600 max-w-xl text-lg md:text-xl font-medium mx-auto lg:mx-0 mb-8 leading-relaxed font-jakarta animate-fade-in"
                  style={{ animationDelay: "2.5s" }}
                >
                  Centralize seus pedidos de compra em um único lugar. Mais agilidade, transparência e controle para sua
                  gestão.
                </p>
              </div>

              {/* Lado Direito - Diagrama Complexo */}
              <div
                className="flex-shrink-0 animate-fade-in w-full lg:w-auto flex justify-center lg:justify-end"
                style={{ animationDelay: "0.5s" }}
              >
                <HeroFlowDiagram />
              </div>
            </div>

            <div
              className="mt-12 md:mt-16 border-t border-slate-200/60 pt-8 animate-fade-in"
              style={{ animationDelay: "0.8s" }}
            >
              <LogoMarquee />
            </div>
          </section>

          {user && (
            <section className="animate-fade-in mb-8">
              <UserGreeting />
              <QuickStats />
            </section>
          )}

          <div className="mb-16">
            <ActionCards />
          </div>

          <WorkflowTimeline />

          <footer className="py-10 text-center border-t border-slate-200 bg-white/50 mt-12 backdrop-blur-sm">
            <p className="text-slate-500 text-sm font-medium font-jakarta">
              © 2026 GMAD Madville | Curitiba - Portal de Solicitações de Suprimentos
            </p>
            <p className="text-slate-400 text-xs mt-2 font-jakarta">
              Versão Beta 2.1 | Suporte:{" "}
              <a
                href="https://wa.me/5547992189824"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#107c50] hover:underline font-bold transition-colors"
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
