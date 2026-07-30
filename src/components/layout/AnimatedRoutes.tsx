import { useLocation, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Requisicao from '@/pages/Requisicao';
import Painel from '@/pages/Painel';
import RequisicaoDetalhe from '@/pages/RequisicaoDetalhe';
import Usuarios from '@/pages/Usuarios';
import AlterarSenha from '@/pages/AlterarSenha';
import Operacoes from '@/pages/Operacoes';
import Workspace from '@/pages/Workspace';
import OrcamentoInteligente from '@/pages/OrcamentoInteligente';
import OAuthConsent from '@/pages/OAuthConsent';
import NotFound from '@/pages/NotFound';
import { AppShell } from '@/components/layout/AppShell';

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div className="animate-fade-in">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />

        <Route path="/requisicao" element={<AppShell><Requisicao /></AppShell>} />
        <Route path="/operacoes" element={<AppShell><Operacoes /></AppShell>} />
        <Route path="/painel" element={<AppShell><Painel /></AppShell>} />
        <Route path="/painel/:id" element={<AppShell><RequisicaoDetalhe /></AppShell>} />
        <Route path="/usuarios" element={<AppShell><Usuarios /></AppShell>} />
        <Route path="/alterar-senha" element={<AppShell><AlterarSenha /></AppShell>} />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

