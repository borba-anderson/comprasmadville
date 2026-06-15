import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Send, FileText, Loader2, CheckCircle2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RequisicaoPrioridade } from "@/types";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import {
  FormStepper,
  StepSolicitante,
  StepItem,
  StepJustificativa,
  StepAnexo,
  StepRevisao,
} from "@/components/requisicao";

const STEPS = [
  { id: 1, title: "Solicitante", description: "Seus dados" },
  { id: 2, title: "Item", description: "O que precisa" },
  { id: 3, title: "Justificativa", description: "Por que precisa" },
  { id: 4, title: "Anexo", description: "Documentos" },
  { id: 5, title: "Revisão", description: "Confirmar envio" },
];

const createFormSchema = (isHighPriority: boolean) =>
  z.object({
    solicitante_nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
    solicitante_email: z.string().email("Email inválido"),
    solicitante_telefone: z.string().min(8, "Telefone é obrigatório"),
    solicitante_setor: z.string().min(1, "Selecione um setor"),
    solicitante_empresa: z.string().min(1, "Selecione uma empresa"),
    item_nome: z.string().min(3, "Nome do item deve ter pelo menos 3 caracteres").max(200),
    quantidade: z.number().min(0.01, "Quantidade deve ser maior que 0"),
    unidade: z.string().min(1, "Selecione uma unidade"),
    especificacoes: z.string().optional(),
    justificativa: z
      .string()
      .min(
        isHighPriority ? 50 : 10,
        isHighPriority
          ? "Para alta prioridade, justificativa deve ter pelo menos 50 caracteres"
          : "Justificativa deve ter pelo menos 10 caracteres",
      )
      .max(2000),
    motivo_compra: z.string().min(1, "Selecione um motivo"),
    prioridade: z.enum(["ALTA", "MEDIA", "BAIXA"]),
  });

