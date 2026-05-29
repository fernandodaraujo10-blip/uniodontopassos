# Mobile Responsive Fix — Uniodonto Passos Dashboard

**Data:** 29/05/2026  
**Versão:** 1.1.0  
**Engenheiro:** Antigravity (AI) + Fernando

---

## Problema Original

O dashboard Uniodonto Passos tinha boa experiência no desktop, mas a versão mobile apresentava:

- Sidebar lateral fixa ocupando espaço excessivo
- Conteúdo principal espremido ao lado da sidebar
- Cards, gráficos e tabelas sobrepostos
- Tabela de investimentos em formato desktop no celular
- Navegação por meses ocupando largura excessiva
- Funil de conversão comprimido horizontalmente
- Grid de métricas de 3 colunas ilegível no mobile
- Sem suporte a safe-area do iOS/Android

---

## Arquivos Alterados

### Novos Componentes Criados

| Arquivo | Descrição |
|---|---|
| `src/components/layout/MobileBottomNav.tsx` | Bottom navigation fixa com 5 itens para mobile |
| `src/components/tables/MobileInvestmentList.tsx` | Lista de cards substituindo a tabela no mobile |

### Componentes Modificados

| Arquivo | O que mudou |
|---|---|
| `src/App.tsx` | Importa `MobileBottomNav`; `main` tem `pb-20 md:pb-0` |
| `src/components/layout/Sidebar.tsx` | Adicionado `hidden md:flex` → esconde no mobile |
| `src/components/layout/Header.tsx` | Layout compacto: título + mês em linha, abas abaixo |
| `src/components/filters/FilterTabs.tsx` | Rótulo curto no mobile ("Análise"), altura mínima 36px |
| `src/components/navigation/MonthNavigator.tsx` | Dois layouts: mobile (setas + mês atual) / desktop (todos) |
| `src/components/charts/AdPerformanceChart.tsx` | Grid métricas `grid-cols-2 md:grid-cols-3`, overflow-hidden |
| `src/components/charts/ConversionFunnelTabs.tsx` | Tabs com scroll, funil com overflow-hidden, widths ajustadas |
| `src/components/tables/InvestmentTable.tsx` | Mantida para desktop; mobile usa `MobileInvestmentList` |
| `src/pages/Dashboard.tsx` | Dois layouts separados: `block md:hidden` e `hidden md:flex` |
| `src/index.css` | Safe-area, `.scrollbar-hide`, media query touch devices |
| `tailwind.config.js` | `darkMode: 'class'`, breakpoint `xs: 375px`, `minHeight.touch` |

---

## Arquitetura da Solução

### Estratégia Mobile-First

```
Mobile (< 768px)          Desktop (≥ 768px)
─────────────────         ──────────────────
Sem sidebar               Sidebar lateral fixa
Bottom Navigation         Sem bottom nav
Layout em coluna única    Grid 12 colunas
Mês: setas + atual        Mês: todos visíveis
Investimentos: cards      Investimentos: tabela
Funil: compacto           Funil: 3 colunas
```

### Ordem dos Blocos no Mobile

```
┌────────────────────────────┐
│  Visão Geral    [Mai/2026] │  ← Header compacto
├────────────────────────────┤
│  [Geral] [Mktg] [Análise]  │  ← FilterTabs
├────────────────────────────┤
│  KPI Carrossel             │  ← KPICardGrid
├────────────────────────────┤
│  Desempenho de Anúncios    │  ← AdPerformanceChart
│  Grid 2×3 de métricas      │
├────────────────────────────┤
│  Investimentos do Mês      │  ← MobileInvestmentList
│  [Todos][Mktg][Ads][Off]   │    (lista de cards, não tabela)
│  • Meta Facebook  R$ 1.242 │
│  • Google Ads     R$ 892   │
│  [Ver todos (7 itens)]     │
├────────────────────────────┤
│  Funil / Origem / Cidades  │  ← ConversionFunnelTabs
│  (visualização compacta)   │
├────────────────────────────┤
│ 🏠  📊  📤  ⚙️  🚪          │  ← MobileBottomNav (fixo)
└────────────────────────────┘
```

