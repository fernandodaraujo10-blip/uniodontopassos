import { ConsolidatedReport, ConsolidatedReportRow, ConsolidatedReportTotals, ReportFilter } from '../types/reports';
import { MonthDataMap } from '../types/dashboard';
import { InvestmentPayload } from '../types/investments';
import { mockDashboardData } from './mockDashboardData';
import { mockInvestmentsData } from './mockInvestments';

// Gera a linha consolidada de um mês a partir dos dados do dashboard e dos investimentos
export function getReportRowForMonth(month: string, dashboardMap: MonthDataMap, investmentsPayload: InvestmentPayload): ConsolidatedReportRow | null {
  const monthData = dashboardMap[month];
  const investDetail = investmentsPayload.monthlyDetails[month];
  
  if (!monthData) return null;

  const marketingSpend = investDetail ? investDetail.totalMarketing : monthData.summary.conversions * monthData.summary.cac * 0.6; // fallback proporcional
  const salesSpend = investDetail ? investDetail.totalSales : monthData.summary.conversions * monthData.summary.cac * 0.4; // fallback proporcional
  const totalSpend = marketingSpend + salesSpend;

  return {
    month,
    monthLabel: monthData.summary.monthLabel,
    activeBeneficiaries: monthData.summary.activeBeneficiaries,
    newBeneficiaries: monthData.summary.newBeneficiaries,
    canceledBeneficiaries: monthData.summary.canceledBeneficiaries,
    leads: monthData.summary.leads,
    conversions: monthData.summary.conversions,
    conversionRate: monthData.summary.conversionRate,
    marketingSpend,
    salesSpend,
    totalSpend,
    cac: monthData.summary.newBeneficiaries > 0 ? totalSpend / monthData.summary.newBeneficiaries : 0,
    cpl: monthData.summary.leads > 0 ? marketingSpend / monthData.summary.leads : 0,
    churnRate: monthData.summary.churnRate
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

  filteredMonths.forEach(m => {
    const row = getReportRowForMonth(m, dashboardMap, investmentsPayload);
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
    averageGrowthRate
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
  endMonth: '2026-05'
};

export const mockConsolidatedReport: ConsolidatedReport = generateConsolidatedReport(defaultReportFilter);
