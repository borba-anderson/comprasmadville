import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import {
  UserGreeting,
  QuickStats,
  ActionCards,
  LogoMarquee,
  WorkflowTimeline,
  HeroFlowDiagram,
} from "@/components/home";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="page-container rounded-none shadow-none">
        {/* REDUZI O PADDING AQUI: de 'py-10 md:py-16' para 'pt-8 pb-10 md:pt-12 md:pb-12' */}
        {/* Isso puxa o título para cima */}
        <section className="pt-8 pb-10 md:pt-12 md:pb-12">
          {/* Ajustei o gap para aproximar mais as colunas */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-12">
            {/* Lado Esquerdo - Título e subtítulo */}
            <div className="text-center md:text-left flex-1 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-semibold tracking-tight text-foreground font-sans py-2 leading-snug">
                Workflow de Requisições
                <br />
                de Suprimentos<span className="text-primary">.</span>
              </h1>

              <p className="text-muted-foreground max-w-xl text-base md:text-lg font-thin mx-0 mb-4 md:text-left">
                Transforme solicitações internas em processos organizados, garantindo rastreabilidade e controle
                orçamentário.
              </p>
            </div>

            {/* Lado Direito - Fluxo Visual */}
            <div className="flex-shrink-0 animate-fade-in flex items-center justify-center w-full md:w-auto">
              <HeroFlowDiagram />
            </div>
          </div>

          {/* Logo Marquee */}
          <LogoMarquee />
        </section>

        {user && (
          <section className="animate-fade-in">
            <UserGreeting />
            <QuickStats />
          </section>
        )}

        <ActionCards />
        <WorkflowTimeline />

        <footer className="py-8 text-center border-t mt-8">
          <p className="text-muted-foreground text-sm">
            © 2026 GMAD Madville | Curitiba - Workflow de Requisições de Suprimentos
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Versão Beta 2.1 | Suporte:{" "}
            <a
              href="https://wa.me/5547992189824"
              target="_blank"
              rel="noopener noreferrer"
              className="text-info hover:underline font-medium"
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
