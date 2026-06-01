import { 
  DashboardDataPayload, 
  BeneficiariosData, 
  LeadsData, 
  ConversoesData, 
  InvestimentoData,
  RoiData, 
  NpsData, 
  InvestmentItem, 
  AdPlatformData, 
  FunnelMetric, 
  CidadeItem 
} from '../types/dashboard';
import { InvestmentPayload } from '../types/investments';
import { 
  formatarNumero, 
  formatarMoeda, 
  formatarPorcentagem, 
  formatarMilharMoeda 
} from './formatters';

// Mapeamento de categorias e rótulos de investimentos
export const mapearCategoriaEItem = (categoryId: string): { categoria: 'Offline' | 'Ads' | 'Marketing' | 'Ferramentas' | 'Outros', metric: string } => {
  switch (categoryId) {
    case 'offline_radio_vida':
      return { categoria: 'Offline', metric: 'Rádio Vida (Passos)' };
    case 'offline_radio_itau':
      return { categoria: 'Offline', metric: 'Rádio (Itaú de Minas)' };
    case 'offline_radio_paraiso':
      return { categoria: 'Offline', metric: 'Rádio (S. S. Paraíso)' };
    case 'offline_radio_cassia':
      return { categoria: 'Offline', metric: 'Rádio (Cássia)' };
    case 'offline_jornal':
      return { categoria: 'Offline', metric: 'Jornal (Folha da Manhã)' };
    case 'offline_led':
      return { categoria: 'Offline', metric: 'Telão/Painel LED (Paraíso)' };
    case 'online_meta':
      return { categoria: 'Ads', metric: 'Meta (Facebook/Instagram)' };
    case 'online_google':
      return { categoria: 'Ads', metric: 'Google Ads' };
    case 'marketing_agency':
      return { categoria: 'Marketing', metric: 'Agencia de Marketing' };
    case 'tools_rd_station':
      return { categoria: 'Ferramentas', metric: 'RD Station (Mkt e Conversas)' };
    case 'tools_rd_conversas':
      return { categoria: 'Ferramentas', metric: 'RD Conversas' };
    case 'tools_rd_marketing':
      return { categoria: 'Ferramentas', metric: 'RD Marketing' };
    case 'tools_rd_crm':
      return { categoria: 'Ferramentas', metric: 'RD CRM' };
    case 'tools_fertaise':
      return { categoria: 'Ferramentas', metric: 'FerTaise' };
    default:
      return { categoria: 'Outros', metric: categoryId };
  }
};

// 1. Mapeamento de Beneficiários
export const mapBeneficiarios = (summary: any, prevSummary: any): BeneficiariosData => {
  const activePercent = prevSummary 
    ? ((summary.activeBeneficiaries - prevSummary.activeBeneficiaries) / prevSummary.activeBeneficiaries) * 100 
    : summary.growthRate;
  
  const pfPercent = summary.month.endsWith('-05') ? 59 : 5;
  const pjPercent = 100 - pfPercent;
  const pfVal = Math.round(summary.activeBeneficiaries * (pfPercent / 100));
  const pjVal = summary.activeBeneficiaries - pfVal;

  return {
    total: formatarNumero(summary.activeBeneficiaries),
    percentText: (activePercent >= 0 ? '+' : '') + formatarPorcentagem(Math.abs(activePercent)),
    percentType: activePercent >= 0 ? 'up' : 'down',
    ativos: formatarNumero(summary.activeBeneficiaries),
    novos: formatarNumero(summary.newBeneficiaries),
    cancelados: formatarNumero(summary.canceledBeneficiaries),
    pfPercent,
    pfVal: formatarNumero(pfVal),
    pjPercent,
    pjVal: formatarNumero(pjVal)
  };
};

