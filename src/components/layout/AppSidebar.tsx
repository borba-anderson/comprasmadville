import { NavLink, useLocation } from "react-router-dom";
import { Home, Activity, LayoutGrid, Plus, Users, KeyRound } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const { isStaff, isAdmin, profile } = useAuth();

  const main = [
    { title: "Início", url: "/", icon: Home, show: true },
    { title: "Operações", url: "/operacoes", icon: Activity, show: true },
    { title: "Painel", url: "/painel", icon: LayoutGrid, show: isStaff },
    { title: "Nova requisição", url: "/requisicao", icon: Plus, show: true },
  ].filter((i) => i.show);

  const account = [
    { title: "Usuários", url: "/usuarios", icon: Users, show: isAdmin },
    { title: "Alterar senha", url: "/alterar-senha", icon: KeyRound, show: true },
  ].filter((i) => i.show);

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  const renderItems = (items: typeof main) => (
    <SidebarMenu>
      {items.map((item) => {
        const active = isActive(item.url);
        return (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
              <NavLink
                to={item.url}
                className={cn(
                  "flex items-center gap-3 rounded-lg text-[13px] font-medium tracking-[-0.006em] transition-colors duration-150",
                  active
                    ? "text-[hsl(var(--text-primary))]"
                    : "text-[hsl(var(--text-tertiary))] hover:text-[hsl(var(--text-primary))]"
                )}
              >
                <item.icon
                  className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "opacity-70")}
                  strokeWidth={1.75}
                />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-[hsl(var(--sidebar-border))]">
      <SidebarHeader className="h-16 justify-center px-3">
        <NavLink to="/" className="flex items-center gap-2.5">
          <img
            src="/lovable-uploads/90e07f8d-0f0d-44f4-b552-1973a3a1c498.png"
            alt="GMAD"
            className="h-8 w-8 object-contain shrink-0"
          />
          {!collapsed && (
            <span className="font-display text-[13px] font-semibold leading-tight tracking-[-0.01em] text-[hsl(var(--text-primary))]">
              GMAD
              <span className="block text-[11px] font-normal text-[hsl(var(--text-quaternary))]">
                Procurement
              </span>
            </span>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="data-label">Navegação</SidebarGroupLabel>}
          <SidebarGroupContent>{renderItems(main)}</SidebarGroupContent>
        </SidebarGroup>

        {account.length > 0 && (
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="data-label">Conta</SidebarGroupLabel>}
            <SidebarGroupContent>{renderItems(account)}</SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="px-4 py-4">
          <p className="text-[11px] text-[hsl(var(--text-quaternary))] leading-relaxed">
            {profile?.nome?.split(" ")[0] ? `Olá, ${profile.nome.split(" ")[0]}` : "GMAD Madville"}
          </p>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
