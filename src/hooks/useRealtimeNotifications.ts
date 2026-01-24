import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';
import { STATUS_CONFIG, Requisicao } from '@/types';

interface UseRealtimeNotificationsOptions {
  userEmail: string | null;
  enabled?: boolean;
  onDataChange?: () => void;
  isStaff?: boolean;
}

export function useRealtimeNotifications({ 
  userEmail, 
  enabled = true,
  onDataChange,
  isStaff = false,
}: UseRealtimeNotificationsOptions) {
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Handle status changes for solicitantes (requesters)
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

  // Handle new requisitions for staff/compradores
  const handleNewRequisicao = useCallback((newData: Requisicao) => {
    const emoji = '🆕';
    const title = `${emoji} Nova Requisição`;
    const description = `${newData.solicitante_nome} solicitou: ${newData.item_nome}`;
    
    // Show toast notification
    toast({
      title,
      description,
      duration: 8000,
    });

    // Add to notification center
    addNotification({
      title: `Nova Requisição - ${newData.protocolo}`,
      description: `${newData.solicitante_nome} (${newData.solicitante_setor}) solicitou: ${newData.item_nome}`,
      type: 'info',
      requisicaoId: newData.id,
      itemNome: newData.item_nome,
    });

    // Trigger data refresh
    onDataChange?.();
  }, [toast, addNotification, onDataChange]);

  useEffect(() => {
    if (!enabled) return;
    if (!isStaff && !userEmail) return;

    console.log('[Realtime] Subscribing to notifications:', { userEmail, isStaff });

    // Create unique channel name
    const channelName = isStaff 
      ? 'requisicoes-staff-notifications'
      : `requisicoes-user-${userEmail?.replace(/[^a-zA-Z0-9]/g, '_')}`;
    
    const channel = supabase.channel(channelName);

    // For staff: listen for new requisitions (INSERT)
    if (isStaff) {
      channel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'requisicoes',
        },
        (payload) => {
          const newData = payload.new as Requisicao;
          console.log('[Realtime] New requisicao created:', newData.protocolo);
          handleNewRequisicao(newData);
        }
      );
    }

    // For solicitantes: listen for status updates on their requisitions
    if (userEmail && !isStaff) {
      channel.on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'requisicoes',
        },
        (payload) => {
          const newData = payload.new as Requisicao;
          const oldData = payload.old as Partial<Requisicao>;
          
          // Check if this update is for the current user's requisitions
          if (newData.solicitante_email === userEmail) {
            console.log('[Realtime] Status change detected:', { 
              old: oldData.status, 
              new: newData.status,
              item: newData.item_nome 
            });
            handleStatusChange(newData, oldData);
          }
        }
      );
    }

    channel.subscribe((status) => {
      console.log('[Realtime] Subscription status:', status);
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('[Realtime] Unsubscribing from:', channelName);
      supabase.removeChannel(channel);
    };
  }, [userEmail, enabled, isStaff, handleStatusChange, handleNewRequisicao]);
}
