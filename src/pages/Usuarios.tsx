import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, RefreshCw, Shield, Building, UserCog, Check, Loader2, KeyRound, Mail } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile, AppRole, EMPRESAS, SETORES } from '@/types';

interface UserWithRoles extends Profile {
  roles: AppRole[];
  gestor_nome?: string;
}

const ROLE_LABELS: Record<AppRole, { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'bg-red-100 text-red-800 border-red-300' },
  gerente: { label: 'Gestor', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  comprador: { label: 'Comprador', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  solicitante: { label: 'Solicitante', color: 'bg-gray-100 text-gray-800 border-gray-300' },
};

const ALL_ROLES: AppRole[] = ['admin', 'gerente', 'comprador', 'solicitante'];

export default function Usuarios() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Edit form state
  const [editEmpresa, setEditEmpresa] = useState('');
  const [editSetor, setEditSetor] = useState('');
  const [editGestorId, setEditGestorId] = useState('');
  const [editRoles, setEditRoles] = useState<AppRole[]>([]);

  const { user, isAdmin, isLoading: authLoading, rolesLoaded } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && rolesLoaded) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        toast({ title: 'Acesso negado', description: 'Apenas administradores podem acessar.', variant: 'destructive' });
        navigate('/');
      }
    }
  }, [authLoading, rolesLoaded, user, isAdmin, navigate, toast]);

  const fetchUsers = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      setIsRefreshing(true);

      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('nome');

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Map roles to users
      const usersWithRoles: UserWithRoles[] = (profiles || []).map((profile) => {
        const roles = (userRoles || [])
          .filter((r) => r.user_id === profile.id)
          .map((r) => r.role as AppRole);

        const gestor = profiles?.find((p) => p.id === profile.gestor_id);

        return {
          ...profile,
          roles: roles.length > 0 ? roles : ['solicitante'],
          gestor_nome: gestor?.nome,
        } as UserWithRoles;
      });

      setUsers(usersWithRoles);
      setFilteredUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (!silent) toast({ title: 'Erro', description: 'Falha ao carregar usuários.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin, fetchUsers]);

  // Filter users based on search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users);
      return;
    }

    const searchLower = search.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.nome.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.setor?.toLowerCase().includes(searchLower) ||
        u.empresa?.toLowerCase().includes(searchLower)
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const openEditDialog = (userToEdit: UserWithRoles) => {
    setSelectedUser(userToEdit);
    setEditEmpresa(userToEdit.empresa || 'none');
    setEditSetor(userToEdit.setor || 'none');
    setEditGestorId(userToEdit.gestor_id || 'none');
    setEditRoles(userToEdit.roles);
    setIsEditDialogOpen(true);
  };

  const handleRoleToggle = (role: AppRole) => {
    setEditRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      setIsSaving(true);

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          empresa: editEmpresa === 'none' ? null : editEmpresa,
          setor: editSetor === 'none' ? null : editSetor,
          gestor_id: editGestorId === 'none' ? null : editGestorId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedUser.id);

      if (profileError) throw profileError;

      // Update roles - delete existing and insert new
      const { error: deleteRolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', selectedUser.id);

      if (deleteRolesError) throw deleteRolesError;

      // Insert new roles (at least solicitante)
      const rolesToInsert: AppRole[] = editRoles.length > 0 ? editRoles : ['solicitante'];
      const { error: insertRolesError } = await supabase
        .from('user_roles')
        .insert(rolesToInsert.map((role) => ({ user_id: selectedUser.id, role })));

      if (insertRolesError) throw insertRolesError;

      toast({ title: 'Usuário atualizado com sucesso' });
      setIsEditDialogOpen(false);
      fetchUsers(true);
    } catch (error) {
      console.error('Error saving user:', error);
      toast({ title: 'Erro ao salvar', description: 'Tente novamente.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!selectedUser) return;

    try {
      setIsSendingReset(true);

      const { error } = await supabase.auth.resetPasswordForEmail(selectedUser.email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: 'Email enviado',
        description: `Um link de redefinição de senha foi enviado para ${selectedUser.email}`,
      });
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast({
        title: 'Erro ao enviar email',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  // Get potential managers (users with gerente or admin role)
  const potentialManagers = users.filter(
    (u) => u.roles.includes('gerente') || u.roles.includes('admin')
  );

  if (authLoading || !rolesLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Gestão de Usuários
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie permissões, gestores e configurações dos usuários
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchUsers()}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email, setor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary" className="text-sm">
              {filteredUsers.length} usuários
            </Badge>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[250px]">Usuário</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Gestor</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => (
                  <TableRow key={u.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <p className="font-medium">{u.nome}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{u.empresa || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{u.setor || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{u.gestor_nome || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((role) => (
                          <Badge
                            key={role}
                            variant="outline"
                            className={`text-xs ${ROLE_LABELS[role].color}`}
                          >
                            {ROLE_LABELS[role].label}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(u)}
                      >
                        <UserCog className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Editar Usuário
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-5 py-4">
              {/* User info (read-only) */}
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="font-medium">{selectedUser.nome}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>

              {/* Empresa */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Empresa
                </Label>
                <Select value={editEmpresa} onValueChange={setEditEmpresa}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {EMPRESAS.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Setor */}
              <div className="space-y-2">
                <Label>Setor</Label>
                <Select value={editSetor} onValueChange={setEditSetor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o setor..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {SETORES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Gestor */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Gestor Responsável
                </Label>
                <Select value={editGestorId} onValueChange={setEditGestorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gestor..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {potentialManagers
                      .filter((m) => m.id !== selectedUser.id)
                      .map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.nome}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  O gestor poderá visualizar as requisições deste usuário
                </p>
              </div>

              {/* Roles */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Permissões
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_ROLES.map((role) => (
                    <label
                      key={role}
                      className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={editRoles.includes(role)}
                        onCheckedChange={() => handleRoleToggle(role)}
                      />
                      <Badge
                        variant="outline"
                        className={`text-xs ${ROLE_LABELS[role].color}`}
                      >
                        {ROLE_LABELS[role].label}
                      </Badge>
                    </label>
                  ))}
                </div>
              </div>

              {/* Password Reset */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  Senha
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSendPasswordReset}
                    disabled={isSendingReset}
                    className="w-full"
                  >
                    {isSendingReset ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar email de redefinição de senha
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Um link será enviado para o email do usuário para definir uma nova senha
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
