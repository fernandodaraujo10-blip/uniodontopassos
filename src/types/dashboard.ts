// ==========================================
// 1. Tipos e Interfaces Legadas (Retrocompatibilidade)
// ==========================================

export type PercentType = 'up' | 'down';

export interface BeneficiariosData {
  total: string;
  percentText: string;
  percentType: PercentType;
  ativos: string;
  novos: string;
  cancelados: string;
  pfPercent: number;
  pfVal: string;
  pjPercent: number;
  pjVal: string;
}

export interface LeadsData {
  total: string;
  percentText: string;
  percentType: PercentType;
  origem: {
    google: string;
    meta: string;
    indicacao: string;
    outros: string;
  };
  origemInt: {
    google: number;
    meta: number;
    indicacao: number;
    outros: number;
  };
}

export interface ConversoesData {
  taxa: string;
  percentText: string;
  percentType: PercentType;
  vendas: string;
  leads: string;
  meta: string;
}

export interface InvestimentoData {
  total: string;
  percentText: string;
  percentType: PercentType;
  atual: string;
  orcamento: string;
  progressoPercent: string;
}

export interface RoiData {
  total: string;
  diff: string;
  diffType: PercentType;
  cac: string;
  ltv: string;
  fator: string;
  progress: number;
}

export interface NpsData {
  total: string;
  diff: string;
  diffType: PercentType;
  status: string;
  statusColor: string;
  respostas: string;
  proDet: string;
  progress: number;
}

export interface InvestmentItem {
  categoria: 'Ads' | 'Marketing' | 'Offline' | string;
  metric: string;
  valor: string;
  valorInt: number;
}

export interface AdPlatformData {
  semanal: number[];
  views: string;
  groups: string;
  groupsChange: string;
  invested: string;
  leads: string;
  conversions: string;
  schedRate: string;
}

export interface FunnelMetric {
  impressoes: string;
  impressoesChange: string;
  impressoesChangeType: PercentType;
  cliques: string;
  cliquesChange: string;
  cliquesChangeType: PercentType;
  leads: string;
  leadsChange: string;
  leadsChangeType: PercentType;
  agendamentos: string;
  agendamentosChange: string;
  agendamentosChangeType: PercentType;
  vendas: string;
  vendasChange: string;
  vendasChangeType: PercentType;
  txCtr: string;
  txCtrChange: string;
  txCtrChangeType: PercentType;
  txLeads: string;
  txLeadsChange: string;
  txLeadsChangeType: PercentType;
  txAgendamentos: string;
  txAgendamentosChange: string;
  txAgendamentosChangeType: PercentType;
  txVendas: string;
  txVendasChange: string;
  txVendasChangeType: PercentType;
}

export interface CidadeItem {
  nome: string;
  beneficiarios: string;
  crescimento: string;
}

export interface MonthDashboardData {
  timestamp: string;
  beneficiarios: BeneficiariosData;
  leads: LeadsData;
  conversoes: ConversoesData;
  investimento: InvestimentoData;
  roi: RoiData;
  nps: NpsData;
  investimentosTabela: InvestmentItem[];
  anuncios: Record<string, AdPlatformData>;
  funil: FunnelMetric;
  cidades: CidadeItem[];
}

export type DashboardDataMap = Record<'abril' | 'maio' | 'junho' | string, MonthDashboardData>;

// ==========================================
// 2. Novos Tipos Estruturados (Fluxo Mensal Avançado)
// ==========================================

export interface MonthlySummary {
  month: string; // Formato 'YYYY-MM' (Ex: '2026-01')
  monthLabel: string; // Formato amigável (Ex: 'Janeiro/2026')
  activeBeneficiaries: number; // Beneficiários ativos no final do mês
  newBeneficiaries: number; // Novos beneficiários inseridos no mês
  canceledBeneficiaries: number; // Beneficiários cancelados no mês
  growthRate: number; // Taxa de crescimento mensal (%)
  leads: number; // Total de leads captados no mês
  conversions: number; // Total de conversões (leads que viraram clientes)
  conversionRate: number; // Taxa de conversão (%)
  cac: number; // Custo de Aquisição de Clientes (R$)
  ltv: number; // Lifetime Value estimado (R$)
  totalRevenue: number; // Receita mensal (R$)
  churnRate: number; // Taxa de Churn (%)
}

export interface TrafficSource {
  source: string; // Ex: 'Google Ads', 'Meta Ads', 'Indicação', 'Tráfego Orgânico'
  leads: number;
  conversions: number;
  conversionRate: number;
  investment: number;
}

export interface AcquisitionChannel {
  channel: string; // Ex: 'Digital', 'Venda Direta', 'Corretores', 'Parcerias'
  channelType?: string;
  leads: number;
  conversions: number;
  conversionRate: number;
}

export interface CityDistribution {
  city: string;
  beneficiaries: number;
  leads: number;
  conversions: number;
}

export interface CampaignPerformance {
  campaignId: string;
  campaignName: string;
  platform: 'Google Ads' | 'Meta Ads' | 'Outros' | string;
  clicks: number;
  impressions: number;
  ctr: number; // Click-Through Rate (%)
  leads: number;
  conversions: number;
  spend: number; // Investimento na campanha (R$)
  cpl: number; // Custo por Lead (R$)
  cac: number; // Custo por Aquisição (R$)
}

export interface DashboardDataPayload {
  summary: MonthlySummary;
  trafficSources: TrafficSource[];
  acquisitionChannels: AcquisitionChannel[];
  cityDistribution: CityDistribution[];
  campaigns: CampaignPerformance[];
}

export interface MonthDataMap {
  [month: string]: DashboardDataPayload;
}
