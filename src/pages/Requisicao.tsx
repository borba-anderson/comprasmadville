import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Send, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RequisicaoPrioridade } from '@/types';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import {
  FormStepper,
  StepSolicitante,
  StepItem,
  StepJustificativa,
  StepAnexo,
  StepRevisao,
} from '@/components/requisicao';

const STEPS = [
  { id: 1, title: 'Solicitante', description: 'Seus dados' },
  { id: 2, title: 'Item', description: 'O que precisa' },
  { id: 3, title: 'Justificativa', description: 'Por que precisa' },
  { id: 4, title: 'Anexo', description: 'Documentos' },
  { id: 5, title: 'Revisão', description: 'Confirmar envio' },
];

const createFormSchema = (isHighPriority: boolean) => z.object({
  solicitante_nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  solicitante_email: z.string().email('Email inválido'),
  solicitante_telefone: z.string().min(8, 'Telefone é obrigatório'),
  solicitante_setor: z.string().min(1, 'Selecione um setor'),
  solicitante_empresa: z.string().min(1, 'Selecione uma empresa'),
  item_nome: z.string().min(3, 'Nome do item deve ter pelo menos 3 caracteres').max(200),
  quantidade: z.number().min(0.01, 'Quantidade deve ser maior que 0'),
  unidade: z.string().min(1, 'Selecione uma unidade'),
  especificacoes: z.string().optional(),
  justificativa: z.string()
    .min(isHighPriority ? 50 : 10, isHighPriority 
      ? 'Para alta prioridade, justificativa deve ter pelo menos 50 caracteres' 
      : 'Justificativa deve ter pelo menos 10 caracteres')
    .max(2000),
  motivo_compra: z.string().min(1, 'Selecione um motivo'),
  prioridade: z.enum(['ALTA', 'MEDIA', 'BAIXA']),
});

