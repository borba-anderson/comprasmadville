import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, errorResult, jsonResult } from "../supabaseClient";

export default defineTool({
  name: "adicionar_comentario",
  title: "Comentar em uma requisição",
  description:
    "Adiciona um comentário a uma requisição existente, identificada por protocolo ou ID.",
  inputSchema: {
    protocolo: z.string().optional().describe("Protocolo da requisição, ex.: REQ-000123."),
    id: z.string().optional().describe("ID (UUID) da requisição."),
    mensagem: z.string().describe("Texto do comentário."),
    autor_nome: z.string().describe("Nome de quem está comentando."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ protocolo, id, mensagem, autor_nome }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    if (!protocolo && !id) return errorResult("Informe o protocolo ou o id da requisição.");
    if (!mensagem.trim()) return errorResult("A mensagem não pode ser vazia.");

    const supabase = supabaseForUser(ctx);
    let reqId = id;
    if (!reqId) {
      const { data, error } = await supabase
        .from("requisicoes")
        .select("id")
        .eq("protocolo", protocolo!)
        .maybeSingle();
      if (error) return errorResult(error.message);
      if (!data) return errorResult("Requisição não encontrada ou sem permissão de acesso.");
      reqId = data.id;
    }

    const { data, error } = await supabase
      .from("comentarios")
      .insert({ requisicao_id: reqId, mensagem, autor_nome })
      .select("id, mensagem, autor_nome, created_at")
      .maybeSingle();

    if (error) return errorResult(error.message);
    return jsonResult({ comentario: data });
  },
});
