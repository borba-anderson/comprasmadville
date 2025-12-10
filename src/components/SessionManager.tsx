import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';

interface SessionManagerProps {
  children: React.ReactNode;
}

export function SessionManager({ children }: SessionManagerProps) {
  // Ativa o controle de sessão por inatividade
  useInactivityTimeout();
  
  return <>{children}</>;
}
