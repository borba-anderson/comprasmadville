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
          
          <h1 className="inline-block px-6 py-3 mb-4 text-2xl md:text-3xl lg:text-4xl tracking-wide font-serif text-white font-bold bg-gradient-to-r from-primary to-orange-600 rounded-lg shadow-lg animate-fade-in">
            Central de Requisições de Compras
          </h1>
          
          <p className="text-muted-foreground max-w-xl mx-auto text-sm animate-stagger-1">
            Sistema de controle para suas solicitações de compras corporativas.
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
