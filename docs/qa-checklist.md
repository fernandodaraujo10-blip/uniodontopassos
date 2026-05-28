# Checklist de Garantia de Qualidade (QA) - Dashboard Uniodonto Passos

Este documento estabelece o checklist de controle de qualidade para validação da migração do **Dashboard Uniodonto Passos** de HTML monolítico para **React (v19) + Vite + TypeScript + Tailwind CSS (v4)**. Todos os itens devem ser validados e verificados antes da homologação final do projeto.

---

## 1. Layout & Design System

- [ ] **Coerência das Cores da Marca:**
  - [ ] Cor Primária `#D81B60` aplicada em botões ativos, cabeçalhos de destaque e segmentações ativas.
  - [ ] Cor Secundária `#E91E63` aplicada em degradês e hover de botões secundários.
  - [ ] Fundo do painel de anúncios utilizando a cor `#0D040A` (Premium Dark).
  - [ ] Sidebar utilizando gradiente linear vertical de `#D81B60` a `#880E4F`.
  - [ ] Fundo geral do dashboard utilizando a cor `#F8F9FA`.
- [ ] **Tipografia:**
  - [ ] Fonte `Inter` aplicada em todo o documento, com carregamento correto do Google Fonts.
  - [ ] Escala tipográfica respeitando as especificações do `spec.md` (títulos, métricas de KPI e labels pequenos).
- [ ] **Efeitos Visuais e Interatividade:**
  - [ ] Efeito Hover suave (`transition-all duration-300`) em todos os botões e abas de filtros.
  - [ ] Cards de KPI com sombra sutil (`card-shadow`) e elevação/translado suave ao passar o cursor (`hover:scale-102` ou `translate-y-[-2px]`).
  - [ ] Steps do funil de conversão estilizados corretamente com `clip-path` e filtro de brilho/sombra ao passar o mouse.
  - [ ] Scrollbars customizadas e discretas (`custom-scrollbar`) aplicadas na tabela de investimentos e áreas de rolagem vertical.

---

## 2. Responsividade & Estrutura de Tela

- [ ] **Visualização em Tela Única (Desktop >= 1280px):**
  - [ ] Toda a interface se adapta para preencher a tela verticalmente sem rolagem global (`overflow-hidden` no `body`).
  - [ ] Proporção perfeita entre a coluna esquerda (9/12 avos) e a coluna direita de investimentos (3/12 avos).
  - [ ] Carrossel de KPIs exibe de 4 a 6 cartões em fluxo contínuo horizontal, com setas de navegação inteligentes que desaparecem nas extremidades.
- [ ] **Visualização em Telas Médias (Tablets, Notebooks menores <= 1024px):**
  - [ ] O grid se reorganiza e permite rolagem confortável.
  - [ ] Sidebar pode ser recolhida (`collapsed`) liberando mais espaço de tela de forma fluida.
- [ ] **Visualização Mobile (Dispositivos Móveis <= 640px):**
  - [ ] Sidebar se oculta ou recolhe por padrão.
  - [ ] Componentes empilhados verticalmente de forma legível.
  - [ ] Os cards de KPI tornam-se deslizantes (rolagem horizontal por swipe).
  - [ ] Tabelas possuem scroll horizontal se a largura das colunas estourar a tela.

---

## 3. Navegação Mensal & Consistência de Dados

- [ ] **Seletor de Período Dinâmico:**
  - [ ] As setas `<` e `>` navegam corretamente entre Abril, Maio e Junho de 2026.
  - [ ] O botão do mês ativo recebe estilo destacado com fundo `#pink-100` e cor `#D81B60` (rosa primário).
  - [ ] Clicar nos botões de meses laterais altera a seleção imediatamente para o mês selecionado.
