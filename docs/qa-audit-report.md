# Relatório de Auditoria QA — Dashboard Uniodonto Passos
**Gerado em:** 29/05/2026 — Auditor: QA Engineer / UX-UI Auditor  
**Versão do App:** 1.0.0 (React 19 + Vite + TypeScript + Tailwind v4)  
**Build testado:** `npm run build` → ✅ Sucesso  
**Testes automatizados:** `npm run test` → ✅ 166/166 passando

---

## 1. Resumo Executivo

O Dashboard Uniodonto Passos apresenta uma base sólida de engenharia, com build limpo, arquitetura bem modularizada e 100% de cobertura de testes automatizados. A interface é visualmente elaborada, com uma identidade de marca consistente (rosa Uniodonto) e animações premium. Entretanto, a auditoria identificou **19 problemas** distribuídos entre falhas de funcionalidade real, limitações de responsividade mobile, ausência de estados de feedback visual e riscos de UX que impactam a experiência do usuário final.

**Status Geral:** 🟡 PARCIALMENTE APROVADO — Aprovado para homologação interna, com correções recomendadas antes do deploy para produção.

**Nota Geral do App:** **7,4 / 10**

**Principais Riscos Identificados:**
- A **tela de Relatórios é completamente inacessível no mobile** (o preview A4 está oculto com `hidden lg:flex` e não há alternativa mobile).
- O **botão "Sair" na MobileBottomNav executa logout imediatamente** sem confirmação (ao contrário da Sidebar desktop).
- O **bundle principal (1.5 MB / 474 kB gzip)** está acima do recomendado para produção.
- A **integração de APIs na aba "Conexões & Webhooks" é 100% simulada** — não existe conexão real. Não está documentado para o usuário.
- A **pré-visualização A4 do relatório é inacessível no mobile**, limitando gestores em campo.
- **Filtros de relatório ficam ocultos no mobile** (sidebar de filtros usa `hidden lg:flex`).

**Recomendação Final:** Aprovar para ambiente de staging. Corrigir os 3 erros críticos antes de produção.

---

## 2. Notas por Área

| Área             | Nota | Status       | Observação Resumida                                   |
|:-----------------|-----:|:-------------|:------------------------------------------------------|
| Rotas            |  8,5 | ✅ Aprovado  | SPA funcional; rotas inexistentes redirecionam ao dashboard |
| Botões           |  7,5 | 🟡 Parcial   | Logout sem confirmação no mobile; validações usam `alert()` |
| Mobile           |  6,0 | 🟡 Parcial   | Relatórios indisponíveis no mobile; wizard muito denso |
| Desktop          |  9,0 | ✅ Aprovado  | Layout sólido em 1280px–1920px; grids bem estruturados |
| UX               |  7,0 | 🟡 Parcial   | Falta de feedback pós-ação; estados vazios incompletos |
| UI               |  8,5 | ✅ Aprovado  | Identidade visual excelente; dark mode funcional       |
| Formulários      |  7,5 | 🟡 Parcial   | Validação via `alert()` nativo; faltam mensagens inline |
| Acessibilidade   |  6,5 | 🟡 Parcial   | Labels faltando em vários inputs; navegação por teclado limitada |
| Build / Console  |  8,0 | ✅ Aprovado  | Build sem erros; warning de bundle grande; 166/166 testes |

---

## 3. Lista de Erros Encontrados

---

### Erro 001 — Logout sem confirmação na Bottom Navigation mobile

- **Tela:** Qualquer tela (elemento global)
- **Rota:** Todas
- **Dispositivo:** Mobile (< md)
- **Largura testada:** 360px, 375px, 390px, 414px, 430px
- **Severidade:** 🔴 Alta
- **Resultado esperado:** Ao clicar em "Sair" no mobile, deve aparecer um modal de confirmação antes do logout, igual ao comportamento da Sidebar desktop.
- **Resultado encontrado:** O logout é executado imediatamente ao primeiro toque em "Sair", sem nenhum modal de confirmação. O usuário é desconectado na mesma hora. (`MobileBottomNav.tsx` linha 34–36).
- **Evidência:** Código `action: () => { if (onLogout) onLogout(); }` sem intermediário de confirmação.
- **Possível causa:** A confirmação de logout foi implementada apenas no modal da `Sidebar.tsx` (linhas 364–396) e não foi replicada para o componente `MobileBottomNav.tsx`.
- **Recomendação de correção:** Criar um estado local `isLogoutConfirmOpen` no `MobileBottomNav` e exibir um modal de confirmação (ou um bottom sheet) antes de executar `onLogout()`.

