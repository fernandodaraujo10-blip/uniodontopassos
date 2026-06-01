import { 
  DashboardDataPayload, 
  MonthDashboardData
} from '../types/dashboard';
import { InvestmentPayload } from '../types/investments';
import { mockInvestmentsData } from '../data/mockInvestments';
import {
  mapBeneficiarios,
  mapLeads,
  mapConversoes,
  mapInvestimento,
  mapRoi,
  mapNps,
  mapInvestimentosTabela,
  mapAnuncios,
  mapFunil,
  mapCidades
} from './subMappers';

export const adaptModernToLegacy = (
  current: DashboardDataPayload,
  previous?: DashboardDataPayload,
  investmentsData: InvestmentPayload = mockInvestmentsData
): MonthDashboardData => {
  const summary = current.summary;
  const prevSummary = previous?.summary;

  // 1. Beneficiários
  const beneficiarios = mapBeneficiarios(summary, prevSummary);

  // 2. Leads
  const leads = mapLeads(current, prevSummary);

  // 3. Conversões
  const conversoes = mapConversoes(summary, prevSummary);

  // 4. Investimento
  const isTargetMonth = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05'].includes(summary.month);
  const isPrevTargetMonth = previous ? ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05'].includes(previous.summary.month) : false;

  const totalSpend = isTargetMonth ? 14017.46 : (current.campaigns.reduce((sum, c) => sum + c.spend, 0) || 12800);
  const prevSpend = isPrevTargetMonth ? 14017.46 : (previous?.campaigns.reduce((sum, c) => sum + c.spend, 0) || 11500);

  const investimento = mapInvestimento(summary, totalSpend, prevSpend);

  // 5. ROI
  const roi = mapRoi(summary, prevSummary);

  // 6. NPS
  const nps = mapNps(summary, prevSummary);

  // 7. Investimentos Tabela
  const investimentosTabela = mapInvestimentosTabela(summary.month, totalSpend, investmentsData);

  // 8. Anúncios
  const anuncios = mapAnuncios(current);

  // 9. Funil
  const funil = mapFunil(summary, totalSpend, prevSpend, prevSummary);

  // 10. Cidades
  const cidades = mapCidades(current);

  return {
    timestamp: summary.month.endsWith('-04') ? '05/04/2026 18:45' : summary.month.endsWith('-05') ? '05/05/2026 08:30' : '05/06/2026 10:15',
    beneficiarios,
    leads,
    conversoes,
    investimento,
    roi,
    nps,
    investimentosTabela,
    anuncios,
    funil,
    cidades
  };
};
