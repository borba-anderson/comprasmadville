
# Procurement Intelligence Platform — Roadmap de Evolução

Você selecionou as 4 frentes principais + redesign de áreas-chave. Isso é trabalho de várias semanas. Para entregar com qualidade enterprise (e não virar uma reforma "meio pronta" em todo lugar), proponho executar em **5 fases incrementais**, cada uma entregável e testável de ponta a ponta.

---

## Filosofia de execução

- **Reaproveitar o que já existe**: `SmartActionCenter`, `AlertasInteligentes`, `InsightsInteligentes`, `SupplierPerformance`, `PredictiveInsights`, `SpendIntelligence` já existem. Vamos consolidar, não duplicar.
- **Linguagem visual única**: criar tokens de design "premium enterprise" (Stripe/Linear/Ramp) — densidade alta controlada, tipografia refinada, cor com restrição, microanimações sutis.
- **IA invisível**: insights aparecem como cards/badges contextuais, nunca como chatbot.
- **Zero regressão**: cada fase mantém todos os fluxos atuais (requisição/aprovação/cotação) intactos.

---

## Fase 1 — Design System Premium + App Shell (base de tudo)

Sem isso, qualquer redesign vira "remendo bonito".

- Refinar `index.css`: nova escala tipográfica (Inter tight + display variant), hierarquia de superfícies (`surface-1/2/3`), sombras enterprise (sutis, em camadas), espaçamento e raios padronizados, paleta neutra fria + accent #008651 mantido.
- Novo **App Shell**: sidebar colapsável (shadcn sidebar) substituindo o header atual, com command palette (⌘K) para navegação e ações rápidas.
- Skeletons consistentes, transições de página refinadas, estados vazios premium.

**Entregável**: app inteiro com nova "casca", mesma funcionalidade.

---

## Fase 2 — Feed Operacional Inteligente (Command Center)

Nova rota `/operacoes` (ou substitui a Home atual para staff).

```text
┌─────────────────────────────────────────────────┐
│  Pulso Operacional         [hoje · 7d · 30d]   │
├─────────────────────────────────────────────────┤
│  KPIs vivos (4 tiles densos, com sparkline)    │
├─────────────────────────────────────────────────┤
│  FEED                          │  AÇÕES        │
│  • BONAPEL atrasou 3 entregas │  • 4 aprovar  │
│  • Economia R$ 3.240 detectada│  • 2 cotar    │
│  • Lead time +18% almox.      │  • 1 receber  │
│  • Compra 2.4x acima da média │               │
└─────────────────────────────────────────────────┘
```

- Engine de detecção de eventos (client-side, sobre as requisições já carregadas): atrasos consecutivos por fornecedor, anomalias de preço (z-score), variação de lead time por setor, concentração, recorrência emergencial.
- Feed cronológico com filtro por severidade, fornecedor, setor.
- Cada item leva ao contexto correspondente (requisição/fornecedor).

---

## Fase 3 — Supplier Intelligence

Nova rota `/fornecedores` + página `/fornecedores/:nome`.

- Lista com **score de risco** (0–100), OTIF, lead time médio, dependência (% do gasto), tendência (▲▼).
- Página individual: histórico de entregas, evolução de preço por item, comparativo com peers, economia gerada, alertas ativos.
- Score derivado de: % atrasos, variância de lead time, variação de preço, recência de problemas.

---

## Fase 4 — Dashboard Executivo (modo diretoria)

Rota `/executivo` — visual Bloomberg/Ramp.

- Layout minimalista, monoespaçado para números, foco em decisão.
- Tiles: ROI de compras, economia acumulada, capital comprometido, lead time médio, curva ABC de fornecedores, índice de risco operacional, previsão 30/60/90 dias.
- Insights automáticos no topo (3–5 frases curtas geradas pelo motor de detecção).

---

## Fase 5 — IA Operacional embarcada (Lovable AI)

Edge function `procurement-ai` usando `google/gemini-3-flash-preview` via Lovable AI Gateway.

Casos de uso (todos contextuais, sem chatbot):
- **Resumo inteligente** de requisição (botão discreto na página de detalhe).
- **Sugestão de prioridade** ao criar requisição (analisa item + justificativa).
- **Previsão de atraso** por requisição em curso (badge no painel).
- **Sugestão de fornecedor ideal** com base em histórico (na cotação).
- **Insights executivos** narrativos no dashboard executivo.

Output estruturado via tool calling, cache local, fallback gracioso.

---

## Como vamos trabalhar

Vou implementar **uma fase por vez**, parar, você valida no preview, e seguimos. Isso evita um PR gigante impossível de revisar e mantém o sistema sempre estável.

## Próximo passo

Confirme que esse roadmap faz sentido e eu começo pela **Fase 1 (Design System Premium + App Shell)** — que é pré-requisito para tudo o resto ficar coerente.

Se quiser inverter prioridade (por exemplo começar pelo Feed Operacional sem mexer no shell ainda), me diga.