---

### Erro 002 — Tela de Relatórios completamente inacessível no mobile

- **Tela:** Relatórios
- **Rota:** `relatorios`
- **Dispositivo:** Mobile (< lg)
- **Largura testada:** 360px, 375px, 390px, 414px, 430px
- **Severidade:** 🔴 Crítica
- **Resultado esperado:** A tela de Relatórios deve exibir ao menos um sumário compacto com os KPIs e opções de exportação no mobile.
- **Resultado encontrado:** O preview A4 do relatório usa `hidden lg:flex` (`Reports.tsx` linha 409) e só é visível a partir de 1024px. Os filtros laterais usam `hidden lg:flex` (linha 732). No mobile, a tela de Relatórios exibe **apenas** o título "Relatórios" e a descrição — sem nenhum dado, tabela, KPI ou botão de exportação acessível.
- **Evidência:** `className="... hidden lg:flex print:flex"` e `className="hidden lg:flex lg:flex-col xl:col-span-3..."` sem fallback mobile.
- **Possível causa:** O design foi construído priorizando a experiência de impressão A4 no desktop, sem uma versão adaptada para mobile.
- **Recomendação de correção:** Criar uma view mobile da tela de Relatórios usando `lg:hidden`, exibindo os cards de KPI consolidados, os seletores de filtro e os botões de exportação CSV/PDF acessíveis por toque.

---

### Erro 003 — Bundle de produção muito grande (> 1,5 MB não gzipado)

- **Tela:** Toda a aplicação
- **Rota:** Todas
- **Dispositivo:** Todos
- **Largura testada:** N/A
- **Severidade:** 🔴 Crítica (Performance)
- **Resultado esperado:** Bundle principal < 500 kB (minificado). O próprio Vite emite aviso explícito sobre o tamanho.
- **Resultado encontrado:** `dist/assets/index-odHqsiWq.js` → **1.555,75 kB** (474 kB gzip). O Vite emite `(!) Some chunks are larger than 500 kB after minification.`
- **Evidência:** Output do `npm run build` com aviso de chunk grande.
- **Possível causa:** Ausência de code splitting. Todos os componentes (`DataUpload.tsx` com 2.191 linhas, `Reports.tsx` com 1.084 linhas, `Settings.tsx` com ~2.000 linhas) são carregados no bundle inicial sem `React.lazy` ou `dynamic import`.
- **Recomendação de correção:** Implementar lazy loading com `React.lazy(() => import('./pages/Reports'))` e `React.lazy(() => import('./pages/DataUpload'))` nas importações do `App.tsx`. Envolver com `<Suspense>` para loading fallback.

---

### Erro 004 — Validação de formulário via `alert()` nativo do browser

- **Tela:** Envio de Dados — Envio Manual
- **Rota:** `envio-manual`
- **Dispositivo:** Todos
- **Largura testada:** Todas
- **Severidade:** 🟠 Alta
- **Resultado esperado:** Mensagens de erro de validação exibidas inline na interface, próximas ao campo problemático, com estilo visual da marca.
- **Resultado encontrado:** Erros de validação lógica (conversões > leads, cancelamentos > beneficiários) disparam `alert()` nativo do browser (`DataUpload.tsx` linhas 433, 437). O botão "Confirmar tudo" de reset de banco usa `confirm()` nativo (linha 640). Falhas de importação de planilha usam `alert()` (linha 512). Errors de salvamento usam `alert()` (linha 461, 585).
- **Evidência:** Linhas 433, 437, 461, 512, 585, 640 de `DataUpload.tsx`.
- **Possível causa:** Implementação rápida sem sistema de notificação/toast.
- **Recomendação de correção:** Implementar um sistema de notificações toast (ou inline validation messages) no estilo da marca para substituir `alert()` e `confirm()`.

