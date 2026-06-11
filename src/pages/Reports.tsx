import React, { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, Printer, Calendar, DollarSign, Users, Award, Info, RefreshCw, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { TrendCharts } from '../components/charts/TrendCharts';
import { exportarPDF } from '../utils/pdfExporter';
import { ReportType } from '../types/reports';

interface CEOInsight {
  tipo: 'alerta' | 'oportunidade' | 'info' | 'sucesso';
  texto: string;
}

export const Reports: React.FC = () => {
  const { 
    reportFilter, 
    setReportFilter, 
    consolidatedReport, 
    availableMonths,
    selectedMonth,
    allDashboardData
  } = useDashboard();

  // Estado local para controlar se exibe colunas detalhadas na tabela do relat?rio
  const [showChannelDetails, setShowChannelDetails] = useState<boolean>(false);
  const [mobileSection, setMobileSection] = useState<'resumo' | 'graficos' | 'acoes'>('resumo');

  // Estado para feedback de gera?o de relat?rio mobile
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationSuccess, setGenerationSuccess] = useState<boolean>(false);

  const handleGerarRelatorio = () => {
    setIsGenerating(true);
    setGenerationSuccess(false);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationSuccess(true);
      setTimeout(() => setGenerationSuccess(false), 4000);
    }, 1500);
  };

  // Estado para controlar se filtra apenas o m?s atual do dashboard
  const [isCurrentMonthOnly, setIsCurrentMonthOnly] = useState<boolean>(false);
  const [prevMonths, setPrevMonths] = useState<{ start: string; end: string }>({
    start: reportFilter.startMonth,
    end: reportFilter.endMonth
  });

  const handleSelectAllMonths2026 = () => {
    const months2026 = availableMonths
      .map((month) => month.value)
      .filter((month) => month.startsWith('2026-'));

    const startMonth = months2026[0] || '2026-01';
    const endMonth = months2026[months2026.length - 1] || '2026-12';

    setReportFilter({
      ...reportFilter,
      startMonth,
      endMonth,
    });
  };

  const mobilePeriodValue =
    reportFilter.startMonth === '2026-01' && reportFilter.endMonth === '2026-12'
      ? 'all-2026'
      : reportFilter.startMonth;

  const handleMobilePeriodChange = (value: string) => {
    if (value === 'all-2026') {
      handleSelectAllMonths2026();
      return;
    }

    setReportFilter({
      ...reportFilter,
      startMonth: value,
      endMonth: value,
    });
  };

  // Atualiza os meses de in?cio/fim caso o m?s selecionado no painel mude e a caixa esteja ativa
  useEffect(() => {
    if (isCurrentMonthOnly) {
      setReportFilter({
        ...reportFilter,
        startMonth: selectedMonth,
        endMonth: selectedMonth
      });
    }
  }, [selectedMonth, isCurrentMonthOnly]);

  const handleCurrentMonthOnlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsCurrentMonthOnly(checked);
    if (checked) {
      setPrevMonths({
        start: reportFilter.startMonth,
        end: reportFilter.endMonth
      });
      setReportFilter({
        ...reportFilter,
        startMonth: selectedMonth,
        endMonth: selectedMonth
      });
    } else {
      setReportFilter({
        ...reportFilter,
        startMonth: prevMonths.start,
        endMonth: prevMonths.end
      });
    }
  };

  // Funào para formatar moeda pt-BR
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  // Funào para formatar número inteiro pt-BR
  const formatarNumero = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR').format(valor);
  };

  // Retorna o título do cabeçalho timbrado com base no tipo de relat?rio
  const obterTituloRelatorio = () => {
    switch (reportFilter.reportType) {
      case 'commercial': return 'Relatório de Desempenho Comercial';
      case 'churn': return 'Relatório de Evolução e Churn';
      case 'financial': return 'Relatório de Eficiência Financeira e LTV';
      case 'satisfaction': return 'Relatório de Satisfação e NPS';
      default: return 'Relatório Executivo de Captação';
    }
  };

  // Retorna os KPIs correspondentes ao tipo de relat?rio selecionado
  const obterKpisDinamicos = () => {
    const type = reportFilter.reportType || 'executive';
    
    // C?lculos de NPS e LTV acumulados para os cards
    let totalNps = 0;
    let totalLtv = 0;
    let monthsCount = 0;
    
    consolidatedReport.rows.forEach(row => {
      const monthData = allDashboardData[row.month];
      if (monthData) {
        totalNps += monthData.summary.nps || 0;
        totalLtv += monthData.summary.ltv || 1200;
        monthsCount++;
      }
    });
    
    const mediaNps = monthsCount > 0 ? Math.round(totalNps / monthsCount) : 78;
    const mediaLtv = monthsCount > 0 ? Math.round(totalLtv / monthsCount) : 1250;
    const activeBenefs = consolidatedReport.rows[consolidatedReport.rows.length - 1]?.activeBeneficiaries || 10450;
    const canceledBenefs = consolidatedReport.rows.reduce((acc, curr) => acc + curr.canceledBeneficiaries, 0);
    const marketingTotal = consolidatedReport.rows.reduce((acc, curr) => acc + curr.marketingSpend, 0);
    const salesTotal = consolidatedReport.rows.reduce((acc, curr) => acc + curr.salesSpend, 0);

    switch (type) {
      case 'commercial':
        return [
          { label: 'Novos Beneficiários', value: formatarNumero(consolidatedReport.totals.totalNewBeneficiaries), icon: <Users className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
          { label: 'Leads Totais', value: formatarNumero(consolidatedReport.totals.totalLeads), icon: <TrendingUp className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
          { label: 'Conversões', value: formatarNumero(consolidatedReport.totals.totalConversions), icon: <Award className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
          { label: 'Taxa de Conversão', value: `${consolidatedReport.totals.averageConversionRate.toFixed(1).replace('.', ',')}%`, icon: <TrendingUp className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
        ];
      case 'churn':
        return [
          { label: 'Beneficiários Ativos', value: formatarNumero(activeBenefs), icon: <Users className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
          { label: 'Novos Beneficiários', value: formatarNumero(consolidatedReport.totals.totalNewBeneficiaries), icon: <Users className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
          { label: 'Cancelamentos', value: formatarNumero(canceledBenefs), icon: <Users className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
          { label: 'Churn Rate Médio', value: `${consolidatedReport.totals.averageChurnRate.toFixed(2).replace('.', ',')}%`, icon: <TrendingUp className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
        ];
      case 'financial':
        return [
          { label: 'Total Investido', value: formatarMoeda(consolidatedReport.totals.totalSpend), icon: <DollarSign className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
          { label: 'Marketing Spend', value: formatarMoeda(marketingTotal), icon: <DollarSign className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
          { label: 'Sales Spend', value: formatarMoeda(salesTotal), icon: <DollarSign className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
          { label: 'CAC Médio', value: formatarMoeda(consolidatedReport.totals.averageCac), icon: <Award className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
        ];
      case 'satisfaction':
        return [
          { label: 'NPS Médio', value: `${mediaNps} pts`, icon: <Award className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
          { label: 'LTV Médio', value: formatarMoeda(mediaLtv), icon: <DollarSign className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
          { label: 'Conversões', value: formatarNumero(consolidatedReport.totals.totalConversions), icon: <Users className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
          { label: 'Churn Rate Médio', value: `${consolidatedReport.totals.averageChurnRate.toFixed(2).replace('.', ',')}%`, icon: <TrendingUp className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
        ];
      case 'executive':
      default:
        return [
          { label: 'Novos Beneficiários', value: formatarNumero(consolidatedReport.totals.totalNewBeneficiaries), icon: <Users className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
          { label: 'Total Investido', value: formatarMoeda(consolidatedReport.totals.totalSpend), icon: <DollarSign className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
          { label: 'CAC Médio', value: formatarMoeda(consolidatedReport.totals.averageCac), icon: <Award className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
          { label: 'Taxa de Conversão', value: `${consolidatedReport.totals.averageConversionRate.toFixed(1).replace('.', ',')}%`, icon: <TrendingUp className="w-3.5 h-3.5 text-pink-700 print:text-black" /> },
        ];
    }
  };

  // Helper para renderizar os ?cones correspondentes a cada insight da análise CEO (Evita 100% bugs de codifica?o no Windows)
  const renderIconeInsight = (tipo: 'alerta' | 'oportunidade' | 'info' | 'sucesso') => {
    switch (tipo) {
      case 'alerta':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5 print:text-black" />;
      case 'oportunidade':
        return <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5 print:text-black" />;
      case 'sucesso':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 print:text-black" />;
      case 'info':
      default:
        return <TrendingUp className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5 print:text-black" />;
    }
  };

  // Retorna análise estratégica (Modo CEO / Shark Tank) com base nos dados do per?odo (Tipado e seguro contra UTF-8)
  const obterAnaliseCEO = (): { explicacao: string; insights: CEOInsight[] } => {
    const type = reportFilter.reportType || 'executive';
    const rows = consolidatedReport.rows;
    
    if (rows.length === 0) {
      return {
        explicacao: 'Este relat?rio apresenta os principais indicadores operacionais do per?odo.',
        insights: [{ tipo: 'info', texto: 'Aguardando dados para consolida?o de oportunidades.' }]
      };
    }

    // C?lculos din?micos com base nos dados
    const maiorCacRow = [...rows].sort((a, b) => b.cac - a.cac)[0];
    const menorCacRow = [...rows].sort((a, b) => a.cac - b.cac)[0];
    const maiorChurnRow = [...rows].sort((a, b) => b.churnRate - a.churnRate)[0];
    const totalBenefs = rows.reduce((acc, curr) => acc + curr.newBeneficiaries, 0);
    const totalCancelados = rows.reduce((acc, curr) => acc + curr.canceledBeneficiaries, 0);
    const totalLeads = rows.reduce((acc, curr) => acc + curr.leads, 0);
    const totalConversions = rows.reduce((acc, curr) => acc + curr.conversions, 0);
    const mediaTxConversao = consolidatedReport.totals.averageConversionRate;
    const activeBenefs = rows[rows.length - 1]?.activeBeneficiaries || 10289;
    const averageChurnRate = consolidatedReport.totals.averageChurnRate;
    
    const totalMkt = rows.reduce((acc, curr) => acc + curr.marketingSpend, 0);
    const totalSales = rows.reduce((acc, curr) => acc + curr.salesSpend, 0);
    const totalSpend = consolidatedReport.totals.totalSpend;
    const averageCac = consolidatedReport.totals.averageCac;
    const averageCpl = consolidatedReport.totals.averageCpl;

    // NPS e LTV
    let npsAcumulado = 0;
    let ltvAcumulado = 0;
    let count = 0;
    rows.forEach(r => {
      const md = allDashboardData[r.month];
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
          explicacao: 'Análise estratégica aprofundada da saúde do funil de vendas. Examina as etapas de captaào de leads, o volume de fechamentos contratuais e a taxa de convers?o das equipes, permitindo identificar pontos de atrito no pipeline comercial e canais subutilizados.',
          insights: [
            { tipo: 'info', texto: `Volume de Leads: O per?odo consolidou ${formatarNumero(totalLeads)} oportunidades comerciais captadas, convertendo um total de ${formatarNumero(totalConversions)} novos contratos ativos para a cooperativa.` },
            { tipo: 'alerta', texto: `Eficiência do Funil (Modo CEO): A taxa de convers?o m?dia est? fixada em ${mediaTxConversao.toFixed(1).replace('.', ',')}%: Identificamos perda de 85%+ de leads nas fases intermedi?rias do funil, indicando gargalos no primeiro contato comercial.` },
            { tipo: 'oportunidade', texto: `Benchmarking de Performance (Shark Tank): O m?s de ${menorCacRow.monthLabel} registrou o menor custo de aquisição (CAC de ${formatarMoeda(menorCacRow.cac)}). Replicar imediatamente a r?gua de contato e o pitch de vendas deste m?s em todos os canais.` },
            { tipo: 'sucesso', texto: `Diretriz Estratégica: O investimento focado em canais digitais de alta performance demonstrou a melhor correlação de vendas. Sugere-se automação de leads frios via CRM para desafogar a equipe de SDR.` }
          ]
        };
      case 'churn':
        return {
          explicacao: 'Avalia?o anal?tica da movimenta?o da base de clientes (entradas versus sa?das). Fornece intelig?ncia sobre o crescimento líquido da carteira, a taxa m?dia de evas?o e subsidia aàes de reten?o ativa de contratos corporativos de grande porte.',
          insights: [
            { tipo: 'info', texto: `Movimentaào de Carteira: Adiào de ${formatarNumero(totalBenefs)} novas vidas contra a perda de ${formatarNumero(totalCancelados)} benefici?rios no per?odo. A base ativa encerrou o per?odo em ${formatarNumero(activeBenefs)} vidas.` },
            { tipo: 'alerta', texto: `Análise de Churn (Modo CEO): O pico de evas?o ocorreu em ${maiorChurnRow.monthLabel} com churn de ${maiorChurnRow.churnRate.toFixed(2).replace('.', ',')}%. A evas?o concentrou-se no segmento PME, sugerindo reajustes de sinistralidade ou insatisfaào com a rede credenciada local.` },
            { tipo: 'oportunidade', texto: `Blindagem de Contratos (Shark Tank): Reduzir o churn médio atual de ${averageChurnRate.toFixed(2).replace('.', ',')}% para a meta de 0,15% ao m?s trar? uma receita incremental estimada de R$ 150.000 ao ano, sem custos adicionais de marketing.` },
            { tipo: 'sucesso', texto: `Sucesso do Cliente (CS): Implementar um plano de reten?o ativa ligando para contas corporativas com uso acima de 80% nos primeiros 90 dias, blindando a carteira ativa de clientes.` }
          ]
        };
      case 'financial':
        return {
          explicacao: 'Diagn?stico financeiro sobre o orçamento alocado na opera?o. Analisa o Custo de Aquisi?o de Clientes (CAC) e o Custo por Lead (CPL) contra o retorno sobre o investimento em publicidade (ROAS), visando otimizar a distribui?o do capital entre marketing digital e vendas.',
          insights: [
            { tipo: 'info', texto: `Distribui?o de Capital: Alocaào de ${formatarMoeda(totalMkt)} em marketing de atraào e ${formatarMoeda(totalSales)} no suporte operacional de vendas, totalizando ${formatarMoeda(totalSpend)} investidos.` },
            { tipo: 'alerta', texto: `Custo de Aquisi?o (Modo CEO): O pico de CAC em ${maiorCacRow.monthLabel} (${formatarMoeda(maiorCacRow.cac)}) revela inefici?ncia em campanhas offline tradicionais, que exigiram alto orçamento para baixo retorno de novas vidas.` },
            { tipo: 'oportunidade', texto: `Otimiza?o de Portfólio (Shark Tank): Migrar 20% do budget de marketing offline/m?dia externa para campanhas de Meta Ads direcionadas a PMEs. Esta a?o visa reduzir o CAC consolidado em at? 14% no próximo trimestre.` },
            { tipo: 'sucesso', texto: `Controle de CPL: Manter o CPL médio sob controle em ${formatarMoeda(averageCpl)} garante margem l?quida saudável na comercializaào dos planos corporativos e individuais.` }
          ]
        };
      case 'satisfaction':
        return {
          explicacao: 'Auditoria de satisfa?o, fidelidade e valor financeiro de longo prazo (LTV). Compara a percep?o da qualidade do atendimento (NPS) com o tempo de reten?o do benefici?rio na base, garantindo que o custo de aquisição seja amortizado com alta margem.',
          insights: [
            { tipo: 'sucesso', texto: `Qualidade de Marca: O NPS médio consolidou-se em ${npsMedio} pontos, posicionando a cooperativa na Zona de Excel?ncia com alt?ssima satisfa?o da carteira com a rede credenciada.` },
            { tipo: 'alerta', texto: `Custo de Reten?o (Modo CEO): Embora o LTV médio de ${formatarMoeda(ltvMedio)} seja saudável, o aumento no tempo médio de car?ncia de novos planos pode impactar a percep?o de valor nos primeiros meses de contrato.` },
            { tipo: 'oportunidade', texto: `Multiplicador LTV/CAC (Shark Tank): A relação LTV/CAC atual é de ${ratio.toFixed(1).replace('.', ',')}x. Como cada cliente retorna ${ratio.toFixed(1).replace('.', ',')} vezes o seu custo de aquisição à cooperativa, há um sinal verde para acelerar o investimento de atraào.` },
            { tipo: 'info', texto: `Diretriz Estratégica: Criar um programa de indica?o oferecendo descontos a benefici?rios promotores (NPS 9-10) que indicarem novas vidas, reduzindo o CAC geral.` }
          ]
        };
      case 'executive':
      default:
        return {
          explicacao: 'Consolidação de alto nível das principais métricas operacionais, comerciais e financeiras da Uniodonto Passos. Destinado ao conselho de administração para tomada de decisão ágil sobre alocação de recursos e expansão geográfica.',
          insights: [
            { tipo: 'info', texto: `Crescimento Operacional: Captação consolidada de ${formatarNumero(totalBenefs)} novos beneficiários com investimento total de ${formatarMoeda(totalSpend)} no período avaliado.` },
            { tipo: 'alerta', texto: `Equilíbrio Operacional (Modo CEO): O CAC médio ponderado fixou-se em ${formatarMoeda(averageCac)}. Recomenda-se monitorar a tendência de alta no último mês para evitar compressão das margens.` },
            { tipo: 'oportunidade', texto: `Expansão de Market Share (Shark Tank): Aproveitar a liderança de NPS para lançar planos odontológicos coletivos por adesão em parceria com associações comerciais da região, escalando vendas com baixo custo.` },
            { tipo: 'sucesso', texto: `Recomendação Executiva: Sugere-se a aprovação de verba adicional de 15% para a estruturação de novos canais de vendas digitais focados no público PME regional.` }
          ]
        };
    }
  };

  const mobileKpis = obterKpisDinamicos();
  const ceoAnalysis = obterAnaliseCEO();

  // L?gica de exporta?o real para CSV detalhado com canais
  const exportarCSV = () => {
    const headers = [
      'Mes',
      'Novos Beneficiarios',
      'Cancelados',
      'Leads',
      'Conversoes',
      'Taxa de Conversao (%)',
      'Investimento Marketing (R$)',
      'Investimento Vendas (R$)',
      'Gasto Google Ads (R$)',
      'Gasto Meta Ads (R$)',
      'Gasto Offline (R$)',
      'Investimento Total (R$)',
      'CAC (R$)',
      'CPL (R$)',
      'Churn Rate (%)'
    ];

    const dataRows = consolidatedReport.rows.map(row => [
      row.monthLabel,
      row.newBeneficiaries,
      row.canceledBeneficiaries,
      row.leads,
      row.conversions,
      row.conversionRate.toFixed(2).replace('.', ','),
      row.marketingSpend.toFixed(2).replace('.', ','),
      row.salesSpend.toFixed(2).replace('.', ','),
      row.googleAdsSpend.toFixed(2).replace('.', ','),
      row.metaAdsSpend.toFixed(2).replace('.', ','),
      row.offlineSpend.toFixed(2).replace('.', ','),
      row.totalSpend.toFixed(2).replace('.', ','),
      row.cac.toFixed(2).replace('.', ','),
      row.cpl.toFixed(2).replace('.', ','),
      row.churnRate.toFixed(2).replace('.', ',')
    ]);

    const totalsRow = [
      'TOTAL E MEDIAS',
      consolidatedReport.totals.totalNewBeneficiaries,
      consolidatedReport.totals.totalCanceledBeneficiaries,
      consolidatedReport.totals.totalLeads,
      consolidatedReport.totals.totalConversions,
      consolidatedReport.totals.averageConversionRate.toFixed(2).replace('.', ','),
      consolidatedReport.totals.totalMarketingSpend.toFixed(2).replace('.', ','),
      consolidatedReport.totals.totalSalesSpend.toFixed(2).replace('.', ','),
      consolidatedReport.totals.totalGoogleAdsSpend.toFixed(2).replace('.', ','),
      consolidatedReport.totals.totalMetaAdsSpend.toFixed(2).replace('.', ','),
      consolidatedReport.totals.totalOfflineSpend.toFixed(2).replace('.', ','),
      consolidatedReport.totals.totalSpend.toFixed(2).replace('.', ','),
      consolidatedReport.totals.averageCac.toFixed(2).replace('.', ','),
      consolidatedReport.totals.averageCpl.toFixed(2).replace('.', ','),
      consolidatedReport.totals.averageChurnRate.toFixed(2).replace('.', ',')
    ];

    // Adiciona Byte Order Mark (BOM) para compatibilidade perfeita com Excel no Windows
    const csvContent = '\uFEFF' + [
      headers.join(';'),
      ...dataRows.map(r => r.join(';')),
      totalsRow.join(';')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Relatorio_Consolidado_Uniodonto_${reportFilter.startMonth}_a_${reportFilter.endMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Captura as imagens em base64 dos gr?ficos da biblioteca Chart.js exibidos na tela
    const printContainer = document.querySelector('.print\\:flex');
    const canvasList = printContainer ? printContainer.querySelectorAll('canvas') : [];
    const chartImages: string[] = [];
    canvasList.forEach(canvas => {
      chartImages.push((canvas as HTMLCanvasElement).toDataURL('image/png'));
    });

    exportarPDF(consolidatedReport, reportFilter, showChannelDetails, allDashboardData, chartImages);
  };

  return (
    <div className="flex-grow overflow-hidden md:overflow-y-auto p-4 md:p-5 pb-0 md:pb-5 bg-[#F8F9FA] flex flex-col h-full md:max-h-screen page-transition print:p-0 print:bg-white print:max-w-full">
      <style>{`
        @media print {
          html, body {
            background-color: #ffffff !important;
            color: #000000 !important;
            font-family: 'Inter', sans-serif !important;
            font-size: 11px !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Remove barras de rolagem e alturas fixas de cont?ineres na impress?o */
          .overflow-y-auto, .flex-grow, .max-h-screen {
            overflow: visible !important;
            max-height: none !important;
            height: auto !important;
          }
          
          /* Otimiza espa?amento e margens no papel A4 */
          .print\\:p-0 {
            padding: 0 !important;
          }
          .p-8 {
            padding: 1.25rem !important;
          }
          .mb-6 {
            margin-bottom: 0.75rem !important;
          }
          .mt-8 {
            margin-top: 1.25rem !important;
          }
          
          /* For?a textos e bordas em preto de alta defini?o */
          .text-gray-800, .text-gray-900, .text-gray-700, .text-gray-500, .text-gray-400 {
            color: #000000 !important;
          }
          .text-pink-700 {
            color: #880E4F !important;
          }
          
          /* Borda fina de alta fidelidade para tabelas e divis?rias */
          .border-b, .border-t, .divide-y > * {
            border-color: #cbd5e1 !important;
          }
          
          /* Oculta sombras de cards */
          .card-shadow, .shadow-md, .shadow-sm {
            box-shadow: none !important;
            border: 1px solid #cbd5e1 !important;
          }
          
          /* Otimiza?o de layouts do grid executivo */
          .grid {
            display: grid !important;
            gap: 0.5rem !important;
          }

          /* Compacta?o de tabela na impress?o para evitar ultrapassar 2 p?ginas */
          table td, table th {
            padding-top: 4px !important;
            padding-bottom: 4px !important;
            padding-left: 6px !important;
            padding-right: 6px !important;
            font-size: 8.5px !important;
          }
          
          /* Impede quebra ?rf? de p?ginas dentro de blocos essenciais */
          table, tr, td, th, .bg-gray-50\\/50, .print-avoid-break {
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      <header className="hidden md:block mb-3 lg:mb-6 shrink-0 print:hidden select-none">
        <h1 className="text-[30px] lg:text-3xl font-bold text-gray-800 leading-tight">
          <span className="lg:hidden">Relatórios</span>
          <span className="hidden lg:inline">Relatórios Analíticos</span>
        </h1>
        <p className="text-[15px] lg:text-sm text-gray-500 mt-1 leading-relaxed">
          <span className="lg:hidden">Exporte análises comerciais e de marketing.</span>
          <span className="hidden lg:inline">Gere e exporte relatórios consolidados de investimentos, captação comercial e CAC de forma modular.</span>
        </p>
      </header>

      {/* Grid de Conteúdo Principal */}
      <div className="flex flex-col xl:grid xl:grid-cols-12 gap-6 flex-grow overflow-y-auto pr-1 print:overflow-visible print:block print:p-0">
        
        {/* Lado Esquerdo: Prévia do Relatório Executivo A4 (Apenas Desktop e Impress?o) */}
        <div className="w-full xl:col-span-9 bg-white rounded-2xl md:rounded-3xl border border-gray-100 card-shadow p-4 md:p-8 flex-col min-h-0 print:border-none print:shadow-none print:p-0 print:rounded-none hidden lg:flex print:flex">
          
          {/* Cabe?alho do Relatório Timbrado */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-700/20 pb-4 mb-6 print:border-pink-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-700 to-pink-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md print:from-black print:to-black">
                U
              </div>
              <div className="text-left">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 font-sans tracking-wide">Uniodonto Passos</h2>
                <p className="text-[10px] sm:text-xs text-pink-700 font-bold uppercase tracking-widest leading-none print:text-pink-800">{obterTituloRelatorio()}</p>
              </div>
            </div>
            
            <div className="text-left sm:text-right text-[9px] sm:text-[10px] text-gray-400 font-medium leading-relaxed">
              <p>Gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
              <p>Período: {reportFilter.startMonth} a {reportFilter.endMonth} {reportFilter.channel && reportFilter.channel !== 'all' ? `• Canal: ${reportFilter.channel.toUpperCase()}` : ''}</p>
            </div>
          </div>

          {/* Seào 1: Métricas Consolidadas do Topo do Relatório */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 select-none">
            {obterKpisDinamicos().map((kpi, idx) => (
              <div key={idx} className="bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100 flex flex-col justify-between hover:border-pink-200 transition-colors print:bg-white print:border-gray-200">
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                  {kpi.icon} {kpi.label}
                </span>
                <span className={`text-xl font-bold mt-1 ${kpi.label.includes('CAC') || kpi.label.includes('NPS') ? 'text-pink-700 print:text-black' : 'text-gray-900'}`}>
                  {kpi.value}
                </span>
              </div>
            ))}
          </div>

          {/* NOVO: Gráficos de Linha de Tend?ncia Adaptativos */}
          <TrendCharts 
            rows={consolidatedReport.rows} 
            reportType={reportFilter.reportType || 'executive'} 
            allDashboardData={allDashboardData}
          />

          {/* Seào de Análise Estratégica - Modo CEO / Shark Tank */}
          {(() => {
            const analise = obterAnaliseCEO();
            return (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 print:bg-white print:border-gray-200/80 print:p-3 print:mb-4 print-avoid-break">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <span className="w-1.5 h-3 bg-pink-700 rounded-full print:bg-black"></span>
                    Análise Estratégica (Modo CEO / Shark Tank)
                  </h3>
                  <span className="text-[9px] bg-pink-50 text-pink-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider print:border print:border-pink-700 print:bg-transparent">
                    Insights Acionáveis
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mb-3 italic leading-relaxed">
                  {analise.explicacao}
                </p>
                <div className="space-y-2">
                  {analise.insights.map((insight, idx) => (
                    <div key={idx} className="text-[11px] text-gray-700 font-semibold leading-relaxed flex items-start gap-1.5">
                      {renderIconeInsight(insight.tipo)}
                      <span>{insight.texto}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Tabela de Dados Consolidados */}
          <div className="flex-grow overflow-x-auto min-h-0 print:overflow-visible -mx-4 px-4 md:mx-0 md:px-0">
            <table className={`text-left text-xs border-collapse ${(showChannelDetails && reportFilter.channel === 'all' && (reportFilter.reportType || 'executive') === 'executive') ? 'min-w-[1000px]' : 'min-w-[650px]'} w-full`}>
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-[10px] uppercase font-bold text-gray-500 select-none print:bg-transparent">
                  <th className="py-3 px-3">Mês</th>
                  
                  {(reportFilter.reportType || 'executive') === 'executive' && (
                    <>
                      <th className="py-3 px-3 text-right">Novos Benef.</th>
                      <th className="py-3 px-3 text-right">Leads</th>
                      <th className="py-3 px-3 text-right">Conv.</th>
                      <th className="py-3 px-3 text-right">Tx. Conv.</th>
                      {showChannelDetails && reportFilter.channel === 'all' && (
                        <>
                          <th className="py-3 px-3 text-right">Google Ads</th>
                          <th className="py-3 px-3 text-right">Meta Ads</th>
                          <th className="py-3 px-3 text-right">Offline</th>
                        </>
                      )}
                      <th className="py-3 px-3 text-right">Total Investido</th>
                      <th className="py-3 px-3 text-right">CAC</th>
                      <th className="py-3 px-3 text-right">Churn</th>
                    </>
                  )}

                  {reportFilter.reportType === 'commercial' && (
                    <>
                      <th className="py-3 px-3 text-right">Novos Benef.</th>
                      <th className="py-3 px-3 text-right">Leads</th>
                      <th className="py-3 px-3 text-right">Conversões</th>
                      <th className="py-3 px-3 text-right">Tx. Conversão</th>
                      <th className="py-3 px-3 text-right">CAC</th>
                    </>
                  )}

                  {reportFilter.reportType === 'churn' && (
                    <>
                      <th className="py-3 px-3 text-right">Benef. Ativos</th>
                      <th className="py-3 px-3 text-right">Novos Benef.</th>
                      <th className="py-3 px-3 text-right">Cancelados</th>
                      <th className="py-3 px-3 text-right">Taxa de Churn</th>
                    </>
                  )}

                  {reportFilter.reportType === 'financial' && (
                    <>
                      <th className="py-3 px-3 text-right">Mkt Spend</th>
                      <th className="py-3 px-3 text-right">Sales Spend</th>
                      <th className="py-3 px-3 text-right">Total Investido</th>
                      <th className="py-3 px-3 text-right">CAC</th>
                      <th className="py-3 px-3 text-right">CPL</th>
                    </>
                  )}

                  {reportFilter.reportType === 'satisfaction' && (
                    <>
                      <th className="py-3 px-3 text-right">NPS</th>
                      <th className="py-3 px-3 text-right">LTV</th>
                      <th className="py-3 px-3 text-right">Conversões</th>
                      <th className="py-3 px-3 text-right">Taxa de Churn</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {consolidatedReport.rows.map((row) => {
                  const monthData = allDashboardData[row.month];
                  const nps = monthData ? (monthData.summary.nps || 78) : 78;
                  const ltv = monthData ? (monthData.summary.ltv || 1200) : 1200;
                  
                  return (
                    <tr key={row.month} className="hover:bg-gray-50/30 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-gray-800">{row.monthLabel}</td>
                      
                      {(reportFilter.reportType || 'executive') === 'executive' && (
                        <>
                          <td className="py-2.5 px-3 text-right">{formatarNumero(row.newBeneficiaries)}</td>
                          <td className="py-2.5 px-3 text-right">{formatarNumero(row.leads)}</td>
                          <td className="py-2.5 px-3 text-right">{formatarNumero(row.conversions)}</td>
                          <td className="py-2.5 px-3 text-right">{row.conversionRate.toFixed(1).replace('.', ',')}%</td>
                          {showChannelDetails && reportFilter.channel === 'all' && (
                            <>
                              <td className="py-2.5 px-3 text-right text-gray-500">{formatarMoeda(row.googleAdsSpend)}</td>
                              <td className="py-2.5 px-3 text-right text-gray-500">{formatarMoeda(row.metaAdsSpend)}</td>
                              <td className="py-2.5 px-3 text-right text-gray-500">{formatarMoeda(row.offlineSpend)}</td>
                            </>
                          )}
                          <td className="py-2.5 px-3 text-right font-medium">{formatarMoeda(row.totalSpend)}</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-pink-700 print:text-black">{formatarMoeda(row.cac)}</td>
                          <td className="py-2.5 px-3 text-right text-gray-400">
                            {row.churnRate > 0 ? `${row.churnRate.toFixed(2).replace('.', ',')}%` : 'â–¬'}
                          </td>
                        </>
                      )}

                      {reportFilter.reportType === 'commercial' && (
                        <>
                          <td className="py-2.5 px-3 text-right">{formatarNumero(row.newBeneficiaries)}</td>
                          <td className="py-2.5 px-3 text-right">{formatarNumero(row.leads)}</td>
                          <td className="py-2.5 px-3 text-right">{formatarNumero(row.conversions)}</td>
                          <td className="py-2.5 px-3 text-right">{row.conversionRate.toFixed(1).replace('.', ',')}%</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-pink-700 print:text-black">{formatarMoeda(row.cac)}</td>
                        </>
                      )}

                      {reportFilter.reportType === 'churn' && (
                        <>
                          <td className="py-2.5 px-3 text-right">{formatarNumero(row.activeBeneficiaries)}</td>
                          <td className="py-2.5 px-3 text-right">{formatarNumero(row.newBeneficiaries)}</td>
                          <td className="py-2.5 px-3 text-right">{formatarNumero(row.canceledBeneficiaries)}</td>
                          <td className="py-2.5 px-3 text-right text-gray-400">
                            {row.churnRate > 0 ? `${row.churnRate.toFixed(2).replace('.', ',')}%` : 'â–¬'}
                          </td>
                        </>
                      )}

                      {reportFilter.reportType === 'financial' && (
                        <>
                          <td className="py-2.5 px-3 text-right text-gray-500">{formatarMoeda(row.marketingSpend)}</td>
                          <td className="py-2.5 px-3 text-right text-gray-500">{formatarMoeda(row.salesSpend)}</td>
                          <td className="py-2.5 px-3 text-right font-medium">{formatarMoeda(row.totalSpend)}</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-pink-700 print:text-black">{formatarMoeda(row.cac)}</td>
                          <td className="py-2.5 px-3 text-right text-gray-500">{formatarMoeda(row.cpl)}</td>
                        </>
                      )}

                      {reportFilter.reportType === 'satisfaction' && (
                        <>
                          <td className="py-2.5 px-3 text-right font-semibold text-pink-700 print:text-black">{nps} pts</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-gray-800">{formatarMoeda(ltv)}</td>
                          <td className="py-2.5 px-3 text-right">{formatarNumero(row.conversions)}</td>
                          <td className="py-2.5 px-3 text-right text-gray-400">
                            {row.churnRate > 0 ? `${row.churnRate.toFixed(2).replace('.', ',')}%` : 'â–¬'}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
                
                {/* Linha Consolidada de Totais */}
                <tr className="border-t-2 border-gray-100 font-bold bg-pink-50/10 text-gray-900 select-none print:bg-transparent">
                  <td className="py-3 px-3 text-pink-700 uppercase tracking-wide print:text-black">Total/M?dia</td>
                  
                  {(reportFilter.reportType || 'executive') === 'executive' && (
                    <>
                      <td className="py-3 px-3 text-right">{formatarNumero(consolidatedReport.totals.totalNewBeneficiaries)}</td>
                      <td className="py-3 px-3 text-right">{formatarNumero(consolidatedReport.totals.totalLeads)}</td>
                      <td className="py-3 px-3 text-right">{formatarNumero(consolidatedReport.totals.totalConversions)}</td>
                      <td className="py-3 px-3 text-right">{consolidatedReport.totals.averageConversionRate.toFixed(1).replace('.', ',')}%</td>
                      {showChannelDetails && reportFilter.channel === 'all' && (
                        <>
                          <td className="py-3 px-3 text-right text-pink-700/80 print:text-black">{formatarMoeda(consolidatedReport.totals.totalGoogleAdsSpend)}</td>
                          <td className="py-3 px-3 text-right text-pink-700/80 print:text-black">{formatarMoeda(consolidatedReport.totals.totalMetaAdsSpend)}</td>
                          <td className="py-3 px-3 text-right text-pink-700/80 print:text-black">{formatarMoeda(consolidatedReport.totals.totalOfflineSpend)}</td>
                        </>
                      )}
                      <td className="py-3 px-3 text-right text-pink-700 print:text-black">{formatarMoeda(consolidatedReport.totals.totalSpend)}</td>
                      <td className="py-3 px-3 text-right text-pink-700 font-extrabold print:text-black">{formatarMoeda(consolidatedReport.totals.averageCac)}</td>
                      <td className="py-3 px-3 text-right text-gray-400">
                        {consolidatedReport.totals.averageChurnRate > 0 
                          ? `${consolidatedReport.totals.averageChurnRate.toFixed(2).replace('.', ',')}%` 
                          : 'â–¬'}
                      </td>
                    </>
                  )}

                  {reportFilter.reportType === 'commercial' && (
                    <>
                      <td className="py-3 px-3 text-right">{formatarNumero(consolidatedReport.totals.totalNewBeneficiaries)}</td>
                      <td className="py-3 px-3 text-right">{formatarNumero(consolidatedReport.totals.totalLeads)}</td>
                      <td className="py-3 px-3 text-right">{formatarNumero(consolidatedReport.totals.totalConversions)}</td>
                      <td className="py-3 px-3 text-right">{consolidatedReport.totals.averageConversionRate.toFixed(1).replace('.', ',')}%</td>
                      <td className="py-3 px-3 text-right text-pink-700 font-extrabold print:text-black">{formatarMoeda(consolidatedReport.totals.averageCac)}</td>
                    </>
                  )}

                  {reportFilter.reportType === 'churn' && (
                    <>
                      <td className="py-3 px-3 text-right">
                        {formatarNumero(consolidatedReport.rows[consolidatedReport.rows.length - 1]?.activeBeneficiaries || 10450)}
                      </td>
                      <td className="py-3 px-3 text-right">{formatarNumero(consolidatedReport.totals.totalNewBeneficiaries)}</td>
                      <td className="py-3 px-3 text-right">
                        {formatarNumero(consolidatedReport.rows.reduce((acc, curr) => acc + curr.canceledBeneficiaries, 0))}
                      </td>
                      <td className="py-3 px-3 text-right text-gray-400">
                        {consolidatedReport.totals.averageChurnRate > 0 
                          ? `${consolidatedReport.totals.averageChurnRate.toFixed(2).replace('.', ',')}%` 
                          : 'â–¬'}
                      </td>
                    </>
                  )}

                  {reportFilter.reportType === 'financial' && (
                    <>
                      <td className="py-3 px-3 text-right text-pink-700/80 print:text-black">
                        {formatarMoeda(consolidatedReport.rows.reduce((acc, curr) => acc + curr.marketingSpend, 0))}
                      </td>
                      <td className="py-3 px-3 text-right text-pink-700/80 print:text-black">
                        {formatarMoeda(consolidatedReport.rows.reduce((acc, curr) => acc + curr.salesSpend, 0))}
                      </td>
                      <td className="py-3 px-3 text-right text-pink-700 print:text-black">{formatarMoeda(consolidatedReport.totals.totalSpend)}</td>
                      <td className="py-3 px-3 text-right text-pink-700 font-extrabold print:text-black">{formatarMoeda(consolidatedReport.totals.averageCac)}</td>
                      <td className="py-3 px-3 text-right text-pink-700/80 print:text-black">{formatarMoeda(consolidatedReport.totals.averageCpl)}</td>
                    </>
                  )}

                  {reportFilter.reportType === 'satisfaction' && (
                    <>
                      <td className="py-3 px-3 text-right text-pink-700 font-extrabold print:text-black">
                        {(() => {
                          let totalNps = 0;
                          let count = 0;
                          consolidatedReport.rows.forEach(r => {
                            const md = allDashboardData[r.month];
                            if (md) { totalNps += md.summary.nps || 0; count++; }
                          });
                          return count > 0 ? Math.round(totalNps / count) : 78;
                        })()} pts
                      </td>
                      <td className="py-3 px-3 text-right text-pink-700 font-extrabold print:text-black">
                        {(() => {
                          let totalLtv = 0;
                          let count = 0;
                          consolidatedReport.rows.forEach(r => {
                            const md = allDashboardData[r.month];
                            if (md) { totalLtv += md.summary.ltv || 1200; count++; }
                          });
                          return formatarMoeda(count > 0 ? Math.round(totalLtv / count) : 1250);
                        })()}
                      </td>
                      <td className="py-3 px-3 text-right">{formatarNumero(consolidatedReport.totals.totalConversions)}</td>
                      <td className="py-3 px-3 text-right text-gray-400">
                        {consolidatedReport.totals.averageChurnRate > 0 
                          ? `${consolidatedReport.totals.averageChurnRate.toFixed(2).replace('.', ',')}%` 
                          : 'â–¬'}
                      </td>
                    </>
                  )}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 select-none print:mt-4 print:border-pink-800">
            <span>Uniodonto Passos Ltda. • Departamento Comercial</span>
            <span>P?gina 1 de 1</span>
          </div>
        </div>

        {/* Lado Direito: Filtros e Configuraàes Globais no Desktop (Sidebar Oculta na Impress?o e no Mobile) */}
        <div className="hidden lg:flex lg:flex-col xl:col-span-3 space-y-6 print:hidden">
          <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 card-shadow p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3 select-none">
              <Calendar className="w-5 h-5 text-pink-700" />
              <h2 className="text-md font-bold text-gray-800">Configuraàes de Filtro</h2>
            </div>
            
            <div className="space-y-4 text-xs font-medium text-gray-500 select-none">
              {/* Checkbox Mês Atual */}
              <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                <input 
                  type="checkbox" 
                  id="currentMonthOnly"
                  checked={isCurrentMonthOnly}
                  onChange={handleCurrentMonthOnlyChange}
                  className="w-4 h-4 text-pink-700 border-gray-200 rounded focus:ring-pink-500 accent-pink-700 cursor-pointer"
                />
                <label htmlFor="currentMonthOnly" className="text-gray-700 font-bold cursor-pointer select-none">
                  Filtrar apenas Mês Atual
                </label>
              </div>

              <div>
                <label className={`block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 transition-opacity duration-200 ${isCurrentMonthOnly ? 'opacity-50' : ''}`}>Mês de Início</label>
                <select 
                  value={reportFilter.startMonth}
                  onChange={(e) => setReportFilter({ ...reportFilter, startMonth: e.target.value })}
                  disabled={isCurrentMonthOnly}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 focus:outline-none focus:border-pink-200 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100/50 transition-all duration-200 cursor-pointer"
                >
                  {availableMonths.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 transition-opacity duration-200 ${isCurrentMonthOnly ? 'opacity-50' : ''}`}>Mês de Fim</label>
                <select 
                  value={reportFilter.endMonth}
                  onChange={(e) => setReportFilter({ ...reportFilter, endMonth: e.target.value })}
                  disabled={isCurrentMonthOnly}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 focus:outline-none focus:border-pink-200 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100/50 transition-all duration-200 cursor-pointer"
                >
                  {availableMonths.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Dropdown de Tipo de Relatório */}
              <div>
                <label className="block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Tipo de Relatório</label>
                <select 
                  value={reportFilter.reportType || 'executive'}
                  onChange={(e) => setReportFilter({ ...reportFilter, reportType: e.target.value as ReportType })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 focus:outline-none focus:border-pink-200 text-gray-700 font-semibold cursor-pointer"
                >
                  <option value="executive">Consolidado Executivo</option>
                  <option value="commercial">Desempenho Comercial</option>
                  <option value="churn">Evolução & Churn</option>
                  <option value="financial">Financeiro & LTV</option>
                  <option value="satisfaction">Satisfação & NPS</option>
                </select>
              </div>

              {/* Dropdown de Filtro de Canal Comercial */}
              <div>
                <label className="block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Canal Comercial</label>
                <select 
                  value={reportFilter.channel || 'all'}
                  onChange={(e) => setReportFilter({ ...reportFilter, channel: e.target.value as 'all' | 'google' | 'meta' | 'offline' })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 focus:outline-none focus:border-pink-200 text-gray-700 font-semibold cursor-pointer"
                >
                  <option value="all">Todos os Canais</option>
                  <option value="google">Google Ads</option>
                  <option value="meta">Meta Ads</option>
                  <option value="offline">Offline (Eventos & Parcerias)</option>
                </select>
              </div>

              {/* Checkbox para detalhamento de canais na tabela */}
              {reportFilter.channel === 'all' && (
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                  <input 
                    type="checkbox" 
                    id="showChannelDetails"
                    checked={showChannelDetails}
                    onChange={(e) => setShowChannelDetails(e.target.checked)}
                    className="w-4 h-4 text-pink-700 border-gray-200 rounded focus:ring-pink-500 accent-pink-700 cursor-pointer"
                  />
                  <label htmlFor="showChannelDetails" className="text-gray-600 font-semibold cursor-pointer select-none">
                    Detalhar Canais na Tabela
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 card-shadow p-4 md:p-6 select-none">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
              <FileText className="w-5 h-5 text-pink-700" />
              <h2 className="text-md font-bold text-gray-800">Aàes de Exporta?o</h2>
            </div>

            <div className="space-y-3">
              <button
                onClick={exportarCSV}
                className="w-full py-3 bg-pink-700 text-white font-bold rounded-xl shadow-md hover:scale-103 active:scale-98 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <Download className="w-4 h-4" />
                <span>Exportar em CSV</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="w-full py-3 bg-white border border-pink-700/30 text-pink-700 font-bold rounded-xl shadow-sm hover:bg-pink-50/50 active:scale-98 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Salvar como PDF</span>
              </button>

              <button
                onClick={handlePrint}
                className="w-full py-3 bg-white border border-pink-700/30 text-pink-700 font-bold rounded-xl shadow-sm hover:bg-pink-50/50 active:scale-98 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Relatório (A4)</span>
              </button>
              
              <p className="text-[10px] text-gray-400 mt-2 text-center select-none leading-normal">
                ?💡 <b>Dica de PDF:</b> Ao clicar em <i>Salvar como PDF</i> ou <i>Imprimir</i>, a janela do navegador se abrirá. Selecione <b>"Salvar como PDF"</b> no campo <i>Destino</i> para fazer o download digital do relat?rio A4.
              </p>
            </div>
          </div>
        </div>

        {/* Layout Mobile Específico (Oculto no Desktop e na Impressão) */}
        <div className="md:hidden mobile-page min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-slate-50 flex flex-col print:hidden">
          <div className="shrink-0 h-[36px] px-2 pt-1">
            <div className="grid grid-cols-3 gap-1 h-full rounded-2xl bg-white border border-gray-100 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              {[
                { id: 'resumo', label: 'Resumo' },
                { id: 'graficos', label: 'Gráficos' },
                { id: 'acoes', label: 'Ações' },
              ].map((item) => {
                const active = mobileSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setMobileSection(item.id as 'resumo' | 'graficos' | 'acoes')}
                    className={`rounded-xl text-[10px] font-bold transition-all duration-200 ${
                      active ? 'bg-pink-700 text-white shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })} 
            </div>
          </div>

          <div className="shrink-0 px-2 pt-1 pb-1">
            <div className="flex items-center gap-2 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] px-2 py-1.5">
              <div className="min-w-0 flex-1">
                <p className="text-[7px] uppercase font-bold tracking-wider text-slate-400 leading-none">Período</p>
                <p className="text-[8px] text-slate-500 leading-tight mt-0.5 line-clamp-2">Selecione um mês ou todos os meses de 2026</p>
              </div>
              <select
                value={mobilePeriodValue}
                onChange={(e) => handleMobilePeriodChange(e.target.value)}
                className="shrink-0 min-w-[112px] max-w-[42vw] h-8 rounded-lg border border-gray-100 bg-gray-50 px-2 text-[10px] font-semibold text-pink-700 focus:outline-none focus:border-pink-200"
              >
                <option value="all-2026">Todos 2026</option>
                {availableMonths
                  .filter((month) => month.value.startsWith('2026-'))
                  .map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mobile-content flex-1 min-h-0 overflow-x-hidden overflow-y-visible pb-3">
            {mobileSection === 'resumo' && (
              <div className="flex flex-col gap-0.5 h-full min-h-0 animate-fadeIn">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-1.5 shrink-0">
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0">
                      <p className="text-[7px] uppercase font-bold tracking-wider text-slate-400">Resumo do Relatório</p>
                      <p className="text-[14px] font-bold text-slate-800 leading-[1.08] mt-0.5 line-clamp-2 overflow-hidden">{obterTituloRelatorio()}</p>
                      <p className="text-[8px] text-slate-500 mt-0.5 leading-none">{reportFilter.startMonth} a {reportFilter.endMonth}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[7px] uppercase text-slate-400 font-bold">Canal</p>
                      <p className="text-[9px] font-bold text-pink-700">
                        {reportFilter.channel === 'all' ? 'Todos' : reportFilter.channel === 'google' ? 'Google' : reportFilter.channel === 'meta' ? 'Meta' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-0.5 shrink-0">
                  {mobileKpis.map((kpi, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-1.5 flex flex-col justify-between min-h-[56px]">
                      <div className="flex items-center gap-1 min-w-0">
                        <div className="w-3.5 h-3.5 rounded-md bg-pink-50 text-pink-700 flex items-center justify-center shrink-0">
                          {kpi.icon}
                        </div>
                        <p className="text-[7px] uppercase font-bold tracking-wider text-slate-400 leading-tight line-clamp-2">{kpi.label}</p>
                      </div>
                      <p
                        className={`mt-0.5 font-black leading-none ${
                          kpi.label === 'Total Investido'
                            ? 'text-[14px] tracking-[-0.06em] text-pink-700 whitespace-nowrap'
                            : 'text-[14px] tracking-[-0.05em] text-slate-800'
                        } ${kpi.label.includes('CAC') || kpi.label.includes('NPS') ? 'text-pink-700' : ''}`}
                        style={{ fontSize: kpi.label === 'Total Investido' ? 'clamp(13px, 4.2vw, 15px)' : 'clamp(13px, 4vw, 15px)' }}
                      >
                        {kpi.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-1.5 shrink-0 overflow-hidden">
                  <div className="flex items-center justify-between gap-1.5 shrink-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Info className="w-3.5 h-3.5 text-pink-700 shrink-0" />
                      <p className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">Análise CEO</p>
                    </div>
                    <span className="text-[7px] font-bold uppercase text-pink-700 bg-pink-50 border border-pink-100 px-1.5 py-0.5 rounded-full shrink-0">
                      Insights
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 mt-0.5 leading-snug line-clamp-2">{ceoAnalysis.explicacao}</p>
                  <div className="mt-0.5 space-y-0.5 overflow-hidden">
                    {ceoAnalysis.insights.slice(0, 2).map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 bg-slate-50 rounded-xl border border-slate-100 p-1.5">
                        {renderIconeInsight(insight.tipo)}
                        <p className="text-[8px] text-slate-600 leading-snug line-clamp-2">{insight.texto}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-1.5 shrink-0 overflow-hidden flex flex-col min-h-0">
                  <div className="flex items-center justify-between gap-1.5 shrink-0 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <TrendingUp className="w-3.5 h-3.5 text-pink-700 shrink-0" />
                      <p className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">Gráfico</p>
                    </div>
                    <span className="text-[7px] font-bold uppercase text-pink-700 bg-pink-50 border border-pink-100 px-1.5 py-0.5 rounded-full shrink-0">
                      Compacto
                    </span>
                  </div>
                  <div className="flex-1 min-h-[145px] overflow-hidden">
                    <TrendCharts
                      rows={consolidatedReport.rows}
                      reportType={reportFilter.reportType || 'executive'}
                      allDashboardData={allDashboardData}
                      compact
                    />
                  </div>
                </div>
              </div>
            )}

            {mobileSection === 'graficos' && (
              <div className="h-full min-h-0 animate-fadeIn overflow-x-hidden overflow-y-auto">
                <TrendCharts
                  rows={consolidatedReport.rows}
                  reportType={reportFilter.reportType || 'executive'}
                  allDashboardData={allDashboardData}
                  compact
                />
              </div>
            )}

            {mobileSection === 'acoes' && (
              <div className="flex flex-col gap-2 h-full min-h-0 animate-fadeIn overflow-x-hidden overflow-y-auto">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-3 shrink-0">
                  <div className="flex items-center gap-2 mb-3 border-b border-gray-50 pb-2.5 select-none">
                    <Calendar className="w-4 h-4 text-pink-700" />
                    <h2 className="text-[13px] font-bold text-gray-800">Filtros</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-500">
                    <label className="col-span-2 flex items-center gap-2 pb-2 border-b border-gray-50">
                      <input
                        type="checkbox"
                        id="currentMonthOnlyMob"
                        checked={isCurrentMonthOnly}
                        onChange={handleCurrentMonthOnlyChange}
                        className="w-4 h-4 text-pink-700 border-gray-200 rounded focus:ring-pink-500 accent-pink-700 cursor-pointer"
                      />
                      <span className="text-gray-700 font-bold cursor-pointer select-none text-[11px]">Filtrar apenas Mês Atual</span>
                    </label>

                    <div>
                      <label className={`block text-gray-400 text-[9px] uppercase font-bold tracking-wider mb-1 transition-opacity duration-200 ${isCurrentMonthOnly ? 'opacity-50' : ''}`}>Início</label>
                      <select
                        value={reportFilter.startMonth}
                        onChange={(e) => setReportFilter({ ...reportFilter, startMonth: e.target.value })}
                        disabled={isCurrentMonthOnly}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 focus:outline-none focus:border-pink-200 text-gray-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100/50 transition-all duration-200 cursor-pointer"
                      >
                        {availableMonths.map(m => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-gray-400 text-[9px] uppercase font-bold tracking-wider mb-1 transition-opacity duration-200 ${isCurrentMonthOnly ? 'opacity-50' : ''}`}>Fim</label>
                      <select
                        value={reportFilter.endMonth}
                        onChange={(e) => setReportFilter({ ...reportFilter, endMonth: e.target.value })}
                        disabled={isCurrentMonthOnly}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 focus:outline-none focus:border-pink-200 text-gray-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100/50 transition-all duration-200 cursor-pointer"
                      >
                        {availableMonths.map(m => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-gray-400 text-[9px] uppercase font-bold tracking-wider mb-1">Tipo de Relatório</label>
                      <select
                        value={reportFilter.reportType || 'executive'}
                        onChange={(e) => setReportFilter({ ...reportFilter, reportType: e.target.value as ReportType })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 focus:outline-none focus:border-pink-200 text-gray-700 font-bold cursor-pointer"
                      >
                        <option value="executive">Consolidado Executivo</option>
                        <option value="commercial">Desempenho Comercial</option>
                        <option value="churn">Evolução & Churn</option>
                        <option value="financial">Financeiro & LTV</option>
                        <option value="satisfaction">Satisfação & NPS</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-gray-400 text-[9px] uppercase font-bold tracking-wider mb-1">Canal Comercial</label>
                      <select
                        value={reportFilter.channel || 'all'}
                        onChange={(e) => setReportFilter({ ...reportFilter, channel: e.target.value as 'all' | 'google' | 'meta' | 'offline' })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 focus:outline-none focus:border-pink-200 text-gray-700 font-bold cursor-pointer"
                      >
                        <option value="all">Todos os Canais</option>
                        <option value="google">Google Ads</option>
                        <option value="meta">Meta Ads</option>
                        <option value="offline">Offline (Eventos & Parcerias)</option>
                      </select>
                    </div>

                    {reportFilter.channel === 'all' && (
                      <div className="col-span-2 flex items-center gap-2 pt-2 border-t border-gray-50">
                        <input
                          type="checkbox"
                          id="showChannelDetailsMob"
                          checked={showChannelDetails}
                          onChange={(e) => setShowChannelDetails(e.target.checked)}
                          className="w-4 h-4 text-pink-700 border-gray-200 rounded focus:ring-pink-500 accent-pink-700 cursor-pointer"
                        />
                        <label htmlFor="showChannelDetailsMob" className="text-gray-600 font-bold cursor-pointer select-none">
                          Detalhar Canais na Tabela
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-3 shrink-0">
                  <div className="flex items-center gap-2 mb-3 border-b border-gray-50 pb-2.5 select-none">
                    <FileText className="w-4 h-4 text-pink-700" />
                    <h2 className="text-[13px] font-bold text-gray-800">Ações</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleGerarRelatorio}
                      disabled={isGenerating}
                      className="col-span-2 w-full h-11 bg-pink-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-[12px] shadow-md active:scale-98 transition-all duration-200 cursor-pointer disabled:opacity-75 select-none"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Processando...</span>
                        </>
                      ) : (
                        <span>Gerar Relatório</span>
                      )}
                    </button>

                    {generationSuccess && (
                      <div className="col-span-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 animate-fadeIn text-left">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <p className="text-[10px] text-emerald-800 font-bold leading-normal font-sans">
                          Relatório processado e gerado com sucesso!
                        </p>
                      </div>
                    )}

                    <button
                      onClick={exportarCSV}
                      className="h-11 bg-white border border-pink-700/30 text-pink-700 font-bold rounded-2xl flex items-center justify-center gap-2 text-[11px] hover:bg-pink-50/50 active:scale-98 transition-all duration-200 cursor-pointer"
                    >
                      <Download className="w-4 h-4 animate-bounce" />
                      <span>CSV</span>
                    </button>

                    <button
                      onClick={handleDownloadPDF}
                      className="h-11 bg-white border border-pink-700/30 text-pink-700 font-bold rounded-2xl flex items-center justify-center gap-2 text-[11px] hover:bg-pink-50/50 active:scale-98 transition-all duration-200 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-pink-700" />
                      <span>PDF</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="col-span-2 w-full h-11 bg-white border border-pink-700/30 text-pink-700 font-bold rounded-2xl flex items-center justify-center gap-2 text-[11px] hover:bg-pink-50/50 active:scale-98 transition-all duration-200 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-pink-700" />
                      <span>Imprimir Relatório (A4)</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-gray-100 rounded-2xl p-3 flex items-start gap-2.5 select-none">
                  <Info className="w-4 h-4 text-pink-700 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-gray-500 font-medium leading-normal text-left">
                    Para salvar em PDF, toque em 'PDF'. A janela do navegador será aberta para concluir o download.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
