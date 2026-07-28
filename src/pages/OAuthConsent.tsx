import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldCheck } from "lucide-react";

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Parâmetro authorization_id ausente.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = `/auth?next=${encodeURIComponent(next)}`;
        return;
      }
      try {
        const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
        if (!active) return;
        if (error) {
          setError(error.message);
          return;
        }
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) {
          window.location.href = immediate;
          return;
        }
        setDetails(data);
      } catch (e: any) {
        if (active) setError(e?.message ?? "Falha ao carregar a autorização.");
      }
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    try {
      const { data, error } = approve
        ? await oauth().approveAuthorization(authorizationId)
        : await oauth().denyAuthorization(authorizationId);
      if (error) {
        setBusy(false);
        setError(error.message);
        return;
      }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) {
        setBusy(false);
        setError("O servidor de autorização não retornou um redirecionamento.");
        return;
      }
      window.location.href = target;
    } catch (e: any) {
      setBusy(false);
      setError(e?.message ?? "Falha ao concluir a autorização.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[hsl(var(--surface-2))] px-4">
      <Card className="w-full max-w-md">
        {error ? (
          <>
            <CardHeader>
              <CardTitle className="text-lg">Não foi possível continuar</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
          </>
        ) : !details ? (
          <CardContent className="py-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Carregando autorização…
          </CardContent>
        ) : (
          <>
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-lg">
                Conectar {details.client?.name ?? "aplicativo"} à sua conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {details.client?.name ?? "O aplicativo"} poderá usar as ferramentas do Sistema de
                Requisições de Compras em seu nome, respeitando suas permissões atuais.
              </p>
              {details.client?.redirect_uri && (
                <p className="text-xs text-muted-foreground break-all">
                  Redirecionamento: {details.client.redirect_uri}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <Button disabled={busy} onClick={() => decide(true)} className="flex-1">
                  Aprovar
                </Button>
                <Button
                  disabled={busy}
                  variant="outline"
                  onClick={() => decide(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </main>
  );
}