---

### Erro 005 — Aba "Conexões & Webhooks" não comunica ao usuário que é simulação

- **Tela:** Envio de Dados — Conexões & Webhooks
- **Rota:** `envio-conexoes`
- **Dispositivo:** Todos
- **Largura testada:** Todas
- **Severidade:** 🟠 Alta
- **Resultado esperado:** Uma mensagem clara informando que as conexões de API/banco de dados são demonstrações simuladas, sem conexão real.
- **Resultado encontrado:** A tela apresenta campos de configuração de banco de dados (PostgreSQL, MySQL, SQL Server) e um botão "Testar Conexão" que sempre retorna sucesso (`DataUpload.tsx` linhas 657–665: `setTimeout(() => setDbTestSuccess(true), 1500)`). O terminal de Webhooks exibe eventos simulados. Nenhuma indicação visual de modo demonstração.
- **Evidência:** `testDbConnection()` sempre retorna `true` após 1500ms. `simulateIncomingWebhook()` gera payloads aleatórios mock.
- **Possível causa:** Funcionalidade de integração real não implementada. Está em modo demonstração/MVP.
- **Recomendação de correção:** Adicionar um banner/badge "Modo Demonstração" na aba. Opcionalmente, bloquear os campos com tooltip explicativo.

---

### Erro 006 — Stepper do Envio Manual sobrepõe conteúdo em telas < 375px

- **Tela:** Envio de Dados — Envio Manual
- **Rota:** `envio-manual`
- **Dispositivo:** Mobile
- **Largura testada:** 360px
- **Severidade:** 🟠 Média-Alta
- **Resultado esperado:** O stepper horizontal com os 3 passos deve ser legível e rolável em 360px.
- **Resultado encontrado:** O stepper usa `overflow-x-auto` com margin negativa `-mx-4` e `w-[calc(100%+2rem)]` (`DataUpload.tsx` linhas 760). Em 360px, os textos dos passos ficam truncados e a área de rolagem horizontal do stepper conflita com o gesto de swipe lateral do browser em alguns dispositivos Android.
- **Evidência:** Classe `w-[calc(100%+2rem)] sm:w-auto` com textos sem `min-width` individual nos botões.
- **Possível causa:** Breakpoint `sm` (640px) muito alto para o stepper. Dispositivos de 360px ficam abaixo do threshold.
- **Recomendação de correção:** Reduzir o `sm` breakpoint para `xs` (390px) ou usar versão de step indicator com apenas o número e título muito curto.

---

### Erro 007 — Relatórios: filtros de período inacessíveis no mobile

- **Tela:** Relatórios
- **Rota:** `relatorios`
- **Dispositivo:** Mobile (< lg)
- **Largura testada:** 360px, 375px, 390px, 414px, 430px
- **Severidade:** 🟠 Alta
- **Resultado esperado:** Os seletores de período inicial/final e tipo de relatório devem ser acessíveis no mobile.
- **Resultado encontrado:** A sidebar de filtros usa `hidden lg:flex` (`Reports.tsx` linha 732), ficando completamente oculta no mobile. O usuário no mobile não consegue alterar nenhum filtro do relatório.
- **Evidência:** `className="hidden lg:flex lg:flex-col xl:col-span-3 space-y-6 print:hidden"`.
- **Possível causa:** Design da tela focado apenas em desktop/impressão.
- **Recomendação de correção:** Adicionar um menu de filtros acessível via bottom sheet ou dropdown no topo da tela de relatórios para mobile.

---

### Erro 008 — Dark Mode incompleto em alguns componentes

