import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SETORES, UNIDADES, MOTIVOS_COMPRA, RequisicaoPrioridade } from '@/types';
import { z } from 'zod';

const formSchema = z.object({
  solicitante_nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  solicitante_email: z.string().email('Email inválido'),
  solicitante_telefone: z.string().optional(),
  solicitante_setor: z.string().min(1, 'Selecione um setor'),
  item_nome: z.string().min(3, 'Nome do item deve ter pelo menos 3 caracteres').max(200),
  quantidade: z.number().min(0.01, 'Quantidade deve ser maior que 0'),
  unidade: z.string().min(1, 'Selecione uma unidade'),
  especificacoes: z.string().optional(),
  justificativa: z.string().min(10, 'Justificativa deve ter pelo menos 10 caracteres').max(2000),
  motivo_compra: z.string().min(1, 'Selecione um motivo'),
  prioridade: z.enum(['ALTA', 'MEDIA', 'BAIXA']),
});

export default function Requisicao() {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
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
      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O arquivo deve ter no máximo 5MB',
          variant: 'destructive',
        });
        return;
      }
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: 'Tipo de arquivo inválido',
          description: 'Apenas PDF, JPG e PNG são permitidos',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // Validate form
      const result = formSchema.safeParse(formData);
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

      // Insert requisition
      const { data, error } = await supabase
        .from('requisicoes')
        .insert([{
          solicitante_nome: formData.solicitante_nome,
          solicitante_email: formData.solicitante_email,
          solicitante_telefone: formData.solicitante_telefone || null,
          solicitante_setor: formData.solicitante_setor,
          item_nome: formData.item_nome,
          quantidade: formData.quantidade,
          unidade: formData.unidade,
          especificacoes: formData.especificacoes || null,
          justificativa: formData.justificativa,
          motivo_compra: formData.motivo_compra,
          prioridade: formData.prioridade,
          status: 'pendente' as const,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating requisition:', error);
        throw error;
      }

      // Success
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
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
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
              <div className="bg-card rounded-lg p-4 mb-6">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <Header />
      <main className="page-container">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-card rounded-2xl shadow-lg border overflow-hidden">
              {/* Section 1: Solicitante */}
              <div className="p-8 border-b">
                <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                    1
                  </span>
                  Dados do Solicitante
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="solicitante_nome">
                      Nome Completo <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="solicitante_nome"
                      name="solicitante_nome"
                      value={formData.solicitante_nome}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      className="mt-1.5"
                    />
                    {errors.solicitante_nome && (
                      <p className="text-xs text-destructive mt-1">{errors.solicitante_nome}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="solicitante_email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="solicitante_email"
                      name="solicitante_email"
                      type="email"
                      value={formData.solicitante_email}
                      onChange={handleChange}
                      placeholder="seu.email@empresa.com"
                      className="mt-1.5"
                    />
                    {errors.solicitante_email && (
                      <p className="text-xs text-destructive mt-1">{errors.solicitante_email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="solicitante_telefone">Telefone</Label>
                    <Input
                      id="solicitante_telefone"
                      name="solicitante_telefone"
                      value={formData.solicitante_telefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="solicitante_setor">
                      Setor <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.solicitante_setor}
                      onValueChange={(value) => handleSelectChange('solicitante_setor', value)}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {SETORES.map((setor) => (
                          <SelectItem key={setor} value={setor}>
                            {setor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.solicitante_setor && (
                      <p className="text-xs text-destructive mt-1">{errors.solicitante_setor}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Item */}
              <div className="p-8 border-b">
                <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                    2
                  </span>
                  Detalhes do Item
                </h2>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="item_nome">
                      Nome do Item <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="item_nome"
                      name="item_nome"
                      value={formData.item_nome}
                      onChange={handleChange}
                      placeholder="Ex: Notebook Dell Inspiron 15"
                      className="mt-1.5"
                    />
                    {errors.item_nome && (
                      <p className="text-xs text-destructive mt-1">{errors.item_nome}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="quantidade">
                        Quantidade <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="quantidade"
                        name="quantidade"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={formData.quantidade}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                      {errors.quantidade && (
                        <p className="text-xs text-destructive mt-1">{errors.quantidade}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="unidade">
                        Unidade <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.unidade}
                        onValueChange={(value) => handleSelectChange('unidade', value)}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UNIDADES.map((unidade) => (
                            <SelectItem key={unidade} value={unidade}>
                              {unidade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="especificacoes">Especificações Técnicas</Label>
                    <Textarea
                      id="especificacoes"
                      name="especificacoes"
                      value={formData.especificacoes}
                      onChange={handleChange}
                      placeholder="Modelo, cor, tamanho, características específicas..."
                      rows={3}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Justificativa */}
              <div className="p-8 border-b">
                <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                    3
                  </span>
                  Justificativa e Prioridade
                </h2>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="justificativa">
                      Justificativa <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="justificativa"
                      name="justificativa"
                      value={formData.justificativa}
                      onChange={handleChange}
                      placeholder="Explique por que este item é necessário..."
                      rows={4}
                      className="mt-1.5"
                    />
                    {errors.justificativa && (
                      <p className="text-xs text-destructive mt-1">{errors.justificativa}</p>
                    )}
                  </div>

                  <div>
                    <Label>
                      Motivo da Compra <span className="text-destructive">*</span>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {MOTIVOS_COMPRA.map((motivo) => (
                        <label
                          key={motivo}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.motivo_compra === motivo
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="motivo_compra"
                            value={motivo}
                            checked={formData.motivo_compra === motivo}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{motivo}</span>
                        </label>
                      ))}
                    </div>
                    {errors.motivo_compra && (
                      <p className="text-xs text-destructive mt-1">{errors.motivo_compra}</p>
                    )}
                  </div>

                  <div>
                    <Label>
                      Prioridade <span className="text-destructive">*</span>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      {[
                        { value: 'ALTA', label: 'Alta', desc: 'Máximo 24h', color: 'destructive' },
                        { value: 'MEDIA', label: 'Média', desc: 'Até 3 dias', color: 'warning' },
                        { value: 'BAIXA', label: 'Baixa', desc: 'Planejamento', color: 'success' },
                      ].map((prio) => (
                        <label
                          key={prio.value}
                          className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.prioridade === prio.value
                              ? `border-${prio.color} bg-${prio.color}/10`
                              : 'border-border hover:border-muted-foreground/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="prioridade"
                            value={prio.value}
                            checked={formData.prioridade === prio.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span className={`priority-badge priority-${prio.value} mb-1`}>
                            {prio.label}
                          </span>
                          <span className="text-xs text-muted-foreground">{prio.desc}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Anexo */}
              <div className="p-8">
                <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                    4
                  </span>
                  Anexo (Opcional)
                </h2>

                <div className="relative">
                  {file ? (
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <FileText className="w-8 h-8 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setFile(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                      <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                      <p className="text-sm font-medium">Clique para selecionar</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, JPG ou PNG (máx. 5MB)
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>

                {/* Submit */}
                <Button type="submit" size="xl" className="w-full mt-8" isLoading={isLoading}>
                  <Send className="w-5 h-5" />
                  Enviar Requisição
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
