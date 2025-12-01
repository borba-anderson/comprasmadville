import { Link } from 'react-router-dom';
import { FileText, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Logo } from '@/components/layout/Logo';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <Header />
      
      <main className="page-container">
        {/* Hero Section */}
        <section className="py-12 md:py-20 text-center animate-fade-in">
          <div className="flex justify-center mb-8">
            <Logo size="xl" showText={false} />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4">
            Madville
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-8">
            Sistema de Requisições de Compras
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Solicite materiais, equipamentos e serviços de forma rápida e organizada.
            Acompanhe suas requisições em tempo real.
          </p>
        </section>

        {/* Cards Section */}
        <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card: Fazer Requisição */}
          <Link to="/requisicao" className="group">
            <div className="bg-card rounded-2xl shadow-lg border p-8 h-full card-hover">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <FileText className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-3">
                Fazer Requisição
              </h3>
              <p className="text-muted-foreground mb-6">
                Envie sua solicitação de compra de forma rápida e simples. 
                Não é necessário login.
              </p>
              <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all">
                Acessar formulário
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card: Painel Admin */}
          <Link to="/auth" className="group">
            <div className="bg-card rounded-2xl shadow-lg border p-8 h-full card-hover">
              <div className="w-16 h-16 bg-info/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-info transition-colors">
                <Shield className="w-8 h-8 text-info group-hover:text-info-foreground transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-3">
                Painel Administrativo
              </h3>
              <p className="text-muted-foreground mb-6">
                Acesso restrito para gerenciar requisições, aprovar compras e 
                acompanhar o status.
              </p>
              <div className="flex items-center text-info font-semibold group-hover:gap-3 transition-all">
                Fazer login
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        </section>

        {/* Features Section */}
        <section className="py-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Como funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Preencha o formulário</h3>
              <p className="text-sm text-muted-foreground">
                Informe os dados do item que precisa e a justificativa
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Aguarde aprovação</h3>
              <p className="text-sm text-muted-foreground">
                Sua requisição será analisada pela equipe de compras
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Receba o material</h3>
              <p className="text-sm text-muted-foreground">
                Após aprovação e compra, você será notificado
              </p>
            </div>
          </div>
        </section>

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
