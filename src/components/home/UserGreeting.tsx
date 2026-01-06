import { useAuth } from '@/contexts/AuthContext';

export const UserGreeting = () => {
  const { user, profile } = useAuth();
  
  if (!user) return null;
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };
  
  const firstName = profile?.nome?.split(' ')[0] || 'Usuário';
  
  return (
    <div className="text-center mb-8 animate-fade-in">
      <p className="text-lg text-muted-foreground">
        {getGreeting()}, <span className="font-semibold text-foreground">{firstName}</span>
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        O que você precisa fazer hoje?
      </p>
    </div>
  );
};
