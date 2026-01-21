import { Header } from '@/components/layout/Header';
import { Logo } from '@/components/layout/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { UserGreeting, QuickStats, ActionCards, HowItWorks } from '@/components/home';
const Index = () => {
  const {
    user
  } = useAuth();
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main className="page-container shadow-xl rounded-none border-0 border-none">
        {/* Hero Section */}
        <section className="py-10 md:py-16 text-center animate-fade-in border rounded-2xl">
          <div className="mb-6 flex-row flex items-center justify-center gap-0 border-0">
            <Logo size="xl" showText={false} />
          </div>
          <h1 className="text-3xl mb-3 tracking-tight font-sans text-primary font-bold text-center md:text-4xl bg-[status-em-analise] py-[8px] bg-info-foreground">CENTRAL DE REQUISIÇÕES DE COMPRAS</h1>
          
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">Sistema de controle para suas solicitações de compras corporativas. </p>
        </section>

        {/* User Context (quando logado) */}
        {user && <section className="animate-fade-in">
            <UserGreeting />
            <QuickStats />
          </section>}

        {/* Action Cards */}
        <ActionCards />

        {/* Como Funciona */}
        <HowItWorks />

        {/* Footer */}
        <footer className="py-8 text-center border-t mt-8">
          <p className="text-muted-foreground text-sm">© 2026 GMAD Madville | Curitiba - Sistema de Requisições de Compras</p>
          <p className="text-muted-foreground text-xs mt-2">
            Versão 2.0 | Suporte:{' '}
            <a href="https://wa.me/5547992189824" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
              WhatsApp
            </a>
          </p>
        </footer>
      </main>
    </div>;
};
export default Index;