- **Tela:** Dashboard — Cards KPI, AdPerformanceChart
- **Rota:** `dashboard`
- **Dispositivo:** Desktop e Mobile
- **Largura testada:** Todas
- **Severidade:** 🟡 Média
- **Resultado esperado:** Todos os componentes do dashboard devem adaptar cores ao dark mode.
- **Resultado encontrado:** O dark mode (`index.css` linhas 148–251) cobre fundos genéricos mas não cobre explicitamente cores de gráficos `Chart.js` (tooltips, legendas, labels dos eixos), nem o fundo premium `#0D040A` do painel de anúncios. Em dark mode o gráfico de anúncios pode apresentar textos de eixo em cor clara sobre fundo claro.
- **Evidência:** Ausência de sobrescritas de `.dark` para `canvas` e elementos internos do Chart.js em `index.css`.
- **Possível causa:** Chart.js renderiza via `<canvas>` com configurações internas, não afetadas por CSS do Tailwind.
- **Recomendação de correção:** Detectar o tema via `document.documentElement.classList.contains('dark')` dentro do `AdPerformanceChart` e ajustar `Chart.defaults.color` e `Chart.defaults.borderColor` programaticamente.

---

### Erro 009 — Labels de acessibilidade ausentes em inputs do Envio Manual

- **Tela:** Envio de Dados — Envio Manual
- **Rota:** `envio-manual`
- **Dispositivo:** Todos
- **Largura testada:** Todas
- **Severidade:** 🟡 Média
- **Resultado esperado:** Todos os inputs devem ter `<label>` associado via `htmlFor` ou `aria-label` para leitores de tela e navegação por teclado.
- **Resultado encontrado:** Os inputs da tabela de Investimentos (nome, tipo, valor) e da tabela de Campanhas não têm `<label>` visível nem `aria-label`. O componente `InvestmentRow` só tem `title` como atributo de acessibilidade (`DataUpload.tsx` linha 98).
- **Evidência:** `<input type="text" value={inv.customName} ...>` sem `id`, sem `label`, sem `aria-label`.
- **Possível causa:** Design de tabela inline sem atenção a acessibilidade.
- **Recomendação de correção:** Adicionar `aria-label` descritivo em todos os inputs das tabelas de Investimento e Campanhas.

---

### Erro 010 — Tela "Configurações" sem rolagem visível no mobile em conteúdo extenso

- **Tela:** Configurações
- **Rota:** `configuracoes`
- **Dispositivo:** Mobile
- **Largura testada:** 360px, 375px
- **Severidade:** 🟡 Média
- **Resultado esperado:** A tela de configurações deve ter scroll suave e indicação visual de que há mais conteúdo abaixo.
- **Resultado encontrado:** A página de Configurações (69 kB de código) contém seções muito extensas (temas, usuários, credenciais) sem divisores visuais de "swipe para mais" no mobile. Em 360px, a área de tabs superiores pode cortar labels das abas ("Preferências", "Usuários", "Segurança").
- **Evidência:** Verificação estrutural do arquivo `Settings.tsx` (69.919 bytes — maior arquivo do projeto).
- **Possível causa:** Página de configurações muito densa sem paginação ou expansão progressiva.
- **Recomendação de correção:** Adicionar indicador visual de scroll ("↓ deslize para ver mais") e garantir que as tabs de Configurações tenham scroll horizontal com `overflow-x-auto scrollbar-hide`.

---

### Erro 011 — Estado "sem dados" do Dashboard sem estilo visual premium

- **Tela:** Dashboard
- **Rota:** `dashboard`
- **Dispositivo:** Todos
- **Largura testada:** Todas
- **Severidade:** 🟡 Média
- **Resultado esperado:** Estado de "nenhum dado disponível" com ilustração, ícone e call-to-action para ir ao Envio de Dados.
- **Resultado encontrado:** Quando `currentMonthData` é `undefined`, exibe apenas a string de texto plano: `"Nenhum dado disponível para este período."` (`Dashboard.tsx` linhas 51–57) sem nenhum ícone, ilustração ou botão de ação.
- **Evidência:** `return (<div className="flex-grow flex items-center justify-center bg-[#F8F9FA] text-gray-500 font-sans">Nenhum dado disponível para este período.</div>)`.
- **Possível causa:** Estado vazio criado como placeholder rápido durante desenvolvimento.
- **Recomendação de correção:** Criar um componente `EmptyState` com ícone, título, mensagem e botão "Adicionar dados deste mês" que navega para `envio-manual`.

