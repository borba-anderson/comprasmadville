import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, errorResult, jsonResult } from "../supabaseClient";

export default defineTool({
  name: "resumo_compras",
  title: "Resumo de compras",
  description:
    "Retorna indicadores agregados das requisições visíveis: contagem por status, valor total comprado, valor orçado e economia estimada em um período.",
  inputSchema: {
    dias: z.number().int().optional().describe("Janela em dias a considerar a partir de hoje (padrão 30)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ dias }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const janela = Math.min(Math.max(dias ?? 30, 1), 365);
    const desde = new Date(Date.now() - janela * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabaseForUser(ctx)
      .from("requisicoes")
      .select("status, valor, valor_orcado, created_at")
      .gte("created_at", desde);

    if (error) return errorResult(error.message);

    const linhas = data ?? [];
    const porStatus: Record<string, number> = {};
    let totalComprado = 0;
    let totalOrcado = 0;

    for (const r of linhas) {
      porStatus[r.status] = (porStatus[r.status] ?? 0) + 1;
      if (r.valor) totalComprado += Number(r.valor);
      if (r.valor_orcado) totalOrcado += Number(r.valor_orcado);
    }

    return jsonResult({
      periodo_dias: janela,
      total_requisicoes: linhas.length,
      por_status: porStatus,
      valor_total_comprado: totalComprado,
      valor_total_orcado: totalOrcado,
      economia_estimada: totalOrcado - totalComprado,
      moeda: "BRL",
    });
  },
});
