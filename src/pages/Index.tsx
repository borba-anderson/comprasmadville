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

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="page-container rounded-none shadow-none">
        {/* HERO SECTION */}
        <section className="pt-8 pb-12 md:pt-14 md:pb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-20">
            {/* Lado Esquerdo - Título e Texto */}
            <div className="text-center md:text-left flex-1 animate-fade-in">
              {/* AJUSTES DE ESTILO REALIZADOS:
                  - font-bold: Para dar o peso visual da imagem.
                  - tracking-tighter: Para juntar mais as letras (estilo moderno).
                  - leading-[1.1]: Espaçamento entre linhas personalizado e justo.
                  - text-5xl/6xl: Tamanho aumentado para impacto.
              */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-foreground font-sans mb-6 leading-[1.1]">
                Workflow de Solicitações
                <br className="hidden md:block" />
                de Suprimentos<span className="text-primary">.</span>
              </h1>

              {/* Subtítulo ajustado: removido 'font-thin', aumentado tamanho e peso para legibilidade */}
              <p className="text-muted-foreground/80 max-w-xl text-lg md:text-xl font-normal mx-auto md:mx-0 mb-8 leading-relaxed">
                Transforme pedidos internos em processos organizados, garantindo rastreabilidade e controle
                orçamentário.
              </p>
            </div>

            {/* Lado Direito - Hero Visual (Snake Layout) */}
            <div className="flex-shrink-0 animate-fade-in flex items-center justify-center w-full md:w-auto transform md:scale-95 lg:scale-100 transition-transform">
              <HeroFlowDiagram />
            </div>
          </div>

          {/* Faixa de Logos com mais espaço no topo */}
          <div className="mt-12 md:mt-16 border-t border-slate-100 pt-8">
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
          <p className="text-muted-foreground text-sm font-medium">
            © 2026 GMAD Madville | Curitiba - Workflow de Solicitações de Suprimentos
          </p>
          <p className="text-muted-foreground/60 text-xs mt-2">
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
