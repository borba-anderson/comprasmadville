import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, errorResult, jsonResult } from "../supabaseClient";

const STATUS = [
  "pendente",
  "em_analise",
  "aprovado",
  "cotando",
  "comprado",
  "em_entrega",
  "recebido",
  "rejeitado",
  "cancelado",
] as const;

export default defineTool({
  name: "listar_requisicoes",
  title: "Listar requisições",
  description:
    "Lista as requisições de compra visíveis para o usuário conectado, com filtros opcionais por status, prioridade, setor, empresa e texto livre.",
  inputSchema: {
    status: z.enum(STATUS).optional().describe("Filtrar por status da requisição."),
    prioridade: z.enum(["ALTA", "MEDIA", "BAIXA"]).optional().describe("Filtrar por prioridade."),
    setor: z.string().optional().describe("Filtrar pelo setor/departamento do solicitante."),
    empresa: z.string().optional().describe("Filtrar pela empresa do solicitante."),
    busca: z.string().optional().describe("Texto livre buscado no nome do item ou protocolo."),
    limite: z.number().int().optional().describe("Quantidade máxima de registros (padrão 20, máximo 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, prioridade, setor, empresa, busca, limite }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const max = Math.min(Math.max(limite ?? 20, 1), 100);

    let query = supabaseForUser(ctx)
      .from("requisicoes")
      .select(
        "id, protocolo, item_nome, quantidade, unidade, status, prioridade, solicitante_nome, solicitante_setor, solicitante_empresa, fornecedor_nome, valor, valor_orcado, previsao_entrega, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(max);

    if (status) query = query.eq("status", status);
    if (prioridade) query = query.eq("prioridade", prioridade);
    if (setor) query = query.eq("solicitante_setor", setor);
    if (empresa) query = query.eq("solicitante_empresa", empresa);
    if (busca) query = query.or(`item_nome.ilike.%${busca}%,protocolo.ilike.%${busca}%`);

    const { data, error } = await query;
    if (error) return errorResult(error.message);
    return jsonResult({ total: data?.length ?? 0, requisicoes: data ?? [] });
  },
});