// 2. Mapeamento de Leads
export const mapLeads = (current: DashboardDataPayload, prevSummary: any): LeadsData => {
  const summary = current.summary;
  const prevLeads = prevSummary?.leads || 130;
  const leadsDiffPercent = ((summary.leads - prevLeads) / prevLeads) * 100;
  
  const googleSource = current.trafficSources.find(s => s.source.toLowerCase().includes('google'));
  const metaSource = current.trafficSources.find(s => s.source.toLowerCase().includes('meta'));
  const partnersSource = current.trafficSources.find(s => s.source.toLowerCase().includes('parceria') || s.source.toLowerCase().includes('indicação'));

  const googlePct = googleSource ? Math.round((googleSource.leads / summary.leads) * 100) : 60;
  const metaPct = metaSource ? Math.round((metaSource.leads / summary.leads) * 100) : 20;
  const partnersPct = partnersSource ? Math.round((partnersSource.leads / summary.leads) * 100) : 10;
  const organicPct = 100 - (googlePct + metaPct + partnersPct);

  return {
    total: formatarNumero(summary.leads),
    percentText: (leadsDiffPercent >= 0 ? '+' : '') + formatarPorcentagem(Math.abs(leadsDiffPercent)),
    percentType: leadsDiffPercent >= 0 ? 'up' : 'down',
    origem: {
      google: `${googlePct}%`,
      meta: `${metaPct}%`,
      indicacao: `${partnersPct}%`,
      outros: `${organicPct}%`
    },
    origemInt: {
      google: googlePct,
      meta: metaPct,
      indicacao: partnersPct,
      outros: organicPct
    }
  };
};

// 3. Mapeamento de Conversões
export const mapConversoes = (summary: any, prevSummary: any): ConversoesData => {
  const prevConvRate = prevSummary?.conversionRate || 11.5;
  const convRateDiff = summary.conversionRate - prevConvRate;

  return {
    taxa: formatarPorcentagem(summary.conversionRate),
    percentText: (convRateDiff >= 0 ? '+' : '') + convRateDiff.toFixed(1).replace('.', ',') + ' p.p.',
    percentType: convRateDiff >= 0 ? 'up' : 'down',
    vendas: formatarNumero(summary.conversions),
    leads: formatarNumero(summary.leads),
    meta: '12%'
  };
};

// 4. Mapeamento de Investimento
export const mapInvestimento = (
  summary: any,
  totalSpend: number,
  prevSpend: number
): InvestimentoData => {
  const spendDiffPercent = prevSpend > 0 ? ((totalSpend - prevSpend) / prevSpend) * 100 : 0;
  const orcamento = summary.month.endsWith('-04') ? 12100 : summary.month.endsWith('-05') ? 13000 : 14000;
  const progressoPercent = (totalSpend / orcamento) * 100;

  return {
    total: formatarMilharMoeda(totalSpend),
    percentText: (spendDiffPercent >= 0 ? '+' : '') + formatarPorcentagem(Math.abs(spendDiffPercent)),
    percentType: spendDiffPercent >= 0 ? 'up' : 'down',
    atual: formatarMoeda(totalSpend),
    orcamento: formatarMoeda(orcamento),
    progressoPercent: progressoPercent.toFixed(1).replace('.', ',') + '%'
  };
};

// 5. Mapeamento de ROI
export const mapRoi = (summary: any, prevSummary: any): RoiData => {
  const factor = summary.ltv / summary.cac;
  const prevFactor = prevSummary ? prevSummary.ltv / prevSummary.cac : 3.8;
  const factorDiff = factor - prevFactor;
  const progressRoi = Math.min(Math.round(factor * 20), 100);

  return {
    total: `${factor.toFixed(1).replace('.', ',')}x`,
    diff: (factorDiff >= 0 ? '+' : '') + `${factorDiff.toFixed(1).replace('.', ',')}x`,
    diffType: factorDiff >= 0 ? 'up' : 'down',
    cac: formatarMoeda(summary.cac),
    ltv: formatarMoeda(summary.ltv),
    fator: `${factor.toFixed(1).replace('.', ',')}x`,
    progress: progressRoi
  };
};

