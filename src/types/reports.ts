import { MonthlySummary } from './dashboard';

export type ReportType = 'executive' | 'efficiency' | 'campaigns' | 'churn';

export interface ReportFilter {
  startMonth: string; // Formato 'YYYY-MM'
  endMonth: string; // Formato 'YYYY-MM'
  cities?: string[];
  channels?: string[];
  channel?: 'all' | 'google' | 'meta' | 'offline';
  reportType?: ReportType;
}

export interface ConsolidatedReportRow {
  month: string;
  monthLabel: string;
  activeBeneficiaries: number;
  newBeneficiaries: number;
  canceledBeneficiaries: number;
  leads: number;
  conversions: number;
  conversionRate: number;
  marketingSpend: number;
  salesSpend: number;
  totalSpend: number;
  cac: number;
  cpl: number;
  churnRate: number;
  googleAdsSpend: number;
  metaAdsSpend: number;
  offlineSpend: number;
}

export interface ConsolidatedReportTotals {
  totalNewBeneficiaries: number;
  totalCanceledBeneficiaries: number;
  totalLeads: number;
  totalConversions: number;
  averageConversionRate: number;
  totalMarketingSpend: number;
  totalSalesSpend: number;
  totalSpend: number;
  averageCac: number;
  averageCpl: number;
  averageChurnRate: number;
  averageGrowthRate: number;
  totalGoogleAdsSpend: number;
  totalMetaAdsSpend: number;
  totalOfflineSpend: number;
}

export interface ConsolidatedReport {
  generatedAt: string;
  filter: ReportFilter;
  rows: ConsolidatedReportRow[];
  totals: ConsolidatedReportTotals;
}