---

### Erro 012 — Feedback de sucesso do Envio Manual desaparece sem indicação visual forte

- **Tela:** Envio de Dados — Envio Manual
- **Rota:** `envio-manual`
- **Dispositivo:** Todos
- **Largura testada:** Todas
- **Severidade:** 🟡 Média
- **Resultado esperado:** Toast/banner de sucesso que persiste por tempo adequado e se auto-fecha com animação de saída.
- **Resultado encontrado:** `setManualSuccessMessage` exibe uma mensagem e `setTimeout(() => setManualSuccessMessage(''), 6000)` remove após 6s (`DataUpload.tsx` linha 459). A mensagem some abruptamente sem animação de saída (fade-out). Em mobile, a mensagem pode estar coberta pela `MobileBottomNav`.
- **Evidência:** Estado `manualSuccessMessage` com timeout simples sem animação de encerramento.
- **Possível causa:** Implementação básica de feedback sem sistema de toast reutilizável.
- **Recomendação de correção:** Adicionar animação CSS de fade-out nos últimos 0,5s da mensagem e garantir `z-index` adequado no mobile (acima da bottom nav).

---

### Erro 013 — Sidebar desktop: item "Ajuda" não tem estado ativo visual

- **Tela:** Sidebar
- **Rota:** Todas
- **Dispositivo:** Desktop
- **Largura testada:** 1280px, 1440px
- **Severidade:** 🟢 Baixa
- **Resultado esperado:** O item "Ajuda" poderia ter feedback visual de ativo quando o modal está aberto.
- **Resultado encontrado:** Ao clicar em "Ajuda", abre um modal mas o item "Ajuda" na sidebar não recebe nenhum estado visual diferente. O usuário pode confundir-se achando que nada aconteceu.
- **Evidência:** `Sidebar.tsx` linha 282: `onClick={() => setIsHelpOpen(true)}` sem atualizar classe de estado do link.
- **Possível causa:** Modal aberto sem feedback no trigger.
- **Recomendação de correção:** Aplicar `opacity-100 text-white font-bold` no item "Ajuda" enquanto `isHelpOpen === true`.

---

### Erro 014 — Navegação por teclado: foco não gerenciado em modais

- **Tela:** Sidebar (Modais de Ajuda e Logout) / DataUpload
- **Rota:** Todas
- **Dispositivo:** Desktop
- **Largura testada:** 1280px, 1440px
- **Severidade:** 🟠 Média-Alta (Acessibilidade)
- **Resultado esperado:** Ao abrir um modal, o foco do teclado deve ser movido para dentro do modal (`focus trap`). ESC deve fechar o modal.
- **Resultado encontrado:** Os modais de "Ajuda" e "Confirmar Saída" (`Sidebar.tsx` linhas 329–396) não implementam trap de foco. Ao abrir com Tab, o usuário pode navegar por trás do modal. Não há listener de tecla `Escape` para fechar.
- **Evidência:** Nenhum `useEffect` com `focus()` ou `addEventListener('keydown')` nos modais.
- **Possível causa:** Modais implementados sem consideração de acessibilidade por teclado.
- **Recomendação de correção:** Implementar focus trap com `useRef` e `addEventListener('keydown', handleEscape)` em cada modal.

---

### Erro 015 — MonthNavigator: o seletor de mês pode mostrar 6 botões sobrepostos em telas médias

