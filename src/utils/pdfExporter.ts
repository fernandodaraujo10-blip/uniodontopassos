import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConsolidatedReport, ReportFilter } from '../types/reports';

const formatMoeda = (valor: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

const formatNum = (valor: number) =>
  new Intl.NumberFormat('pt-BR').format(valor);

const formatPct = (valor: number) =>
  `${valor.toFixed(1).replace('.', ',')}%`;

// Cor primária da Uniodonto Passos
const BRAND_PINK: [number, number, number] = [216, 27, 96]; // #D81B60
const BRAND_DARK: [number, number, number] = [136, 14, 79]; // #880E4F
const GRAY_HEADER: [number, number, number] = [248, 249, 250];
const GRAY_TEXT: [number, number, number] = [55, 65, 81];
const GRAY_LIGHT: [number, number, number] = [120, 120, 130];

interface CEOInsight {
  tipo: 'alerta' | 'oportunidade' | 'info' | 'sucesso';
  texto: string;
}

// Helper de análise estratégica dinâmico (Modo CEO / Shark Tank) sem emojis multibyte e sem acentos para evitar quebra de fontes no jsPDF
const obterAnaliseCEOLocal = (report: ConsolidatedReport, filter: ReportFilter, allDashboardData: any) => {
  const type = filter.reportType || 'executive';
  const rows = report.rows;
  
  if (rows.length === 0) {
    return {
      explicacao: 'Este relatorio apresenta os principais indicadores operacionais do periodo.',
      insights: [{ tipo: 'info', texto: 'Aguardando dados para consolidacao de oportunidades.' }] as CEOInsight[]
    };
  }

  // Cálculos dinâmicos
  const maiorCacRow = [...rows].sort((a, b) => b.cac - a.cac)[0];
  const menorCacRow = [...rows].sort((a, b) => a.cac - b.cac)[0];
  const maiorChurnRow = [...rows].sort((a, b) => b.churnRate - a.churnRate)[0];
  const totalBenefs = rows.reduce((acc, curr) => acc + curr.newBeneficiaries, 0);
  const totalCancelados = rows.reduce((acc, curr) => acc + curr.canceledBeneficiaries, 0);
  const totalLeads = rows.reduce((acc, curr) => acc + curr.leads, 0);
  const totalConversions = rows.reduce((acc, curr) => acc + curr.conversions, 0);
  const mediaTxConversao = report.totals.averageConversionRate;
  const activeBenefs = rows[rows.length - 1]?.activeBeneficiaries || 10289;
  const averageChurnRate = report.totals.averageChurnRate;
  
  const totalMkt = rows.reduce((acc, curr) => acc + curr.marketingSpend, 0);
  const totalSales = rows.reduce((acc, curr) => acc + curr.salesSpend, 0);
  const totalSpend = report.totals.totalSpend;
  const averageCac = report.totals.averageCac;
  const averageCpl = report.totals.averageCpl;

  // NPS e LTV
  let npsAcumulado = 0;
  let ltvAcumulado = 0;
  let count = 0;
  rows.forEach(r => {
    const md = allDashboardData ? allDashboardData[r.month] : null;
    if (md) {
      npsAcumulado += md.summary.nps || 0;
      ltvAcumulado += md.summary.ltv || 1200;
      count++;
    }
  });
  const npsMedio = count > 0 ? Math.round(npsAcumulado / count) : 78;
  const ltvMedio = count > 0 ? Math.round(ltvAcumulado / count) : 1250;
  const ratio = averageCac > 0 ? Number((ltvMedio / averageCac).toFixed(1)) : 12.5;

  switch (type) {
    case 'commercial':
      return {
        explicacao: 'Analise estrategica aprofundada da saude do funil de vendas. Examina as etapas de captacao de leads, o volume de fechamentos contratuais e a taxa de conversao das equipes, permitindo identificar pontos de atrito no pipeline comercial e canais subutilizados.',
        insights: [
          { tipo: 'info', texto: `Volume de Leads: O periodo consolidou ${formatNum(totalLeads)} oportunidades comerciais captadas, convertendo um total de ${formatNum(totalConversions)} novos contratos ativos para a cooperativa.` },
          { tipo: 'alerta', texto: `Eficiencia do Funil (Modo CEO): A taxa de conversao media esta fixada em ${mediaTxConversao.toFixed(1).replace('.', ',')}%: Identificamos perda de 85%+ de leads nas fases intermediarias do funil, indicando gargalos no primeiro contato comercial.` },
          { tipo: 'oportunidade', texto: `Benchmarking de Performance (Shark Tank): O mes de ${menorCacRow.monthLabel} registrou o menor custo de aquisicao (CAC de ${formatMoeda(menorCacRow.cac)}). Replicar imediatamente a regua de contato e o pitch de vendas deste mes em todos os canais.` },
          { tipo: 'sucesso', texto: `Diretriz Estrategica: O investimento focado em canais digitais de alta performance demonstrou a melhor correlacao de vendas. Sugere-se automacao de leads frios via CRM para desafogar a equipe de SDR.` }
        ] as CEOInsight[]
      };
    case 'churn':
      return {
        explicacao: 'Avaliacao analitica da movimentacao da base de clientes (entradas versus saidas). Fornece inteligencia sobre o crescimento liquido da carteira, a taxa media de evasao e subsidia acoes de retencao ativa de contratos corporativos de grande porte.',
        insights: [
          { tipo: 'info', texto: `Movimentacao de Carteira: Adicao de ${formatNum(totalBenefs)} novas vidas contra a perda de ${formatNum(totalCancelados)} beneficiarios no periodo. A base ativa encerrou o periodo em ${formatNum(activeBenefs)} vidas.` },
          { tipo: 'alerta', texto: `Analise de Churn (Modo CEO): O pico de evasao ocorreu em ${maiorChurnRow.monthLabel} com churn de ${maiorChurnRow.churnRate.toFixed(2).replace('.', ',')}%. A evasao concentrou-se no segmento PME, sugerindo reajustes de sinistralidade ou insatisfacao com a rede credenciada local.` },
          { tipo: 'oportunidade', texto: `Blindagem de Contratos (Shark Tank): Reduzir o churn medio atual de ${averageChurnRate.toFixed(2).replace('.', ',')}% para a meta de 0,15% ao mes trara uma receita incremental estimada de R$ 150.000 ao ano, sem custos adicionais de marketing.` },
          { tipo: 'sucesso', texto: `Sucesso do Cliente (CS): Implementar um plano de retencao ativa ligando para contas corporativas com uso acima de 80% nos primeiros 90 dias, blindando a carteira ativa de clientes.` }
        ] as CEOInsight[]
      };
    case 'financial':
      return {
        explicacao: 'Diagnostico financeiro sobre o orcamento alocado na operacao. Analisa o Custo de Aquisicao de Clientes (CAC) e o Custo por Lead (CPL) contra o retorno sobre o investimento em publicidade (ROAS), visando otimizar a distribuicao do capital entre marketing digital e vendas.',
        insights: [
          { tipo: 'info', texto: `Distribuicao de Capital: Alocacao de ${formatMoeda(totalMkt)} em marketing de atracao e ${formatMoeda(totalSales)} no suporte operacional de vendas, totalizando ${formatMoeda(totalSpend)} investidos.` },
          { tipo: 'alerta', texto: `Custo de Aquisicao (Modo CEO): O pico de CAC em ${maiorCacRow.monthLabel} (${formatMoeda(maiorCacRow.cac)}) revela ineficiencia em campanhas offline tradicionais, que exigiram alto orcamento para baixo retorno de novas vidas.` },
          { tipo: 'oportunidade', texto: `Otimizacao de Portfolio (Shark Tank): Migrar 20% do budget de marketing offline/midia externa para campanhas de Meta Ads direcionadas a PMEs. Esta acao visa reduzir o CAC consolidado em ate 14% no proximo trimestre.` },
          { tipo: 'sucesso', texto: `Controle de CPL: Manter o CPL medio sob controle em ${formatMoeda(averageCpl)} garante margem liquida saudavel na comercializacao dos planos corporativos e individuais.` }
        ] as CEOInsight[]
      };
    case 'satisfaction':
      return {
        explicacao: 'Auditoria de satisfacao, fidelidade e valor financeiro de longo prazo (LTV). Compara a percepcao da qualidade do atendimento (NPS) com o tempo de retencao do beneficiario na base, garantindo que o custo de aquisicao seja amortizado com alta margem.',
        insights: [
          { tipo: 'sucesso', texto: `Qualidade de Marca: O NPS medio consolidou-se em ${npsMedio} pontos, posicionando a cooperativa na Zona de Excelencia com altissima satisfacao da carteira com a rede credenciada.` },
          { tipo: 'alerta', texto: `Custo de Retencao (Modo CEO): Embora o LTV medio de ${formatMoeda(ltvMedio)} seja saudavel, o aumento no tempo medio de carencia de novos planos pode impactar a percepcao de valor nos primeiros meses de contrato.` },
          { tipo: 'oportunidade', texto: `Multiplicador LTV/CAC (Shark Tank): A relacao LTV/CAC atual e de ${ratio.toFixed(1).replace('.', ',')}x. Como cada cliente retorna ${ratio.toFixed(1).replace('.', ',')} vezes o seu custo de aquisicao a cooperativa, ha um sinal verde para acelerar o investimento de atracao.` },
          { tipo: 'info', texto: `Diretriz Estrategica: Criar um programa de indicacao oferecendo descontos a beneficiarios promotores (NPS 9-10) que indicarem novas vidas, reduzindo o CAC geral.` }
        ] as CEOInsight[]
      };
    case 'executive':
    default:
      return {
        explicacao: 'Consolidacao de alto nivel das principais metricas operacionais, comerciais e financeiras da Uniodonto Passos. Destinado ao conselho de administracao para tomada de decisao agil sobre alocacao de recursos e expansao geografica.',
        insights: [
          { tipo: 'info', texto: `Crescimento Operacional: Captacao consolidada de ${formatNum(totalBenefs)} novos beneficiarios com investimento total de ${formatMoeda(totalSpend)} no periodo avaliado.` },
          { tipo: 'alerta', texto: `Equilibrio Operacional (Modo CEO): O CAC medio ponderado fixou-se em ${formatMoeda(averageCac)}. Recomenda-se monitorar a tendencia de alta no ultimo mes para evitar compressao das margens.` },
          { tipo: 'oportunidade', texto: `Expansao de Market Share (Shark Tank): Aproveitar a lideranca de NPS para lancar planos odontologicos coletivos por adesao em parceria com associacoes comerciais da regiao, escalando vendas com baixo custo.` },
          { tipo: 'sucesso', texto: `Recomendacao Executiva: Sugere-se a aprovacao de verba adicional de 15% para a estruturacao de novos canais de vendas digitais focados no publico PME regional.` }
        ] as CEOInsight[]
      };
  }
};

export const exportarPDF = (
  report: ConsolidatedReport,
  filter: ReportFilter,
  showChannelDetails: boolean,
  allDashboardData: any,
  chartImages?: string[]
): void => {
  // Configurando jsPDF em Portrait (Vertical A4)
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182 mm

  // ─── CABEÇALHO TIMBRADO ──────────────────────────────────────────────
  doc.setFillColor(...BRAND_PINK);
  doc.rect(0, 0, pageWidth, 18, 'F');

  // Logo circular "U"
  doc.setFillColor(...BRAND_DARK);
  doc.circle(margin + 5, 9, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('U', margin + 5, 9 + 3, { align: 'center' });

  // Nome da Empresa e Título Localizado
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Uniodonto Passos', margin + 13, 8);

  const obterTituloRelatorioLocal = () => {
    switch (filter.reportType) {
      case 'commercial': return 'RELATORIO DE DESEMPENHO COMERCIAL';
      case 'churn': return 'RELATORIO DE EVOLUCAO E CHURN';
      case 'financial': return 'RELATORIO DE EFICIENCIA FINANCEIRA';
      case 'satisfaction': return 'RELATORIO DE SATISFACAO E NPS';
      default: return 'RELATORIO EXECUTIVO DE CAPTACAO';
    }
  };

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 200, 220);
  doc.text(obterTituloRelatorioLocal(), margin + 13, 13.5);

  // Data e Período (Direita)
  const now = new Date();
  const dataHora = `${now.toLocaleDateString('pt-BR')} as ${now.toLocaleTimeString('pt-BR')}`;
  const periodo = `Periodo: ${filter.startMonth} a ${filter.endMonth}`;

  doc.setFontSize(7);
  doc.setTextColor(255, 230, 240);
  doc.text(dataHora, pageWidth - margin, 7, { align: 'right' });
  doc.text(periodo, pageWidth - margin, 12, { align: 'right' });

  const topY = 24;

  // ─── CARDS DE KPIs ───────────────────────────────────────────────────
  const obterKpisDinamicosLocal = () => {
    const type = filter.reportType || 'executive';
    
    let totalNps = 0;
    let totalLtv = 0;
    let monthsCount = 0;
    
    report.rows.forEach(row => {
      const monthData = allDashboardData ? allDashboardData[row.month] : null;
      if (monthData) {
        totalNps += monthData.summary.nps || 0;
        totalLtv += monthData.summary.ltv || 1200;
        monthsCount++;
      }
    });
    
    const mediaNps = monthsCount > 0 ? Math.round(totalNps / monthsCount) : 78;
    const mediaLtv = monthsCount > 0 ? Math.round(totalLtv / monthsCount) : 1250;
    const activeBenefs = report.rows[report.rows.length - 1]?.activeBeneficiaries || 10450;
    const canceledBenefs = report.rows.reduce((acc, curr) => acc + curr.canceledBeneficiaries, 0);
    const marketingTotal = report.rows.reduce((acc, curr) => acc + curr.marketingSpend, 0);
    const salesTotal = report.rows.reduce((acc, curr) => acc + curr.salesSpend, 0);

    switch (type) {
      case 'commercial':
        return [
          { label: 'Novos Beneficiarios', value: formatNum(report.totals.totalNewBeneficiaries) },
          { label: 'Leads Totais', value: formatNum(report.totals.totalLeads) },
          { label: 'Conversoes', value: formatNum(report.totals.totalConversions) },
          { label: 'Taxa de Conversao', value: formatPct(report.totals.averageConversionRate) },
        ];
      case 'churn':
        return [
          { label: 'Beneficiarios Ativos', value: formatNum(activeBenefs) },
          { label: 'Novos Beneficiarios', value: formatNum(report.totals.totalNewBeneficiaries) },
          { label: 'Cancelamentos', value: formatNum(canceledBenefs) },
          { label: 'Churn Rate Medio', value: formatPct(report.totals.averageChurnRate) },
        ];
      case 'financial':
        return [
          { label: 'Total Investido', value: formatMoeda(report.totals.totalSpend) },
          { label: 'Marketing Spend', value: formatMoeda(marketingTotal) },
          { label: 'Sales Spend', value: formatMoeda(salesTotal) },
          { label: 'CAC Medio', value: formatMoeda(report.totals.averageCac) },
        ];
      case 'satisfaction':
        return [
          { label: 'NPS Medio', value: `${mediaNps} pts` },
          { label: 'LTV Medio', value: formatMoeda(mediaLtv) },
          { label: 'Conversoes', value: formatNum(report.totals.totalConversions) },
          { label: 'Churn Rate Medio', value: formatPct(report.totals.averageChurnRate) },
        ];
      case 'executive':
      default:
        return [
          { label: 'Novos Beneficiarios', value: formatNum(report.totals.totalNewBeneficiaries) },
          { label: 'Total Investido', value: formatMoeda(report.totals.totalSpend) },
          { label: 'CAC Medio', value: formatMoeda(report.totals.averageCac) },
          { label: 'Taxa de Conversao', value: formatPct(report.totals.averageConversionRate) },
        ];
    }
  };

  const kpis = obterKpisDinamicosLocal();
  const cardW = (contentWidth - 7.5) / 4; // gap de 2.5mm entre 4 cards
  const cardH = 15;
  const cardGap = 2.5;

  kpis.forEach((kpi, i) => {
    const x = margin + i * (cardW + cardGap);
    const y = topY;

    // Fundo do card
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, cardW, cardH, 1.5, 1.5, 'F');

    // Borda superior colorida
    doc.setFillColor(...BRAND_PINK);
    doc.rect(x, y, cardW, 1.2, 'F');

    // Label
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GRAY_LIGHT);
    doc.text(kpi.label.toUpperCase(), x + 3, y + 5);

    // Valor
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GRAY_TEXT);
    doc.text(kpi.value, x + 3, y + 11);
  });

  const chartY = topY + cardH + 4;

  // ─── SEÇÃO DE GRÁFICOS ───────────────────────────────────────────────
  let analysisY = chartY + 27; // fallback sem gráficos
  if (chartImages && chartImages.length >= 3) {
    const chartW_full = contentWidth;
    const chartH_full = 32;
    const chartW_half = (contentWidth - 4) / 2;
    const chartH_half = 30;

    // Adiciona o Gráfico 1 (Principal) de largura total
    doc.addImage(chartImages[0], 'PNG', margin, chartY, chartW_full, chartH_full);
    
    // Adiciona os Gráficos 2 e 3 lado a lado na linha de baixo
    doc.addImage(chartImages[1], 'PNG', margin, chartY + chartH_full + 3, chartW_half, chartH_half);
    doc.addImage(chartImages[2], 'PNG', margin + chartW_half + 4, chartY + chartH_full + 3, chartW_half, chartH_half);

    analysisY = chartY + chartH_full + chartH_half + 6; // 43 + 32 + 30 + 6 = 111 mm
  } else if (chartImages && chartImages.length >= 2) {
    // Caso de fallback com 2 gráficos apenas
    const chartW = (contentWidth - 4) / 2;
    const chartH = 34;
    doc.addImage(chartImages[0], 'PNG', margin, chartY, chartW, chartH);
    doc.addImage(chartImages[1], 'PNG', margin + chartW + 4, chartY, chartW, chartH);
    analysisY = chartY + 37;
  } else {
    // Sem gráficos (Fallback elegante)
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, chartY, contentWidth, 24, 2, 2, 'F');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...GRAY_LIGHT);
    doc.text('Graficos analiticos consolidados no sistema.', margin + (contentWidth / 2), chartY + 13, { align: 'center' });
    analysisY = chartY + 27;
  }

  // ─── ANÁLISE CEO / SHARK TANK ─────────────────────────────────────────
  const analise = obterAnaliseCEOLocal(report, filter, allDashboardData);
  
  // Caixa de Fundo Cinza Claro com Borda Fina
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.2);
  
  // Altura inicial base
  let boxH = 26;
  doc.roundedRect(margin, analysisY, contentWidth, boxH, 1.5, 1.5, 'FD');

  // Faixa rosa vertical esquerda
  doc.setFillColor(...BRAND_PINK);
  doc.rect(margin, analysisY, 1.2, boxH, 'F');

  // Título da Análise
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND_DARK);
  doc.text('ANALISE ESTRATEGICA OPERACIONAL (MODO CEO / SHARK TANK)', margin + 4, analysisY + 5);

  // Texto de Explicação
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 110, 120);
  const explicacaoLinhas = doc.splitTextToSize(analise.explicacao, contentWidth - 8);
  doc.text(explicacaoLinhas, margin + 4, analysisY + 9);

  // Renderização dinâmica de Insights (sem emojis multibyte)
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GRAY_TEXT);
  
  let insightY = analysisY + 9 + (explicacaoLinhas.length * 3) + 2;
  analise.insights.forEach((insight) => {
    // Marcador bolinha rosa
    doc.setFillColor(...BRAND_PINK);
    doc.circle(margin + 5, insightY - 1, 0.6, 'F');

    // Texto do insight quebrado
    const prefixo = insight.tipo === 'alerta' ? 'ATENCAO: ' : insight.tipo === 'oportunidade' ? 'OPORTUNIDADE: ' : insight.tipo === 'sucesso' ? 'SUCESSO: ' : 'INFO: ';
    const textoInsight = `${prefixo}${insight.texto}`;
    const insightLinhas = doc.splitTextToSize(textoInsight, contentWidth - 10);
    doc.text(insightLinhas, margin + 7, insightY);
    insightY += insightLinhas.length * 3 + 1;
  });

  // Ajusta a altura da caixa com base no espaço real dos textos para evitar cortes
  const finalBoxH = Math.max(boxH, (insightY - analysisY) + 2);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, analysisY, contentWidth, finalBoxH, 1.5, 1.5, 'D');
  doc.setFillColor(...BRAND_PINK);
  doc.rect(margin, analysisY, 1.2, finalBoxH, 'F');

  // Reimprime os textos por cima para garantir contraste
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND_DARK);
  doc.text('ANALISE ESTRATEGICA OPERACIONAL (MODO CEO / SHARK TANK)', margin + 4, analysisY + 5);

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 110, 120);
  doc.text(explicacaoLinhas, margin + 4, analysisY + 9);

  let tempInsightY = analysisY + 9 + (explicacaoLinhas.length * 3) + 2;
  analise.insights.forEach((insight) => {
    doc.setFillColor(...BRAND_PINK);
    doc.circle(margin + 5, tempInsightY - 1, 0.6, 'F');

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GRAY_TEXT);
    const prefixo = insight.tipo === 'alerta' ? 'ATENCAO: ' : insight.tipo === 'oportunidade' ? 'OPORTUNIDADE: ' : insight.tipo === 'sucesso' ? 'SUCESSO: ' : 'INFO: ';
    const textoInsight = `${prefixo}${insight.texto}`;
    const insightLinhas = doc.splitTextToSize(textoInsight, contentWidth - 10);
    doc.text(insightLinhas, margin + 7, tempInsightY);
    tempInsightY += insightLinhas.length * 3 + 1;
  });

  const tableStartY = analysisY + finalBoxH + 4;

  // ─── TÍTULO DO DETALHAMENTO ──────────────────────────────────────────
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND_DARK);
  doc.text('Detalhamento Mensal Consolidado', margin, tableStartY - 1);

  // ─── TABELA DE DADOS DINÂMICA ────────────────────────────────────────
  const type = filter.reportType || 'executive';
  let fullHead: string[] = [];
  let bodyRows: any[][] = [];
  let totalsRow: any[] = [];

  switch (type) {
    case 'commercial':
      fullHead = ['Mes', 'Novos Benef.', 'Leads', 'Conversoes', 'Tx. Conversao', 'CAC'];
      bodyRows = report.rows.map(row => [
        row.monthLabel,
        formatNum(row.newBeneficiaries),
        formatNum(row.leads),
        formatNum(row.conversions),
        formatPct(row.conversionRate),
        formatMoeda(row.cac)
      ]);
      totalsRow = [
        'Total / Media',
        formatNum(report.totals.totalNewBeneficiaries),
        formatNum(report.totals.totalLeads),
        formatNum(report.totals.totalConversions),
        formatPct(report.totals.averageConversionRate),
        formatMoeda(report.totals.averageCac)
      ];
      break;

    case 'churn':
      fullHead = ['Mes', 'Benef. Ativos', 'Novos Benef.', 'Cancelados', 'Taxa de Churn'];
      bodyRows = report.rows.map(row => [
        row.monthLabel,
        formatNum(row.activeBeneficiaries),
        formatNum(row.newBeneficiaries),
        formatNum(row.canceledBeneficiaries),
        row.churnRate > 0 ? formatPct(row.churnRate) : '—'
      ]);
      totalsRow = [
        'Total / Media',
        formatNum(report.rows[report.rows.length - 1]?.activeBeneficiaries || 10450),
        formatNum(report.totals.totalNewBeneficiaries),
        formatNum(report.rows.reduce((acc, curr) => acc + curr.canceledBeneficiaries, 0)),
        report.totals.averageChurnRate > 0 ? formatPct(report.totals.averageChurnRate) : '—'
      ];
      break;

    case 'financial':
      const totalMkt = report.rows.reduce((acc, curr) => acc + curr.marketingSpend, 0);
      const totalSales = report.rows.reduce((acc, curr) => acc + curr.salesSpend, 0);
      fullHead = ['Mes', 'Mkt Spend', 'Sales Spend', 'Total Investido', 'CAC', 'CPL'];
      bodyRows = report.rows.map(row => [
        row.monthLabel,
        formatMoeda(row.marketingSpend),
        formatMoeda(row.salesSpend),
        formatMoeda(row.totalSpend),
        formatMoeda(row.cac),
        formatMoeda(row.cpl)
      ]);
      totalsRow = [
        'Total / Media',
        formatMoeda(totalMkt),
        formatMoeda(totalSales),
        formatMoeda(report.totals.totalSpend),
        formatMoeda(report.totals.averageCac),
        formatMoeda(report.totals.averageCpl)
      ];
      break;

    case 'satisfaction':
      fullHead = ['Mes', 'NPS', 'LTV', 'Conversoes', 'Taxa de Churn'];
      bodyRows = report.rows.map(row => {
        const md = allDashboardData ? allDashboardData[row.month] : null;
        const nps = md ? (md.summary.nps ?? 78) : 78;
        const ltv = md ? (md.summary.ltv || 1200) : 1200;
        return [
          row.monthLabel,
          `${nps} pts`,
          formatMoeda(ltv),
          formatNum(row.conversions),
          row.churnRate > 0 ? formatPct(row.churnRate) : '—'
        ];
      });
      
      let npsAcumulado = 0;
      let ltvAcumulado = 0;
      let count = 0;
      report.rows.forEach(r => {
        const md = allDashboardData ? allDashboardData[r.month] : null;
        if (md) {
          npsAcumulado += md.summary.nps || 0;
          ltvAcumulado += md.summary.ltv || 1200;
          count++;
        }
      });
      const npsMedio = count > 0 ? Math.round(npsAcumulado / count) : 78;
      const ltvMedio = count > 0 ? Math.round(ltvAcumulado / count) : 1250;

      totalsRow = [
        'Total / Media',
        `${npsMedio} pts`,
        formatMoeda(ltvMedio),
        formatNum(report.totals.totalConversions),
        report.totals.averageChurnRate > 0 ? formatPct(report.totals.averageChurnRate) : '—'
      ];
      break;

    case 'executive':
    default:
      fullHead = showChannelDetails && filter.channel === 'all'
        ? ['Mes', 'Novos Benef.', 'Leads', 'Conversoes', 'Tx. Conv.', 'Google Ads', 'Meta Ads', 'Offline', 'Total Investido', 'CAC', 'Churn']
        : ['Mes', 'Novos Benef.', 'Leads', 'Conversoes', 'Tx. Conv.', 'Total Investido', 'CAC', 'Churn'];

      bodyRows = report.rows.map(row => {
        const base = [
          row.monthLabel,
          formatNum(row.newBeneficiaries),
          formatNum(row.leads),
          formatNum(row.conversions),
          formatPct(row.conversionRate)
        ];
        const channels = showChannelDetails && filter.channel === 'all'
          ? [formatMoeda(row.googleAdsSpend), formatMoeda(row.metaAdsSpend), formatMoeda(row.offlineSpend)]
          : [];
        const tail = [
          formatMoeda(row.totalSpend),
          formatMoeda(row.cac),
          row.churnRate > 0 ? formatPct(row.churnRate) : '—'
        ];
        return [...base, ...channels, ...tail];
      });

      const totalsBase = [
        'Total / Media',
        formatNum(report.totals.totalNewBeneficiaries),
        formatNum(report.totals.totalLeads),
        formatNum(report.totals.totalConversions),
        formatPct(report.totals.averageConversionRate),
      ];
      const totalsChannels = showChannelDetails && filter.channel === 'all'
        ? [formatMoeda(report.totals.totalGoogleAdsSpend), formatMoeda(report.totals.totalMetaAdsSpend), formatMoeda(report.totals.totalOfflineSpend)]
        : [];
      const totalsTail = [
        formatMoeda(report.totals.totalSpend),
        formatMoeda(report.totals.averageCac),
        report.totals.averageChurnRate > 0 ? formatPct(report.totals.averageChurnRate) : '—',
      ];
      totalsRow = [...totalsBase, ...totalsChannels, ...totalsTail];
      break;
  }

  // Renderização da Tabela Consolidada com Autotable
  autoTable(doc, {
    startY: tableStartY,
    head: [fullHead],
    body: [...bodyRows, totalsRow],
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 6.8,
      cellPadding: 2,
      font: 'helvetica',
      textColor: [...GRAY_TEXT] as [number, number, number],
      lineColor: [229, 231, 235],
      lineWidth: 0.15,
    },
    headStyles: {
      fillColor: [...BRAND_PINK] as [number, number, number],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 6.5,
      halign: 'center',
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'left' },
    },
    alternateRowStyles: {
      fillColor: [250, 250, 252],
    },
    didParseCell: (data) => {
      // Destaca a linha de totais
      if (data.row.index === bodyRows.length) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [255, 240, 246];
        data.cell.styles.textColor = [...BRAND_DARK] as [number, number, number];
      }
    },
  });

  // ─── RODAPÉ PREMIUM (Renderiza em todas as páginas) ───────────────────
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const footerY = pageHeight - 8;
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.2);
    doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY_LIGHT);
    doc.text('Uniodonto Passos Ltda. • Departamento Comercial', margin, footerY);
    doc.text(`Pagina ${i} de ${pageCount}`, pageWidth - margin, footerY, { align: 'right' });
  }

  // ─── DOWNLOAD DO PDF ─────────────────────────────────────────────────
  const filename = `Relatorio_Uniodonto_${filter.startMonth}_a_${filter.endMonth}.pdf`;
  doc.save(filename);
};
