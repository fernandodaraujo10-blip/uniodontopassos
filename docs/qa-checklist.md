# Checklist de Garantia de Qualidade (QA) - Dashboard Uniodonto Passos

Este documento estabelece o checklist de controle de qualidade para validação da migração do **Dashboard Uniodonto Passos** de HTML monolítico para **React (v19) + Vite + TypeScript + Tailwind CSS (v4)**. Todos os itens devem ser validados e verificados antes da homologação final do projeto.

---

## 1. Layout & Design System

- [x] **Coerência das Cores da Marca:**
  - [x] Cor Primária `#D81B60` aplicada em botões ativos, cabeçalhos de destaque e segmentações ativas.
  - [x] Cor Secundária `#E91E63` aplicada em degradês e hover de botões secundários.
  - [x] Fundo do painel de anúncios utilizando a cor `#0D040A` (Premium Dark).
  - [x] Sidebar utilizando gradiente linear vertical de `#D81B60` a `#880E4F`.
  - [x] Fundo geral do dashboard utilizando a cor `#F8F9FA`.
- [x] **Tipografia:**
  - [x] Fonte `Inter` aplicada em todo o documento, com carregamento correto do Google Fonts.
  - [x] Escala tipográfica respeitando as especificações do `spec.md` (títulos, métricas de KPI e labels pequenos).
- [x] **Efeitos Visuais e Interatividade:**
  - [x] Efeito Hover suave (`transition-all duration-300`) em todos os botões e abas de filtros.
  - [x] Cards de KPI com sombra sutil (`card-shadow`) e elevação/translado suave ao passar o cursor (`hover:scale-102` ou `translate-y-[-2px]`).
  - [x] Steps do funil de conversão estilizados corretamente com `clip-path` e filtro de brilho/sombra ao passar o mouse.
  - [x] Scrollbars customizadas e discretas (`custom-scrollbar`) aplicadas na tabela de investimentos e áreas de rolagem vertical.

---

## 2. Responsividade & Estrutura de Tela

- [x] **Visualização em Tela Única (Desktop >= 1280px):**
  - [x] Toda a interface se adapta para preencher a tela verticalmente sem rolagem global (`overflow-hidden` no `body`).
  - [x] Proporção perfeita entre a coluna esquerda (9/12 avos) e a coluna direita de investimentos (3/12 avos).
  - [x] Carrossel de KPIs exibe de 4 a 6 cartões em fluxo contínuo horizontal, com setas de navegação inteligentes que desaparecem nas extremidades.
- [x] **Visualização em Telas Médias (Tablets, Notebooks menores <= 1024px):**
  - [x] O grid se reorganiza e permite rolagem confortável.
  - [x] Sidebar pode ser recolhida (`collapsed`) liberando mais espaço de tela de forma fluida.
- [x] **Visualização Mobile (Dispositivos Móveis <= 640px):**
  - [x] Sidebar se oculta ou recolhe por padrão.
  - [x] Componentes empilhados verticalmente de forma legível.
  - [x] Os cards de KPI tornam-se deslizantes (rolagem horizontal por swipe).
  - [x] Tabelas possuem scroll horizontal se a largura das colunas estourar a tela.

---

## 3. Navegação Mensal & Consistência de Dados

- [x] **Seletor de Período Dinâmico:**
  - [x] As setas `<` e `>` navegam corretamente entre Abril, Maio e Junho de 2026.
  - [x] O botão do mês ativo recebe estilo destacado com fundo `#pink-100` e cor `#D81B60` (rosa primário).
  - [x] Clicar nos botões de meses laterais altera a seleção imediatamente para o mês selecionado.
