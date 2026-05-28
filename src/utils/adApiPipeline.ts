export interface ApiProgressLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AdsSyncResult {
  trafficInput: { source: string; leads: number; conversions: number; investment: number }[];
  campaignsInput: {
    campaignId: string;
    campaignName: string;
    platform: string;
    clicks: number;
    impressions: number;
    leads: number;
    conversions: number;
    spend: number;
  }[];
  investmentsInput: { categoryId: string; amount: number }[];
  adsLeads: number;
  adsConversions: number;
  adsSpend: number;
}

/**
 * Pipeline simulado premium de conexão direta e sincronização com as APIs do Google Ads e Meta Ads.
 * Fornece logs detalhados de progresso para criar um efeito visual impressionante de carregamento no frontend.
 */
export const syncAdsApis = async (
  month: string,
  onLog: (log: ApiProgressLog) => void
): Promise<AdsSyncResult> => {
  const getTimestamp = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  // 1. Inicializando Conexão
  onLog({ timestamp: getTimestamp(), message: 'Iniciando pipeline de sincronização de APIs...', type: 'info' });
  await delay(600);

  // 2. Autenticação Google Ads
  onLog({ timestamp: getTimestamp(), message: 'Estabelecendo conexão segura com Google Ads API v16...', type: 'info' });
  await delay(800);
  onLog({ timestamp: getTimestamp(), message: 'Autenticado com sucesso via OAuth 2.0 (Token de acesso renovado).', type: 'success' });
  await delay(500);

  // 3. Autenticação Meta Ads
  onLog({ timestamp: getTimestamp(), message: 'Conectando ao Meta Ads Graph API v19.0...', type: 'info' });
  await delay(800);
  onLog({ timestamp: getTimestamp(), message: 'Token de Página verificado para Uniodonto Passos Business Manager.', type: 'success' });
  await delay(600);

  // 4. Mapeamento de Campanhas Ativas do Mês
  onLog({ timestamp: getTimestamp(), message: `Buscando campanhas ativas para o período: ${month}...`, type: 'info' });
  await delay(900);

  // Dados dinâmicos simulados com base no mês
  const isJuly = month === '2026-07';
  
  // Google Ads
  onLog({ timestamp: getTimestamp(), message: '→ [Google Ads] Baixando métricas da campanha "Google Ads - Captação Passos"...', type: 'info' });
  await delay(500);
  onLog({ timestamp: getTimestamp(), message: '→ [Google Ads] Baixando métricas da campanha "Google Ads - Plano Individual"...', type: 'info' });
  await delay(500);

  // Meta Ads
  onLog({ timestamp: getTimestamp(), message: '→ [Meta Ads] Baixando métricas da campanha "Meta Ads - Conversão Convênio"...', type: 'info' });
  await delay(500);
  onLog({ timestamp: getTimestamp(), message: '→ [Meta Ads] Baixando métricas da campanha "Meta Ads - Remarketing Família"...', type: 'info' });
  await delay(600);

  // Resultados consolidados dinâmicos baseados no mês
  const googleSpend = isJuly ? 4600 : 4200;
  const metaSpend = isJuly ? 3600 : 3100;
  
  const results: AdsSyncResult = {
    trafficInput: [
      { source: 'Google Ads', leads: isJuly ? 80 : 72, conversions: isJuly ? 10 : 9, investment: googleSpend },
      { source: 'Meta Ads', leads: isJuly ? 25 : 22, conversions: isJuly ? 4 : 3, investment: metaSpend }
    ],
    campaignsInput: [
      {
        campaignId: 'c1',
        campaignName: 'Google Ads - Captação Passos',
        platform: 'Google Ads',
        clicks: isJuly ? 2000 : 1850,
        impressions: isJuly ? 28000 : 25600,
        leads: isJuly ? 40 : 36,
        conversions: isJuly ? 5 : 4,
        spend: isJuly ? 2500 : 2300
      },
      {
        campaignId: 'c2',
        campaignName: 'Google Ads - Plano Individual',
        platform: 'Google Ads',
        clicks: isJuly ? 1600 : 1480,
        impressions: isJuly ? 24000 : 21200,
        leads: isJuly ? 40 : 36,
        conversions: isJuly ? 5 : 5,
        spend: isJuly ? 2100 : 1900
      },
      {
        campaignId: 'c3',
        campaignName: 'Meta Ads - Conversão Convênio',
        platform: 'Meta Ads',
        clicks: isJuly ? 2600 : 2200,
        impressions: isJuly ? 38000 : 34000,
        leads: isJuly ? 15 : 14,
        conversions: isJuly ? 3 : 2,
        spend: isJuly ? 1900 : 1700
      },
      {
        campaignId: 'c4',
        campaignName: 'Meta Ads - Remarketing Família',
        platform: 'Meta Ads',
        clicks: isJuly ? 1900 : 1700,
        impressions: isJuly ? 30000 : 27000,
        leads: isJuly ? 10 : 8,
        conversions: isJuly ? 1 : 1,
        spend: isJuly ? 1700 : 1400
      }
    ],
    investmentsInput: [
      { categoryId: 'marketing_google', amount: googleSpend },
      { categoryId: 'marketing_meta', amount: metaSpend }
    ],
    adsLeads: isJuly ? 105 : 94,
    adsConversions: isJuly ? 14 : 12,
    adsSpend: googleSpend + metaSpend
  };

  // 5. Consolidação e Retorno dos Dados
  onLog({ timestamp: getTimestamp(), message: 'Processando custos de faturamento e agendamentos...', type: 'info' });
  await delay(700);
  
  onLog({
    timestamp: getTimestamp(),
    message: `Sincronização Finalizada: R$ ${(results.adsSpend).toLocaleString('pt-BR')} investidos, ${results.adsLeads} leads e ${results.adsConversions} conversões importadas.`,
    type: 'success'
  });
  
  return results;
};
