import { Link } from 'react-router-dom';
import { LogOut, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface HeaderProps {
  showSidebarTrigger?: boolean;
}

export function Header({ showSidebarTrigger = false }: HeaderProps) {
  const { user, profile, roles, signOut, isStaff } = useAuth();

  const getRoleBadge = () => {
    if (roles.includes('admin')) return 'Admin';
    if (roles.includes('gerente')) return 'Gerente';
    if (roles.includes('comprador')) return 'Comprador';
    return 'Usuário';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {showSidebarTrigger && (
          <SidebarTrigger className="mr-4" />
        )}
        
        <Link to="/" className="flex items-center gap-2">
          <Logo size="sm" showText={true} />
        </Link>

        <div className="flex-1" />

        <nav className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="hidden md:inline-block font-medium">
                    {profile?.nome || user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{profile?.nome || 'Usuário'}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                    <span className="mt-1 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full w-fit">
                      {getRoleBadge()}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isStaff && (
                  <DropdownMenuItem asChild>
                    <Link to="/painel">Painel Administrativo</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/requisicao">Nova Requisição</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button asChild>
                <Link to="/requisicao">Fazer Requisição</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