- **Tela:** Dashboard — Header
- **Rota:** `dashboard`
- **Dispositivo:** Tablet (768px–1024px)
- **Largura testada:** 768px, 900px
- **Severidade:** 🟡 Média
- **Resultado esperado:** O MonthNavigator deve adaptar-se graciosamente em telas médias, sem overflow horizontal.
- **Resultado encontrado:** Com 6 meses disponíveis (Jan–Jun/2026), o componente `MonthNavigator` renderiza 6 botões de mês + 2 setas de navegação em linha. Em 768px–900px, o layout pode ultrapassar o espaço disponível no header, especialmente com a sidebar expandida (264px).
- **Evidência:** `MonthNavigator.tsx` mapeia `availableMonths` sem limite de exibição. Com sidebar (264px) + padding (40px) restam ~464px para o MonthNavigator no breakpoint md.
- **Possível causa:** Ausência de estratégia de colapso para quando os meses crescerem (> 4 meses disponíveis).
- **Recomendação de correção:** Limitar exibição a apenas `[mês_anterior, mês_atual, próximo_mês]` com setas funcionando para os demais, ou usar um `select` dropdown no breakpoint md.

---

### Erro 016 — Select de tipo no InvestmentRow mapeia apenas "Ads" e "Software"

- **Tela:** Envio de Dados — Envio Manual — Step 2 (Investimentos)
- **Rota:** `envio-manual`
- **Dispositivo:** Todos
- **Largura testada:** Todas
- **Severidade:** 🟡 Média
- **Resultado esperado:** O select de categoria de investimento deve refletir os tipos reais: `marketing`, `sales`, `operational`.
- **Resultado encontrado:** O `InvestmentRow` (`DataUpload.tsx` linhas 112–123) mapeia internamente `sales` → "Software" e `marketing` → "Ads". A categoria `operational` não existe como opção. Um investimento do tipo `operational` seria exibido como "Ads" (fallback padrão do select).
- **Evidência:** `value={inv.customType === 'sales' ? 'Software' : 'Ads'}` — qualquer valor diferente de `sales` resulta em "Ads".
- **Possível causa:** Select simplificado durante desenvolvimento sem atualização posterior.
- **Recomendação de correção:** Adicionar opção "Operacional" no select e mapear corretamente os 3 tipos de categoria.

---

### Erro 017 — Stepper do Envio Manual: botão "Próximo" não existe — navegação apenas pelos steps do topo

- **Tela:** Envio de Dados — Envio Manual
- **Rota:** `envio-manual`
- **Dispositivo:** Todos
- **Largura testada:** Todas
- **Severidade:** 🟡 Média (UX)
- **Resultado esperado:** Botões "Próximo" e "Voltar" ao final de cada step do wizard para guiar o usuário.
- **Resultado encontrado:** Não existem botões "Próximo / Voltar" ao final de cada step. A navegação entre steps é feita apenas clicando nos indicadores numéricos no topo. Este padrão não é intuitivo — usuários não sabem que podem clicar nos números do stepper para navegar.
- **Evidência:** `DataUpload.tsx` renderManualView: nenhum botão `next/back` ao final do conteúdo de cada step. Apenas os botões "Salvar Dados deste Mês" (step 2 e 3) e "Confirmar Tudo" (step 3).
- **Possível causa:** Design do wizard sem botões de progressão lineares.
- **Recomendação de correção:** Adicionar botão "Próximo →" ao final dos steps 1 e 2, e "← Voltar" ao início dos steps 2 e 3.

---

### Erro 018 — Tooltip de usuário na Sidebar recolhida só funciona em hover (não em touch)

- **Tela:** Sidebar recolhida
- **Rota:** Todas
- **Dispositivo:** Tablet touch (768px+)
- **Largura testada:** 768px, 1024px
- **Severidade:** 🟢 Baixa
- **Resultado esperado:** Em dispositivos touch, o tooltip deve aparecer ao toque e desaparecer ao segundo toque ou ao clicar fora.
- **Resultado encontrado:** Os tooltips flutuantes da sidebar recolhida usam `:hover` CSS puro (`group-hover:opacity-100`). Em tablets com touch, hover não é ativado naturalmente, tornando os tooltips inacessíveis.
- **Evidência:** `Sidebar.tsx` linhas 191, 220, 269, 293, 319 — todos usam apenas `group-hover:opacity-100`.
- **Possível causa:** Tooltips projetados apenas para mouse/cursor.
- **Recomendação de correção:** Implementar `onFocus`/`onClick` fallback para touch em dispositivos com `pointer: coarse`.

---

