import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, LogIn, UserPlus, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import gmadLogo from "@/assets/gmad-logo.png";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const signupSchema = loginSchema
  .extend({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    telefone: z.string().min(14, "Telefone inválido (formato: (00) 00000-0000)"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const rawRedirect = searchParams.get("redirect");
  // Aceita apenas caminhos relativos da própria aplicação
  const redirectUrl =
    rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/painel";


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "telefone") {
      const formatted = formatPhone(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const withTimeout = async <T,>(promise: Promise<T>, ms: number, timeoutMessage: string): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(timeoutMessage));
      }, ms);
      promise
        .then((value) => {
          clearTimeout(timer);
          resolve(value);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const { error } = await withTimeout(
          signIn(formData.email, formData.password),
          15000,
          "Tempo de resposta excedido.",
        );
        if (error) {
          toast({ title: "Erro no login", description: error.message, variant: "destructive" });
          setIsLoading(false);
          return;
        }

        toast({ title: "Login realizado!", description: "Bem-vindo de volta." });
        setTimeout(() => navigate(redirectUrl), 500);
      } else {
        const result = signupSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const { error } = await withTimeout(
          signUp(formData.email, formData.password, formData.nome, formData.telefone),
          20000,
          "Tempo de resposta excedido.",
        );
        if (error) {
          toast({ title: "Erro no cadastro", description: error.message, variant: "destructive" });
          setIsLoading(false);
          return;
        }

        toast({ title: "Conta criada!", description: "Você já pode acessar o sistema." });
        setTimeout(() => navigate(redirectUrl), 500);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-background flex flex-col items-center justify-center px-4 py-8 sm:px-6">
      <main className="w-full max-w-[420px] animate-fade-in">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[18px] border border-[hsl(var(--border-subtle))] bg-card shadow-[var(--shadow-elegant)]">
            <img src={gmadLogo} alt="GMAD" className="h-11 w-11 object-contain" />
          </div>
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Procurement Intelligence
          </p>
          <h1 className="text-[28px] leading-tight sm:text-[32px]">Central de Compras</h1>
          <p className="mt-2 text-[15px] text-[hsl(var(--text-tertiary))]">
            Acesse sua conta corporativa para continuar.
          </p>
        </div>

        <section className="overflow-hidden rounded-[22px] border border-[hsl(var(--border-subtle))] bg-card shadow-[var(--shadow-elegant-lg)] animate-scale-in">
          <div className="p-5 sm:p-8">
            <div className="mb-7 grid grid-cols-2 rounded-[12px] bg-[hsl(var(--surface-inset))] p-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsLogin(true)}
                aria-pressed={isLogin}
                className={isLogin ? "h-9 bg-card text-primary shadow-[var(--shadow-elegant-sm)] hover:bg-card" : "h-9 text-muted-foreground hover:text-foreground"}
              >
                Entrar
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsLogin(false)}
                aria-pressed={!isLogin}
                className={!isLogin ? "h-9 bg-card text-primary shadow-[var(--shadow-elegant-sm)] hover:bg-card" : "h-9 text-muted-foreground hover:text-foreground"}
              >
                Cadastrar
              </Button>
            </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <Label
                  htmlFor="nome"
                  className="ml-1 text-xs font-semibold text-[hsl(var(--text-secondary))]"
                >
                  Nome Completo
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: João Silva"
                  autoComplete="name"
                  className="h-12"
                />
                {errors.nome && <p className="text-xs text-red-500 font-medium ml-1">{errors.nome}</p>}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1.5">
                <Label
                  htmlFor="telefone"
                  className="ml-1 text-xs font-semibold text-[hsl(var(--text-secondary))]"
                >
                  Telefone
                </Label>
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  autoComplete="tel"
                  className="h-12"
                />
                {errors.telefone && <p className="text-xs text-red-500 font-medium ml-1">{errors.telefone}</p>}
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="ml-1 text-xs font-semibold text-[hsl(var(--text-secondary))]"
              >
                Email Corporativo
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu.email@empresa.com"
                autoComplete="email"
                className="h-12"
              />
              {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="ml-1 text-xs font-semibold text-[hsl(var(--text-secondary))]"
              >
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="h-12 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-medium ml-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="ml-1 text-xs font-semibold text-[hsl(var(--text-secondary))]"
                >
                  Confirmar Senha
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="h-12"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 font-medium ml-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="mt-2 h-12 w-full shadow-[var(--shadow-tint-primary)]"
              size="lg"
              isLoading={isLoading}
            >
              {isLogin ? (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Entrar no Sistema
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Criar Conta
                </>
              )}
            </Button>
          </form>

          <div className="mt-7 border-t border-[hsl(var(--border-subtle))] pt-5 text-center">
            <p className="text-sm text-muted-foreground font-medium">
              Problemas com acesso?{" "}
              <a
                href="https://wa.me/5547992189824"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Contate o suporte
              </a>
            </p>
          </div>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[hsl(var(--text-quaternary))]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Ambiente corporativo seguro
            </div>
          </div>
        </section>

        <div className="mt-6 text-center animate-fade-in delay-100">
        <Link
          to="/"
          className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao início
        </Link>
        </div>
      </main>
    </div>
  );
}
