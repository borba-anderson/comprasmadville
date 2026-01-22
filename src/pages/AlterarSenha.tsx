import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/layout/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
});

export default function AlterarSenha() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // Validate form
      const result = passwordSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: formData.currentPassword,
      });

      if (signInError) {
        setErrors({ currentPassword: 'Senha atual incorreta' });
        setIsLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Senha alterada!',
        description: 'Sua senha foi atualizada com sucesso.',
      });

      // Clear form and redirect
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => navigate('/'), 1500);

    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao alterar senha.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary to-primary/90 px-8 py-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center shadow-lg">
                <Logo size="md" showText={false} />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-primary-foreground">Alterar Senha</h1>
            <p className="text-primary-foreground/80 mt-2 text-sm font-medium">
              {profile?.nome || user.email}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Password */}
              <div>
                <Label htmlFor="currentPassword" className="text-sm font-semibold">
                  Senha Atual
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-xs text-destructive mt-1">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <Label htmlFor="newPassword" className="text-sm font-semibold">
                  Nova Senha
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-destructive mt-1">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                  Confirmar Nova Senha
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="mt-1.5"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Alterar Senha
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-muted/50 border-t text-center">
            <p className="text-sm text-muted-foreground">
              <KeyRound className="w-4 h-4 inline mr-1" />
              Sua senha deve ter pelo menos 6 caracteres
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center text-primary-foreground/90 hover:text-primary-foreground text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
