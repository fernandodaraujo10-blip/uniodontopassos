import { ConsolidatedReport, ConsolidatedReportRow, ConsolidatedReportTotals, ReportFilter } from '../types/reports';
import { MonthDataMap } from '../types/dashboard';
import { InvestmentPayload } from '../types/investments';
import { mockDashboardData } from './mockDashboardData';
import { mockInvestmentsData } from './mockInvestments';

// Gera a linha consolidada de um mês a partir dos dados do dashboard e dos investimentos
export function getReportRowForMonth(
  month: string,
  dashboardMap: MonthDataMap,
  investmentsPayload: InvestmentPayload,
  filter?: ReportFilter
): ConsolidatedReportRow | null {
  const monthData = dashboardMap[month];
  const investDetail = investmentsPayload.monthlyDetails[month];
  
  if (!monthData) return null;

  // Extração detalhada dos gastos do mês por canal
  let googleAdsSpend = 0;
  let metaAdsSpend = 0;
  let offlineSpend = 0;

  if (investDetail) {
    googleAdsSpend = investDetail.investments.find(i => i.categoryId === 'marketing_google')?.amount || 0;
    metaAdsSpend = investDetail.investments.find(i => i.categoryId === 'marketing_meta')?.amount || 0;
    offlineSpend = investDetail.investments.find(i => i.categoryId === 'marketing_events')?.amount || 0;
  } else {
    // fallbacks caso não haja detalhe de investimento estruturado
    const totalMarketing = monthData.summary.conversions * monthData.summary.cac * 0.6;
    googleAdsSpend = totalMarketing * 0.55;
    metaAdsSpend = totalMarketing * 0.35;
    offlineSpend = totalMarketing * 0.10;
  }

  const marketingSpend = investDetail ? investDetail.totalMarketing : (googleAdsSpend + metaAdsSpend + offlineSpend);
  const salesSpend = investDetail ? investDetail.totalSales : monthData.summary.conversions * monthData.summary.cac * 0.4;
  
  // Variáveis padrão (canal = 'all' ou indefinido)
  let activeBeneficiaries = monthData.summary.activeBeneficiaries;
  let newBeneficiaries = monthData.summary.newBeneficiaries;
  let canceledBeneficiaries = monthData.summary.canceledBeneficiaries;
  let leads = monthData.summary.leads;
  let conversions = monthData.summary.conversions;
  let conversionRate = monthData.summary.conversionRate;
  let currentMarketingSpend = marketingSpend;
  let currentSalesSpend = salesSpend;
  let totalSpend = marketingSpend + salesSpend;
  let churnRate = monthData.summary.churnRate;

  // Lógica de filtragem específica por canal comercial
  if (filter && filter.channel && filter.channel !== 'all') {
    const ch = filter.channel;
    currentSalesSpend = 0; // Desconsidera custos de vendas gerais na análise de canais de mkt

    if (ch === 'google') {
      const googleTraffic = monthData.trafficSources.find(t => t.source.toLowerCase().includes('google'));
      leads = googleTraffic ? googleTraffic.leads : 0;
      conversions = googleTraffic ? googleTraffic.conversions : 0;
      currentMarketingSpend = googleAdsSpend;
      totalSpend = googleAdsSpend;
    } else if (ch === 'meta') {
      const metaTraffic = monthData.trafficSources.find(t => t.source.toLowerCase().includes('meta'));
      leads = metaTraffic ? metaTraffic.leads : 0;
      conversions = metaTraffic ? metaTraffic.conversions : 0;
      currentMarketingSpend = metaAdsSpend;
      totalSpend = metaAdsSpend;
    } else if (ch === 'offline') {
      const offlineTraffic = monthData.trafficSources.find(t => t.source.toLowerCase().includes('evento') || t.source.toLowerCase().includes('parceria'));
      leads = offlineTraffic ? offlineTraffic.leads : 0;
      conversions = offlineTraffic ? offlineTraffic.conversions : 0;
      currentMarketingSpend = offlineSpend;
      totalSpend = offlineSpend;
    }

    conversionRate = leads > 0 ? (conversions / leads) * 100 : 0;
    // O CAC do canal é calculado sobre as conversões diretas que ele gerou
    newBeneficiaries = conversions;
    canceledBeneficiaries = 0; // Churn não se aplica individualmente a novos leads por canal nesta visualização simplificada
    churnRate = 0;
  }

  return {
    month,
    monthLabel: monthData.summary.monthLabel,
    activeBeneficiaries,
    newBeneficiaries,
    canceledBeneficiaries,
    leads,
    conversions,
    conversionRate,
    marketingSpend: currentMarketingSpend,
    salesSpend: currentSalesSpend,
    totalSpend,
    cac: newBeneficiaries > 0 ? totalSpend / newBeneficiaries : 0,
    cpl: leads > 0 ? currentMarketingSpend / leads : 0,
    churnRate,
    googleAdsSpend,
    metaAdsSpend,
    offlineSpend
  };
}

