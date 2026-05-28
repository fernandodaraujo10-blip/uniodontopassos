# Estrutura do Projeto - Dashboard Uniodonto Passos

Este documento detalha o mapeamento e a descrição da nova arquitetura de componentes e páginas do projeto **Dashboard Uniodonto Passos**, após a refatoração completa do monolito legado `index.old.html`. 

A nova estrutura foi planejada e organizada sob as melhores práticas do ecossistema **React + Vite + TypeScript**, garantindo código limpo, componentização inteligente, tipagem estrita (zero `any`) e isolamento de responsabilidades.

---

## 📂 Visão Geral da Estrutura de Arquivos

```text
dashboard/
├── docs/
│   └── project-structure.md       # Este guia de mapeamento e arquitetura
├── src/
│   ├── components/
│   │   ├── cards/
│   │   │   ├── BeneficiariosCard.tsx  # Card do KPI total de beneficiários (PF/PJ SVG Donut)
│   │   │   ├── ConversoesCard.tsx     # Card do KPI de conversões e metas
│   │   │   ├── InvestimentoCard.tsx   # Card do KPI de investimentos e progresso
│   │   │   ├── KPICardGrid.tsx        # Grid e Carrossel inteligente de cards de KPI
│   │   │   ├── LeadsCard.tsx          # Card do KPI de leads e canais de origem
│   │   │   ├── NpsCard.tsx            # Card do KPI de satisfação NPS e promotores
│   │   │   └── RoiCard.tsx            # Card do KPI de retorno (ROI, CAC e LTV)
│   │   ├── charts/
│   │   │   ├── AdPerformanceChart.tsx # Gráfico de Anúncios escuro (Chart.js / react-chartjs-2)
│   │   │   └── ConversionFunnelTabs.tsx # Tabs do Funil de Conversão, Origens de Leads e Cidades
│   │   ├── filters/
│   │   │   └── FilterTabs.tsx         # Alternador de visão/área (Geral, Marketing, Análise)
│   │   ├── layout/
│   │   │   ├── Header.tsx             # Cabeçalho da página integrada (título, filtros, meses)
│   │   │   └── Sidebar.tsx            # Menu de navegação lateral retrátil (com localStorage)
│   │   ├── navigation/
│   │   │   └── MonthNavigator.tsx     # Seletor dinâmico e interativo de meses
│   │   └── tables/
│   │       └── InvestmentTable.tsx    # Tabela dinâmica de investimentos do mês com filtros
│   ├── data/
│   │   └── mockData.ts                # Base de dados estruturada para Abril, Maio e Junho/2026
│   ├── pages/
│   │   ├── Dashboard.tsx              # Página principal reunindo o painel de métricas
│   │   ├── DataUpload.tsx             # Painel de Envio de Dados com drag-and-drop de planilhas
│   │   └── Reports.tsx                # Painel de Relatórios com exportação de relatórios
│   ├── types/
│   │   └── dashboard.ts               # Definições de interfaces e tipos estritos do TypeScript
│   ├── App.tsx                        # Orquestrador global e gerenciador de navegação/páginas
│   ├── index.css                      # Estilos globais e animações customizadas (funil, scroll)
│   └── main.tsx                       # Ponto de entrada do React
├── package.json                       # Configurações e dependências do projeto
├── tailwind.config.js                 # Configurações do Tailwind CSS
├── tsconfig.json                      # Configurações do compilador TypeScript
└── vite.config.ts                     # Configurações do bundler Vite
```

---

## 🧱 Detalhamento dos Componentes

### 1. Componentes de Layout (`src/components/layout/`)

#### 📌 `Sidebar.tsx`
* **Descrição:** A barra de navegação lateral do sistema.
* **Funcionalidades:**
  * Navegação entre abas (`Dashboard`, `Relatórios` e `Envio de Dados`).
  * Comportamento recolhível (**collapsed**) que economiza espaço horizontal na tela.
  * Persistência do estado do menu recolhido via `localStorage`.
  * Aciona redimensionamento automático de gráficos ao expandir/recolher para evitar quebras visuais.
  * Ícones interativos fornecidos pela biblioteca `lucide-react`.

