import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, errorResult, jsonResult } from "../supabaseClient";

const SETORES_HINT = "Setor/departamento do solicitante, ex.: Compras, Endomarketing, TI.";

export default defineTool({
  name: "criar_requisicao",
  title: "Criar requisição de compra",
  description:
    "Cria uma nova requisição de compra em nome do usuário conectado. O protocolo é gerado automaticamente pelo sistema.",
  inputSchema: {
    item_nome: z.string().describe("Nome do item ou serviço solicitado."),
    quantidade: z.number().describe("Quantidade solicitada."),
    unidade: z.string().describe("Unidade de medida, ex.: Unidade, Caixa, Metro."),
    justificativa: z.string().describe("Justificativa da compra (mínimo 50 caracteres)."),
    solicitante_nome: z.string().describe("Nome completo do solicitante."),
    solicitante_email: z.string().describe("E-mail do solicitante."),
    solicitante_setor: z.string().describe(SETORES_HINT),
    solicitante_empresa: z.string().optional().describe("Empresa do solicitante."),
    solicitante_telefone: z.string().optional().describe("Telefone do solicitante."),
    prioridade: z.enum(["ALTA", "MEDIA", "BAIXA"]).optional().describe("Prioridade (padrão MEDIA)."),
    especificacoes: z.string().optional().describe("Especificações técnicas adicionais."),
    centro_custo: z.string().optional().describe("Centro de custo."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    if (input.justificativa.trim().length < 50)
      return errorResult("A justificativa deve ter pelo menos 50 caracteres.");
    if (!(input.quantidade > 0)) return errorResult("A quantidade deve ser maior que zero.");

    const { data, error } = await supabaseForUser(ctx)
      .from("requisicoes")
      .insert({
        item_nome: input.item_nome,
        quantidade: input.quantidade,
        unidade: input.unidade,
        justificativa: input.justificativa,
        solicitante_nome: input.solicitante_nome,
        solicitante_email: input.solicitante_email,
        solicitante_setor: input.solicitante_setor,
        solicitante_empresa: input.solicitante_empresa ?? null,
        solicitante_telefone: input.solicitante_telefone ?? null,
        prioridade: input.prioridade ?? "MEDIA",
        especificacoes: input.especificacoes ?? null,
        centro_custo: input.centro_custo ?? null,
      })
      .select("id, protocolo, item_nome, status, prioridade, created_at")
      .maybeSingle();

    if (error) return errorResult(error.message);
    return jsonResult({ criada: data });
  },
});