// 6. Mapeamento de NPS
export const mapNps = (summary: any, prevSummary: any): NpsData => {
  const npsScore = summary.nps || 78;
  const prevNpsScore = prevSummary?.nps || 76;
  const npsDiff = npsScore - prevNpsScore;
  const promotores = npsScore + 4; // aproximado
  const detratores = 100 - promotores - 14; // aproximado
  const progressNps = npsScore;

  return {
    total: String(npsScore),
    diff: (npsDiff >= 0 ? '+' : '') + `${npsDiff} pt` + (Math.abs(npsDiff) !== 1 ? 's' : ''),
    diffType: npsDiff >= 0 ? 'up' : 'down',
    status: npsScore >= 75 ? 'Excelência' : npsScore >= 50 ? 'Qualidade' : 'Aperfeiçoamento',
    statusColor: npsScore >= 75 ? 'text-green-500' : 'text-yellow-500',
    respostas: String(Math.round(summary.activeBeneficiaries * 0.033)),
    proDet: `${detratores}% / ${promotores}%`,
    progress: progressNps
  };
};

// 7. Mapeamento de Investimentos Tabela
export const mapInvestimentosTabela = (
  month: string,
  totalSpend: number,
  investmentsData: InvestmentPayload
): InvestmentItem[] => {
  const monthlyDetail = investmentsData.monthlyDetails[month];
  if (monthlyDetail && monthlyDetail.investments && monthlyDetail.investments.length > 0) {
    return monthlyDetail.investments.map(inv => {
      const mapped = mapearCategoriaEItem(inv.categoryId);
      return {
        categoria: mapped.categoria,
        metric: mapped.metric,
        valor: inv.amount === 0 ? '' : formatarMoeda(inv.amount),
        valorInt: inv.amount
      };
    });
  } else {
    const offlineSpend = totalSpend * 0.08;
    const adsSpend = totalSpend * 0.6;
    const mktToolsSpend = totalSpend * 0.32;
    return [
      { categoria: 'Ads', metric: 'Meta anúncios do Facebook/Instagram', valor: formatarMoeda(adsSpend * 0.45), valorInt: adsSpend * 0.45 },
      { categoria: 'Ads', metric: 'Anúncios do Google', valor: formatarMoeda(adsSpend * 0.55), valorInt: adsSpend * 0.55 },
      { categoria: 'Marketing', metric: 'RD Conversas', valor: formatarMoeda(mktToolsSpend * 0.3), valorInt: mktToolsSpend * 0.3 },
      { categoria: 'Marketing', metric: 'RD CRM', valor: formatarMoeda(mktToolsSpend * 0.25), valorInt: mktToolsSpend * 0.25 },
      { categoria: 'Offline', metric: 'Rádio Passos / Rádio Vida', valor: formatarMoeda(offlineSpend * 0.7), valorInt: offlineSpend * 0.7 },
      { categoria: 'Marketing', metric: 'Outros custos e ferramentas', valor: formatarMoeda(mktToolsSpend * 0.45), valorInt: mktToolsSpend * 0.45 },
      { categoria: 'Offline', metric: 'Patrocínios e eventos', valor: formatarMoeda(offlineSpend * 0.3), valorInt: offlineSpend * 0.3 }
    ];
  }
};

