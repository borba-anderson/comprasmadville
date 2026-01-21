

# Plano de Simplificação do Título - Visual Minimalista

## Objetivo
Remover o efeito de glow animado do título e deixar o visual mais limpo e minimalista.

---

## 1. Remover Animação do Título

### Arquivo: `src/pages/Index.tsx`

**De (linha 27):**
```tsx
<h1 className="inline-block px-6 py-3 mb-4 text-2xl md:text-3xl lg:text-4xl tracking-wide font-sans text-white font-bold bg-gradient-to-r from-primary to-orange-600 rounded-lg shadow-lg animate-fade-in animate-title-glow">
```

**Para:**
```tsx
<h1 className="inline-block px-6 py-3 mb-4 text-2xl md:text-3xl lg:text-4xl tracking-wide font-sans text-white font-bold bg-gradient-to-r from-primary to-orange-600 rounded-lg shadow-lg animate-fade-in">
```

**Alteração:** Remover `animate-title-glow` da classe

---

## 2. Remover CSS da Animação (Limpeza)

### Arquivo: `src/index.css`

**Remover (linhas 524-537):**
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

---

## Resumo das Alterações

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/Index.tsx` | Remover classe `animate-title-glow` do título |
| `src/index.css` | Remover keyframes e classe `.animate-title-glow` |

---

## Resultado Visual

O título manterá:
- Fundo gradiente laranja
- Sombra estática (`shadow-lg`)
- Animação suave de entrada (`animate-fade-in`)
- Visual limpo e minimalista sem efeitos pulsantes

```text
+------------------------------------------------+
|                                                |
|           [LOGO GMAD GRANDE]                   |
|                                                |
|  +------------------------------------------+  |
|  | CENTRAL DE REQUISIÇÕES DE COMPRAS        |  |
|  +------------------------------------------+  |
|      (sombra estática, visual limpo)           |
|                                                |
+------------------------------------------------+
```

