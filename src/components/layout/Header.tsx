import { Link, useLocation } from "react-router-dom";
import { LogOut, User, Users, KeyRound, Search, LayoutGrid, Home, Plus, Activity } from "lucide-react";
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
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";


interface HeaderProps {
  showSidebarTrigger?: boolean;
  /** Em telas com sidebar, esconde a navegação duplicada do topo */
  compact?: boolean;
}

export function Header({ showSidebarTrigger = false, compact = false }: HeaderProps) {
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
    { to: "/operacoes", label: "Operações", icon: Activity, show: !!user },
    { to: "/painel", label: "Painel", icon: LayoutGrid, show: isStaff },
    { to: "/requisicao", label: "Nova requisição", icon: Plus, show: !!user },
  ].filter((i) => i.show);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border-subtle))] ios-material">
        <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-5 lg:px-7 safe-x">
          {showSidebarTrigger && <SidebarTrigger className="mr-0 h-9 w-9 sm:mr-1" aria-label="Abrir ou recolher menu" />}


          {!compact && (
            <Link to="/" className="flex items-center gap-2 min-w-0 max-w-[52%] sm:max-w-none overflow-hidden">
              <Logo size="sm" showText={true} />
            </Link>

          )}

          {/* Primary nav — desktop (oculta quando há sidebar) */}
          {user && !compact && (
            <nav className="hidden md:flex items-center gap-1 ml-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "relative inline-flex items-center gap-2 px-3.5 h-9 rounded-full text-[14px] font-semibold tracking-[-0.01em] transition-all duration-200 ios-press",
                      active
                        ? "text-primary bg-primary/10"
                        : "text-tertiary-fg hover:text-primary-fg hover:bg-[hsl(var(--surface-2))]"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", active ? "opacity-90" : "opacity-60")} strokeWidth={1.75} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex-1" />

          <div className="flex items-center gap-1.5 sm:gap-2">
            {user && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(true)}
                  className="h-9 w-9 shrink-0 rounded-full bg-[hsl(var(--surface-inset))] px-0 text-[hsl(var(--text-tertiary))] hover:bg-[hsl(var(--surface-3))] sm:w-[clamp(180px,24vw,320px)] sm:justify-start sm:rounded-[11px] sm:px-3.5"
                  aria-label="Buscar"
                >
                  <Search className="h-4 w-4 shrink-0" />
                  <span className="hidden truncate text-[13px] font-normal sm:inline">Buscar no sistema</span>
                  <span className="ml-auto hidden items-center gap-0.5 lg:inline-flex">
                    <kbd className="kbd-premium">⌘</kbd>
                    <kbd className="kbd-premium">K</kbd>
                  </span>
                </Button>

                <ThemeToggle />
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