// 8. Mapeamento de Anúncios Semanais
export const mapAnuncios = (current: DashboardDataPayload): Record<string, AdPlatformData> => {
  const summary = current.summary;
  const googleWeekly = summary.month.endsWith('-04') ? [10, 55, 74, 68, 80, 55, 48] : 
                        summary.month.endsWith('-05') ? [12, 69, 84, 75, 88, 61, 57] : 
                        [15, 78, 92, 85, 96, 68, 62];

  const metaWeekly = summary.month.endsWith('-04') ? [32, 45, 58, 62, 70, 48, 39] :
                     summary.month.endsWith('-05') ? [40, 52, 68, 71, 79, 58, 45] :
                     [48, 60, 75, 82, 88, 65, 52];

  const instaWeekly = summary.month.endsWith('-04') ? [22, 38, 48, 55, 72, 50, 41] :
                      summary.month.endsWith('-05') ? [28, 42, 55, 68, 85, 60, 48] :
                      [35, 50, 68, 79, 98, 72, 58];

  const googleCamp = current.campaigns.filter(c => c.platform === 'Google Ads');
  const metaCamp = current.campaigns.filter(c => c.platform === 'Meta Ads');

  const gSpend = googleCamp.reduce((sum, c) => sum + c.spend, 0) || 5000;
  const gLeads = googleCamp.reduce((sum, c) => sum + c.leads, 0) || 45;
  const gConv = googleCamp.reduce((sum, c) => sum + c.conversions, 0) || 6;

  const mSpend = metaCamp.reduce((sum, c) => sum + c.spend, 0) || 4000;
  const mLeads = metaCamp.reduce((sum, c) => sum + c.leads, 0) || 40;
  const mConv = metaCamp.reduce((sum, c) => sum + c.conversions, 0) || 5;

  return {
    'Google Ads': {
      semanal: googleWeekly,
      views: formatarNumero(gSpend * 18),
      groups: `${googleCamp.length} campanhas`,
      groupsChange: '▬ 0',
      invested: formatarMoeda(gSpend),
      leads: String(gLeads),
      conversions: String(gConv),
      schedRate: formatarPorcentagem(gLeads > 0 ? (gConv / gLeads) * 100 : 40.0)
    },
    'Meta ADS': {
      semanal: metaWeekly,
      views: formatarNumero(mSpend * 22),
      groups: `${metaCamp.length} campanhas`,
      groupsChange: '▲ 1',
      invested: formatarMoeda(mSpend),
      leads: String(mLeads),
      conversions: String(mConv),
      schedRate: formatarPorcentagem(mLeads > 0 ? (mConv / mLeads) * 100 : 42.0)
    },
    'Instagram': {
      semanal: instaWeekly,
      views: formatarNumero(mSpend * 15),
      groups: '2 campanhas',
      groupsChange: '▬ 0',
      invested: formatarMoeda(mSpend * 0.45),
      leads: String(Math.round(mLeads * 0.45)),
      conversions: String(Math.round(mConv * 0.45)),
      schedRate: '38,10%'
    }
  };
};

