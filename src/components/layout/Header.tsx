import { Link, useLocation } from "react-router-dom";
import { LogOut, User, Users, KeyRound, Search, LayoutGrid, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { NotificationBell } from "./NotificationBell";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CommandPalette, useCommandPalette } from "./CommandPalette";
import { cn } from "@/lib/utils";

interface HeaderProps {
  showSidebarTrigger?: boolean;
}

export function Header({ showSidebarTrigger = false }: HeaderProps) {
  const { user, profile, roles, signOut, isStaff, isAdmin } = useAuth();
  const { pathname } = useLocation();
  const { open, setOpen } = useCommandPalette();

  const getRoleBadge = () => {
    if (roles.includes("admin")) return "Admin";
    if (roles.includes("gerente")) return "Gestor";
    if (roles.includes("comprador")) return "Comprador";
    return "Solicitante";
  };

  const navItems = [
    { to: "/", label: "Início", icon: Home, show: !!user },
    { to: "/painel", label: "Painel", icon: LayoutGrid, show: isStaff },
    { to: "/requisicao", label: "Nova requisição", icon: Plus, show: !!user },
  ].filter((i) => i.show);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-subtle bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <div className="flex h-14 items-center px-4 md:px-6 gap-2">
          {showSidebarTrigger && <SidebarTrigger className="mr-2" />}

          <Link to="/" className="flex items-center gap-2 mr-4 shrink-0">
            <Logo size="sm" showText={true} />
          </Link>

          {/* Primary nav — desktop */}
          {user && (
            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-[13px] font-medium transition-colors",
                      active
                        ? "text-primary-fg bg-[hsl(var(--surface-3))]"
                        : "text-secondary-fg hover:text-primary-fg hover:bg-[hsl(var(--surface-2))]"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            {user && (
              <>
                {/* Command palette trigger */}
                <button
                  onClick={() => setOpen(true)}
                  className="hidden sm:inline-flex items-center gap-2 h-8 px-2.5 rounded-md border border-subtle bg-[hsl(var(--surface-2))] text-tertiary-fg hover:text-primary-fg hover:border-strong transition-colors text-[12px] focus-ring-premium"
                  aria-label="Buscar"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Buscar</span>
                  <span className="hidden lg:inline-flex items-center gap-0.5 ml-2">
                    <kbd className="kbd-premium">⌘</kbd>
                    <kbd className="kbd-premium">K</kbd>
                  </span>
                </button>

                <NotificationBell />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 h-9 px-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="hidden md:inline-block font-medium text-[13px]">
                        {profile?.nome?.split(" ")[0] || user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuLabel>
                      <div className="flex flex-col gap-1">
                        <span className="text-[13px]">{profile?.nome || "Usuário"}</span>
                        <span className="text-xs text-tertiary-fg font-normal">{user.email}</span>
                        <span className="mt-1 text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 bg-primary/10 text-primary rounded w-fit">
                          {getRoleBadge()}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isStaff && (
                      <DropdownMenuItem asChild className="md:hidden">
                        <Link to="/painel">Painel administrativo</Link>
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/usuarios" className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Gestão de usuários
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onSelect={() => setOpen(true)}>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                      <span className="ml-auto inline-flex items-center gap-0.5">
                        <kbd className="kbd-premium">⌘</kbd>
                        <kbd className="kbd-premium">K</kbd>
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/alterar-senha" className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4" />
                        Alterar senha
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {!user && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild size="sm">
                  <Link to="/auth">Entrar</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link to="/requisicao">Fazer Solicitação</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {user && <CommandPalette open={open} onOpenChange={setOpen} />}
    </>
  );
}
