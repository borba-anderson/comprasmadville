import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, LogIn, UserPlus, ArrowLeft } from "lucide-react";
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
    telefone: z
      .string()
      .min(14, "Telefone inválido (formato: (00) 00000-0000)"),
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

  const redirectUrl = searchParams.get("redirect") || "/painel";

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

  const withTimeout = async <T,>(
    promise: Promise<T>,
    ms: number,
    timeoutMessage: string
  ): Promise<T> => {
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
          "Tempo de resposta excedido."
        );
        if (error) {
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta.",
        });
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
          signUp(
            formData.email,
            formData.password,
            formData.nome,
            formData.telefone
          ),
          20000,
          "Tempo de resposta excedido."
        );
        if (error) {
          toast({
            title: "Erro no cadastro",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: "Conta criada!",
          description: "Você já pode acessar o sistema.",
        });
        setTimeout(() => navigate(redirectUrl), 500);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#107c50] flex flex-col items-center justify-center p-4">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}
      </style>

      <div className="mb-8 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-4 mb-3">
          <img src={gmadLogo} alt="GMAD Logo" className="h-16 w-auto" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white font-jakarta tracking-tight">
          Central de Compras
        </h1>
      </div>

      <div className="w-full max-w-[440px] bg-white rounded-[2rem] shadow-2xl shadow-emerald-950/20 overflow-hidden animate-scale-in">
        <div className="p-8 md:p-10">
          <div className="flex mb-8 bg-slate-100/80 p-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 font-jakarta ${
                isLogin
                  ? "bg-white text-[#107c50] shadow-sm ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 font-jakarta ${
                !isLogin
                  ? "bg-white text-[#107c50] shadow-sm ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <Label
                  htmlFor="nome"
                  className="text-xs font-bold text-slate-500 uppercase tracking-wider font-jakarta ml-1"
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
                  className="h-12 bg-slate-50 border-slate-200 focus:border-[#107c50] focus:ring-[#107c50]/20 rounded-xl"
                />
                {errors.nome && (
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {errors.nome}
                  </p>
                )}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1.5">
                <Label
                  htmlFor="telefone"
                  className="text-xs font-bold text-slate-500 uppercase tracking-wider font-jakarta ml-1"
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
                  className="h-12 bg-slate-50 border-slate-200 focus:border-[#107c50] focus:ring-[#107c50]/20 rounded-xl"
                />
                {errors.telefone && (
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {errors.telefone}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-bold text-slate-500 uppercase tracking-wider font-jakarta ml-1"
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
                className="h-12 bg-slate-50 border-slate-200 focus:border-[#107c50] focus:ring-[#107c50]/20 rounded-xl"
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium ml-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-bold text-slate-500 uppercase tracking-wider font-jakarta ml-1"
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
                  className="h-12 bg-slate-50 border-slate-200 focus:border-[#107c50] focus:ring-[#107c50]/20 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#107c50] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium ml-1">
                  {errors.password}
                </p>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-bold text-slate-500 uppercase tracking-wider font-jakarta ml-1"
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
                  className="h-12 bg-slate-50 border-slate-200 focus:border-[#107c50] focus:ring-[#107c50]/20 rounded-xl"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-[#107c50] hover:bg-[#0d6942] text-white font-bold rounded-xl text-base shadow-lg shadow-emerald-900/10 transition-all active:scale-[0.98] mt-2"
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

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Problemas com acesso?{" "}
              
                href="https://wa.me/5547992189824"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#107c50] hover:text-[#0d6942] font-bold hover:underline transition-colors"
              >
                Contate o suporte
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center animate-fade-in delay-100">
        <Link
          to="/"
          className="inline-flex items-center text-white/80 hover:text-white text-sm font-medium transition-colors px-4 py-2 rounded-full hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}