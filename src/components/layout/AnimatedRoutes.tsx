import { useEffect, useState } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
  const [isVisible, setIsVisible] = useState(true);
  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath) {
      setIsVisible(false);
      
      const timeout = setTimeout(() => {
        setPrevPath(location.pathname);
        setIsVisible(true);
      }, 150);

      return () => clearTimeout(timeout);
    }
  }, [location.pathname, prevPath]);

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      <Routes location={location}>
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