- [ ] **Consistência Matemática entre Períodos:**
  - [ ] **Abril de 2026:**
    - [ ] Beneficiários: `10.289` | Novos: `35` | Cancelados: `15` | PF/PJ: `5%` / `95%` (`515` / `9.774`).
    - [ ] Leads: `132` | Origem: Google `60%`, Meta `22%`, Indicação `10%`, Outros `8%`.
    - [ ] Taxa de Conversão: `11,8%` (Vendas: `15` / Leads: `132`).
    - [ ] Investimento: `R$ 12,1 mil` | Atual: `R$ 11.500,00` | Orçado: `R$ 12.100,00` | Progresso: `95,0%`.
    - [ ] ROI: `3,8x` | CAC: `R$ 295,00` | LTV: `R$ 1.120,00` | Fator: `3,8x`.
    - [ ] NPS: `76` (Promotores/Detratores: `5% / 81%`).
  - [ ] **Maio de 2026:**
    - [ ] Beneficiários: `10.289` | Novos: `42` | Cancelados: `18` | PF/PJ: `59%` / `41%` (`6.774` / `3.515`). (Atenção: A transição de rosca muda bruscamente de PF/PJ para refletir a variação).
    - [ ] Leads: `145` | Origem: Google `65%`, Meta `20%`, Indicação `8%`, Outros `7%`.
    - [ ] Taxa de Conversão: `12,4%` (Vendas: `18` / Leads: `145`).
    - [ ] Investimento: `R$ 12,5 mil` | Atual: `R$ 11.915,32` | Orçado: `R$ 13.000,00` | Progresso: `91,7%`.
    - [ ] ROI: `4,2x` | CAC: `R$ 283,69` | LTV: `R$ 1.190,00` | Fator: `4,2x`.
    - [ ] NPS: `78` (Promotores/Detratores: `4% / 82%`).
  - [ ] **Junho de 2026:**
    - [ ] Beneficiários: `10.320` | Novos: `55` | Cancelados: `24` | PF/PJ: `5%` / `95%` (`516` / `9.804`).
    - [ ] Leads: `160` | Origem: Google `68%`, Meta `18%`, Indicação `9%`, Outros `5%`.
    - [ ] Taxa de Conversão: `13,1%` (Vendas: `21` / Leads: `160`).
    - [ ] Investimento: `R$ 14,0 mil` | Atual: `R$ 12.800,00` | Orçado: `R$ 14.000,00` | Progresso: `91,4%`.
    - [ ] ROI: `4,5x` | CAC: `R$ 272,00` | LTV: `R$ 1.220,00` | Fator: `4,5x`.
    - [ ] NPS: `80` (Promotores/Detratores: `3% / 83%`).
- [ ] **Filtros de Área do Dashboard:**
  - [ ] **Geral:** Exibe todos os 6 cards de KPI e atua em modo carrossel deslizante se necessário. Título da tela definido como "Visão geral".
  - [ ] **Marketing:** Exibe apenas Leads, Conversões, Investimento e ROI. Desativa o scroll horizontal e exibe um grid de 4 colunas estático. Título: "Desempenho de Marketing".
  - [ ] **Análise & Crescimento:** Exibe apenas Beneficiários, Leads, Conversões e NPS. Desativa o scroll horizontal e exibe um grid de 4 colunas estático. Título: "Análise de Crescimento & Conversão".

---

## 4. Funcionalidades de Componentes Dinâmicos

- [ ] **Sidebar (Barra Lateral):**
  - [ ] O clique no botão `-right-3` encolhe/expande a sidebar mudando sua largura de `w-64` para `w-[76px]` de forma animada.
  - [ ] Textos da sidebar ocultam-se suavemente ao encolher.
  - [ ] O estado da sidebar (recolhido/expandido) persiste no `localStorage` após recarregar a página.
- [ ] **Gráfico de Anúncios (Chart.js / react-chartjs-2):**
  - [ ] Renderiza corretamente na cor `#0D040A` (Premium Dark).
  - [ ] Exibe os dados semanais baseados no mês ativo e na plataforma de anúncios selecionada (Google Ads, Meta ADS, Instagram).
  - [ ] Tooltips estilizados com fundo escuro, cor rosa nos títulos e formato `Pistas: X` são disparados no hover das barras.
  - [ ] O redimensionamento do gráfico ocorre automaticamente ao abrir/fechar a sidebar (com atraso de 305ms para sincronizar com a transição de CSS).
- [ ] **Tabela de Investimentos:**
  - [ ] Lista as linhas de investimentos baseado no mês ativo.
  - [ ] Aplica filtragem dinâmica ao clicar nas abas: Todos, Marketing, Ads, Offline.
  - [ ] Atualiza o total consolidado ("Total") de forma reativa baseado apenas nas linhas ativas no filtro atual, formatado como Real brasileiro (`R$ XX.XXX,XX`).
- [ ] **Abas do Funil de Conversão (Card Multifunção):**
  - [ ] Alterna perfeitamente entre as abas "Funil de Conversão", "Origem dos Leads" e "Cidades".
  - [ ] Funil de Conversão exibe os 5 degraus com `clip-path` geométrico e cores do rosa do 100 ao 500.
  - [ ] Tabela de Cidades exibe corretamente a listagem dos municípios e as respectivas métricas de crescimento e beneficiários do mês selecionado.

---

## 5. Performance Básica & Confiabilidade

- [ ] **Renderização Otimizada:**
  - [ ] Não ocorrem re-renderizações desnecessárias ao digitar ou mover filtros de área.
  - [ ] As instâncias do Chart.js são destruídas e recriadas de forma limpa ao trocar de mês ou plataforma, evitando vazamento de memória.
- [ ] **Erros no Console:**
  - [ ] Zero avisos ou erros de chave duplicada (`key` em loops React) no console do desenvolvedor.
  - [ ] Nenhuma falha de compilação do TypeScript no build (`npm run build`).
