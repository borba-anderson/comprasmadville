# Evolução Enterprise Premium — Procurement Intelligence

Sem destruir o que já existe. Refinar, aprofundar e maturar.

## Fase 1 — Design System: Profundidade Visual Enterprise
Refinar `index.css` e tokens sem mudar a identidade (verde Madville #008651 mantido).
- Surface stack em 3 camadas (`--surface-base`, `--surface-raised`, `--surface-overlay`) com leve shift de luminosidade — efeito Stripe/Linear.
- Sombras compostas multi-layer (`--shadow-card`, `--shadow-card-hover`, `--shadow-elevated`) com tint do primary em hover.
- Borders refinadas com gradiente sutil (top lighter / bottom darker) para dar peso aos cards.
- Tipografia: refinar tracking dos números tabulares e dos eyebrows (uppercase 10px com letter-spacing maior).
- Novo utilitário `.card-elevated` substituindo cards "leves demais".
- Skeleton loaders premium com shimmer suave.

## Fase 2 — KPIs Decisórios (não meramente informativos)
Criar componente `DecisionKPI` reutilizável que substitui/complementa `StatsCard`/`HeroKPIs` nas telas-chave (Operações + Painel header).
Cada KPI passa a ter:
- Valor principal + unidade
- Delta % vs período anterior (com seta + cor semântica)
- **Impacto financeiro estimado** (ex: "R$ 12,4k em risco")
- **Semáforo de criticidade** (low/medium/high) — barra lateral colorida
- Microsparkline opcional (7 pontos)
- Tooltip rico com contexto

Exemplo: "7 entregas atrasadas · +18% vs semana · Impacto R$ 12,4k · Risco médio".

## Fase 3 — Feed Operacional Vivo (evolução da página /operacoes)
Refinar `Operacoes.tsx`:
- **Agrupamento temporal**: "Agora", "Últimas 2h", "Hoje", "Esta semana".
- **Severidade visual**: borda lateral colorida + ícone com halo por severidade.
- **Ações inline contextuais** por tipo de evento: `Aprovar`, `Ver fornecedor`, `Negociar`, `Resolver atraso`, `Recalcular previsão`.
- **Badges inteligentes**: SLA restante, valor em risco, fornecedor crítico.
- Timeline refinada com conector vertical sutil entre eventos do mesmo grupo.
- Filtros sticky com contadores.

## Fase 4 — IA Embarcada (não isolada em um card)
Criar componente `AIInsightInline` leve que pode ser injetado em qualquer contexto:
- Aparece como linha sutil com ícone Sparkles + texto de insight + ação.
- Variantes: `risk`, `opportunity`, `trend`, `anomaly`.
- Embarcar nos pontos:
  - Topo de cada KPI crítico no Painel
  - Acima da tabela de requisições (interpretação automática)
  - Dentro do detalhe de requisição (sugestão de fornecedor / preço)
  - No Feed (resumo executivo do momento)
- Reutiliza lógica heurística client-side já presente; sem necessidade de edge function nova nesta fase (evita custo desnecessário).

## Fase 5 — Procurement Command Center (tela assinatura)
Evoluir `/operacoes` para "Command Center" — ou criar `/command` se preferir manter ambas. Proposta: **promover /operacoes para Command Center** com layout denso tipo Bloomberg/Ramp:

```text
┌─────────────────────────────────────────────────────────────┐
│ Command Center · Live  ·  ⏱ atualizado há 12s               │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│ DecKPI 1 │ DecKPI 2 │ DecKPI 3 │ DecKPI 4 │ AI Pulse        │
├──────────┴──────────┴──────────┴──────────┤ (insight        │
│ Decisões Prioritárias (top 5 acionáveis)  │  executivo      │
├───────────────────────────────────────────┤  do momento)    │
│ Feed Vivo (agrupado + ações inline)       │                 │
│                                           ├─────────────────┤
│                                           │ Fornecedores    │
│                                           │ Críticos        │
│                                           ├─────────────────┤
│                                           │ Oportunidades   │
│                                           │ Savings         │
└───────────────────────────────────────────┴─────────────────┘
```

Elementos: KPIs decisórios no topo, painel "Decisões Prioritárias" (top N ações que destravam fluxo), feed vivo central, AI Pulse + Críticos + Savings na coluna direita.

## Fase 6 — Mobile Premium
- Command Center: stack vertical com KPIs em carrossel horizontal snap.
- Feed: cards full-width com ação primária visível (swipe não, mas tap direto).
- Header: trigger ⌘K vira ícone de busca; navegação primária colapsa.

## Detalhes técnicos
- Arquivos novos: `src/components/intelligence/DecisionKPI.tsx`, `src/components/intelligence/AIInsightInline.tsx`, `src/components/operacoes/PriorityDecisions.tsx`, `src/components/operacoes/EventGroup.tsx`.
- Arquivos editados: `src/index.css` (tokens de profundidade), `src/pages/Operacoes.tsx` (Command Center layout), `src/pages/Painel.tsx` (DecisionKPI no header), `src/components/dashboard/HeroKPIs.tsx` (refino visual).
- Sem mudanças em backend, schema, RLS ou edge functions nesta entrega.
- Sem mudança de rotas existentes; identidade visual (verde Madville, Inter, radius) preservada.

## Ordem de execução proposta
1. Fase 1 (tokens + sombras) — base de tudo
2. Fase 2 (DecisionKPI) — reutilizado nas demais
3. Fase 3 + 5 (Feed vivo + Command Center) — entregues juntos pois compartilham componentes
4. Fase 4 (AIInsightInline) — injeta nos lugares certos
5. Fase 6 (mobile refinements)

Posso começar pela Fase 1+2 (fundamento + KPIs decisórios) e seguir em sequência, ou prefere que eu entregue tudo (1→6) numa leva só?