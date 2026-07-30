import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface IncomingFile {
  name: string;
  mimeType: string;
  dataUrl?: string;
  text?: string;
}

const SYSTEM_PROMPT = `Você é um analista de compras. Extraia, de orçamentos de fornecedores, os dados estruturados.
Responda SOMENTE com JSON válido no formato:
{"fornecedor":"nome","prazo_entrega":"texto ou null","condicao_pagamento":"texto ou null","validade":"texto ou null","total":number|null,
"itens":[{"codigo":"string|null","descricao":"string","quantidade":number|null,"embalagem":"string|null","preco_unitario":number|null,"preco_total":number|null}]}
Valores numéricos em reais como número (use ponto decimal). Nunca invente itens que não existam no documento.`;

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
          text: `Extraia os itens deste orçamento (arquivo: ${f.name}).${f.text ? `\n\nConteúdo tabular:\n${f.text.slice(0, 20000)}` : ''}`,
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
        fornecedor: (parsed.fornecedor as string) || f.name.replace(/\.[^.]+$/, ''),
        prazo_entrega: parsed.prazo_entrega ?? null,
        condicao_pagamento: parsed.condicao_pagamento ?? null,
        validade: parsed.validade ?? null,
        total: parsed.total ?? null,
        itens: Array.isArray(parsed.itens) ? parsed.itens : [],
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
