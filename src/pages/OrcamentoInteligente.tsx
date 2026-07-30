import { useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FileDropzone, UploadFile } from '@/components/orcamento/FileDropzone';
import { ComparisonTable } from '@/components/orcamento/ComparisonTable';
import { RecommendationSummary } from '@/components/orcamento/RecommendationSummary';
import {
  FornecedorOrcamento,
  calcularResumo,
  construirComparativo,
} from '@/components/orcamento/types';
import { Sparkles, Loader2, Save, RotateCcw } from 'lucide-react';

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const isSheet = (name: string) => /\.(xlsx|xls|csv)$/i.test(name);

export default function OrcamentoInteligente() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [fornecedores, setFornecedores] = useState<FornecedorOrcamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const linhas = useMemo(() => construirComparativo(fornecedores), [fornecedores]);
  const resumo = useMemo(() => calcularResumo(fornecedores, linhas), [fornecedores, linhas]);

  const analisar = async () => {
    if (!files.length) return;
    setLoading(true);
    try {
      const payload = await Promise.all(
        files.map(async ({ file }) => {
          if (isSheet(file.name)) {
            const XLSX = await import('xlsx');
            const buf = await file.arrayBuffer();
            const wb = XLSX.read(buf, { type: 'array' });
            const text = wb.SheetNames.map(
              (n) => `# ${n}\n${XLSX.utils.sheet_to_csv(wb.Sheets[n])}`
            ).join('\n\n');
            return { name: file.name, mimeType: 'text/csv', text };
          }
          return { name: file.name, mimeType: file.type || 'application/pdf', dataUrl: await fileToDataUrl(file) };
        })
      );

      const { data, error } = await supabase.functions.invoke('extract-orcamento', {
        body: { files: payload },
      });
      if (error) throw error;

      const extraidos: FornecedorOrcamento[] = (data?.fornecedores ?? []).map(
        (f: Omit<FornecedorOrcamento, 'id'>, i: number) => ({ ...f, id: `f${i}` })
      );
      setFornecedores(extraidos);
      toast({
        title: 'Orçamentos analisados',
        description: `${extraidos.length} fornecedor(es) · ${extraidos.reduce((s, f) => s + f.itens.length, 0)} itens extraídos`,
      });
    } catch (e) {
      toast({
        title: 'Erro na análise',
        description: e instanceof Error ? e.message : String(e),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const salvar = async () => {
    setSaving(true);
    const { error } = await supabase.from('orcamento_analises').insert({
      titulo: `Comparativo ${new Date().toLocaleDateString('pt-BR')}`,
      criado_por: profile?.nome ?? null,
      fornecedores: fornecedores as never,
      resumo: resumo as never,
    });
    setSaving(false);
    toast(
      error
        ? { title: 'Erro ao salvar', description: error.message, variant: 'destructive' }
        : { title: 'Comparativo salvo' }
    );
  };

  return (
    <div className="page-shell pb-12 stack-section">
      <header className="page-header">
        <h1 className="page-title flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" strokeWidth={1.75} /> Orçamento Inteligente
        </h1>
        <p className="page-subtitle">
          Anexe as propostas dos fornecedores — a IA extrai os itens, compara preços e recomenda a melhor compra.
        </p>
      </header>

      <section className="surface-card p-5 stack-md">
        <FileDropzone
          files={files}
          disabled={loading}
          onAdd={(fs) =>
            setFiles((prev) => [...prev, ...fs.map((file) => ({ id: crypto.randomUUID(), file }))])
          }
          onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={analisar} disabled={!files.length || loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? 'Analisando propostas...' : 'Analisar com IA'}
          </Button>
          {fornecedores.length > 0 && (
            <>
              <Button variant="outline" onClick={salvar} disabled={saving}>
                <Save className="mr-2 h-4 w-4" /> Salvar comparativo
              </Button>
              <Button variant="ghost" onClick={() => setFornecedores([])}>
                <RotateCcw className="mr-2 h-4 w-4" /> Limpar análise
              </Button>
            </>
          )}
        </div>
      </section>

      {fornecedores.length > 0 && (
        <>
          <RecommendationSummary fornecedores={fornecedores} resumo={resumo} />
          <section className="stack-md">
            <h2 className="data-label">Comparativo item a item</h2>
            <ComparisonTable fornecedores={fornecedores} linhas={linhas} />
          </section>
        </>
      )}
    </div>
  );
}
