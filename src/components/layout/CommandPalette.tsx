import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Home,
  FileText,
  LayoutGrid,
  Users,
  Plus,
  KeyRound,
  LogOut,
  Search,
  Bell,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { isStaff, isAdmin, signOut } = useAuth();

  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar páginas, ações ou requisições..." />
      <CommandList>
        <CommandEmpty>Nada encontrado.</CommandEmpty>

        <CommandGroup heading="Navegar">
          <CommandItem onSelect={() => go("/")}>
            <Home className="mr-2 h-4 w-4" />
            <span>Início</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/requisicao")}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Nova requisição</span>
          </CommandItem>
          {isStaff && (
            <CommandItem onSelect={() => go("/painel")}>
              <LayoutGrid className="mr-2 h-4 w-4" />
              <span>Painel de requisições</span>
            </CommandItem>
          )}
          {isAdmin && (
            <CommandItem onSelect={() => go("/usuarios")}>
              <Users className="mr-2 h-4 w-4" />
              <span>Gestão de usuários</span>
            </CommandItem>
          )}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Conta">
          <CommandItem onSelect={() => go("/alterar-senha")}>
            <KeyRound className="mr-2 h-4 w-4" />
            <span>Alterar senha</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onOpenChange(false);
              signOut();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return { open, setOpen };
}
