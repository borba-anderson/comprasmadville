import { supabase } from '@/integrations/supabase/client';
import { FunctionsHttpError } from '@supabase/supabase-js';
import type { FornecedorOrcamento } from '@/components/orcamento/types';

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const isSheet = (name: string) => /\.(xlsx|xls|csv)$/i.test(name);

export type TipoDocumento = 'pedido' | 'nota_fiscal' | 'orcamento';

const mensagemErroExtracao = async (error: unknown): Promise<string> => {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = await error.context.json();
      if (body?.status === 402) {
        return 'Os créditos de IA do workspace estão esgotados. Adicione créditos nas configurações de cobrança para liberar a leitura dos documentos.';
      }
      if (body?.status === 429) {
        return 'O serviço de leitura atingiu o limite temporário. Aguarde alguns instantes e tente novamente.';
      }
      if (typeof body?.error === 'string' && body.error.trim()) return body.error;
    } catch {
      // Mantém a mensagem segura abaixo quando a resposta não contém JSON válido.
    }
  }
  return error instanceof Error ? error.message : 'Não foi possível ler os documentos.';
};

export async function buildPayload(files: File[]) {
  return Promise.all(
    files.map(async (file) => {
      if (isSheet(file.name)) {
        const XLSX = await import('xlsx');
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        const text = wb.SheetNames.map(
          (n) => `# ${n}\n${XLSX.utils.sheet_to_csv(wb.Sheets[n])}`
        ).join('\n\n');
        return { name: file.name, mimeType: 'text/csv', text };
      }
      return {
        name: file.name,
        mimeType: file.type || 'application/pdf',
        dataUrl: await fileToDataUrl(file),
      };
    })
  );
}

/** Extrai documentos com instruções específicas para cada natureza fiscal/comercial. */
export async function extrairDocumentos(
  files: File[],
  tipoDocumento: TipoDocumento = 'orcamento'
): Promise<FornecedorOrcamento[]> {
  if (!files.length) return [];
  const payload = await buildPayload(files);
  const { data, error } = await supabase.functions.invoke('extract-orcamento', {
    body: { files: payload, tipoDocumento },
  });
  if (error) throw new Error(await mensagemErroExtracao(error));
  if (!Array.isArray(data?.fornecedores)) {
    throw new Error('A leitura não retornou dados estruturados. Tente novamente com um arquivo mais nítido.');
  }
  return (data?.fornecedores ?? []).map(
    (f: Omit<FornecedorOrcamento, 'id'>, i: number) => ({ ...f, id: `d${i}-${Date.now()}` })
  );
}
