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
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden font-sans">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
          body { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      {/* --- FUNDO GEOMÉTRICO (Igual à referência visual) --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent"></div>

        {/* Triângulo Esquerda */}
        <svg
          className="absolute top-[15%] left-[-5%] w-[400px] h-[400px] text-slate-200/60 rotate-12 opacity-70"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M 40 150 L 100 50 L 160 150 Z" />
        </svg>

        {/* Círculo Direita */}
        <svg
          className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] text-blue-50/80 opacity-60"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <circle cx="100" cy="100" r="80" />
        </svg>

        {/* Elementos flutuantes */}
        <svg
          className="absolute top-[45%] left-[40%] w-12 h-12 text-slate-300/50 animate-bounce"
          style={{ animationDuration: "4s" }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M 12 4 L 20 18 L 4 18 Z" />
        </svg>
      </div>

      <div className="relative z-10">
        <Header />

        <main className="page-container rounded-none shadow-none bg-transparent px-4 md:px-8 max-w-7xl mx-auto">
          {/* HERO SECTION */}
          <section className="pt-12 pb-16 md:pt-20 md:pb-28">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
              {/* Lado Esquerdo - Título Original */}
              <div className="text-center lg:text-left flex-1 max-w-xl relative z-10">
                <h1 className="font-jakarta text-4xl sm:text-5xl md:text-[3.5rem] font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.15] min-h-[2.4em] md:min-h-[auto]">
                  {/* Linha 1 */}
                  <TypewriterEffect text="Portal de Solicitações" speed={50} hideCursorOnFinish={true} />
                  <br className="hidden md:block" />

                  {/* Linha 2 - Verde */}
                  <TypewriterEffect
                    text="de Suprimentos."
                    speed={50}
                    initialDelay={1150}
                    className="text-[#107c50]"
                    hideCursorOnFinish={false}
                  />
                </h1>

                <p
                  className="text-slate-600 text-lg md:text-xl font-medium mb-8 leading-relaxed font-jakarta animate-fade-in"
                  style={{ animationDelay: "2.5s" }}
                >
                  Centralize seus pedidos de compra em um único lugar. Mais agilidade, transparência e controle para sua
                  gestão.
                </p>
              </div>

              {/* Lado Direito - Diagrama Estilo Imagem */}
              <div
                className="flex-shrink-0 animate-fade-in w-full lg:w-auto flex justify-center lg:justify-end relative z-20"
                style={{ animationDelay: "0.5s" }}
              >
                <HeroFlowDiagram />
              </div>
            </div>

            <div
              className="mt-16 md:mt-20 border-t border-slate-200/60 pt-10 animate-fade-in"
              style={{ animationDelay: "0.8s" }}
            >
              <LogoMarquee />
            </div>
          </section>

          {user && (
            <section className="animate-fade-in mb-12">
              <UserGreeting />
              <QuickStats />
            </section>
          )}

          <div className="mb-20">
            <ActionCards />
          </div>

          <WorkflowTimeline />

          <footer className="py-12 text-center border-t border-slate-200 bg-white/60 mt-16 backdrop-blur-md rounded-t-3xl">
            <p className="text-slate-500 text-sm font-medium font-jakarta">
              © 2026 GMAD Madville | Curitiba - Portal de Solicitações de Suprimentos
            </p>
            <p className="text-slate-400 text-xs mt-3 font-jakarta">
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
