import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hora em milissegundos

export function useInactivityTimeout() {
  const { user, signOut } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(async () => {
    toast.info('Sessão expirada por inatividade. Faça login novamente.');
    await signOut();
  }, [signOut]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (user) {
      timeoutRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
    }
  }, [user, handleLogout]);

  useEffect(() => {
    if (!user) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // Eventos de atividade do usuário
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];

    // Iniciar timer
    resetTimer();

    // Adicionar listeners para resetar timer em qualquer atividade
    events.forEach((event) => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [user, resetTimer]);

  return { resetTimer };
}
