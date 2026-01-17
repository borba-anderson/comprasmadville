import { useNavigate } from 'react-router-dom';
import { FileText, Shield, ArrowRight, Sparkles, Lock } from 'lucide-react';
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
      {/* Card Primário: Fazer Requisição */}
      <a href="#" onClick={handleRequisicaoClick} className="group relative">
        <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
          {/* Badge "Mais utilizado" */}
          <Badge className="absolute -top-3 left-6 bg-success text-success-foreground border-0 shadow-lg">
            <Sparkles className="w-3 h-3 mr-1" />
            Mais utilizado
          </Badge>
          
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FileText className="w-7 h-7 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">
            Fazer requisição
          </h3>
          
          <p className="text-white/80 mb-6 leading-relaxed">
            Solicite materiais, equipamentos ou serviços de forma rápida e organizada.
          </p>
          
          <div className="flex items-center text-white font-semibold group-hover:gap-3 transition-all">
            {user ? 'Iniciar nova requisição' : 'Entrar para solicitar'}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </a>

      {/* Card Secundário: Painel Administrativo */}
      <a href="#" onClick={handlePainelClick} className="group">
        <div className="bg-card rounded-2xl border border-border/60 p-8 h-full transition-all duration-300 hover:border-muted-foreground/30 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-start justify-between mb-6">
            <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center group-hover:bg-muted/80 transition-colors">
              <Shield className="w-7 h-7 text-muted-foreground" />
            </div>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              <Lock className="w-3 h-3 mr-1" />
              Restrito
            </Badge>
          </div>
          
          <h3 className="text-xl font-bold text-card-foreground mb-3">
            Painel Administrativo
          </h3>
          
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            Acesso exclusivo para equipe de Compras. Gerencie requisições, aprove pedidos e acompanhe indicadores.
          </p>
          
          <div className="flex items-center text-muted-foreground font-medium group-hover:text-foreground group-hover:gap-3 transition-all">
            {user ? 'Acessar painel' : 'Entrar como gestor'}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </a>
    </section>;
};