// Gera um relatório consolidado completo dinamicamente
export function generateConsolidatedReport(
  filter: ReportFilter,
  dashboardMap: MonthDataMap = mockDashboardData,
  investmentsPayload: InvestmentPayload = mockInvestmentsData
): ConsolidatedReport {
  const months = Object.keys(dashboardMap).sort();
  const filteredMonths = months.filter(m => m >= filter.startMonth && m <= filter.endMonth);
  
  const rows: ConsolidatedReportRow[] = [];
  
  let totalNewBeneficiaries = 0;
  let totalCanceledBeneficiaries = 0;
  let totalLeads = 0;
  let totalConversions = 0;
  let totalMarketingSpend = 0;
  let totalSalesSpend = 0;
  let totalSpend = 0;
  let sumChurn = 0;
  let sumGrowth = 0;

  let totalGoogleAdsSpend = 0;
  let totalMetaAdsSpend = 0;
  let totalOfflineSpend = 0;

  filteredMonths.forEach(m => {
    const row = getReportRowForMonth(m, dashboardMap, investmentsPayload, filter);
    if (row) {
      rows.push(row);
      totalNewBeneficiaries += row.newBeneficiaries;
      totalCanceledBeneficiaries += row.canceledBeneficiaries;
      totalLeads += row.leads;
      totalConversions += row.conversions;
      totalMarketingSpend += row.marketingSpend;
      totalSalesSpend += row.salesSpend;
      totalSpend += row.totalSpend;
      sumChurn += row.churnRate;
      sumGrowth += dashboardMap[m].summary.growthRate;
      
      // Acumula os gastos detalhados
      totalGoogleAdsSpend += row.googleAdsSpend;
      totalMetaAdsSpend += row.metaAdsSpend;
      totalOfflineSpend += row.offlineSpend;
    }
  });

  const count = rows.length || 1;
  const averageConversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;
  const averageCac = totalNewBeneficiaries > 0 ? totalSpend / totalNewBeneficiaries : 0;
  const averageCpl = totalLeads > 0 ? totalMarketingSpend / totalLeads : 0;
  const averageChurnRate = sumChurn / count;
  const averageGrowthRate = sumGrowth / count;

  const totals: ConsolidatedReportTotals = {
    totalNewBeneficiaries,
    totalCanceledBeneficiaries,
    totalLeads,
    totalConversions,
    averageConversionRate,
    totalMarketingSpend,
    totalSalesSpend,
    totalSpend,
    averageCac,
    averageCpl,
    averageChurnRate,
    averageGrowthRate,
    totalGoogleAdsSpend,
    totalMetaAdsSpend,
    totalOfflineSpend
  };

  return {
    generatedAt: new Date().toISOString(),
    filter,
    rows,
    totals
  };
}

// Dados do relatório padrão de Janeiro a Maio de 2026
export const defaultReportFilter: ReportFilter = {
  startMonth: '2026-01',
  endMonth: '2026-05',
  channel: 'all'
};

export const mockConsolidatedReport: ConsolidatedReport = generateConsolidatedReport(defaultReportFilter);