#### 📌 `Header.tsx`
* **Descrição:** Topo do dashboard unificado.
* **Funcionalidades:**
  * Exibição dinâmica do título da página de acordo com a área selecionada.
  * Agrupa os componentes `FilterTabs` (área de atuação) e `MonthNavigator` (período) de forma responsiva.

---

### 2. Componentes de Navegação & Filtros (`src/components/navigation/` & `src/components/filters/`)

#### 📌 `MonthNavigator.tsx`
* **Descrição:** Seletor interativo de meses do calendário fiscal/dashboard.
* **Funcionalidades:**
  * Navegação sequencial pelos botões de setas (`<` e `>`).
  * Seleção direta de meses, com o mês atual destacado em rosa padrão da marca.
  * Reatividade total propagando as alterações para todos os componentes do dashboard instantaneamente.

#### 📌 `FilterTabs.tsx`
* **Descrição:** Abas de filtros de visão do dashboard (**Geral**, **Marketing**, e **Análise & Crescimento**).
* **Funcionalidades:**
  * Altera o estado do dashboard para focar nas métricas relevantes.
  * Estilização visual fluida usando cores da paleta institucional.

---

### 3. Componentes de Cartões de KPI (`src/components/cards/`)

Para garantir alto desempenho e tipagem rígida, cada indicador de desempenho foi isolado em seu próprio componente:

#### 📌 `KPICardGrid.tsx`
* **Descrição:** Componente inteligente que envelopa os cartões de KPI.
* **Funcionalidades:**
  * Se a área for **Geral**: organiza todos os 6 cards em um carrossel com rolagem horizontal suave e setas dinâmicas que ocultam/exibem conforme o limite de scroll.
  * Se a área for **Marketing** ou **Análise**: exibe apenas os 4 cartões relevantes no formato de grid fixo, otimizando o layout de tela cheia.

#### 📌 `BeneficiariosCard.tsx`
* **Descrição:** KPI de beneficiários totais, novos e cancelados da Uniodonto Passos.
* **Funcionalidades:** Inclui um gráfico **Donut/Rosca minimalista feito em SVG inline dinâmico**, mostrando a porcentagem de beneficiários Pessoa Física (PF) vs. Pessoa Jurídica (PJ).

#### 📌 `LeadsCard.tsx`
* **Descrição:** Exibe o número de leads do período e detalha as quatro principais origens de tráfego (Google, Meta, Indicações e Outros).

#### 📌 `ConversoesCard.tsx`
* **Descrição:** Mostra a taxa de conversão final da captação comercial, relacionando leads com vendas finalizadas, incluindo a indicação da meta mensal estipulada.

#### 📌 `InvestimentoCard.tsx`
* **Descrição:** Apresenta o consolidado financeiro investido na captação, contrapondo com o valor orçado no mês através de uma **barra de progresso horizontal**.

#### 📌 `RoiCard.tsx`
* **Descrição:** Consolida o Retorno sobre o Investimento (ROI), o Custo de Aquisição de Clientes (CAC) e o Lifetime Value (LTV) estimado, com barra de eficiência.

#### 📌 `NpsCard.tsx`
* **Descrição:** Exibe a nota de satisfação de NPS (Net Promoter Score), classificação do nível da nota (Zona de Excelência) e taxa de promotores.

---

### 4. Componentes de Gráficos (`src/components/charts/`)

#### 📌 `AdPerformanceChart.tsx`
* **Descrição:** Gráfico de desempenho semanal de anúncios construído em cima do **Chart.js** via `react-chartjs-2`.
* **Funcionalidades:**
  * Interface escuro premium para destaque estético da marca.
  * Seletor de canal (Instagram, Meta ADS ou Google Ads) que atualiza o gráfico e as estatísticas.
  * Efeito de **gradiente linear vertical rosa** nas colunas do gráfico.
  * Tooltips customizadas interativas.
  * Exibição reativa de métricas secundárias (Visualizações, Campanhas com badge de variação, Investimento, Leads, Conversões e Taxa de Agendamento).

