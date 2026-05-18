# Reestruturação Visual — Procurement Intelligence

Objetivo: transformar a Home (`/`) e o Painel analítico em uma experiência executiva, limpa e action-driven, sem adicionar dados novos. Apenas reorganização, remoção e refino visual.

## Fase 1 — Home (`src/pages/Index.tsx`) executiva

Substituir a home atual (Hero + ActionCards + HeroFlowDiagram + HowItWorks + LogoMarquee + QuickStats + WorkflowTimeline) por uma estrutura de 5 seções enxutas:

1. **Hero executivo** — título "Procurement Intelligence", subtítulo único, e um resumo inline (3 chips: economia mês, alertas críticos, em andamento). Sem ilustrações pesadas, sem marquee.
2. **KPIs Executivos** — apenas 4 `DecisionKPI` grandes: Spend Total, Economia Gerada, Compras em Andamento, Atrasos Críticos. Grid 4 colunas, padding generoso.
3. **Central de Ações** — reuso de `PriorityDecisions` (já existe) como bloco principal, ampliado, com título "Central de Ações" e CTA "Resolver" / "Ver detalhes" em cada item.
4. **Visão Estratégica** — exatamente 4 mini gráficos: Tendência de gastos, Lead time, Pareto de categorias, Economia gerada. Reutilizar componentes existentes (`TrendChart`, `LeadTimeAnalysis`, `GastosPorSetorBars`, `EconomiaSummary`) com wrapper minimalista.
5. **CTA final** — link para `/operacoes` (Command Center) e `/painel` (Analítico).

Remover da home: `ActionCards`, `HeroFlowDiagram`, `HowItWorks`, `LogoMarquee`, `QuickStats`, `WorkflowTimeline`. (Arquivos ficam no projeto, apenas não são mais referenciados na home.)

## Fase 2 — Painel (`src/pages/Painel.tsx`) em abas premium

Reorganizar o Painel analítico em 5 abas (shadcn `Tabs`), uma única vez, sem cards soltos no topo:

- **Financeiro**: GastosDashboard, EconomiaSummary, GastosLineChart
- **Operacional**: StatusPainel, ProcessFunnel, OperationalEfficiency
- **Fornecedores**: SupplierPerformance
- **Compradores**: EconomiaPorComprador, GastosPorSolicitanteBars
- **Preditivo**: `PredictiveInsights` ampliado + insights de risco

Cada aba: 1 KPI row enxuto + no máximo 3 visualizações grandes. Espaçamento `gap-6`, padding `p-6/p-8`.

## Fase 3 — Sistema de cores reduzido

No `index.css`, normalizar paleta visual:
- Manter primário verde Madville
- Cinza neutro para superfícies
- Vermelho `--sev-high` para alertas
- Azul leve `--sev-info` para insights
- Reduzir uso de violeta/âmbar nos componentes da home (substituir por neutro + acento verde/vermelho)

## Fase 4 — Densidade e respiro

- Aumentar `py` das seções da home para `py-16`
- `max-w-7xl mx-auto` consistente
- Cards usam `card-elevated` com `p-6/p-8`
- Remover bordas duplas e separadores desnecessários

## Fase 5 — Action-driven copy

KPIs e itens da Central de Ações reescritos para formato impacto+ação:
- "R$ 8,1k em risco por atraso → Resolver"
- "3 fornecedores sem previsão → Revisar"

## Arquivos

**Editados**:
- `src/pages/Index.tsx` (rewrite completo, mantendo header/layout)
- `src/pages/Painel.tsx` (reestruturar em Tabs)
- `src/index.css` (ajustes de paleta de severidade)
- `src/components/dashboard/PredictiveInsights.tsx` (refino visual)

**Criados**:
- `src/components/home/ExecutiveHero.tsx`
- `src/components/home/ExecutiveKPIRow.tsx` (wrapper sobre DecisionKPI)
- `src/components/home/StrategicCharts.tsx` (grid 2x2 com 4 gráficos)

**Sem backend**. Sem novas dependências. Sem mudanças de rota.