---

## Detalhes Técnicos por Tarefa

### Tarefa 1 — Sidebar
- `Sidebar.tsx`: `hidden md:flex` no `<aside>`
- `App.tsx`: `<main className="... pb-20 md:pb-0">`

### Tarefa 2 — Bottom Navigation
- `MobileBottomNav.tsx`: `fixed bottom-0`, `z-50`, altura ~64px
- Safe-area: `padding-bottom: env(safe-area-inset-bottom, 0px)`
- Ativo: `text-pink-700` com barra indicadora no topo
- Ícone ativo: `scale-110`, `strokeWidth: 2.5`

### Tarefa 3 — Tabela → Cards
- `MobileInvestmentList.tsx`: lista de cards com nome, badge de categoria, mês e valor
- Limite inicial de 5 itens + botão "Ver todos"
- Chips de filtro com scroll horizontal e `scrollbar-hide`

### Tarefa 4 — Sobreposições
- Todos os containers receberam `min-w-0 overflow-hidden`
- Funil com `overflow-hidden` para não vazar lateralmente
- z-index da bottom-nav: `z-50`

### Tarefa 5 — Breakpoints
- `Dashboard.tsx`: `block md:hidden` (mobile) / `hidden md:flex` (desktop)
- `FilterTabs.tsx`: `<span class="md:hidden">` e `<span class="hidden md:inline">`
- `MonthNavigator.tsx`: `flex md:hidden` / `hidden md:flex`

### Tarefa 6 — Tipografia
- Header mobile: `text-xl md:text-3xl`
- FilterTabs: `min-h-[36px]`
- MobileBottomNav labels: `text-[10px]`
- MobileInvestmentList item: `text-[14px] font-semibold`

### Tarefa 7 — Espaçamentos
- Padding lateral: `px-4` no mobile
- Gap entre cards: `gap-4`
- Botões: `min-h-[44px]`
- Border-radius cards: `rounded-2xl`

### Tarefa 8 — Desktop Preservado
- Nenhuma classe do desktop foi removida
- Adicionado apenas `hidden md:flex` e variantes `md:` às classes existentes

---

## Telas Suportadas

| Largura | Dispositivo | Status |
|---|---|---|
| 360px | Android compacto | ✅ |
| 375px | iPhone SE / Android médio | ✅ |
| 390px | iPhone 14 | ✅ |
| 414px | iPhone 11 Pro Max | ✅ |
| 430px | iPhone 14 Plus | ✅ |
| 768px+ | Tablet / Desktop | ✅ (layout original) |

---

## Checklist Final

- [x] Sidebar não aparece no mobile
- [x] Bottom navigation fixa e funcional
- [x] Nenhum componente sobreposto
- [x] Investimentos como lista/card no mobile
- [x] Tabela desktop preservada
- [x] MonthNavigator compacto no mobile
- [x] Filtros compactos com scroll
- [x] Cards ocupam largura total no mobile
- [x] Desktop completamente preservado
- [x] Sem overflow horizontal indesejado
- [x] Safe-area iOS/Android respeitada
- [x] Identidade Uniodonto preservada (rosa vinho)
- [x] Build sem erros TypeScript
- [x] Código componentizado e limpo

---

## Pendências / Próximos Passos

1. **Teste físico em Android real** — verificar safe-area e height do browser
2. **iOS Safari** — validar `env(safe-area-inset-bottom)` no Safari
3. **Dark mode no mobile** — o `.dark .mobile-bottom-nav` está no CSS mas pode precisar de ajuste fino
4. **KPICardGrid no mobile** — carrossel funcional, mas pode evoluir para grid 2x2 fixo na área "geral"
5. **Reports e Settings** — estas páginas também podem ser otimizadas para mobile em iterações futuras
6. **DataUpload mobile** — tela de envio pode precisar de layout específico para mobile
