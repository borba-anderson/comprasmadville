import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, errorResult, jsonResult } from "../supabaseClient";

export default defineTool({
  name: "detalhe_requisicao",
  title: "Detalhe da requisição",
  description:
    "Retorna todos os dados de uma requisição específica, buscada pelo protocolo (ex.: REQ-000123) ou pelo ID.",
  inputSchema: {
    protocolo: z.string().optional().describe("Protocolo da requisição, ex.: REQ-000123."),
    id: z.string().optional().describe("ID (UUID) da requisição."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ protocolo, id }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    if (!protocolo && !id) return errorResult("Informe o protocolo ou o id da requisição.");

    const supabase = supabaseForUser(ctx);
    let query = supabase.from("requisicoes").select("*").limit(1);
    query = id ? query.eq("id", id) : query.eq("protocolo", protocolo!);

    const { data, error } = await query.maybeSingle();
    if (error) return errorResult(error.message);
    if (!data) return errorResult("Requisição não encontrada ou sem permissão de acesso.");

    const { data: comentarios } = await supabase
      .from("comentarios")
      .select("autor_nome, mensagem, created_at")
      .eq("requisicao_id", data.id)
      .order("created_at", { ascending: true });

    return jsonResult({ requisicao: data, comentarios: comentarios ?? [] });
  },
});
