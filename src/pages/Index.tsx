import { Header } from '@/components/layout/Header';
import { Logo } from '@/components/layout/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserGreeting, 
  QuickStats, 
  ActionCards, 
  LogoMarquee, 
  WorkflowTimeline 
} from '@/components/home';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="page-container rounded-2xl shadow">
        {/* Hero Section - Com logo GMAD */}
        <section className="py-10 md:py-16 text-center">
          {/* Logo GMAD centralizada */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <Logo size="2xl" showText={false} />
          </div>
          
          {/* Badge/Pill no topo */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-primary/10 border border-primary/20 rounded-full animate-fade-in">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-primary">Sistema Corporativo GMAD</span>
          </div>

          {/* Título principal - estilo limpo */}
          <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground animate-fade-in">
            Central de Requisições
            <span className="block text-primary">de Compras.</span>
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg animate-stagger-1">
            Gerencie suas solicitações de compras corporativas de forma simples, rápida e eficiente.
          </p>
          
          {/* Logo Marquee - Única faixa */}
          <LogoMarquee />
        </section>

        {/* User Context (quando logado) */}
        {user && (
          <section className="animate-fade-in">
            <UserGreeting />
            <QuickStats />
          </section>
        )}

        {/* Action Cards */}
        <ActionCards />

        {/* Workflow Timeline - Substitui HowItWorks */}
        <WorkflowTimeline />

        {/* Footer */}
        <footer className="py-8 text-center border-t mt-8">
          <p className="text-muted-foreground text-sm">
            © 2026 GMAD Madville | Curitiba - Sistema de Requisições de Compras
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Versão 2.0 | Suporte:{' '}
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