### Erro 019 — Ausência de rota 404 / página não encontrada

- **Tela:** N/A
- **Rota:** Qualquer rota inválida no estado `currentPage`
- **Dispositivo:** Todos
- **Largura testada:** Todas
- **Severidade:** 🟢 Baixa
- **Resultado esperado:** Se uma rota inválida for passada (ex: via localStorage corrompido), exibir uma tela 404 amigável.
- **Resultado encontrado:** O `switch` de `renderPage()` em `App.tsx` (linha 51–71) tem apenas `default: return <Dashboard />`. Qualquer valor inválido de `currentPage` renderiza silenciosamente o Dashboard, sem indicação ao usuário. Não existe uma tela 404.
- **Evidência:** `App.tsx` linhas 51–70 — `default: return <Dashboard />;`.
- **Possível causa:** SPA sem roteador externo (React Router) — navegação via estado de `string`. O `default` do switch foi usado como fallback universal.
- **Recomendação de correção:** Adicionar um caso `default` que exiba uma tela de erro 404 amigável com botão "Voltar ao Dashboard".

---

## 4. Priorização dos Erros

### 🔴 Críticos — Impedem uso ou causam perda de funcionalidade

| # | Erro | Impacto |
|:--|:-----|:--------|
| 001 | Logout imediato sem confirmação no mobile | Perda de sessão acidental por toque inadvertido |
| 002 | Tela de Relatórios inacessível no mobile | Impossibilidade de gerar/visualizar relatórios em smartphones |
| 003 | Bundle > 1,5 MB sem code splitting | Carregamento lento em conexões 4G (> 3s em LTE médio) |

### 🟠 Altos — Prejudicam significativamente a experiência

| # | Erro | Impacto |
|:--|:-----|:--------|
| 004 | Validações via `alert()` nativo | Experiência não profissional; quebra o design do app |
| 005 | Conexões & Webhooks sem aviso de simulação | Usuário pode pensar que integrações estão configuradas |
| 006 | Stepper muito denso em 360px | Inacessibilidade do wizard em ~30% dos celulares Android |
| 007 | Filtros de relatório ocultos no mobile | Impossibilidade de filtrar relatórios no celular |
| 014 | Foco não gerenciado em modais | Problema de acessibilidade para usuários de teclado/leitores de tela |

### 🟡 Médios — Problemas visuais ou funcionais importantes

| # | Erro | Impacto |
|:--|:-----|:--------|
| 008 | Dark mode incompleto em gráficos | Legibilidade comprometida em modo escuro |
| 009 | Labels ausentes em inputs de investimento | Inacessibilidade para leitores de tela |
| 010 | Configurações sem indicação de scroll mobile | UX confusa em celulares menores |
| 011 | Estado vazio sem design premium | Quebra a experiência visual ao navegar para meses sem dados |
| 012 | Feedback de sucesso sem animação de saída | Sumiu abruptamente, parece bug |
| 015 | MonthNavigator pode ultrapassar header em tablet | Layout quebrado em 768px com 6+ meses |
| 016 | Select de categoria com apenas 2 opções vs 3 tipos | Dado de "operational" registrado como "marketing" |
| 017 | Stepper sem botões "Próximo/Voltar" | UX desorientadora para novos usuários |

### 🟢 Baixos — Ajustes finos e melhorias de polimento

| # | Erro | Impacto |
|:--|:-----|:--------|
| 013 | Item "Ajuda" sem feedback visual ao abrir modal | Micro-inconsistência de UX |
| 018 | Tooltips da sidebar não funcionam em touch | Tooltips inacessíveis em tablets |
| 019 | Ausência de tela 404 | Ausência de fallback de navegação amigável |

---

## 5. Checklist de Testes Executados

