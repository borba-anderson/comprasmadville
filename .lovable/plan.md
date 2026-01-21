

# Plano de Redesign Visual - Tela Inicial (Atualizado)

## Objetivo
Transformar a tela inicial em uma experiência visual mais impactante e profissional, com animações dinâmicas corporativas, workflow interativo do processo de requisições e uma faixa de logos das empresas GMAD rolando no fundo.

---

## 1. Logos das Empresas - Upload e Configuração

### Arquivos a Copiar para o Projeto
| Arquivo Original | Destino |
|------------------|---------|
| `LOGO_MADVILLE.png` | `src/assets/logos/logo-madville.png` |
| `LOGO_SOLUÇÕES.png` | `src/assets/logos/logo-solucoes.png` |
| `gmad_curitiba.png` | `src/assets/logos/logo-curitiba.png` |

---

## 2. Novas Animações CSS

### Keyframes a Adicionar em `src/index.css`

| Keyframe | Descrição |
|----------|-----------|
| `marquee` | Scroll infinito horizontal para logos |
| `pulse-glow` | Brilho pulsante para badges |
| `shimmer` | Efeito de luz passando para card primário |
| `float` | Flutuação suave para ícones |
| `draw-line` | Linha sendo desenhada para workflow |
| `bounce-subtle` | Pequeno pulo para ícones hover |

### Classes Utilitárias Novas
- `.animate-marquee` - Logos rolando continuamente
- `.animate-shimmer` - Efeito brilho no card
- `.animate-float` - Flutuação suave
- `.animate-stagger-1/2/3` - Delays de entrada escalonados
- `.hover-bounce` - Pulo sutil no hover

---

## 3. Componente: LogoMarquee

### Novo arquivo: `src/components/home/LogoMarquee.tsx`

**Funcionalidade:**
- Uma única faixa de carrossel infinito horizontal
- 3 logos (Madville, Soluções, Curitiba) repetidas para criar loop contínuo
- Opacidade reduzida (15-20%) para não competir com conteúdo
- Velocidade suave (25 segundos por ciclo)
- Posicionada abaixo do título principal

---

## 4. Componente: WorkflowTimeline (Substitui HowItWorks)

### Novo arquivo: `src/components/home/WorkflowTimeline.tsx`

**6 Etapas do Processo:**

| Etapa | Ícone | Título | Descrição |
|-------|-------|--------|-----------|
| 1 | ClipboardList | SOLICITE | Preencha o formulário com dados do item |
| 2 | Search | ANÁLISE | Equipe de compras revisa a solicitação |
| 3 | Calculator | COTAÇÃO | Busca de fornecedores e melhores preços |
| 4 | CheckCircle | APROVAÇÃO | Validação pela gestão (se necessário) |
| 5 | ShoppingCart | COMPRA | Pedido realizado com fornecedor |
| 6 | PackageCheck | ENTREGA | Item recebido e confirmado |

**Animações:**
- Cards aparecem sequencialmente com delay (stagger effect)
- Linha conectora animada entre etapas
- Ícones com flutuação suave
- Cards levantam no hover com sombra

**Layout Responsivo:**
- Desktop: Linha horizontal com 6 etapas conectadas
- Mobile: Timeline vertical empilhada

---

## 5. Redesign do Hero Section

### Alterações em `src/pages/Index.tsx`

**Mudanças:**
- Remover a logo GMAD grande do centro (manter apenas no Header)
- Título principal com animação fade-in + slide-up
- Subtítulo com delay de animação
- Uma faixa de LogoMarquee abaixo do subtítulo

**Estrutura Nova:**
```text
+----------------------------------------------------------+
|                    HEADER (com logo)                      |
+----------------------------------------------------------+
|                                                           |
|      "CENTRAL DE REQUISIÇÕES DE COMPRAS"                  |
|           (fade-in + slide-up animado)                    |
|                                                           |
|      Sistema de controle para suas solicitações...        |
|           (fade-in com delay)                             |
|                                                           |
|   [→ MADVILLE | SOLUÇÕES | CURITIBA | MADVILLE... →]      |
|              (logos rolando - única faixa)                |
|                                                           |
+----------------------------------------------------------+
```