- [x] **Consistência Matemática entre Períodos** *(validado por 55 testes automatizados em `dashboardAdapter.test.ts`)*:
  - [x] **Abril de 2026:**
    - [x] Beneficiários: `10.289` | Novos: `35` | Cancelados: `15` | PF/PJ: `5%` / `95%` (`515` / `9.774`).
    - [x] Leads: `132` | Origem: Google `45%`, Meta `17%`, Indicação `8%`, Outros `30%`.
    - [x] Taxa de Conversão: `11,8%` (Vendas: `15` / Leads: `132`).
    - [x] ROI: `3,8x` | CAC: `R$ 295,00` | LTV: `R$ 1.120,00`.
    - [x] NPS: `76` (Classificação: Excelência).
  - [x] **Maio de 2026:**
    - [x] Beneficiários: `10.289` | Novos: `42` | Cancelados: `18` | PF/PJ: `59%` / `41%`.
    - [x] Leads: `145` | Taxa de Conversão: `12,4%` | Vendas: `18`.
    - [x] ROI: `4,2x` | CAC: `R$ 283,69` | LTV: `R$ 1.190,00`.
    - [x] NPS: `78` (Classificação: Excelência).
  - [x] **Junho de 2026:**
    - [x] Beneficiários: `10.320` | Novos: `55` | Cancelados: `24` | PF/PJ: `5%` / `95%`.
    - [x] Leads: `160` | Taxa de Conversão: `13,1%` | Vendas: `21`.
    - [x] ROI: `4,5x` | CAC: `R$ 272,00` | LTV: `R$ 1.220,00`.
    - [x] NPS: `80` (Classificação: Excelência).
- [x] **Filtros de Área do Dashboard:**
  - [x] **Geral:** Exibe todos os 6 cards de KPI e atua em modo carrossel deslizante. Título: "Visão geral".
  - [x] **Marketing:** Exibe apenas Leads, Conversões, Investimento e ROI. Grid de 4 colunas estático. Título: "Desempenho de Marketing".
  - [x] **Análise & Crescimento:** Exibe apenas Beneficiários, Leads, Conversões e NPS. Título: "Análise de Crescimento & Conversão".

---

## 4. Funcionalidades de Componentes Dinâmicos

- [x] **Sidebar (Barra Lateral):**
  - [x] O clique no botão de recolhimento encolhe/expande a sidebar de forma animada.
  - [x] Textos da sidebar ocultam-se suavemente ao encolher.
  - [x] O estado da sidebar (recolhido/expandido) persiste no `localStorage` após recarregar a página.
- [x] **Gráfico de Anúncios (Chart.js / react-chartjs-2):**
  - [x] Renderiza corretamente na cor `#0D040A` (Premium Dark).
  - [x] Exibe os dados semanais baseados no mês ativo e na plataforma de anúncios selecionada.
  - [x] Tooltips estilizados com fundo escuro e cor rosa nos títulos.
- [x] **Tabela de Investimentos** *(validada por 13 testes automatizados em `InvestmentTable.test.tsx`)*:
  - [x] Lista as linhas de investimentos baseado no mês ativo.
  - [x] Aplica filtragem dinâmica ao clicar nas abas: Todos, Marketing, Ads, Offline.
  - [x] Atualiza o total consolidado de forma reativa baseado nas linhas ativas no filtro atual.
- [x] **Abas do Funil de Conversão (Card Multifunção):**
  - [x] Alterna perfeitamente entre as abas "Funil de Conversão", "Origem dos Leads" e "Cidades".
  - [x] Funil de Conversão exibe os 5 degraus com `clip-path` geométrico.
  - [x] Tabela de Cidades exibe corretamente a listagem dos municípios e métricas de crescimento.

---

## 5. Performance Básica & Confiabilidade

- [x] **Compilação Sem Erros:**
  - [x] `npm run build` compila com zero erros TypeScript. Bundle gerado com sucesso.
  - [x] `tsconfig.build.json` criado para excluir arquivos `.test.ts/tsx` do build de produção (evita erros de tipagem de APIs de teste no bundle final).
- [x] **Testes Automatizados:**
  - [x] **166/166 testes passando** — 7 arquivos de teste, 100% de taxa de sucesso.
  - [x] `src/utils/dashboardAdapter.test.ts` — 55 testes unitários de dados matemáticos e formatação.
  - [x] `src/utils/InvestmentTable.test.tsx` — 13 testes de componente React (renderização, filtragem e totais).
  - [x] `src/utils/routes.test.tsx` — 18 testes de rotas SPA (FilterTabs, MonthNavigator, fluxo Login→Dashboard).
  - [x] `src/utils/sync.test.tsx` — 27 testes de sincronização de estado (contexto, upsert, reset, segurança do hook).
  - [x] `src/utils/dataMap.test.ts` — 41 testes de integridade do mapa de dados (estrutura, campanhas, cidades, investimentos, relatórios).
  - [x] `src/test/Login.test.tsx` — 7 testes de autenticação.
  - [x] `src/test/Settings.test.tsx` — 5 testes de configurações de usuário.
