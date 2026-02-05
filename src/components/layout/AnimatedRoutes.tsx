import { useLocation, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Requisicao from '@/pages/Requisicao';
import Painel from '@/pages/Painel';
import RequisicaoDetalhe from '@/pages/RequisicaoDetalhe';
import Usuarios from '@/pages/Usuarios';
import AlterarSenha from '@/pages/AlterarSenha';
import NotFound from '@/pages/NotFound';

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div className="animate-fade-in">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/requisicao" element={<Requisicao />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="/painel/:id" element={<RequisicaoDetalhe />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/alterar-senha" element={<AlterarSenha />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
