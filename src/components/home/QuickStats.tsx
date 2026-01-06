import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  emAndamento: number;
  aguardandoAprovacao: number;
  concluidasMes: number;
  atrasadas: number;
}

export const QuickStats = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<Stats>({
    emAndamento: 0,
    aguardandoAprovacao: 0,
    concluidasMes: 0,
    atrasadas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !profile) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        // Requisições em andamento (cotando, comprado, em_entrega)
        const { count: emAndamento } = await supabase
          .from('requisicoes')
          .select('*', { count: 'exact', head: true })
          .eq('solicitante_email', profile.email)
          .in('status', ['cotando', 'comprado', 'em_entrega']);

        // Aguardando aprovação (pendente, em_analise)
        const { count: aguardando } = await supabase
          .from('requisicoes')
          .select('*', { count: 'exact', head: true })
          .eq('solicitante_email', profile.email)
          .in('status', ['pendente', 'em_analise']);

        // Concluídas no mês
        const { count: concluidas } = await supabase
          .from('requisicoes')
          .select('*', { count: 'exact', head: true })
          .eq('solicitante_email', profile.email)
          .eq('status', 'recebido')
          .gte('recebido_em', firstDayOfMonth);

        // Atrasadas
        const { count: atrasadas } = await supabase
          .from('requisicoes')
          .select('*', { count: 'exact', head: true })
          .eq('solicitante_email', profile.email)
          .lt('previsao_entrega', now.toISOString())
          .not('status', 'in', '(recebido,cancelado,rejeitado)');

        setStats({
          emAndamento: emAndamento || 0,
          aguardandoAprovacao: aguardando || 0,
          concluidasMes: concluidas || 0,
          atrasadas: atrasadas || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, profile]);

  if (!user || loading) return null;

  const statItems = [
    {
      label: 'Em andamento',
      value: stats.emAndamento,
      icon: Package,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      label: 'Aguardando',
      value: stats.aguardandoAprovacao,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Concluídas',
      value: stats.concluidasMes,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Atrasadas',
      value: stats.atrasadas,
      icon: AlertCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      hide: stats.atrasadas === 0,
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in">
      {statItems
        .filter((item) => !item.hide)
        .map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${item.bgColor} border border-border/50`}
          >
            <item.icon className={`w-4 h-4 ${item.color}`} />
            <span className={`font-semibold ${item.color}`}>{item.value}</span>
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </div>
        ))}
    </div>
  );
};