export default function Requisicao() {
  const { user, profile, isLoading: authLoading, rolesLoaded } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [protocolo, setProtocolo] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileSizeError, setFileSizeError] = useState<string>("");

  const [formData, setFormData] = useState({
    solicitante_nome: "",
    solicitante_email: "",
    solicitante_telefone: "",
    solicitante_setor: "",
    solicitante_empresa: "",
    centro_custo: "",
    item_nome: "",
    quantidade: 1,
    unidade: "unidade",
    especificacoes: "",
    justificativa: "",
    motivo_compra: "",
    prioridade: "MEDIA" as RequisicaoPrioridade,
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && rolesLoaded && !user) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para criar uma requisição.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [authLoading, rolesLoaded, user, navigate, toast]);

  // Pre-fill form with user profile data
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        solicitante_nome: profile.nome || "",
        solicitante_email: profile.email || "",
        solicitante_telefone: profile.telefone || "",
        solicitante_setor: profile.setor || "",
        solicitante_empresa: profile.empresa || "",
      }));
    }
  }, [profile]);

  // Show loading while checking auth
  if (authLoading || !rolesLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name === "solicitante_telefone") {
      const formatted = formatPhone(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    selectedFiles.forEach((file) => {
      if (allowedTypes.includes(file.type)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      toast({
        title: "Arquivos inválidos ignorados",
        description: `Apenas PDF, JPG, PNG e Excel são permitidos. Ignorados: ${invalidFiles.join(", ")}`,
        variant: "destructive",
      });
    }

    if (validFiles.length === 0) return;

    const currentTotalSize = files.reduce((acc, f) => acc + f.size, 0);
    const newFilesSize = validFiles.reduce((acc, f) => acc + f.size, 0);
    const newTotalSize = currentTotalSize + newFilesSize;

    if (newTotalSize > MAX_TOTAL_SIZE) {
      setFileSizeError(
        `O limite total de 50MB seria excedido. Espaço disponível: ${((MAX_TOTAL_SIZE - currentTotalSize) / (1024 * 1024)).toFixed(2)}MB`,
      );
      toast({
        title: "Limite de tamanho excedido",
        description: "O total de arquivos não pode ultrapassar 50MB",
        variant: "destructive",
      });
      return;
    }

    setFileSizeError("");
    setFiles((prev) => [...prev, ...validFiles]);
    e.target.value = "";
  };

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileSizeError("");
  };

  const validateStep = (step: number): boolean => {
    const isHighPriority = formData.prioridade === "ALTA";
    const schema = createFormSchema(isHighPriority);

    type FormDataKey = keyof typeof formData;
    let fieldsToValidate: FormDataKey[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "solicitante_nome",
          "solicitante_email",
          "solicitante_setor",
          "solicitante_telefone",
          "solicitante_empresa",
        ];
        break;
      case 2:
        fieldsToValidate = ["item_nome", "quantidade", "unidade"];
        break;
      case 3:
        fieldsToValidate = ["justificativa", "motivo_compra", "prioridade"];
        break;
      case 4:
        return true;
      case 5:
        return true;
    }

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0] as string;
        if (fieldName && fieldsToValidate.includes(fieldName as FormDataKey)) {
          fieldErrors[fieldName] = err.message;
        }
      });
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        return false;
      }
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const isHighPriority = formData.prioridade === "ALTA";
      const schema = createFormSchema(isHighPriority);
      const result = schema.safeParse(formData);

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        toast({
          title: "Erro de validação",
          description: "Verifique os campos destacados.",
          variant: "destructive",
        });
        return;
      }

      let arquivo_url: string | null = null;
      let arquivo_nome: string | null = null;

      if (files.length > 0) {
        const uploadedUrls: string[] = [];
        const uploadedNames: string[] = [];

        for (const file of files) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage.from("requisicoes-anexos").upload(fileName, file);

          if (uploadError) {
            console.error("Error uploading file:", uploadError);
            throw new Error(`Erro ao enviar arquivo: ${file.name}`);
          }

          const { data: urlData } = supabase.storage.from("requisicoes-anexos").getPublicUrl(fileName);

          uploadedUrls.push(urlData.publicUrl);
          uploadedNames.push(file.name);
        }

        arquivo_url = uploadedUrls.join(",");
        arquivo_nome = uploadedNames.join(",");
      }

      const { data, error } = await supabase
        .from("requisicoes")
        .insert([
          {
            solicitante_nome: formData.solicitante_nome,
            solicitante_email: formData.solicitante_email,
            solicitante_telefone: formData.solicitante_telefone,
            solicitante_setor: formData.solicitante_setor,
            solicitante_empresa: formData.solicitante_empresa,
            centro_custo: formData.centro_custo || null,
            item_nome: formData.item_nome,
            quantidade: formData.quantidade,
            unidade: formData.unidade,
            especificacoes: formData.especificacoes || null,
            justificativa: formData.justificativa,
            motivo_compra: formData.motivo_compra,
            prioridade: formData.prioridade,
            status: "pendente" as const,
            arquivo_url,
            arquivo_nome,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating requisition:", error);
        throw error;
      }

      setProtocolo(data.protocolo);
      setIsSuccess(true);
      toast({
        title: "Requisição enviada!",
        description: `Protocolo: ${data.protocolo}`,
      });
    } catch (error: unknown) {
      console.error("Error:", error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar sua requisição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    const now = new Date();
    const dataHora = now.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    const timeline = [
      { label: 'Requisição criada', done: true },
      { label: 'Em análise', done: false },
      { label: 'Em cotação', done: false },
      { label: 'Pedido emitido', done: false },
      { label: 'Concluído', done: false },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-b from-success/5 via-background to-background">
        <div className="h-1 bg-success w-full" />
        <Header />
        <main className="page-container">
          <div className="max-w-2xl mx-auto animate-fade-in">
            {/* Hero confirmation */}
            <div className="text-center mb-8">
              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 bg-success/30 rounded-full blur-2xl animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center shadow-xl shadow-success/30 animate-scale-in">
                  <CheckCircle2 className="w-10 h-10 text-success-foreground" strokeWidth={2.5} />
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                Requisição enviada com sucesso
              </h1>
              <p className="text-muted-foreground">
                Sua requisição foi recebida e está aguardando análise.
              </p>
            </div>

            {/* Protocol card */}
            <div className="bg-card border border-border/70 rounded-2xl shadow-sm overflow-hidden mb-6">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-b border-border/60 p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Protocolo
                </p>
                <p className="text-4xl font-bold font-mono text-primary tabular-nums">
                  {protocolo}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">Data/Hora</p>
                  <p className="font-semibold text-foreground">{dataHora}</p>
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">Solicitante</p>
                  <p className="font-semibold text-foreground truncate">{formData.solicitante_nome}</p>
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">Status</p>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 text-warning text-xs font-semibold border border-warning/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                    Aguardando análise
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">Próxima etapa</p>
                  <p className="font-semibold text-foreground">Análise da equipe de compras</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Acompanhe sua requisição
              </h3>
              <div className="relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
                <ul className="space-y-4">
                  {timeline.map((item, idx) => (
                    <li key={item.label} className="flex items-center gap-4 relative">
                      <div className={cn(
                        "relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                        item.done
                          ? "bg-success border-success text-success-foreground shadow-sm shadow-success/30"
                          : "bg-background border-border"
                      )}>
                        {item.done ? (
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                        )}
                      </div>
                      <span className={cn(
                        "text-sm transition-colors",
                        item.done ? "font-semibold text-foreground" : "text-muted-foreground"
                      )}>
                        {item.label}
                      </span>
                      {idx === 1 && (
                        <span className="ml-auto text-[11px] uppercase tracking-wider font-semibold text-warning">
                          Próxima
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center mb-6">
              Você receberá atualizações em <strong className="text-foreground">{formData.solicitante_email}</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => window.location.reload()} size="lg" className="gap-2">
                <FileText className="w-4 h-4" />
                Nova Requisição
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/">Voltar ao Início</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepSolicitante
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
          />
        );
      case 2:
        return (
          <StepItem formData={formData} errors={errors} onChange={handleChange} onSelectChange={handleSelectChange} />
        );
      case 3:
        return (
          <StepJustificativa
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
          />
        );
      case 4:
        return (
          <StepAnexo
            files={files}
            onFilesChange={handleFilesChange}
            onFileRemove={handleFileRemove}
            formData={formData}
            totalSizeError={fileSizeError}
          />
        );
      case 5:
        return <StepRevisao formData={formData} files={files} onEditStep={(step) => setCurrentStep(step)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-background">
      <div className="h-1 bg-success w-full" />
      <div className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <Header />
      </div>
      <main className="page-container">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground text-sm transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Rascunho salvo localmente
            </div>
          </div>

          {/* Page intro */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Nova Requisição de Compra</h1>
            <p className="text-muted-foreground mt-1">
              Preencha as etapas abaixo. Você pode revisar antes do envio final.
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border/70 overflow-hidden">
            <div className="px-6 md:px-10 py-6 border-b border-border/60 bg-gradient-to-b from-muted/40 to-transparent">
              <FormStepper steps={STEPS} currentStep={currentStep} onStepClick={handleStepClick} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-6 md:px-10 py-10">{renderStep()}</div>

              <div className="px-6 md:px-10 py-5 border-t border-border/60 bg-muted/20 flex flex-col sm:flex-row gap-3 justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="gap-2 w-full sm:w-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </Button>
                <span className="text-xs text-muted-foreground font-medium tabular-nums">
                  Etapa {currentStep} de {STEPS.length} · {Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100)}% concluído
                </span>
                {currentStep < STEPS.length ? (
                  <Button type="button" onClick={handleNext} className="gap-2 w-full sm:w-auto">
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading} className="gap-2 w-full sm:w-auto bg-success hover:bg-success/90 shadow-md shadow-success/20">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar Requisição
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

