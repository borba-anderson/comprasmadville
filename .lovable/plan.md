

# Plano de Reorganização do Hero - Layout Lado a Lado

## Objetivo
Reorganizar a seção hero para um layout horizontal com título à esquerda e logo à direita, removendo a badge.

---

## Alterações no Arquivo: `src/pages/Index.tsx`

### Estrutura Atual (linhas 21-44):
```tsx
<section className="py-10 md:py-16 text-center">
  {/* Logo centralizada */}
  <div className="flex justify-center mb-6 animate-fade-in">
    <Logo size="2xl" showText={false} />
  </div>
  
  {/* Badge/Pill */}
  <div className="inline-flex items-center gap-2 ...">
    ...Sistema Corporativo GMAD
  </div>

  {/* Título centralizado */}
  <h1 className="mb-4 text-4xl...">...</h1>
  <p className="text-muted-foreground max-w-xl mx-auto...">...</p>
  
  <LogoMarquee />
</section>
```

### Nova Estrutura:
```tsx
<section className="py-10 md:py-16">
  {/* Container flex com título à esquerda e logo à direita */}
  <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
    
    {/* Lado Esquerdo - Título e subtítulo */}
    <div className="text-center md:text-left flex-1 animate-fade-in">
      <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
        Central de Requisições
        <span className="block text-primary">de Compras.</span>
      </h1>

      <p className="text-muted-foreground max-w-xl text-base md:text-lg">
        Gerencie suas solicitações de compras corporativas de forma simples, rápida e eficiente.
      </p>
    </div>
    
    {/* Lado Direito - Logo GMAD */}
    <div className="flex-shrink-0 animate-fade-in">
      <Logo size="2xl" showText={false} />
    </div>
  </div>
  
  {/* Logo Marquee - mantém abaixo */}
  <LogoMarquee />
</section>
```

---

## Detalhes das Alterações

| Mudança | Antes | Depois |
|---------|-------|--------|
| **Layout** | Centralizado vertical | Flex horizontal (md+) |
| **Título** | Centro | Esquerda em desktop, centro em mobile |
| **Logo GMAD** | Topo centralizado | Direita em desktop |
| **Badge** | Visível | Removida |
| **Subtítulo** | `mx-auto` centralizado | Alinhado à esquerda em desktop |

---

## Comportamento Responsivo

| Viewport | Layout |
|----------|--------|
| **Mobile** | Título centralizado no topo, logo abaixo (empilhado) |
| **Desktop** | Título à esquerda, logo à direita (lado a lado) |

---

## Resultado Visual Esperado

**Desktop:**
```text
+------------------------------------------------------------+
|                                                            |
|  Central de Requisições              [LOGO GMAD]           |
|  de Compras.                                               |
|                                                            |
|  Gerencie suas solicitações...                             |
|                                                            |
|  [====== logos rolando ======]                             |
+------------------------------------------------------------+
```

**Mobile:**
```text
+---------------------------+
|                           |
|  Central de Requisições   |
|      de Compras.          |
|                           |
|  Gerencie suas...         |
|                           |
|      [LOGO GMAD]          |
|                           |
|  [logos rolando]          |
+---------------------------+
```

---

## Arquivo a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/Index.tsx` | Linhas 21-44: Novo layout flex com título à esquerda e logo à direita |

