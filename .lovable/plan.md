

# Plano: Logo Único - Hub Central de Compras

## Objetivo
Substituir o diagrama de fluxo com 3 círculos e setas por um **único badge/selo corporativo** que representa a Central de Compras, usando o conceito de Hub Central com efeito pulse/glow.

---

## Alteração

**Arquivo:** `src/components/home/HeroFlowDiagram.tsx`

### Código Completo (Substituição Total)

```tsx
import { Network } from 'lucide-react';

export const HeroFlowDiagram = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Badge/Selo Corporativo - Hub Central */}
      <div className="relative">
        {/* Anel externo decorativo (rotação lenta) */}
        <div 
          className="absolute inset-0 rounded-full border-4 border-dashed border-primary/30 animate-spin" 
          style={{ animationDuration: '20s' }} 
        />
        
        {/* Anel médio */}
        <div className="absolute inset-2 rounded-full border-2 border-primary/50" />
        
        {/* Efeito Pulse/Glow pulsante */}
        <div className="absolute inset-0 rounded-full bg-primary/15 animate-pulse-glow" />
        
        {/* Círculo principal do Hub */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full 
                        bg-gradient-to-br from-zinc-600 via-zinc-700 to-zinc-800 
                        border-4 border-primary 
                        flex items-center justify-center 
                        shadow-2xl shadow-primary/30">
          <Network className="w-16 h-16 md:w-20 md:h-20 text-primary" />
        </div>
      </div>
      
      {/* Texto do selo */}
      <div className="text-center">
        <span className="text-sm md:text-base font-bold text-primary tracking-wider uppercase">
          Central de Compras
        </span>
      </div>
    </div>
  );
};
```

---

## Especificações do Design

| Elemento | Detalhe |
|----------|---------|
| **Tamanho** | 128x128px (mobile) / 160x160px (desktop) |
| **Ícone** | `Network` - representa hub conectando processos |
| **Camada 1** | Borda tracejada externa com rotação lenta (20s) |
| **Camada 2** | Anel médio sutil (`border-primary/50`) |
| **Camada 3** | Efeito pulse/glow com `animate-pulse-glow` |
| **Camada 4** | Círculo principal com gradiente e borda sólida |
| **Fundo** | Gradiente de `zinc-600` → `zinc-700` → `zinc-800` |
| **Sombra** | `shadow-2xl shadow-primary/30` para profundidade |
| **Texto** | "CENTRAL DE COMPRAS" em caixa alta, cor primária |

---

## Comparação Visual

**Antes (3 círculos com setas):**
```text
[Estabelecimento] ↘        ↗ [Compra]
                    [Central]
```

**Depois (Badge único):**
```text
         ╭─ ─ ─ ─ ─╮
        │  ╭─────╮  │  ← Borda rotativa
        │ │ ◉──◉ │  │
        │ │  ╲│╱  │  │  ← Ícone Network
        │ │   ◉   │  │
        │  ╰─────╯  │
         ╰─ ─ ─ ─ ─╯
     CENTRAL DE COMPRAS
```

---

## Resumo

| Item | Ação |
|------|------|
| **Remover** | Componente `CurvedArrow`, 3 círculos, setas |
| **Adicionar** | Badge único com 4 camadas visuais |
| **Ícone** | `Network` (hub de conexões) |
| **Efeitos** | Rotação lenta + pulse/glow |
| **Arquivo** | `src/components/home/HeroFlowDiagram.tsx` |

O novo design é mais limpo e profissional, representando uma **central unificada** de compras.

