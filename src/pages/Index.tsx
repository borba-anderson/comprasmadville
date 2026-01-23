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

// --- COMPONENTE AJUSTADO: CURSOR COM REMOÇÃO FÍSICA ---
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
  const [showCursor, setShowCursor] = useState(false); // Começa invisível por padrão

  useEffect(() => {
    // Reseta estado se os props mudarem
    setDisplayedText("");
    setShowCursor(initialDelay === 0);

    const startTimeout = setTimeout(() => {
      setShowCursor(true); // Garante que o cursor apareça ao começar
      let currentIndex = 0;

      const interval = setInterval(() => {
        // Usamos slice para evitar erros de concatenação
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          // Se for a primeira linha, remove o cursor IMEDIATAMENTE ao acabar
          if (hideCursorOnFinish) {
            setShowCursor(false);
          }
        }
      }, speed);

      return () => clearInterval(interval);
    }, initialDelay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, initialDelay, hideCursorOnFinish]);

  // Renderização condicional estrita: Se showCursor for false, o span nem é renderizado no DOM
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

  // AJUSTE FINO DO TEMPO:
  // "Portal de Solicitações" tem 22 caracteres.
  // Loop vai de 0 a 22 (23 passos).
  // 23 passos * 50ms = 1150ms.
  // O atraso da segunda linha deve ser EXATAMENTE 1150ms.

  return (
    <div className="min-h-screen bg-background">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          
          .font-jakarta {
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
        `}
      </style>

      <Header />

      <main className="page-container rounded-none shadow-none">
        {/* HERO SECTION */}
        <section className="pt-8 pb-12 md:pt-14 md:pb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-20">
            {/* Lado Esquerdo */}
            <div className="text-center md:text-left flex-1">
              <h1 className="font-jakarta text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-foreground mb-6 leading-[1.1] min-h-[2.4em] md:min-h-[auto]">
                {/* LINHA 1 */}
                <TypewriterEffect
                  text="Portal de Solicitações"
                  speed={50}
                  hideCursorOnFinish={true} // Cursor morre aqui
                />

                <br className="hidden md:block" />

                {/* LINHA 2 */}
                <TypewriterEffect
                  text="de Suprimentos."
                  speed={50}
                  initialDelay={1150} // Sincronia perfeita para pegar o bastão
                  className="text-primary"
                  hideCursorOnFinish={false} // Cursor fica piscando no final da frase
                />
              </h1>

              <p
                className="text-muted-foreground/80 max-w-xl text-lg md:text-xl font-normal mx-auto md:mx-0 mb-8 leading-relaxed font-jakarta animate-fade-in"
                style={{ animationDelay: "2.5s" }}
              >
                Centralize seus pedidos de compra em um único lugar. Mais agilidade, transparência e controle para sua
                gestão.
              </p>
            </div>

            {/* Lado Direito */}
            <div
              className="flex-shrink-0 animate-fade-in flex items-center justify-center w-full md:w-auto transform md:scale-95 lg:scale-100 transition-transform"
              style={{ animationDelay: "0.5s" }}
            >
              <HeroFlowDiagram />
            </div>
          </div>

          <div
            className="mt-12 md:mt-16 border-t border-slate-100 pt-8 animate-fade-in"
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

        <footer className="py-10 text-center border-t bg-slate-50/50 mt-12">
          <p className="text-muted-foreground text-sm font-medium font-jakarta">
            © 2026 GMAD Madville | Curitiba - Portal de Solicitações de Suprimentos
          </p>
          <p className="text-muted-foreground/60 text-xs mt-2 font-jakarta">
            Versão Beta 2.1 | Suporte:{" "}
            <a
              href="https://wa.me/5547992189824"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold transition-colors"
            >
              WhatsApp
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