---

## 6. Redesign dos Action Cards

### Alterações em `src/components/home/ActionCards.tsx`

**Card Primário (Fazer Requisição):**
- Efeito shimmer constante passando pelo card
- Gradiente mais vibrante (laranja para laranja escuro)
- Sombra colorida (glow) laranja
- Badge "Mais utilizado" com pulse animation
- Ícone com flutuação suave

**Card Secundário (Painel Administrativo):**
- Border animado no hover
- Sombra mais pronunciada no hover
- Entrada com delay (stagger effect)

**Animações de Entrada:**
- Card 1: aparece primeiro (delay 0.2s)
- Card 2: aparece segundo (delay 0.4s)
- Ambos com slide-up + fade

---

## 7. Estrutura Final da Página

```text
+----------------------------------------------------------+
|              HEADER (com logo GMAD)                       |
+----------------------------------------------------------+
|                                                           |
|      "CENTRAL DE REQUISIÇÕES DE COMPRAS"                  |
|           Sistema de controle...                          |
|                                                           |
|   [→ LOGOS MARQUEE - única faixa →]                       |
|                                                           |
+----------------------------------------------------------+
|                                                           |
|   [STATS DO USUÁRIO - quando logado]                      |
|                                                           |
+----------------------------------------------------------+
|                                                           |
|   +------------------------+  +------------------------+  |
|   |   FAZER REQUISIÇÃO     |  |   PAINEL ADMIN         |  |
|   |      (shimmer)         |  |                        |  |
|   +------------------------+  +------------------------+  |
|                                                           |
+----------------------------------------------------------+
|                                                           |
|              COMO FUNCIONA - WORKFLOW                     |
|                                                           |
|  [1]----[2]----[3]----[4]----[5]----[6]                   |
|   |      |      |      |      |      |                    |
| SOLIC  ANAL   COTA   APROV  COMPRA ENTREG                 |
|                                                           |
+----------------------------------------------------------+
|                       FOOTER                              |
+----------------------------------------------------------+
```

---

## 8. Resumo dos Arquivos a Criar/Modificar

| Tipo | Arquivo | Ação |
|------|---------|------|
| Asset | `src/assets/logos/logo-madville.png` | Criar (copiar upload) |
| Asset | `src/assets/logos/logo-solucoes.png` | Criar (copiar upload) |
| Asset | `src/assets/logos/logo-curitiba.png` | Criar (copiar upload) |
| CSS | `src/index.css` | Adicionar keyframes e classes |
| Componente | `src/components/home/LogoMarquee.tsx` | Criar novo |
| Componente | `src/components/home/WorkflowTimeline.tsx` | Criar novo |
| Componente | `src/components/home/ActionCards.tsx` | Modificar com animações |
| Componente | `src/components/home/index.ts` | Atualizar exports |
| Página | `src/pages/Index.tsx` | Remover logo central, adicionar animações |

---

## 9. Especificações Técnicas

### Velocidades de Animação
| Elemento | Duração |
|----------|---------|
| Marquee logos | 25 segundos por ciclo |
| Shimmer card | 3 segundos por ciclo |
| Workflow line draw | 2 segundos |
| Entrada de elementos | 0.5s com delays escalonados |

### Cores e Opacidades
- Logos no fundo: 15% opacidade
- Sombra glow laranja: `rgba(234, 88, 12, 0.25)`
- Gradiente card: `from-primary to-primary/80`

### Responsividade
- Workflow horizontal em desktop (>768px)
- Workflow vertical empilhado em mobile
- Logos menores em mobile (60px vs 100px altura)