#### 📌 `ConversionFunnelTabs.tsx`
* **Descrição:** Painel multifuncional de conversões que agrupa 3 visões em abas:
  1. **Funil de Conversão:** Representação visual do funil (Impressões, Cliques, Leads, Agendamentos e Vendas) usando cortes poligonais dinâmicos do Tailwind (`clip-path`). Conta com animações interativas e cálculo automático de taxas de conversão relativas à direita (CTR, etc.).
  2. **Origem dos Leads:** Lista detalhada de captação de leads com barras horizontais animadas.
  3. **Cidades:** Tabela listando as 5 principais cidades da área de atuação, número de beneficiários locais e crescimento periódico em badges verdes destacados.

---

### 5. Componente de Tabela (`src/components/tables/`)

#### 📌 `InvestmentTable.tsx`
* **Descrição:** Painel vertical que detalha os investimentos do mês.
* **Funcionalidades:**
  * Exibe o total geral investido no período.
  * Possui **filtros rápidos** por categoria (Todos, Marketing, Ads e Offline).
  * O total investido é **recalculado instantaneamente** no frontend de acordo com o filtro selecionado, formatando o resultado de acordo com a moeda corrente brasileira (BRL).
  * Exibição de tags coloridas redondas associando cada investimento à sua categoria.
  * Registro preciso de data e hora no rodapé mostrando a última atualização.

---

## 📄 Descrição das Páginas (`src/pages/`)

#### 📌 `Dashboard.tsx`
* **Descrição:** A interface central que une o cabeçalho, os KPIs, a tabela de investimentos e a seção de gráficos.
* **Funcionalidades:** Alimenta todos os componentes filhos com o estado reativo dos seletores de meses e áreas.

#### 📌 `Reports.tsx`
* **Descrição:** Mockup didático e elegante da central de relatórios institucionais.
* **Funcionalidades:** Permite filtrar relatórios por categoria ou período, visualizar tamanho e extensão do arquivo, simular ações de impressão e download.

#### 📌 `DataUpload.tsx`
* **Descrição:** Painel para envio de planilhas ERP (faturamento, captação ou satisfação).
* **Funcionalidades:**
  * Área interativa de **Drag-and-Drop** (arrastar e soltar arquivo) com detecção de extensão permitida (.xlsx, .csv).
  * Feedbacks visuais e informativos sobre o progresso e sucesso do envio dos arquivos.
  * Bloco de instruções detalhado ao lado para orientar o usuário final.

---

## 🔄 Fluxo de Dados e Tipagem (`src/types/` & `src/data/`)

* **`src/types/dashboard.ts`:** Todas as estruturas do dashboard foram tipadas minuciosamente usando interfaces TypeScript, eliminando riscos de tipos incorretos ou inconsistências na renderização.
* **`src/data/mockData.ts`:** Centraliza a massa de dados reais e coerentes do projeto correspondentes aos meses de **Abril**, **Maio** e **Junho de 2026**. Essa centralização facilita a futura substituição por uma API REST real.

---

## ⚡ Diferenciais Técnicos e Ganhos da Refatoração

1. **Responsividade Garantida:** O uso inteligente de classes utilitárias do Tailwind CSS garante que a página permaneça compacta, sem vazamento ou estouro em telas menores.
2. **Separação de Preocupações:** A lógica de negócio, os dados de amostragem, os estilos visuais e as interfaces foram completamente isolados em seus respectivos diretórios.
3. **Escalabilidade:** A inclusão de novas métricas, meses ou plataformas de publicidade agora exige apenas a modificação do arquivo de tipos e do mock de dados, sem necessidade de reescrever lógica visual.
4. **Sem Vazamento de Memória:** O controle de instâncias do Chart.js via `react-chartjs-2` evita acúmulo de instâncias e sobrecarga de memória na CPU.
