import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SessionManager } from "@/components/SessionManager";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Requisicao from "./pages/Requisicao";
import Painel from "./pages/Painel";
import RequisicaoDetalhe from "./pages/RequisicaoDetalhe";
import Usuarios from "./pages/Usuarios";
import AlterarSenha from "./pages/AlterarSenha";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SessionManager>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
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
          </BrowserRouter>
        </TooltipProvider>
      </SessionManager>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

