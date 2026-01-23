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
        {/* ESPAÇAMENTO REDUZIDO: de 'py-10' para 'pt-6 pb-12' */}
        {/* Isso aproxima o título do Header conforme solicitado */}
        <section className="pt-6 pb-12 md:pt-10 md:pb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 lg:gap-16">
            {/* Lado Esquerdo - Título */}
            <div className="text-center md:text-left flex-1 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-semibold tracking-tight text-foreground font-sans py-2 leading-snug">
                Workflow de Requisições
                <br />
                de Suprimentos<span className="text-primary">.</span>
              </h1>

              <p className="text-muted-foreground max-w-xl text-base md:text-lg font-thin mx-0 mb-6 md:text-left">
                Transforme solicitações internas em processos organizados, garantindo rastreabilidade e controle
                orçamentário.
              </p>
            </div>

            {/* Lado Direito - Novo Hero com visual do 'Como Funciona' */}
            <div className="flex-shrink-0 animate-fade-in flex items-center justify-center w-full md:w-auto">
              <HeroFlowDiagram />
            </div>
          </div>

          <LogoMarquee />
        </section>

        {user && (
          <section className="animate-fade-in mb-8">
            <UserGreeting />
            <QuickStats />
          </section>
        )}

        <div className="mb-12">
          <ActionCards />
        </div>

        {/* SUBSTITUIÇÃO: Sai Timeline, Entra Benefícios */}
        <FeaturesGrid />

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
