

# Plano de Ajuste do Título Principal

## Objetivo
Colocar o título "CENTRAL DE REQUISIÇÕES DE COMPRAS" em uma única linha, com fonte diferenciada e fundo em destaque.

---

## Alterações no Arquivo: `src/pages/Index.tsx`

### De (linhas 27-30):
```tsx
<h1 className="text-4xl md:text-5xl mb-4 tracking-tight font-sans text-foreground font-extrabold drop-shadow-sm animate-fade-in">
  CENTRAL DE REQUISIÇÕES
  <span className="block text-primary">DE COMPRAS</span>
</h1>
```

### Para:
```tsx
<h1 className="inline-block px-6 py-3 mb-4 text-2xl md:text-3xl lg:text-4xl tracking-wide font-serif uppercase text-white font-bold bg-gradient-to-r from-primary to-orange-600 rounded-lg shadow-lg animate-fade-in">
  Central de Requisições de Compras
</h1>
```

---

## Características do Novo Design

| Elemento | Descrição |
|----------|-----------|
| **Linha única** | Todo o texto em uma linha, com tamanho responsivo |
| **Fonte serif** | Usa a fonte Lora (font-serif) para visual mais elegante |
| **Fundo gradiente** | Gradiente laranja (from-primary to-orange-600) |
| **Padding interno** | px-6 py-3 cria o efeito de "caixa" |
| **Bordas arredondadas** | rounded-lg para cantos suaves |
| **Sombra** | shadow-lg para dar profundidade |
| **Texto branco** | Contraste alto sobre o fundo laranja |

---

## Alternativas de Estilo

### Opção A - Fundo Sólido (Recomendada):
```tsx
<h1 className="inline-block px-6 py-3 mb-4 text-2xl md:text-3xl lg:text-4xl tracking-wide font-serif text-white font-bold bg-primary rounded-lg shadow-lg animate-fade-in">
  Central de Requisições de Compras
</h1>
```

### Opção B - Fundo Escuro com Borda:
```tsx
<h1 className="inline-block px-6 py-3 mb-4 text-2xl md:text-3xl lg:text-4xl tracking-wide font-serif text-primary font-bold bg-zinc-800 border-2 border-primary rounded-lg shadow-lg animate-fade-in">
  Central de Requisições de Compras
</h1>
```

### Opção C - Fundo com Blur (Glassmorphism):
```tsx
<h1 className="inline-block px-6 py-3 mb-4 text-2xl md:text-3xl lg:text-4xl tracking-wide font-serif text-foreground font-bold bg-white/80 backdrop-blur-sm border border-primary/30 rounded-lg shadow-lg animate-fade-in">
  Central de Requisições de Compras
</h1>
```

---

## Resultado Visual Esperado

```text
+------------------------------------------+
|                                          |
|         [LOGO GMAD GRANDE]               |
|                                          |
|  +------------------------------------+  |
|  | Central de Requisições de Compras |  |
|  +------------------------------------+  |
|     (fundo laranja com sombra)           |
|                                          |
|   Sistema de controle...                 |
|                                          |
|   [logos pequenas rolando]               |
+------------------------------------------+
```

---

## Resumo

| Item | Alteração |
|------|-----------|
| Arquivo | `src/pages/Index.tsx` (linhas 27-30) |
| Título | Uma linha única |
| Fonte | font-serif (Lora) - mais elegante |
| Fundo | Gradiente laranja com cantos arredondados |
| Texto | Branco para contraste |

