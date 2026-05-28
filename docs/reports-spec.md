# Especificação Técnica de Relatórios e Exportação

Este documento detalha o funcionamento, a arquitetura de dados e o planejamento de integrações futuras para o módulo de **Relatórios Analíticos (Reports)** do Dashboard Corporativo da Uniodonto Passos.

---

## 1. Visão Geral do Módulo

O módulo de Relatórios foi desenvolvido sob a premissa de entregar um painel analítico de nível executivo. Ele consolida os dados de performance de marketing digital de forma granular e possibilita a extração e visualização rápida de KPIs críticos para tomada de decisão (ROI, Custo de Mídia, Faturamento e Volume de Conversões).

### Objetivos Principais:
1. **Consolidação Dinâmica**: Filtros cruzados em tempo real de Mês, Canal de Aquisição e Cidade.
2. **Visualização Avançada**: Gráficos de barra e linha responsivos que se adaptam à métrica ativa.
3. **Auditoria Transparente**: Tabela detalhada de registros com ordenação nativa por coluna, pesquisa textual rápida e paginação.
4. **Fidelidade Corporativa**: Prévia interativa no formato de folha timbrada A4 corporativa, alinhada aos padrões de documentação executiva.
5. **Autonomia de Exportação**: Downloads reais e imediatos dos dados selecionados em formato CSV e Excel (compatíveis com o MS Excel do Windows).

---

## 2. Estrutura de Arquivos

O módulo está organizado nos seguintes arquivos no repositório:

```
├── docs/
│   └── reports-spec.md          # Esta especificação técnica
└── src/
    ├── data/
    │   └── reportsData.ts       # Mock de dados brutos e lógica matemática de agregação
    ├── pages/
    │   └── Reports.tsx          # Componente principal de visualização da tela de Relatórios
    ├── App.tsx                  # Layout geral e roteamento/gerenciamento de abas
    └── index.css                # Estilos globais (incluindo .sidebar-gradient e .funnel-step)
```

### Detalhamento das Camadas de Código:

### A. Camada de Dados (`src/data/reportsData.ts`)
Define a interface `MarketingData` e simula uma base histórica granulada de performance com base em sazonalidades determinísticas de mercado (ex: picos em Novembro devido à Black Friday e em Dezembro devido ao Natal), pesos geográficos e multiplicadores de performance por canal.

```typescript
export interface MarketingData {
  id: string;
  mes: string;
  canal: string;
  cidade: string;
  cliques: number;
  impressoes: number;
  conversoes: number;
  custo: number;
  receita: number;
}
```

Disponibiliza a função `calcularResumo(dados: MarketingData[])` que realiza os agregados matemáticos em tempo real, calculando KPIs derivados como ROI, CPA, CPC, CTR e Taxa de Conversão.

### B. Interface Principal (`src/pages/Reports.tsx`)
Concentra o estado de filtragem e ordena os dados dinamicamente. Utiliza a biblioteca `react-chartjs-2` (integrada ao `Chart.js`) para desenhar gráficos responsivos e implementa utilitários locais para gerar arquivos sob demanda.

### C. Estrutura de Navegação (`src/App.tsx`)
Prover a moldura de visualização da aplicação. Contém a Sidebar e o cabeçalho executivo, organizando a navegação em 3 áreas dinâmicas:
1. **Dashboard Geral**: Visão macro consolidada de leads e fluxo de funil de conversão usando o efeito de `polygon` do TailwindCSS.
2. **Relatórios & Exportação**: Área analítica profunda.
3. **Configurações**: Cadastro de parâmetros globais.

---

## 3. Mecanismo de Filtros e Agregação

O processamento de dados baseia-se em estados do React combinados com a otimização de `useMemo` para garantir excelente desempenho (60 FPS) mesmo se a base fictícia escalar para milhares de linhas.

```
[Base Bruta: marketingRawData]
            │
            ▼
    [Filtro de Mês]
            │
            ▼
   [Filtro de Canal]
            │
            ▼
   [Filtro de Cidade]
            │
            ▼
  [Busca Textual Livre]
            │
            ▼
[Dados Filtrados Consolidados] ────► [Calcular Resumo: KPIs do Topo]
            │
            ├──────────────────────► [Agrupar para Gráficos: Canal & Linha do Tempo]
            │
            ├──────────────────────► [Ordenar e Paginar: Tabela Consolidada]
            │
            └──────────────────────► [Popular Prévia A4 Timbrada]
```

---

## 4. Arquitetura de Exportações no Frontend

Para evitar a sobrecarga de servidores e dependências externas desnecessárias nesta fase, as rotinas de exportação foram implementadas no lado do cliente (Client-Side) utilizando recursos nativos da Web:

### A. Exportação para CSV Real
A função `exportarCSV` converte os dados filtrados em um arquivo separado por ponto e vírgula (`;`).
* **Resolução de Encoding**: Insere-se o Byte Order Mark UTF-8 (`\uFEFF`) no início da cadeia de bytes. Isso garante que acentos e símbolos monetários (ex: `R$`, `Mês`) sejam abertos no Microsoft Excel sem erros de codificação de caracteres.
* **Mecanismo de Download**: Cria-se um `Blob` com o tipo MIME `text/csv;charset=utf-8;`, gerando uma URL temporária via `URL.createObjectURL(blob)` e disparando um clique programático em um elemento `<a>` invisível.

### B. Exportação para Excel (.xls/XML Tabulado)
Segue a mesma lógica do CSV, porém estruturado com tabulações (`\t`) e codificação UTF-8, o que permite que o MS Excel classifique as colunas de forma organizada e nativa no momento em que o download é concluído pelo navegador.

