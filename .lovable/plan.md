

# Plano: Corrigir Fluxo Visual do Hero

## Problemas Identificados

1. **Ícones muito escuros**: `bg-zinc-800` deixa os círculos quase pretos
2. **Setas invertidas**: A direção das curvas está errada
3. **Central posicionada errado**: Está para cima, precisa ficar para baixo

---

## Correções Necessárias

### 1. Melhorar Visualização dos Círculos

**De:**
```tsx
bg-zinc-800 border-2 border-primary/30
```

**Para:**
```tsx
bg-zinc-900/50 border-2 border-primary/50 backdrop-blur-sm
```

Ou usar um fundo mais claro com gradiente sutil:
```tsx
bg-gradient-to-br from-zinc-700 to-zinc-800 border-2 border-primary/40
```

---

### 2. Corrigir Direção das Setas

O fluxo deve ser: Estabelecimento ↘ Central ↗ Compra

**Layout desejado:**
```text
[Estabelecimento]              [Compra]
        ↘                    ↗
              [Central]
```

**Correção das setas SVG:**
- Primeira seta: curva descendo (de cima-esquerda para baixo-direita)
- Segunda seta: curva subindo (de baixo-esquerda para cima-direita)

---

### 3. Posicionar Central Abaixo

**De:**
```tsx
<div className="flex flex-col items-center gap-2 -mt-4 md:-mt-6">
```

**Para:**
```tsx
<div className="flex flex-col items-center gap-2 mt-4 md:mt-6">
```

Mudar de `-mt` (margem negativa = para cima) para `mt` (margem positiva = para baixo).

---

## Código Corrigido Completo

**Arquivo:** `src/components/home/HeroFlowDiagram.tsx`

```tsx
import { Building, Users, Package } from 'lucide-react';

// Componente de seta curva customizada
const CurvedArrow = ({ direction = 'down' }: { direction?: 'down' | 'up' }) => (
  <svg 
    width="40" 
    height="50" 
    viewBox="0 0 40 50" 
    className="text-primary flex-shrink-0"
  >
    <path
      d={direction === 'down' 
        ? "M5 5 Q20 25, 35 45"  // Curva descendo
        : "M5 45 Q20 25, 35 5"  // Curva subindo
      }
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      markerEnd={`url(#arrowhead-${direction})`}
    />
    <defs>
      <marker 
        id={`arrowhead-${direction}`} 
        markerWidth="10" 
        markerHeight="7" 
        refX="9" 
        refY="3.5" 
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
      </marker>
    </defs>
  </svg>
);

export const HeroFlowDiagram = () => {
  return (
    <div className="flex items-start gap-2 md:gap-3">
      {/* Círculo 1: Estabelecimento (posição superior) */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border-2 border-primary/50 flex items-center justify-center shadow-lg shadow-primary/10">
          <Building className="w-8 h-8 md:w-10 md:h-10 text-primary" />
        </div>
        <span className="text-xs text-muted-foreground font-medium">Estabelecimento</span>
      </div>
      
      {/* Seta Curva 1 (descendo para Central) */}
      <CurvedArrow direction="down" />
      
      {/* Círculo 2: Central (equipe, maior, posição inferior) */}
      <div className="flex flex-col items-center gap-2 mt-8 md:mt-10">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 border-2 border-primary flex items-center justify-center shadow-xl shadow-primary/20">
          <Users className="w-10 h-10 md:w-14 md:h-14 text-primary" />
        </div>
        <span className="text-xs text-primary font-semibold">Central</span>
      </div>
      
      {/* Seta Curva 2 (subindo para Compra) */}
      <CurvedArrow direction="up" />
      
      {/* Círculo 3: Compra (posição superior) */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border-2 border-primary/50 flex items-center justify-center shadow-lg shadow-primary/10">
          <Package className="w-8 h-8 md:w-10 md:h-10 text-primary" />
        </div>
        <span className="text-xs text-muted-foreground font-medium">Compra</span>
      </div>
    </div>
  );
};
```

---

## Resumo das Mudanças

| Item | Antes | Depois |
|------|-------|--------|
| **Fundo dos círculos** | `bg-zinc-800` (muito escuro) | `bg-gradient-to-br from-zinc-700 to-zinc-800` (gradiente mais visível) |
| **Cor das setas** | `text-primary/60` (opacidade 60%) | `text-primary` (cor sólida) |
| **Espessura das setas** | `strokeWidth="2"` | `strokeWidth="2.5"` |
| **Posição da Central** | `-mt-4` (para cima) | `mt-8` (para baixo) |
| **Container flex** | `items-center` | `items-start` (para alinhar corretamente) |
| **Sombras** | `shadow-lg` simples | `shadow-lg shadow-primary/10` (com cor) |
| **Borda dos círculos** | `border-primary/30` | `border-primary/50` (mais visível) |

---

## Resultado Visual Esperado

```text
[Estabelecimento]              [Compra]
        ↘                    ↗
              [Central]
               (maior)
```

As setas agora conectam corretamente:
- Estabelecimento → Central (descendo)
- Central → Compra (subindo)

