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

// --- COMPONENTE AJUSTADO: CURSOR INTELIGENTE ---
const TypewriterEffect = ({
  text,
  speed = 50,
  initialDelay = 0,
  className = "",
  hideCursorOnFinish = false, // Nova propriedade para controlar o sumiço do cursor
}: {
  text: string;
  speed?: number;
  initialDelay?: number;
  className?: string;
  hideCursorOnFinish?: boolean;
}) => {
  const [displayedText, setDisplayedText] = useState("");

  // O cursor só deve aparecer se NÃO houver atraso inicial, ou quando o atraso acabar
  const [showCursor, setShowCursor] = useState(initialDelay === 0);

  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;

    const startTimeout = setTimeout(() => {
      setShowCursor(true); // Mostra o cursor quando começa a digitar a linha

      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          currentText += text[currentIndex];
          setDisplayedText(currentText);
          currentIndex++;
        } else {
          clearInterval(interval);
          // Se for a primeira linha, esconde o cursor ao terminar para passar para a próxima
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
      {/* O cursor agora obedece ao estado showCursor */}
      <span className={`ml-1 border-r-4 border-primary animate-pulse ${showCursor ? "opacity-100" : "opacity-0"}`}>
        &nbsp;
      </span>
    </span>
  );
};
// ---------------------------------------------

const Index = () => {
  const { user } = useAuth();

  // CÁLCULO DO TEMPO:
  // "Portal de Solicitações" tem 22 caracteres.
  // 22 chars * 50ms = 1100ms de duração.
  // Então o segundo texto deve começar exatamente aos 1100ms.

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
                  hideCursorOnFinish={true} // Oculta o cursor ao terminar
                />

                <br className="hidden md:block" />

                {/* LINHA 2 */}
                <TypewriterEffect
                  text="de Suprimentos."
                  speed={50}
                  initialDelay={1100} // Sincronia exata (22 letras * 50ms)
                  className="text-primary"
                  hideCursorOnFinish={false} // Mantém o cursor piscando no final
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