### C. Geração de PDF e Impressão Otimizada
A ação de PDF dispara o comando nativo `window.print()`.
Para entregar uma experiência impecável, o projeto usa estilos CSS de impressão (`print:`) em conformidade com o formato A4 (210mm x 297mm).
* Todos os elementos de navegação (Sidebar, Navbar, botões de ação, tabela de base com scroll e gráficos genéricos) são ocultados na impressão via classe utilitária `.print:hidden`.
* O contêiner de prévia do relatório A4 é exibido de forma centralizada e ocupa 100% da área física da folha (`print:p-0 print:max-w-full`).
* Isso permite salvar o relatório como um arquivo PDF impecável diretamente pelo driver de PDF nativo do sistema operacional (Windows Print to PDF ou Google Chrome PDF Driver).

---

## 5. Planejamento de Integrações Futuras

Para a transição da aplicação mockada/simulada para uma solução corporativa de alta escala com geração automatizada de relatórios em PDF e Planilhas complexas, os seguintes caminhos arquiteturais estão previstos:

### A. Integração com jsPDF & pdfmake (PDF Client-Side)
Se houver a necessidade de gerar PDFs altamente estilizados de forma puramente cliente sem abrir a caixa de diálogo de impressão do sistema, utilizaremos as bibliotecas `jsPDF` e `html2canvas` ou `pdfmake`.

#### Exemplo de implementação futura com jsPDF:
```typescript
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const gerarPDFExecutivo = async (idDoElementoA4: string) => {
  const elemento = document.getElementById(idDoElementoA4);
  if (!elemento) return;
  
  // Capturar o elemento A4 corporativo como imagem de alta resolução (2x scale)
  const canvas = await html2canvas(elemento, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL('image/png');
  
  // Criar documento PDF no formato A4 (retrato)
  const pdf = new jsPDF('p', 'mm', 'a4');
  const larguraPDF = pdf.internal.pageSize.getWidth();
  const alturaPDF = pdf.internal.pageSize.getHeight();
  
  pdf.addImage(imgData, 'PNG', 0, 0, larguraPDF, alturaPDF);
  pdf.save('Relatorio_Mensal_Performance.pdf');
};
```
> **Nota de Contexto:** Esta arquitetura client-side é recomendada para relatórios curtos (de 1 a 3 páginas). Para relatórios extensos de auditoria, recomenda-se a geração baseada em fluxos de dados ou geração no backend.

---

### B. Integração com SheetJS / ExcelJS (Planilhas Avançadas)
Atualmente, geramos planilhas utilizando a codificação de delimitadores simples. Para relatórios com formatação avançada (células coloridas, mesclagem de linhas, fórmulas nativas do Excel e gráficos embutidos), recomenda-se a integração da biblioteca `xlsx` (SheetJS) ou `exceljs`.

#### Exemplo de implementação futura com ExcelJS:
```typescript
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const exportarExcelEstilizado = async (dados: MarketingData[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Performance');
  
  // Configurar colunas e largura
  worksheet.columns = [
    { header: 'Mês', key: 'mes', width: 15 },
    { header: 'Canal', key: 'canal', width: 20 },
    { header: 'Cidade', key: 'cidade', width: 20 },
    { header: 'Custo (R$)', key: 'custo', width: 18 },
    { header: 'Receita (R$)', key: 'receita', width: 18 },
    { header: 'ROI', key: 'roi', width: 12 }
  ];
  
  // Estilizar Cabeçalho (Fundo Rosa Corporativo e Fonte Branca)
  worksheet.getRow(1).eachCell(cell => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D81B60' }
    };
    cell.font = { name: 'Arial', bold: true, color: { argb: 'FFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Inserir dados com fórmulas
  dados.forEach(item => {
    const row = worksheet.addRow({
      mes: item.mes,
      canal: item.canal,
      cidade: item.cidade,
      custo: item.custo,
      receita: item.receita,
      roi: '' // Calculado via fórmula
    });
    
    // Inserir fórmula na coluna ROI (Faturamento - Investimento) / Investimento
    const numLinha = row.number;
    row.getCell('roi').value = {
      formula: `IF(D${numLinha}>0, (E${numLinha}-D${numLinha})/D${numLinha}, 0)`
    };
    
    // Formatar células numéricas para Moeda e Porcentagem
    row.getCell('custo').numFmt = '"R$ "#,##0.00';
    row.getCell('receita').numFmt = '"R$ "#,##0.00';
    row.getCell('roi').numFmt = '0.00%';
  });
  
  // Escrever buffer e disparar download
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), 'Relatorio_Excel_Corporate.xlsx');
};
```
> **Nota de Contexto:** A utilização de `exceljs` permite que as planilhas mantenham os padrões estéticos visuais (Design System) da marca da empresa, elevando o profissionalismo na entrega das informações para auditorias e reuniões de conselho executivo.

---

### C. Arquitetura Server-Side (Geração de PDFs Robusta com Puppeteer)
Para cenários onde os relatórios são agendados (ex: envio automático de relatórios em PDF toda segunda-feira por e-mail para a diretoria), a arquitetura ideal é delegar a geração de PDF para o Backend.

```
[Cliente (Frontend)] ─── Requisitar PDF (Filtros) ───► [API Gateway / Backend]
                                                               │
                                                               ▼
[S3 Storage / CDN] ◄─── Salvar PDF Gerado ◄─── Geração ─── [Puppeteer Service]
        │                                                     
        └────────────── Retornar URL Pública do PDF ──────────► [Cliente]
```

Essa arquitetura elimina quaisquer gargalos de desempenho no celular do usuário cliente, além de garantir que o PDF gerado seja 100% idêntico para todos os usuários, independente da versão de navegador ou sistema operacional que estejam utilizando.
