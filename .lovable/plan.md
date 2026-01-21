
# Plano de Redesign do Título - Estilo Moderno e Limpo

## Objetivo
Redesenhar a seção do título seguindo o estilo de referência: badge no topo, título grande sem fundo, com palavra em destaque colorida.

---

## Alterações no Arquivo: `src/pages/Index.tsx`

### De (linhas 27-33):
```tsx
<h1 className="inline-block px-6 py-3 mb-4 text-2xl md:text-3xl lg:text-4xl tracking-wide font-sans text-white font-bold bg-zinc-800 rounded-lg shadow-lg animate-fade-in">
  CENTRAL DE REQUISIÇÕES DE COMPRAS
</h1>

<p className="text-muted-foreground max-w-xl mx-auto text-sm animate-stagger-1">
  Sistema de controle para suas solicitações de compras corporativas.
</p>
```

### Para:
```tsx
{/* Badge/Pill no topo */}
<div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-primary/10 border border-primary/20 rounded-full animate-fade-in">
  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
  <span className="text-sm font-medium text-primary">Sistema Corporativo GMAD</span>
</div>

{/* Título principal - estilo limpo */}
<h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground animate-fade-in">
  Central de Requisições
  <span className="block text-primary">de Compras.</span>
</h1>

<p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg animate-stagger-1">
  Gerencie suas solicitações de compras corporativas de forma simples, rápida e eficiente.
</p>
```

---

## Detalhes do Novo Design

| Elemento | Descrição |
|----------|-----------|
| **Badge Pill** | Fundo laranja translúcido (primary/10), borda sutil, cantos totalmente arredondados |
| **Círculo animado** | Pequeno círculo laranja com `animate-pulse` sutil |
| **Título** | Fonte maior (text-4xl até 6xl), sem fundo, tracking-tight para elegância |
| **Destaque colorido** | "de Compras." em cor primária (laranja) como bloco separado |
| **Subtítulo** | Texto maior (text-base/lg), mais legível |

---

## Resultado Visual Esperado

```text
+--------------------------------------------------+
|                                                  |
|            [LOGO GMAD GRANDE]                    |
|                                                  |
|      ●━ Sistema Corporativo GMAD ━━              |  <- badge pill
|                                                  |
|        Central de Requisições                    |  <- texto escuro
|           de Compras.                            |  <- texto laranja
|                                                  |
|   Gerencie suas solicitações de compras...       |
|                                                  |
|       [logos pequenas rolando]                   |
+--------------------------------------------------+
```

---

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/Index.tsx` | Linhas 27-33: Novo layout do título com badge e tipografia limpa |

---

## Alternativa: Título em Linha Única

Se preferir manter o título em uma linha só:

```tsx
<h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight animate-fade-in">
  <span className="text-foreground">Central de Requisições </span>
  <span className="text-primary">de Compras.</span>
</h1>
```
