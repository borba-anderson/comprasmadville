

# Plano de Ajustes Visuais - Logo e Titulo Principal

## Objetivo
Aumentar a logo GMAD principal, diminuir as logos do marquee, e destacar o titulo "CENTRAL DE REQUISICOES DE COMPRAS" com um visual mais impactante (sem badge).

---

## 1. Aumentar Logo GMAD Principal

### Arquivo: `src/components/layout/Logo.tsx`

**Alteracao:**
Adicionar um novo tamanho `2xl` maior para a hero section:

```typescript
const sizes = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
  xl: 'w-28 h-28',
  '2xl': 'w-36 h-36'  // 144px - novo tamanho
};
```

### Arquivo: `src/pages/Index.tsx`

**Alteracao:**
- DE: `<Logo size="lg" showText={false} />`
- PARA: `<Logo size="2xl" showText={false} />`

---

## 2. Diminuir Logos do Marquee

### Arquivo: `src/components/home/LogoMarquee.tsx`

**Alteracoes:**
- Altura das logos: DE `h-16 md:h-24` PARA `h-10 md:h-14` (40px mobile, 56px desktop)
- Espacamento: DE `mx-12` PARA `mx-8`

---

## 3. Destacar Titulo Principal (Sem Badge)

### Arquivo: `src/pages/Index.tsx`

**Novo codigo do titulo:**
```tsx
<h1 className="text-4xl md:text-5xl mb-4 tracking-tight font-sans text-foreground font-extrabold drop-shadow-sm animate-fade-in">
  CENTRAL DE REQUISICOES
  <span className="block text-primary">DE COMPRAS</span>
</h1>
```

**Caracteristicas:**
- Titulo em duas linhas para mais impacto
- "CENTRAL DE REQUISICOES" em cor padrao (foreground)
- "DE COMPRAS" destacado na cor primaria (laranja)
- Fonte extra bold com sombra sutil
- Tamanho maior (text-5xl no desktop)

---

## 4. Resumo das Alteracoes

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/layout/Logo.tsx` | Adicionar tamanho `2xl` (w-36 h-36) |
| `src/pages/Index.tsx` | Usar `size="2xl"` na logo + titulo em duas linhas com destaque |
| `src/components/home/LogoMarquee.tsx` | Diminuir logos para `h-10 md:h-14` |

---

## 5. Resultado Visual Esperado

```text
+------------------------------------------+
|                                          |
|         [LOGO GMAD GRANDE - 144px]       |
|                                          |
|        CENTRAL DE REQUISICOES            |
|             DE COMPRAS                   |
|         (destaque em laranja)            |
|                                          |
|   Sistema de controle...                 |
|                                          |
|   [logos pequenas rolando - 56px]        |
|                                          |
+------------------------------------------+
```

