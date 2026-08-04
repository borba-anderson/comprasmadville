import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface IncomingFile {
  name: string;
  mimeType: string;
  dataUrl?: string;
  text?: string;
}

type TipoDocumento = 'pedido' | 'nota_fiscal' | 'orcamento';

const SYSTEM_PROMPT = `Você é um auditor documental brasileiro extremamente rigoroso. Sua única tarefa é transcrever dados visíveis, sem inferir, completar ou corrigir silenciosamente.
Responda SOMENTE com JSON válido no formato:
{"fornecedor":"nome","prazo_entrega":"texto ou null","condicao_pagamento":"texto ou null","validade":"texto ou null","total":number|null,
"itens":[{"codigo":"string|null","descricao":"string","quantidade":number|null,"embalagem":"string|null","preco_unitario":number|null,"preco_total":number|null}]}
REGRAS OBRIGATÓRIAS:
- Transcreva cada linha de produto exatamente uma vez e preserve o código como impresso.
- Não confunda número da linha, NCM, CFOP, CST, EAN, pedido ou lote com código do produto.
- Quantidade é a quantidade comercial da linha; nunca use quantidade tributável quando houver quantidade comercial.
- Preço unitário e total devem pertencer à mesma linha. Desconto, imposto, frete e total geral não são preço de item.
- Leia todas as páginas. Ignore cabeçalhos repetidos, subtotais, transportadora, parcelas e textos legais.
- Números brasileiros: 1.234,56 significa 1234.56. Não remova casas decimais.
- Se um campo não estiver inequivocamente legível, retorne null. Nunca adivinhe.
- Antes de responder, confira internamente item por item se quantidade × preço unitário corresponde ao total da linha, tolerando apenas arredondamento de centavos.`;

const instrucoesPorTipo: Record<TipoDocumento, string> = {
  pedido: 'Este arquivo é um PEDIDO DE COMPRA ou orçamento aprovado. Extraia somente os produtos efetivamente pedidos e seus valores acordados.',
  nota_fiscal: 'Este arquivo é uma NOTA FISCAL. Extraia somente as linhas da seção DADOS DOS PRODUTOS/SERVIÇOS. Use o código do produto (CÓD. PROD.), QTD., V. UNIT. e V. TOTAL da mesma linha. Não use NCM/SH como código.',
  orcamento: 'Este arquivo é um ORÇAMENTO DE FORNECEDOR. Extraia somente itens cotados e seus respectivos preços comerciais.',
};

const numero = (valor: unknown): number | null => {
  if (typeof valor === 'number' && Number.isFinite(valor) && valor >= 0) return valor;
  return null;
};

const texto = (valor: unknown): string | null =>
  typeof valor === 'string' && valor.trim() ? valor.trim() : null;

const normalizarItens = (valor: unknown) => {
  if (!Array.isArray(valor)) return [];
  return valor.flatMap((bruto) => {
    if (!bruto || typeof bruto !== 'object') return [];
    const item = bruto as Record<string, unknown>;
    const descricao = texto(item.descricao);
    if (!descricao) return [];
    const quantidade = numero(item.quantidade);
    let precoUnitario = numero(item.preco_unitario);
    let precoTotal = numero(item.preco_total);
    if (quantidade && quantidade > 0) {
      if (precoUnitario == null && precoTotal != null) precoUnitario = precoTotal / quantidade;
      if (precoTotal == null && precoUnitario != null) precoTotal = precoUnitario * quantidade;
    }
    return [{
      codigo: texto(item.codigo),
      descricao,
      quantidade,
      embalagem: texto(item.embalagem),
      preco_unitario: precoUnitario,
      preco_total: precoTotal,
    }];
  });
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing LOVABLE_API_KEY' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const files: IncomingFile[] = Array.isArray(body?.files) ? body.files : [];
    const tipoDocumento: TipoDocumento = ['pedido', 'nota_fiscal', 'orcamento'].includes(body?.tipoDocumento)
      ? body.tipoDocumento
      : 'orcamento';
    if (!files.length) {
      return new Response(JSON.stringify({ error: 'Nenhum arquivo enviado' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = [];
    for (const f of files) {
      const content: unknown[] = [
        {
          type: 'text',
          text: `${instrucoesPorTipo[tipoDocumento]}\nArquivo: ${f.name}.${f.text ? `\n\nConteúdo tabular integral disponível:\n${f.text.slice(0, 50000)}` : ''}`,
        },
      ];

      if (f.dataUrl && f.mimeType.startsWith('image/')) {
        content.push({ type: 'image_url', image_url: { url: f.dataUrl } });
      } else if (f.dataUrl) {
        content.push({ type: 'file', file: { filename: f.name, file_data: f.dataUrl } });
      }

      const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Lovable-API-Key': apiKey },
        body: JSON.stringify({
          model: 'openai/gpt-5.6-sol',
          reasoning_effort: 'none',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content },
          ],
          response_format: { type: 'json_object' },
        }),
      });

      if (!resp.ok) {
        const errorBody = await resp.text();
        console.error(`AI gateway failed [${resp.status}]: ${errorBody}`);
        return new Response(
          JSON.stringify({ error: 'Falha na extração', status: resp.status, details: errorBody }),
          { status: resp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const json = await resp.json();
      const raw = json?.choices?.[0]?.message?.content ?? '{}';
      let parsed: Record<string, unknown> = {};
      try {
        parsed = JSON.parse(raw);
      } catch {
        const m = String(raw).match(/\{[\s\S]*\}/);
        parsed = m ? JSON.parse(m[0]) : {};
      }

      results.push({
        arquivo: f.name,
        fornecedor: texto(parsed.fornecedor) || f.name.replace(/\.[^.]+$/, ''),
        prazo_entrega: texto(parsed.prazo_entrega),
        condicao_pagamento: texto(parsed.condicao_pagamento),
        validade: texto(parsed.validade),
        total: numero(parsed.total),
        itens: normalizarItens(parsed.itens),
      });
    }

    return new Response(JSON.stringify({ fornecedores: results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('extract-orcamento error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