export default function Requisicao() {
  const { user, profile, isLoading: authLoading, rolesLoaded } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [protocolo, setProtocolo] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    solicitante_nome: '',
    solicitante_email: '',
    solicitante_telefone: '',
    solicitante_setor: '',
    solicitante_empresa: '',
    item_nome: '',
    quantidade: 1,
    unidade: 'unidade',
    especificacoes: '',
    justificativa: '',
    motivo_compra: '',
    prioridade: 'MEDIA' as RequisicaoPrioridade,
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && rolesLoaded && !user) {
      toast({
        title: 'Acesso restrito',
        description: 'Faça login para criar uma requisição.',
        variant: 'destructive',
      });
      navigate('/auth');
    }
  }, [authLoading, rolesLoaded, user, navigate, toast]);

  // Pre-fill form with user profile data
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        solicitante_nome: profile.nome || '',
        solicitante_email: profile.email || '',
        solicitante_telefone: profile.telefone || '',
        solicitante_setor: profile.setor || '',
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
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name === 'solicitante_telefone') {
      const formatted = formatPhone(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
      setErrors(prev => ({ ...prev, [name]: '' }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O arquivo deve ter no máximo 5MB',
          variant: 'destructive',
        });
        return;
      }
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: 'Tipo de arquivo inválido',
          description: 'Apenas PDF, JPG, PNG e Excel são permitidos',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const validateStep = (step: number): boolean => {
    const isHighPriority = formData.prioridade === 'ALTA';
    const schema = createFormSchema(isHighPriority);
    
    type FormDataKey = keyof typeof formData;
    let fieldsToValidate: FormDataKey[] = [];
    
    switch (step) {
      case 1:
        fieldsToValidate = ['solicitante_nome', 'solicitante_email', 'solicitante_setor', 'solicitante_telefone', 'solicitante_empresa'];
        break;
      case 2:
        fieldsToValidate = ['item_nome', 'quantidade', 'unidade'];
        break;
      case 3:
        fieldsToValidate = ['justificativa', 'motivo_compra', 'prioridade'];
        break;
      case 4:
        return true; // Anexo é opcional
      case 5:
        return true; // Revisão não precisa validar
    }

    const partialData: Record<string, unknown> = {};
    fieldsToValidate.forEach(field => {
      partialData[field] = formData[field];
    });

    const result = schema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
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
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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
      const isHighPriority = formData.prioridade === 'ALTA';
      const schema = createFormSchema(isHighPriority);
      const result = schema.safeParse(formData);
      
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        toast({
          title: 'Erro de validação',
          description: 'Verifique os campos destacados.',
          variant: 'destructive',
        });
        return;
      }

      let arquivo_url: string | null = null;
      let arquivo_nome: string | null = null;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('requisicoes-anexos')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          throw new Error('Erro ao enviar arquivo');
        }

        const { data: urlData } = supabase.storage
          .from('requisicoes-anexos')
          .getPublicUrl(fileName);

        arquivo_url = urlData.publicUrl;
        arquivo_nome = file.name;
      }

      const { data, error } = await supabase
        .from('requisicoes')
        .insert([{
          solicitante_nome: formData.solicitante_nome,
          solicitante_email: formData.solicitante_email,
          solicitante_telefone: formData.solicitante_telefone,
          solicitante_setor: formData.solicitante_setor,
          solicitante_empresa: formData.solicitante_empresa,
          item_nome: formData.item_nome,
          quantidade: formData.quantidade,
          unidade: formData.unidade,
          especificacoes: formData.especificacoes || null,
          justificativa: formData.justificativa,
          motivo_compra: formData.motivo_compra,
          prioridade: formData.prioridade,
          status: 'pendente' as const,
          arquivo_url,
          arquivo_nome,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating requisition:', error);
        throw error;
      }

      setProtocolo(data.protocolo);
      setIsSuccess(true);

      toast({
        title: 'Requisição enviada!',
        description: `Protocolo: ${data.protocolo}`,
      });
    } catch (error: unknown) {
      console.error('Error:', error);
      toast({
        title: 'Erro ao enviar',
        description: 'Ocorreu um erro ao enviar sua requisição. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="page-container">
          <div className="max-w-2xl mx-auto">
            <div className="bg-success/10 border-2 border-success/30 rounded-2xl p-8 text-center animate-scale-in">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-success-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Requisição Enviada!
              </h2>
              <p className="text-muted-foreground mb-4">
                Sua requisição foi recebida e está aguardando análise.
              </p>
              <div className="bg-card rounded-lg p-4 mb-6 border">
                <p className="text-sm text-muted-foreground">Protocolo</p>
                <p className="text-2xl font-bold font-mono text-primary">{protocolo}</p>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Você receberá atualizações no email:{' '}
                <strong>{formData.solicitante_email}</strong>
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => window.location.reload()}>
                  Nova Requisição
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">Voltar ao Início</Link>
                </Button>
              </div>
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
          <StepItem
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
          />
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
            file={file}
            onFileChange={handleFileChange}
            onFileRemove={() => setFile(null)}
            formData={formData}
          />
        );
      case 5:
        return (
          <StepRevisao
            formData={formData}
            file={file}
            onEditStep={(step) => setCurrentStep(step)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="page-container">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>

          {/* Stepper */}
          <div className="bg-card rounded-2xl shadow-lg border overflow-hidden">
            <div className="p-6 border-b bg-muted/30">
              <FormStepper
                steps={STEPS}
                currentStep={currentStep}
                onStepClick={handleStepClick}
              />
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit}>
              <div className="p-8">
                {renderStep()}
              </div>

              {/* Navigation */}
              <div className="p-6 border-t bg-muted/20 flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </Button>

                <span className="text-sm text-muted-foreground">
                  Etapa {currentStep} de {STEPS.length}
                </span>

                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="gap-2"
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="gap-2 bg-success hover:bg-success/90"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Requisição
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
