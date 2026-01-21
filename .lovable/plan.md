

# Plano de Ajuste Visual do Hero Section

## Problema Identificado
A logo GMAD à direita está desproporcional em relação ao título grande, e o espaçamento da seção pode ser otimizado.

---

## Alterações Propostas

### 1. Aumentar o Tamanho da Logo GMAD

**Arquivo:** `src/components/layout/Logo.tsx`

Adicionar um novo tamanho `3xl` para a logo:

```tsx
const sizes = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
  xl: 'w-28 h-28',
  '2xl': 'w-36 h-36',
  '3xl': 'w-48 h-48'  // Novo: 192px
};
```

E atualizar o type:
```tsx
size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
```

---

### 2. Usar o Novo Tamanho no Hero

**Arquivo:** `src/pages/Index.tsx`

**De (linha 39):**
```tsx
<Logo size="2xl" showText={false} />
```

**Para:**
```tsx
<Logo size="3xl" showText={false} />
```

---

### 3. Melhorar o Espaçamento do Logo Marquee

**Arquivo:** `src/components/home/LogoMarquee.tsx`

**De (linha 16):**
```tsx
<div className="w-full overflow-hidden py-8">
```

**Para:**
```tsx
<div className="w-full overflow-hidden py-6 mt-8 border-t border-border/30">
```

Isso adiciona uma linha divisória sutil e melhora a separação visual.

---

## Resultado Visual Esperado

```text
+------------------------------------------------------------+
|                                                            |
|  Central de Requisições              [LOGO GMAD]           |
|  de Compras.                             MAIOR             |
|                                          (192px)           |
|  Gerencie suas solicitações...                             |
|                                                            |
|  --------------------------------------------------------  |  <- linha sutil
|  [====== logos rolando ======]                             |
+------------------------------------------------------------+
```

---

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/layout/Logo.tsx` | Adicionar tamanho `3xl` (192px) |
| `src/pages/Index.tsx` | Usar `size="3xl"` na logo do hero |
| `src/components/home/LogoMarquee.tsx` | Adicionar borda superior sutil e ajustar espaçamento |

