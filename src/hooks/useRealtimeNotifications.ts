import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';
import { STATUS_CONFIG, Requisicao } from '@/types';

interface UseRealtimeNotificationsOptions {
  userEmail: string | null;
  enabled?: boolean;
  onDataChange?: () => void;
}

export function useRealtimeNotifications({ 
  userEmail, 
  enabled = true,
  onDataChange,
}: UseRealtimeNotificationsOptions) {
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const handleStatusChange = useCallback((newData: Requisicao, oldData: Partial<Requisicao>) => {
    // Check if status actually changed
    if (oldData.status && newData.status !== oldData.status) {
      const statusConfig = STATUS_CONFIG[newData.status];
      const oldStatusConfig = STATUS_CONFIG[oldData.status as keyof typeof STATUS_CONFIG];
      
      // Determine notification variant based on status
      let emoji = '📦';
      if (newData.status === 'aprovado') emoji = '✅';
      else if (newData.status === 'rejeitado') emoji = '❌';
      else if (newData.status === 'comprado') emoji = '🛒';
      else if (newData.status === 'recebido') emoji = '📬';
      else if (newData.status === 'cotando') emoji = '💰';
      else if (newData.status === 'em_entrega') emoji = '🚚';
      
      const title = `${emoji} ${newData.item_nome}`;
      const description = `Status alterado de "${oldStatusConfig?.label || oldData.status}" para "${statusConfig?.label || newData.status}"`;
      
      // Show toast notification
      toast({
        title,
        description,
        duration: 8000,
      });

      // Add to notification center
      addNotification({
        title: newData.item_nome,
        description,
        type: 'status_change',
        requisicaoId: newData.id,
        itemNome: newData.item_nome,
      });

      // Trigger data refresh
      onDataChange?.();
    }
  }, [toast, addNotification, onDataChange]);

  useEffect(() => {
    if (!userEmail || !enabled) return;

    // Subscribe to realtime changes on requisicoes table
    const channel = supabase
      .channel('requisicoes-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'requisicoes',
          filter: `solicitante_email=eq.${userEmail}`,
        },
        (payload) => {
          handleStatusChange(
            payload.new as Requisicao,
            payload.old as Partial<Requisicao>
          );
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userEmail, enabled, handleStatusChange]);
}
