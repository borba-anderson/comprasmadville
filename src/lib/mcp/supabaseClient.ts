import { createClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";

/**
 * Cliente Supabase autenticado como o usuário do token OAuth.
 * O token é encaminhado para que as políticas de RLS sejam aplicadas
 * exatamente como no app (Admin, Gestor, Comprador, Solicitante).
 */
export function supabaseForUser(ctx: ToolContext) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export function unauthenticated() {
  return {
    content: [
      { type: "text" as const, text: "Não autenticado. Conecte-se com sua conta do sistema." },
    ],
    isError: true,
  };
}

export function errorResult(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true };
}

export function jsonResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    structuredContent: { data } as Record<string, unknown>,
  };
}
