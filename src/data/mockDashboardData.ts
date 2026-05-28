import { MonthDataMap } from '../types/dashboard';

export const mockDashboardData: MonthDataMap = {
  '2026-01': {
    summary: {
      month: '2026-01',
      monthLabel: 'Janeiro/2026',
      activeBeneficiaries: 9800,
      newBeneficiaries: 180,
      canceledBeneficiaries: 25,
      growthRate: 1.25,
      leads: 1500,
      conversions: 180,
      conversionRate: 12.0,
      cac: 77.87,
      ltv: 4320,
      totalRevenue: 294000,
      churnRate: 0.25,
      nps: 70
    },
    trafficSources: [
      { source: 'Google Ads', leads: 650, conversions: 78, conversionRate: 12.0, investment: 800 },
      { source: 'Meta Ads', leads: 550, conversions: 66, conversionRate: 12.0, investment: 1242 },
      { source: 'Parcerias / Eventos', leads: 150, conversions: 24, conversionRate: 16.0, investment: 2860.18 },
      { source: 'Tráfego Orgânico', leads: 150, conversions: 12, conversionRate: 8.0, investment: 0 }
    ],
    acquisitionChannels: [
      { channel: 'Digital (Inbound)', channelType: 'digital', leads: 1200, conversions: 144, conversionRate: 12.0 },
      { channel: 'Venda Direta (Outbound)', channelType: 'direct', leads: 180, conversions: 20, conversionRate: 11.11 },
      { channel: 'Canais / Corretores', channelType: 'partners', leads: 120, conversions: 16, conversionRate: 13.33 }
    ] as any,
    cityDistribution: [
      { city: 'Passos', beneficiaries: 7000, leads: 600, conversions: 70 },
      { city: 'Itaú de Minas', beneficiaries: 5800, leads: 350, conversions: 42 },
      { city: 'São Seb. Paraíso', beneficiaries: 4800, leads: 250, conversions: 30 },
      { city: 'Cássia', beneficiaries: 3800, leads: 180, conversions: 22 },
      { city: 'Alpinópolis', beneficiaries: 3500, leads: 120, conversions: 16 }
    ],
    campaigns: [
      { campaignId: 'c1', campaignName: 'Institucional Passos - Max Performance', platform: 'Google Ads', clicks: 3500, impressions: 40000, ctr: 8.75, leads: 250, conversions: 30, spend: 450, cpl: 28.0, cac: 15.0 },
      { campaignId: 'c2', campaignName: 'Campanha Lead Focado - Centro', platform: 'Google Ads', clicks: 3000, impressions: 35000, ctr: 8.57, leads: 200, conversions: 24, spend: 350, cpl: 25.0, cac: 14.58 },
      { campaignId: 'c3', campaignName: 'Conversão Família & Individual', platform: 'Meta Ads', clicks: 5000, impressions: 80000, ctr: 6.25, leads: 350, conversions: 42, spend: 700, cpl: 22.85, cac: 16.66 },
      { campaignId: 'c4', campaignName: 'Remarketing - Fechamento Urgente', platform: 'Meta Ads', clicks: 2000, impressions: 30000, ctr: 6.67, leads: 200, conversions: 24, spend: 542, cpl: 20.0, cac: 22.58 }
    ]
  },
  '2026-02': {
    summary: {
      month: '2026-02',
      monthLabel: 'Fevereiro/2026',
      activeBeneficiaries: 9950,
      newBeneficiaries: 210,
      canceledBeneficiaries: 30,
      growthRate: 1.53,
      leads: 1680,
      conversions: 210,
      conversionRate: 12.5,
      cac: 66.75,
      ltv: 4320,
      totalRevenue: 315600,
      churnRate: 0.3,
      nps: 72
    },
    trafficSources: [
      { source: 'Google Ads', leads: 720, conversions: 90, conversionRate: 12.5, investment: 800 },
      { source: 'Meta Ads', leads: 620, conversions: 78, conversionRate: 12.58, investment: 1242 },
      { source: 'Parcerias / Eventos', leads: 180, conversions: 28, conversionRate: 15.56, investment: 2860.18 },
      { source: 'Tráfego Orgânico', leads: 160, conversions: 14, conversionRate: 8.75, investment: 0 }
    ],
    acquisitionChannels: [
      { channel: 'Digital (Inbound)', channelType: 'digital', leads: 1340, conversions: 168, conversionRate: 12.54 },
      { channel: 'Venda Direta (Outbound)', channelType: 'direct', leads: 200, conversions: 24, conversionRate: 12.0 },
      { channel: 'Canais / Corretores', channelType: 'partners', leads: 140, conversions: 18, conversionRate: 12.86 }
    ] as any,
    cityDistribution: [
      { city: 'Passos', beneficiaries: 7200, leads: 680, conversions: 85 },
      { city: 'Itaú de Minas', beneficiaries: 5950, leads: 380, conversions: 48 },
      { city: 'São Seb. Paraíso', beneficiaries: 4950, leads: 280, conversions: 35 },
      { city: 'Cássia', beneficiaries: 3950, leads: 200, conversions: 25 },
      { city: 'Alpinópolis', beneficiaries: 3600, leads: 140, conversions: 17 }
    ],
    campaigns: [
      { campaignId: 'c1', campaignName: 'Institucional Passos - Max Performance', platform: 'Google Ads', clicks: 4200, impressions: 45000, ctr: 9.33, leads: 280, conversions: 35, spend: 450, cpl: 28.57, cac: 12.85 },
      { campaignId: 'c2', campaignName: 'Campanha Lead Focado - Centro', platform: 'Google Ads', clicks: 3500, impressions: 38000, ctr: 9.21, leads: 220, conversions: 28, spend: 350, cpl: 27.27, cac: 12.5 },
      { campaignId: 'c3', campaignName: 'Conversão Família & Individual', platform: 'Meta Ads', clicks: 5800, impressions: 90000, ctr: 6.44, leads: 400, conversions: 50, spend: 700, cpl: 22.5, cac: 14.0 },
      { campaignId: 'c4', campaignName: 'Remarketing - Fechamento Urgente', platform: 'Meta Ads', clicks: 2200, impressions: 32000, ctr: 6.88, leads: 220, conversions: 28, spend: 542, cpl: 20.45, cac: 19.35 }
    ]
  },
  '2026-03': {
    summary: {
      month: '2026-03',
      monthLabel: 'Março/2026',
      activeBeneficiaries: 10100,
      newBeneficiaries: 240,
      canceledBeneficiaries: 35,
      growthRate: 1.5,
      leads: 1850,
      conversions: 240,
      conversionRate: 12.97,
      cac: 58.41,
      ltv: 4320,
      totalRevenue: 340200,
      churnRate: 0.35,
      nps: 75
    },
    trafficSources: [
      { source: 'Google Ads', leads: 800, conversions: 104, conversionRate: 13.0, investment: 800 },
      { source: 'Meta Ads', leads: 680, conversions: 88, conversionRate: 12.94, investment: 1242 },
      { source: 'Parcerias / Eventos', leads: 200, conversions: 32, conversionRate: 16.0, investment: 2860.18 },
      { source: 'Tráfego Orgânico', leads: 170, conversions: 16, conversionRate: 9.41, investment: 0 }
    ],
    acquisitionChannels: [
      { channel: 'Digital (Inbound)', channelType: 'digital', leads: 1480, conversions: 192, conversionRate: 12.97 },
      { channel: 'Venda Direta (Outbound)', channelType: 'direct', leads: 220, conversions: 28, conversionRate: 12.72 },
      { channel: 'Canais / Corretores', channelType: 'partners', leads: 150, conversions: 20, conversionRate: 13.33 }
    ] as any,
    cityDistribution: [
      { city: 'Passos', beneficiaries: 7400, leads: 740, conversions: 96 },
      { city: 'Itaú de Minas', beneficiaries: 6100, leads: 420, conversions: 55 },
      { city: 'São Seb. Paraíso', beneficiaries: 5100, leads: 310, conversions: 40 },
      { city: 'Cássia', beneficiaries: 4100, leads: 220, conversions: 29 },
      { city: 'Alpinópolis', beneficiaries: 3800, leads: 160, conversions: 20 }
    ],
    campaigns: [
      { campaignId: 'c1', campaignName: 'Institucional Passos - Max Performance', platform: 'Google Ads', clicks: 4800, impressions: 50000, ctr: 9.6, leads: 320, conversions: 42, spend: 450, cpl: 29.68, cac: 10.71 },
      { campaignId: 'c2', campaignName: 'Campanha Lead Focado - Centro', platform: 'Google Ads', clicks: 3800, impressions: 40000, ctr: 9.5, leads: 250, conversions: 32, spend: 350, cpl: 26.0, cac: 10.93 },
      { campaignId: 'c3', campaignName: 'Conversão Família & Individual', platform: 'Meta Ads', clicks: 6500, impressions: 95000, ctr: 6.84, leads: 450, conversions: 58, spend: 700, cpl: 22.22, cac: 12.06 },
      { campaignId: 'c4', campaignName: 'Remarketing - Fechamento Urgente', platform: 'Meta Ads', clicks: 2500, impressions: 35000, ctr: 7.14, leads: 230, conversions: 30, spend: 542, cpl: 21.73, cac: 18.06 }
    ]
  },
  '2026-04': {
    summary: {
      month: '2026-04',
      monthLabel: 'Abril/2026',
      activeBeneficiaries: 10289,
      newBeneficiaries: 35,
      canceledBeneficiaries: 15,
      growthRate: 1.5,
      leads: 132,
      conversions: 15,
      conversionRate: 11.8,
      cac: 934.50,
      ltv: 1120.0,
      totalRevenue: 1234680,
      churnRate: 0.15,
      nps: 76
    },
    trafficSources: [
      { source: 'Google Ads', leads: 60, conversions: 7, conversionRate: 11.66, investment: 800 },
      { source: 'Meta Ads', leads: 22, conversions: 3, conversionRate: 13.63, investment: 1242 },
      { source: 'Indicação', leads: 10, conversions: 2, conversionRate: 20.0, investment: 2860.18 },
      { source: 'Tráfego Orgânico', leads: 40, conversions: 3, conversionRate: 7.5, investment: 0 }
    ],
    acquisitionChannels: [
      { channel: 'Digital (Inbound)', channelType: 'digital', leads: 82, conversions: 10, conversionRate: 12.19 },
      { channel: 'Venda Direta (Outbound)', channelType: 'direct', leads: 30, conversions: 3, conversionRate: 10.0 },
      { channel: 'Canais / Corretores', channelType: 'partners', leads: 20, conversions: 2, conversionRate: 10.0 }
    ] as any,
    cityDistribution: [
      { city: 'Passos', beneficiaries: 7980, leads: 70, conversions: 8 },
      { city: 'Itaú de Minas', beneficiaries: 6610, leads: 30, conversions: 3 },
      { city: 'São Seb. Paraíso', beneficiaries: 5750, leads: 20, conversions: 2 },
      { city: 'Cássia', beneficiaries: 4720, leads: 10, conversions: 1 },
      { city: 'Alpinópolis', beneficiaries: 4110, leads: 2, conversions: 1 }
    ],
    campaigns: [
      { campaignId: 'c1', campaignName: 'Google Ads - Captação Passos', platform: 'Google Ads', clicks: 1500, impressions: 20000, ctr: 7.5, leads: 30, conversions: 4, spend: 450, cpl: 66.6, cac: 112.5 },
      { campaignId: 'c2', campaignName: 'Google Ads - Plano Individual', platform: 'Google Ads', clicks: 1200, impressions: 18000, ctr: 6.6, leads: 30, conversions: 3, spend: 350, cpl: 56.6, cac: 116.6 },
      { campaignId: 'c3', campaignName: 'Meta Ads - Conversão Convênio', platform: 'Meta Ads', clicks: 2000, impressions: 30000, ctr: 6.6, leads: 12, conversions: 2, spend: 700, cpl: 125, cac: 350 },
      { campaignId: 'c4', campaignName: 'Meta Ads - Remarketing Família', platform: 'Meta Ads', clicks: 1500, impressions: 25000, ctr: 6.0, leads: 10, conversions: 1, spend: 542, cpl: 130, cac: 542 }
    ]
  },
  '2026-05': {
    summary: {
      month: '2026-05',
      monthLabel: 'Maio/2026',
      activeBeneficiaries: 10289,
      newBeneficiaries: 42,
      canceledBeneficiaries: 18,
      growthRate: 2.1,
      leads: 145,
      conversions: 18,
      conversionRate: 12.4,
      cac: 778.75,
      ltv: 1190.0,
      totalRevenue: 1234680,
      churnRate: 0.17,
      nps: 78
    },
    trafficSources: [
      { source: 'Google Ads', leads: 65, conversions: 8, conversionRate: 12.3, investment: 800 },
      { source: 'Meta Ads', leads: 20, conversions: 3, conversionRate: 15.0, investment: 1242 },
      { source: 'Indicação', leads: 8, conversions: 1, conversionRate: 12.5, investment: 2860.18 },
      { source: 'Tráfego Orgânico', leads: 52, conversions: 6, conversionRate: 11.5, investment: 0 }
    ],
    acquisitionChannels: [
      { channel: 'Digital (Inbound)', channelType: 'digital', leads: 85, conversions: 11, conversionRate: 12.9 },
      { channel: 'Venda Direta (Outbound)', channelType: 'direct', leads: 35, conversions: 4, conversionRate: 11.4 },
      { channel: 'Canais / Corretores', channelType: 'partners', leads: 25, conversions: 3, conversionRate: 12.0 }
    ] as any,
    cityDistribution: [
      { city: 'Passos', beneficiaries: 8125, leads: 75, conversions: 9 },
      { city: 'Itaú de Minas', beneficiaries: 6732, leads: 32, conversions: 4 },
      { city: 'São Seb. Paraíso', beneficiaries: 5921, leads: 22, conversions: 3 },
      { city: 'Cássia', beneficiaries: 4812, leads: 11, conversions: 1 },
      { city: 'Alpinópolis', beneficiaries: 4256, leads: 5, conversions: 1 }
    ],
    campaigns: [
      { campaignId: 'c1', campaignName: 'Google Ads - Captação Passos', platform: 'Google Ads', clicks: 1600, impressions: 22000, ctr: 7.27, leads: 32, conversions: 4, spend: 450, cpl: 65.6, cac: 112.5 },
      { campaignId: 'c2', campaignName: 'Google Ads - Plano Individual', platform: 'Google Ads', clicks: 1300, impressions: 19000, ctr: 6.84, leads: 33, conversions: 4, spend: 350, cpl: 56.0, cac: 87.5 },
      { campaignId: 'c3', campaignName: 'Meta Ads - Conversão Convênio', platform: 'Meta Ads', clicks: 2100, impressions: 32000, ctr: 6.56, leads: 11, conversions: 2, spend: 700, cpl: 145.4, cac: 350 },
      { campaignId: 'c4', campaignName: 'Meta Ads - Remarketing Família', platform: 'Meta Ads', clicks: 1600, impressions: 26000, ctr: 6.15, leads: 9, conversions: 1, spend: 542, cpl: 155.5, cac: 542 }
    ]
  },
  '2026-06': {
    summary: {
      month: '2026-06',
      monthLabel: 'Junho/2026',
      activeBeneficiaries: 10320,
      newBeneficiaries: 55,
      canceledBeneficiaries: 24,
      growthRate: 2.8,
      leads: 160,
      conversions: 21,
      conversionRate: 13.1,
      cac: 272.0,
      ltv: 1220.0,
      totalRevenue: 1238400,
      churnRate: 0.23,
      nps: 80
    },
    trafficSources: [
      { source: 'Google Ads', leads: 68, conversions: 9, conversionRate: 13.23, investment: 4200 },
      { source: 'Meta Ads', leads: 18, conversions: 3, conversionRate: 16.66, investment: 3200 },
      { source: 'Indicação', leads: 9, conversions: 2, conversionRate: 22.22, investment: 0 },
      { source: 'Tráfego Orgânico', leads: 65, conversions: 7, conversionRate: 10.76, investment: 0 }
    ],
    acquisitionChannels: [
      { channel: 'Digital (Inbound)', channelType: 'digital', leads: 96, conversions: 12, conversionRate: 12.5 },
      { channel: 'Venda Direta (Outbound)', channelType: 'direct', leads: 39, conversions: 5, conversionRate: 12.82 },
      { channel: 'Canais / Corretores', channelType: 'partners', leads: 25, conversions: 4, conversionRate: 16.0 }
    ] as any,
    cityDistribution: [
      { city: 'Passos', beneficiaries: 8310, leads: 82, conversions: 11 },
      { city: 'Itaú de Minas', beneficiaries: 6850, leads: 35, conversions: 5 },
      { city: 'São Seb. Paraíso', beneficiaries: 6110, leads: 24, conversions: 3 },
      { city: 'Cássia', beneficiaries: 4930, leads: 12, conversions: 1 },
      { city: 'Alpinópolis', beneficiaries: 4420, leads: 7, conversions: 1 }
    ],
    campaigns: [
      { campaignId: 'c1', campaignName: 'Google Ads - Captação Passos', platform: 'Google Ads', clicks: 1800, impressions: 25000, ctr: 7.2, leads: 35, conversions: 5, spend: 2300, cpl: 65.7, cac: 460 },
      { campaignId: 'c2', campaignName: 'Google Ads - Plano Individual', platform: 'Google Ads', clicks: 1400, impressions: 21000, ctr: 6.66, leads: 33, conversions: 4, spend: 1900, cpl: 57.5, cac: 475 },
      { campaignId: 'c3', campaignName: 'Meta Ads - Conversão Convênio', platform: 'Meta Ads', clicks: 2300, impressions: 35000, ctr: 6.57, leads: 10, conversions: 2, spend: 1700, cpl: 170, cac: 850 },
      { campaignId: 'c4', campaignName: 'Meta Ads - Remarketing Família', platform: 'Meta Ads', clicks: 1700, impressions: 28000, ctr: 6.07, leads: 8, conversions: 1, spend: 1500, cpl: 187.5, cac: 1500 }
    ]
  }
};
