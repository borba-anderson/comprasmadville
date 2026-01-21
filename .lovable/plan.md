

# Plano de Ajuste do Título - Sombra Animada e Fonte

## Objetivo
Adicionar sombra animada sutil ao título, texto em caixa alta (UPPERCASE), e usar a mesma fonte do resto da página (font-sans).

---

## 1. Criar Nova Animação de Sombra

### Arquivo: `src/index.css`

**Adicionar no final do arquivo (antes do fechamento do `@layer utilities`):**

```css
/* Title Glow - Sombra pulsante para título */
@keyframes title-glow {
  0%, 100% {
    box-shadow: 0 10px 25px hsl(24 95% 53% / 0.3);
  }
  50% {
    box-shadow: 0 10px 40px hsl(24 95% 53% / 0.5);
  }
}

.animate-title-glow {
  animation: title-glow 3s ease-in-out infinite;
}
```

**Características:**
- Usa a cor primária (HSL 24 95% 53% - laranja)
- Pulsa suavemente a cada 3 segundos
- Sombra vai de 30% a 50% de opacidade
- Efeito sutil, não agressivo

---

## 2. Atualizar o Título

### Arquivo: `src/pages/Index.tsx`

**De (linha 27-29):**
```tsx
<h1 className="inline-block px-6 py-3 mb-4 text-2xl md:text-3xl lg:text-4xl tracking-wide font-serif text-white font-bold bg-gradient-to-r from-primary to-orange-600 rounded-lg shadow-lg animate-fade-in">
  Central de Requisições de Compras
</h1>
```

**Para:**
```tsx
<h1 className="inline-block px-6 py-3 mb-4 text-2xl md:text-3xl lg:text-4xl tracking-wide font-sans text-white font-bold bg-gradient-to-r from-primary to-orange-600 rounded-lg shadow-lg animate-fade-in animate-title-glow">
  CENTRAL DE REQUISIÇÕES DE COMPRAS
</h1>
```

---

## Resumo das Alterações

| Alteração | Antes | Depois |
|-----------|-------|--------|
| Fonte | `font-serif` (Lora) | `font-sans` (Inter) |
| Texto | "Central de Requisições de Compras" | "CENTRAL DE REQUISIÇÕES DE COMPRAS" |
| Animação | `animate-fade-in` | `animate-fade-in animate-title-glow` |

---

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/index.css` | Adicionar keyframes `title-glow` e classe `.animate-title-glow` |
| `src/pages/Index.tsx` | Linha 27-29: mudar fonte, caixa alta e adicionar animação |

---

## Resultado Visual Esperado

```text
+------------------------------------------------+
|                                                |
|           [LOGO GMAD GRANDE]                   |
|                                                |
|  +------------------------------------------+  |
|  | CENTRAL DE REQUISIÇÕES DE COMPRAS        |  |
|  +------------------------------------------+  |
|      (sombra laranja pulsando suavemente)      |
|                                                |
|   Sistema de controle...                       |
+------------------------------------------------+
```

