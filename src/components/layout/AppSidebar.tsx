import { NavLink, useLocation } from "react-router-dom";
import { Home, Activity, LayoutGrid, Plus, Users, KeyRound, Columns3, ScanSearch, FileSearch, ListTodo, User } from "lucide-react";
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
    { title: "Workspace", url: "/workspace", icon: Columns3, show: isStaff },
    { title: "Cotação Inteligente", url: "/cotacao-inteligente", icon: FileSearch, show: isStaff },
    { title: "Auditoria", url: "/auditoria", icon: ScanSearch, show: isStaff },
    { title: "Tasks", url: "/tasks", icon: ListTodo, show: true },
    { title: "Nova requisição", url: "/requisicao", icon: Plus, show: true },
  ].filter((i) => i.show);

  const account = [
    { title: "Usuários", url: "/usuarios", icon: Users, show: isAdmin },
    { title: "Alterar senha", url: "/alterar-senha", icon: KeyRound, show: true },
  ].filter((i) => i.show);

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  const renderItems = (items: typeof main) => (
    <SidebarMenu className="gap-1.5">
      {items.map((item) => {
        const active = isActive(item.url);
        return (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton asChild isActive={active} tooltip={item.title} className="h-10 rounded-[10px]">
              <NavLink
                to={item.url}
                end={item.url === "/"}
                className={cn(
                  "relative flex items-center gap-3 rounded-[10px] text-[14px] font-medium transition-colors duration-150 ios-press",
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--text-primary))]"
                )}
              >
                {active && !collapsed && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" />}
                <item.icon
                  className={cn("h-[18px] w-[18px] shrink-0", active ? "text-primary" : "opacity-70")}
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
    <Sidebar collapsible="icon" className="border-r border-[hsl(var(--sidebar-border))] ios-material">
      <SidebarHeader className="h-16 justify-center border-b border-[hsl(var(--sidebar-border))] px-3">
        <NavLink to="/" className="flex items-center gap-2.5 rounded-[10px] px-1 py-1">
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

      <SidebarContent className="px-2 py-3">
        <SidebarGroup className="py-1">
          {!collapsed && <SidebarGroupLabel className="data-label">Navegação</SidebarGroupLabel>}
          <SidebarGroupContent>{renderItems(main)}</SidebarGroupContent>
        </SidebarGroup>

        {account.length > 0 && (
          <SidebarGroup className="mt-3 border-t border-[hsl(var(--sidebar-border))] pt-4">
            {!collapsed && <SidebarGroupLabel className="data-label">Conta</SidebarGroupLabel>}
            <SidebarGroupContent>{renderItems(account)}</SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-[hsl(var(--sidebar-border))] p-2.5">
        <div className={cn("flex h-10 items-center rounded-[10px] bg-[hsl(var(--surface-inset))]", collapsed ? "justify-center" : "gap-2.5 px-2.5")}>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-3.5 w-3.5" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-[hsl(var(--text-primary))]">
                {profile?.nome?.split(" ")[0] || "Usuário"}
              </p>
              <p className="text-[10px] text-[hsl(var(--text-quaternary))]">GMAD Procurement</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