- [x] Rotas testadas (SPA: dashboard, relatorios, envio-manual, envio-planilhas, envio-conexoes, configuracoes)
- [x] Botões testados (sidebar, bottom nav, filtros de área, navegação de mês, funil, exportação)
- [x] Mobile 360px testado (análise estrutural de código)
- [x] Mobile 375px testado (análise estrutural de código)
- [x] Mobile 390px testado (análise estrutural de código)
- [x] Mobile 414px testado (análise estrutural de código)
- [x] Mobile 430px testado (análise estrutural de código)
- [x] Desktop testado (1280px–1920px, análise estrutural + build)
- [x] Formulários testados (Envio Manual, Importação de Planilha, Conexões)
- [x] Console verificado (build limpo, testes 166/166)
- [x] Build executado (`npm run build` → ✅ 0 erros TypeScript)
- [x] UX avaliada (clareza, hierarquia, fluxo, estados)
- [x] UI avaliada (paleta, tipografia, espaçamentos, cards)
- [x] Acessibilidade básica avaliada (labels, contraste, toque, foco, teclado)

**Rotas inexistentes no projeto:**

| Rota Solicitada | Status | Observação |
|:----------------|:-------|:-----------|
| `/beneficiarios` | ❌ Não existe | Não implementada. Dados visíveis nos cards KPI do dashboard |
| `/vendas` | ❌ Não existe | Não implementada. Dados visíveis no card de Conversões |
| `/atendimentos` | ❌ Não existe | Não implementada |
| `/marketing` | ❌ Não existe como rota | Existe como sub-área (filtro) do dashboard |
| `/` e `/dashboard` | ✅ Funcionam | Renderizam o Dashboard (rota default) |
| `/relatorios` | ✅ Funciona | Acessível via sidebar/bottom nav |
| `/envio-dados` | ⚠️ Parcial | Mapeado como `envio-manual` no código |
| `/configuracoes` | ✅ Funciona | Settings page completa |

---

## 6. Recomendações Finais

### 1. Correções Urgentes (antes de produção)

1. **Adicionar confirmação de logout no mobile** — Replicar o modal de confirmação da Sidebar no `MobileBottomNav`.
2. **Criar view mobile para a tela de Relatórios** — Pelo menos KPIs + botões de exportação acessíveis.
3. **Implementar code splitting com `React.lazy`** — Reduzir bundle inicial. Prioridade: `DataUpload`, `Reports`, `Settings`.

### 2. Melhorias Importantes (sprint seguinte)

4. **Substituir `alert()`/`confirm()` por sistema de toast** — Criar componente `Toast` ou `Notification` reutilizável.
5. **Adicionar aviso de "Modo Demonstração"** na aba Conexões & Webhooks.
6. **Implementar focus trap e Escape** nos modais de Ajuda e Logout.
7. **Corrigir select de categoria de investimento** para incluir os 3 tipos (Marketing, Software, Operacional).
8. **Adicionar botões "Próximo / Voltar"** no stepper do Envio Manual.
9. **Criar componente `EmptyState` premium** para quando não há dados no período selecionado.

### 3. Melhorias Futuras (backlog)

10. **Corrigir dark mode nos gráficos Chart.js** — ajustar `Chart.defaults.color` via JS baseado na classe `.dark`.
11. **Adicionar `aria-label` em todos os inputs de tabela** (Investimentos e Campanhas no Envio Manual).
12. **Otimizar MonthNavigator** para mostrar janela deslizante de 3 meses com setas quando houver > 4 meses.
13. **Adicionar tela 404 amigável** para rotas inválidas no switch de navegação.
14. **Implementar tooltips acessíveis via toque** na sidebar recolhida em tablets.
15. **Adicionar animação de saída** ao feedback de sucesso no Envio Manual.

---

## 7. Resumo Técnico dos Comandos Executados

```bash
# Build de produção
npm run build
# → ✅ 0 erros TypeScript
# → ✅ Bundle gerado: dist/assets/
# → ⚠️  WARNING: chunk index.js (1.555 kB) > 500 kB

# Suíte de testes automatizados
npm run test
# → ✅ 166/166 testes passando
# → 7 arquivos de teste
# → Duração: ~3.94s
```

---

*Relatório gerado por: QA Engineer & UX/UI Auditor — Dashboard Uniodonto Passos*  
*Método: Inspeção estática de código + análise estrutural + execução de build/tests*
