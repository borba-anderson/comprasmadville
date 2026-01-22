import { useNavigate } from 'react-router-dom';
import { FileText, Shield, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
export const ActionCards = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const handleRequisicaoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      navigate('/requisicao');
    } else {
      navigate('/auth?redirect=/requisicao');
    }
  };
  const handlePainelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      navigate('/painel');
    } else {
      navigate('/auth');
    }
  };
  return <section className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
      {/* Card Primário: Fazer Requisição - Cinza escuro */}
      <a href="#" onClick={handleRequisicaoClick} className="group relative animate-stagger-1">
        <div className="relative bg-gradient-to-br from-accent to-emerald-900 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-2 overflow-hidden">
          {/* Ícone com flutuação */}
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FileText className="w-7 h-7 text-white animate-float" />
          </div>
          
          <h3 className="font-bold text-white mb-3 text-xl">Fazer Requisição</h3>
          
          <p className="text-white/80 mb-6 leading-relaxed text-sm">
            Solicite materiais, equipamentos ou serviços de forma rápida e organizada.
          </p>
          
          <div className="flex items-center text-white font-semibold group-hover:gap-3 transition-all">
            {user ? 'Iniciar nova requisição' : 'Entrar para solicitar'}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </a>

      {/* Card Secundário: Painel Administrativo - Com hover melhorado */}
      <a href="#" onClick={handlePainelClick} className="group animate-stagger-2">
        <div className="bg-card rounded-2xl border-2 border-border/60 p-8 h-full transition-all duration-300 hover:border-info/40 hover:shadow-lg hover:shadow-info/10 hover:-translate-y-2">
          <div className="flex items-start justify-between mb-6">
            <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center group-hover:bg-info/10 transition-colors">
              <Shield className="w-7 h-7 text-muted-foreground group-hover:text-info transition-colors hover-bounce" />
            </div>
            <Badge variant="outline" className="text-xs text-muted-foreground group-hover:border-info/40 group-hover:text-info transition-colors">
              <Lock className="w-3 h-3 mr-1" />
              Restrito
            </Badge>
          </div>
          
          <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-info transition-colors">Painel Administrativo</h3>
          
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">Painel de Controle de pedidos e KPIs. Gerencie as requisições e acompanhe suas solicitações.</p>
          
          <div className="flex items-center text-muted-foreground font-medium group-hover:text-info group-hover:gap-3 transition-all">
            {user ? 'Acessar painel' : 'Entrar como gestor'}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </a>
    </section>;
};