import { Header } from '@/components/layout/Header';
import { Logo } from '@/components/layout/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { UserGreeting, QuickStats, ActionCards, HowItWorks } from '@/components/home';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="page-container">
        {/* Hero Section */}
        <section className="py-10 md:py-16 text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <Logo size="xl" showText={false} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
            Madville
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium mb-2">
            Sistema de Requisições de Compras
          </p>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Governança e controle para suas solicitações de compras corporativas.
          </p>
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

        {/* Como Funciona */}
        <HowItWorks />

        {/* Footer */}
        <footer className="py-8 text-center border-t mt-8">
          <p className="text-muted-foreground text-sm">
            © 2025 Madville - Sistema de Requisições de Compras
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Versão 2.0 | Suporte:{' '}
            <a
              href="https://wa.me/5547992189824"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
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