// 9. Mapeamento de Funil
export const mapFunil = (
  summary: any,
  totalSpend: number,
  prevSpend: number,
  prevSummary: any
): FunnelMetric => {
  const prevLeads = prevSummary?.leads || 130;
  const viewsFunnel = totalSpend * 35;
  const clicksFunnel = viewsFunnel * 0.07;
  const leadsFunnel = summary.leads;
  const appointmentsFunnel = Math.round(summary.conversions * 1.15);
  const salesFunnel = summary.conversions;

  const ctrPct = (clicksFunnel / viewsFunnel) * 100;
  const leadsPct = (leadsFunnel / clicksFunnel) * 100;
  const appointmentsPct = (appointmentsFunnel / leadsFunnel) * 100;
  const salesPct = (salesFunnel / appointmentsFunnel) * 100;

  const prevViews = (prevSpend || 11500) * 35;
  const prevClicks = prevViews * 0.07;
  const prevAppointments = Math.round((prevSummary?.conversions || 15) * 1.15);
  const prevSales = prevSummary?.conversions || 15;

  const viewsDiff = ((viewsFunnel - prevViews) / prevViews) * 100;
  const clicksDiff = ((clicksFunnel - prevClicks) / prevClicks) * 100;
  const leadsDiff = ((leadsFunnel - prevLeads) / prevLeads) * 100;
  const appointmentsDiff = ((appointmentsFunnel - prevAppointments) / prevAppointments) * 100;
  const salesDiff = ((salesFunnel - prevSales) / prevSales) * 100;

  return {
    impressoes: formatarNumero(viewsFunnel),
    impressoesChange: `${viewsDiff >= 0 ? '▲' : '▼'} ${Math.abs(viewsDiff).toFixed(1).replace('.', ',')}%`,
    impressoesChangeType: viewsDiff >= 0 ? 'up' : 'down',
    cliques: formatarNumero(clicksFunnel),
    cliquesChange: `${clicksDiff >= 0 ? '▲' : '▼'} ${Math.abs(clicksDiff).toFixed(1).replace('.', ',')}%`,
    cliquesChangeType: clicksDiff >= 0 ? 'up' : 'down',
    leads: formatarNumero(leadsFunnel),
    leadsChange: `${leadsDiff >= 0 ? '▲' : '▼'} ${Math.abs(leadsDiff).toFixed(1).replace('.', ',')}%`,
    leadsChangeType: leadsDiff >= 0 ? 'up' : 'down',
    agendamentos: formatarNumero(appointmentsFunnel),
    agendamentosChange: `${appointmentsDiff >= 0 ? '▲' : '▼'} ${Math.abs(appointmentsDiff).toFixed(1).replace('.', ',')}%`,
    agendamentosChangeType: appointmentsDiff >= 0 ? 'up' : 'down',
    vendas: formatarNumero(salesFunnel),
    vendasChange: `${salesDiff >= 0 ? '▲' : '▼'} ${Math.abs(salesDiff).toFixed(1).replace('.', ',')}%`,
    vendasChangeType: salesDiff >= 0 ? 'up' : 'down',

    txCtr: ctrPct.toFixed(2).replace('.', ',') + '%',
    txCtrChange: '▲ 0,2%',
    txCtrChangeType: 'up',
    txLeads: leadsPct.toFixed(2).replace('.', ',') + '%',
    txLeadsChange: '▲ 0,1%',
    txLeadsChangeType: 'up',
    txAgendamentos: appointmentsPct.toFixed(2).replace('.', ',') + '%',
    txAgendamentosChange: '▲ 1,2%',
    txAgendamentosChangeType: 'up',
    txVendas: salesPct.toFixed(2).replace('.', ',') + '%',
    txVendasChange: '▲ 0,5%',
    txVendasChangeType: 'up'
  };
};

// 10. Mapeamento de Cidades
export const mapCidades = (current: DashboardDataPayload): CidadeItem[] => {
  const summary = current.summary;
  return current.cityDistribution.map(c => {
    let grow = '+ 12,4%';
    if (c.city === 'Passos') grow = summary.month.endsWith('-04') ? '+ 10,2%' : summary.month.endsWith('-05') ? '+ 12,4%' : '+ 14,1%';
    else if (c.city === 'Itaú de Minas') grow = summary.month.endsWith('-04') ? '+ 8,5%' : summary.month.endsWith('-05') ? '+ 9,8%' : '+ 11,2%';
    else if (c.city === 'São Seb. Paraíso') grow = summary.month.endsWith('-04') ? '+ 12,1%' : summary.month.endsWith('-05') ? '+ 14,2%' : '+ 15,8%';
    else if (c.city === 'Cássia') grow = summary.month.endsWith('-04') ? '+ 6,3%' : summary.month.endsWith('-05') ? '+ 7,1%' : '+ 8,2%';
    else if (c.city === 'Alpinópolis') grow = summary.month.endsWith('-04') ? '+ 15,2%' : summary.month.endsWith('-05') ? '+ 18,7%' : '+ 20,1%';

    return {
      nome: c.city,
      beneficiarios: formatarNumero(c.beneficiaries),
      crescimento: grow
    };
  });
};
