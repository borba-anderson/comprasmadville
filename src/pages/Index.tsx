import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LayoutDashboard, ListTree } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Requisicao } from "@/types";
import { ExecutiveHero } from "@/components/home/ExecutiveHero";
import { ExecutiveKPIRow } from "@/components/home/ExecutiveKPIRow";
import { StrategicCharts } from "@/components/home/StrategicCharts";
import { PriorityDecisions } from "@/components/operacoes/PriorityDecisions";

const TERMINAL: Requisicao["status"][] = ["recebido", "rejeitado", "cancelado"];

const Index = () => {
  const { user } = useAuth();
  const [reqs, setReqs] = useState<Requisicao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("requisicoes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!active) return;
        setReqs((data || []) as Requisicao[]);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  // Derive resumo executivo numbers for the hero chips
  const now = new Date();
  const economia = reqs.reduce(
    (s, r) =>
      r.valor_orcado && r.valor && r.valor < r.valor_orcado
        ? s + (r.valor_orcado - r.valor)
        : s,
    0,
  );
  const atrasos = reqs.filter(
    (r) =>
      r.previsao_entrega &&
      new Date(r.previsao_entrega) < now &&
      !TERMINAL.includes(r.status),
  ).length;
  const andamento = reqs.filter((r) =>
    ["aprovado", "cotando", "comprado", "em_entrega"].includes(r.status),
  ).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="h-0.5 bg-emerald-600 w-full" />
      <div className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <Header />
      </div>

      <main>
        <ExecutiveHero economia={economia} atrasos={atrasos} andamento={andamento} />

        {user ? (
          <>
            <ExecutiveKPIRow requisicoes={reqs} />

            <section className="px-6 md:px-12 max-w-7xl mx-auto pt-16">
              <div className="flex items-baseline justify-between mb-5">
                <div>
                  <h2 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-slate-500">
                    Central de Ações
                  </h2>
                  <p className="text-[20px] font-semibold text-slate-900 mt-1">
                    Decisões que destravam a operação
                  </p>
                </div>
                <Link
                  to="/operacoes"
                  className="text-[12px] font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
                >
                  Ver tudo <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <PriorityDecisions reqs={reqs} limit={6} />
            </section>

            <StrategicCharts requisicoes={reqs} />

            <section className="px-6 md:px-12 max-w-7xl mx-auto pb-20">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="text-[11px] tracking-[0.14em] uppercase text-slate-400 font-semibold">
                    Aprofundar
                  </div>
                  <h3 className="text-[22px] font-semibold text-slate-900 mt-1">
                    Explore o analítico completo
                  </h3>
                  <p className="text-[13.5px] text-slate-500 mt-1 max-w-lg">
                    Financeiro, operacional, fornecedores, compradores e preditivo —
                    organizados em uma vista executiva única.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/painel"
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Painel analítico
                  </Link>
                  <Link
                    to="/operacoes"
                    className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                  >
                    <ListTree className="w-4 h-4" /> Command Center
                  </Link>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="px-6 md:px-12 max-w-7xl mx-auto pb-24">
            <div className="rounded-2xl border border-slate-200 p-10 text-center">
              <h2 className="text-[22px] font-semibold text-slate-900">
                Entre para ver sua operação ao vivo
              </h2>
              <p className="text-[14px] text-slate-500 mt-2">
                KPIs executivos, decisões prioritárias e visão estratégica em um só lugar.
              </p>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 mt-6 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
              >
                Entrar <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        )}

        <footer className="py-10 text-center border-t border-slate-100 bg-white px-4">
          <p className="text-slate-500 text-xs font-medium">
            © 2026 GMAD Madville | Curitiba — Procurement Intelligence
          </p>
          <p className="text-slate-400 text-[11px] mt-2">
            Suporte:{" "}
            <a
              href="https://wa.me/5547992189824"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:underline font-semibold"
            >
              WhatsApp
            </a>
          </p>
        </footer>

        {loading && user && (
          <div className="fixed bottom-4 right-4 text-[11px] text-slate-400 bg-white/80 backdrop-blur px-2.5 py-1 rounded-md border border-slate-100">
            atualizando…
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
