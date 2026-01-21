

# Plano de Ajustes Visuais - Tela Inicial

## Resumo das Alteracoes

Ajustes pontuais na tela inicial para corrigir o visual conforme solicitado.

---

## 1. Adicionar Logo GMAD Acima do Titulo

### Arquivo: `src/pages/Index.tsx`

**Alteracao:**
- Importar o componente `Logo` de `@/components/layout/Logo`
- Adicionar a logo GMAD centralizada acima do titulo principal
- Usar tamanho grande (`size="lg"`) e sem texto (`showText={false}`)

**Estrutura Nova do Hero:**
```text
+------------------------------------------+
|              [LOGO GMAD]                 |
|                                          |
|   "CENTRAL DE REQUISICOES DE COMPRAS"    |
|        Sistema de controle...            |
|                                          |
|   [LOGOS MARQUEE]                        |
+------------------------------------------+
```

---

## 2. Corrigir Workflow Timeline - Usar Setas

### Arquivo: `src/components/home/WorkflowTimeline.tsx`

**Problema atual:**
- Existe uma linha horizontal (div com `h-0.5`) passando por cima dos cards
- Linhas nas linhas 77-80 estao sobrepondo o conteudo

**Solucao:**
- Remover as duas linhas conectoras horizontais (linhas 76-80)
- Adicionar setas (icone `ChevronRight` ou `ArrowRight`) entre cada etapa
- As setas ficarao posicionadas entre os cards, nao atras deles

**Estrutura Visual Nova (Desktop):**
```text
[CARD 1] → [CARD 2] → [CARD 3] → [CARD 4] → [CARD 5] → [CARD 6]
```

**Implementacao:**
- Usar `ArrowRight` do lucide-react entre cada etapa
- Renderizar seta apenas quando `index < steps.length - 1`
- Seta com cor `text-muted-foreground` e tamanho adequado

---

## 3. Alterar Cor do Card "Fazer Requisicao"

### Arquivo: `src/components/home/ActionCards.tsx`

**Alteracao na linha 36:**
- DE: `bg-gradient-to-br from-info to-info/80`
- PARA: `bg-gradient-to-br from-zinc-700 to-zinc-800` (cinza escuro)

**Ajustes adicionais:**
- Sombra no hover: mudar de `hover:shadow-info/30` para `hover:shadow-zinc-700/30`
- Remover shimmer overlay (linha 38) se preferir visual mais limpo

---

## 4. Remover Badge "Mais Utilizado"

### Arquivo: `src/components/home/ActionCards.tsx`

**Remover linhas 40-44:**
```tsx
{/* Badge "Mais utilizado" com pulse */}
<Badge className="absolute -top-3 left-6 bg-success text-success-foreground border-0 shadow-lg animate-pulse-glow">
  <Sparkles className="w-3 h-3 mr-1" />
  Mais utilizado
</Badge>
```

**Limpar imports:**
- Remover `Sparkles` do import do lucide-react
- Remover `Badge` do import se nao for mais utilizado em outro lugar

---

## 5. Resumo dos Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Index.tsx` | Adicionar Logo GMAD acima do titulo |
| `src/components/home/WorkflowTimeline.tsx` | Remover linhas, adicionar setas entre etapas |
| `src/components/home/ActionCards.tsx` | Cor cinza escuro + remover badge |

---

## 6. Resultado Visual Esperado

**Hero Section:**
```text
            [LOGO GMAD]
   CENTRAL DE REQUISICOES DE COMPRAS
     Sistema de controle...
   [logos rolando]
```

**Workflow Timeline:**
```text
[1 SOLICITE] → [2 ANALISE] → [3 COTACAO] → [4 APROVACAO] → [5 COMPRA] → [6 ENTREGA]
```

**Action Cards:**
```text
+------------------------+  +------------------------+
|   FAZER REQUISICAO     |  |   PAINEL ADMIN         |
|   (cinza escuro)       |  |   (com borda)          |
+------------------------+  +------------------------+
```

