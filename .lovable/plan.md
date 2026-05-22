## Reestruturação Visual — Procurement Intelligence Premium

Objetivo: transformar o sistema em uma plataforma SaaS premium (Stripe/Linear/Ramp-like), reduzindo poluição visual, criando hierarquia clara em 3 níveis (Executivo → Ações → Analítico) e tornando tudo action-driven.

Princípio: **remover, simplificar, organizar** — sem adicionar features novas.

---

### Fase 1 — Design tokens & paleta enxuta
Arquivo: `src/index.css`

- Reduzir paleta ativa para 4 cores semânticas: verde institucional (#008651), cinza neutro (escala), vermelho alerta, azul insight.
- Aposentar acentos roxo/amarelo nos componentes core (Insight/AI vira azul, anomaly vira cinza-neutro).
- Aumentar `--radius`, suavizar sombras (camada única mais difusa), tipografia com tracking executivo.
- Tokens novos: `--surface-1/2/3`, `--ink-1/2/3`, `--accent-soft`, `--danger-soft`, `--info-soft`.
- Utilities: `.section` (padding/respiro grande), `.divide-soft`, `.eyebrow-exec`.

### Fase 2 — Home (Index.tsx) reestruturada
Arquivo: `src/pages/Index.tsx` (+ ajustes em `src/components/home/*`)

Nova estrutura linear, sem widgets dispersos:

1. **Hero executivo** — "Procurement Intelligence" + subtítulo + mini-resumo lateral (3 números chave: economia mês, alertas críticos, em andamento). Sem CTA marketing duplicado.
2. **4 KPIs grandes** — Spend Total · Economia Gerada · Compras em Andamento · Atrasos Críticos. Cards grandes, número dominante, delta sutil, sem mini-charts dentro.
3. **Central de Ações** (PriorityDecisions evoluído) — a peça mais importante: lista de decisões com prioridade, impacto financeiro em R$, contexto IA inline ("Mercado Livre gerou 60% dos atrasos") e CTAs (Resolver / Ver / Acompanhar).
4. **Visão Estratégica** — apenas 4 gráficos: Tendência · Lead time · Pareto categorias · Economia. Maiores, mais limpos, sem labels redundantes.
5. **Entrada para abas analíticas** — link/tabs para o Dashboard completo (`/painel` ou seção abaixo).

Remover do Index: LogoMarquee, HowItWorks extenso, HeroFlowDiagram, QuickStats duplicado, ActionCards genéricos. Manter apenas o essencial executivo.

### Fase 3 — Dashboard (GastosDashboard) enxuto
Arquivo: `src/components/dashboard/GastosDashboard.tsx`

- Manter abas (Visão Geral / Financeiro / Fornecedores / Operacional / Preditivo) mas **reduzir widgets por aba**:
  - Visão Geral: TrendChart + ProcessFunnel + LeadTime (3 blocos, full-width alternados).
  - Financeiro: SpendIntelligence + EconomiaSummary + 1 gráfico setor (consolidar 4 → 2).
  - Fornecedores: SupplierPerformance + ranking solicitantes.
  - Operacional: OperationalEfficiency + Alertas (sem duplicar).
  - Preditivo: PredictiveInsights expandido (ver Fase 5).
- Remover ExecutiveKPIs duplicado (já no Hero) e SmartActionCenter (substituído por PriorityDecisions na Home).
- Espaçamento: `gap-8` entre seções, padding interno aumentado, divisórias suavizadas.

### Fase 4 — Polish de componentes existentes
- `DecisionKPI` → versão "executive large" (número 4xl, sem sparkline quando não agrega).
- `PriorityDecisions` → cada item com bloco de impacto financeiro destacado + 3 CTAs (Resolver/Ver/Acompanhar) + insight IA contextual usando `AIInsightInline` variant `risk|opportunity`.
- `AIInsightInline` → variants `anomaly/neutral` repaletados para cinza/azul (remover violeta).
- Cards (`card.tsx`) → radius maior, shadow mais sutil via token.

### Fase 5 — Preditivo sofisticado
Arquivo: `src/components/dashboard/PredictiveInsights.tsx`

Layout estilo "IA analisando":
- Header com pulso "IA · Análise em tempo real".
- 4 blocos: Previsão de Gastos (próx. 30d) · Risco de Atraso por requisição · Tendência por Fornecedor · Anomalias detectadas.
- Score de risco automático (0-100) com barra e leitura textual.
- Visual: gradientes sutis azul-info, números grandes, narrativa explicativa por bloco.

Usar apenas heurísticas já existentes sobre `requisicoes` — sem nova lógica de negócio nem backend.

---

### Fora de escopo
- Nenhuma mudança de backend, schema, RLS ou edge functions.
- Nenhum novo feature funcional — apenas reorganização e polish visual.
- Header, CommandPalette, NotificationBell permanecem como estão (já refinados).

### Arquivos editados
`src/index.css`, `src/pages/Index.tsx`, `src/components/dashboard/GastosDashboard.tsx`, `src/components/dashboard/PredictiveInsights.tsx`, `src/components/intelligence/DecisionKPI.tsx`, `src/components/intelligence/AIInsightInline.tsx`, `src/components/operacoes/PriorityDecisions.tsx`, `src/components/ui/card.tsx` (radius/shadow tokens via classe).

### Estimativa
Entrega em sequência (Fase 1 → 5) numa única passada após aprovação.
