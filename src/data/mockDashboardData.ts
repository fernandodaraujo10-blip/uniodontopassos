import { MonthDataMap, DashboardDataPayload } from '../types/dashboard';

export const mockDashboardData: MonthDataMap = {
  '2026-01': {
    summary: {
      month: '2026-01',
      monthLabel: 'Janeiro/2026',
      activeBeneficiaries: 2450,
      newBeneficiaries: 180,
      canceledBeneficiaries: 25,
      growthRate: 6.75,
      leads: 1500,
      conversions: 180,
      conversionRate: 12.0,
      cac: 302.77,
      ltv: 4320,
      totalRevenue: 294000,
      churnRate: 1.02
    },
    trafficSources: [
      { source: 'Google Ads', leads: 650, conversions: 78, conversionRate: 12.0, investment: 15000 },
      { source: 'Meta Ads', leads: 550, conversions: 66, conversionRate: 12.0, investment: 12000 },
      { source: 'Parcerias / Eventos', leads: 150, conversions: 24, conversionRate: 16.0, investment: 3000 },
      { source: 'Tráfego Orgânico', leads: 150, conversions: 12, conversionRate: 8.0, investment: 0 }
    ],
    acquisitionChannels: [
      { channel: 'Digital (Inbound)', channelType: 'digital', leads: 1200, conversions: 144, conversionRate: 12.0 },
      { channel: 'Venda Direta (Outbound)', channelType: 'direct', leads: 180, conversions: 20, conversionRate: 11.11 },
      { channel: 'Canais / Corretores', channelType: 'partners', leads: 120, conversions: 16, conversionRate: 13.33 }
    ] as any,
    cityDistribution: [
      { city: 'São Paulo', beneficiaries: 950, leads: 600, conversions: 70 },
      { city: 'Campinas', beneficiaries: 500, leads: 350, conversions: 42 },
      { city: 'Santos', beneficiaries: 400, leads: 250, conversions: 30 },
      { city: 'São Bernardo', beneficiaries: 320, leads: 180, conversions: 22 },
      { city: 'Guarulhos', beneficiaries: 280, leads: 120, conversions: 16 }
    ],
    campaigns: [
      { campaignId: 'c1', campaignName: 'Institucional SP - Max Performance', platform: 'Google Ads', clicks: 3500, impressions: 40000, ctr: 8.75, leads: 250, conversions: 30, spend: 7000, cpl: 28.0, cac: 233.33 },
      { campaignId: 'c2', campaignName: 'Campanha Lead Focado - Zona Sul', platform: 'Google Ads', clicks: 3000, impressions: 35000, ctr: 8.57, leads: 200, conversions: 24, spend: 5000, cpl: 25.0, cac: 208.33 },
      { campaignId: 'c3', campaignName: 'Conversão Família & Individual', platform: 'Meta Ads', clicks: 5000, impressions: 80000, ctr: 6.25, leads: 350, conversions: 42, spend: 8000, cpl: 22.85, cac: 190.47 },
      { campaignId: 'c4', campaignName: 'Remarketing - Fechamento Urgente', platform: 'Meta Ads', clicks: 2000, impressions: 30000, ctr: 6.67, leads: 200, conversions: 24, spend: 4000, cpl: 20.0, cac: 166.67 }
    ]
  },
  '2026-02': {
    summary: {
      month: '2026-02',
      monthLabel: 'Fevereiro/2026',
      activeBeneficiaries: 2630,
      newBeneficiaries: 210,
      canceledBeneficiaries: 30,
      growthRate: 7.35,
      leads: 1680,
      conversions: 210,
      conversionRate: 12.5,
      cac: 295.23,
      ltv: 4320,
      totalRevenue: 315600,
      churnRate: 1.14
    },
    trafficSources: [
      { source: 'Google Ads', leads: 720, conversions: 90, conversionRate: 12.5, investment: 18000 },
      { source: 'Meta Ads', leads: 620, conversions: 78, conversionRate: 12.58, investment: 13500 },
      { source: 'Parcerias / Eventos', leads: 180, conversions: 28, conversionRate: 15.56, investment: 4000 },
      { source: 'Tráfego Orgânico', leads: 160, conversions: 14, conversionRate: 8.75, investment: 0 }
    ],
    acquisitionChannels: [
      { channel: 'Digital (Inbound)', channelType: 'digital', leads: 1340, conversions: 168, conversionRate: 12.54 },
      { channel: 'Venda Direta (Outbound)', channelType: 'direct', leads: 200, conversions: 24, conversionRate: 12.0 },
      { channel: 'Canais / Corretores', channelType: 'partners', leads: 140, conversions: 18, conversionRate: 12.86 }
    ] as any,
    cityDistribution: [
      { city: 'São Paulo', beneficiaries: 1025, leads: 680, conversions: 85 },
      { city: 'Campinas', beneficiaries: 540, leads: 380, conversions: 48 },
      { city: 'Santos', beneficiaries: 430, leads: 280, conversions: 35 },
      { city: 'São Bernardo', beneficiaries: 345, leads: 200, conversions: 25 },
      { city: 'Guarulhos', beneficiaries: 290, leads: 140, conversions: 17 }
    ],
    campaigns: [
      { campaignId: 'c1', campaignName: 'Institucional SP - Max Performance', platform: 'Google Ads', clicks: 4200, impressions: 45000, ctr: 9.33, leads: 280, conversions: 35, spend: 8000, cpl: 28.57, cac: 228.57 },
      { campaignId: 'c2', campaignName: 'Campanha Lead Focado - Zona Sul', platform: 'Google Ads', clicks: 3500, impressions: 38000, ctr: 9.21, leads: 220, conversions: 28, spend: 6000, cpl: 27.27, cac: 214.28 },
      { campaignId: 'c3', campaignName: 'Conversão Família & Individual', platform: 'Meta Ads', clicks: 5800, impressions: 90000, ctr: 6.44, leads: 400, conversions: 50, spend: 9000, cpl: 22.5, cac: 180.0 },
      { campaignId: 'c4', campaignName: 'Remarketing - Fechamento Urgente', platform: 'Meta Ads', clicks: 2200, impressions: 32000, ctr: 6.88, leads: 220, conversions: 28, spend: 4500, cpl: 20.45, cac: 160.71 }
    ]
  },
  '2026-03': {
    summary: {
      month: '2026-03',
      monthLabel: 'Março/2026',
      activeBeneficiaries: 2835,
      newBeneficiaries: 240,
      canceledBeneficiaries: 35,
      growthRate: 7.79,
      leads: 1850,
      conversions: 240,
      conversionRate: 12.97,
      cac: 291.67,
      ltv: 4320,
      totalRevenue: 340200,
      churnRate: 1.23
    },
    trafficSources: [
      { source: 'Google Ads', leads: 800, conversions: 104, conversionRate: 13.0, investment: 21000 },
      { source: 'Meta Ads', leads: 680, conversions: 88, conversionRate: 12.94, investment: 15000 },
      { source: 'Parcerias / Eventos', leads: 200, conversions: 32, conversionRate: 16.0, investment: 5000 },
      { source: 'Tráfego Orgânico', leads: 170, conversions: 16, conversionRate: 9.41, investment: 0 }
    ],
    acquisitionChannels: [
      { channel: 'Digital (Inbound)', channelType: 'digital', leads: 1480, conversions: 192, conversionRate: 12.97 },
      { channel: 'Venda Direta (Outbound)', channelType: 'direct', leads: 220, conversions: 28, conversionRate: 12.72 },
      { channel: 'Canais / Corretores', channelType: 'partners', leads: 150, conversions: 20, conversionRate: 13.33 }
    ] as any,
    cityDistribution: [
      { city: 'São Paulo', beneficiaries: 1110, leads: 740, conversions: 96 },
      { city: 'Campinas', beneficiaries: 585, leads: 420, conversions: 55 },
      { city: 'Santos', beneficiaries: 460, leads: 310, conversions: 40 },
      { city: 'São Bernardo', beneficiaries: 370, leads: 220, conversions: 29 },
      { city: 'Guarulhos', beneficiaries: 310, leads: 160, conversions: 20 }
    ],
    campaigns: [
      { campaignId: 'c1', campaignName: 'Institucional SP - Max Performance', platform: 'Google Ads', clicks: 4800, impressions: 50000, ctr: 9.6, leads: 320, conversions: 42, spend: 9500, cpl: 29.68, cac: 226.19 },
      { campaignId: 'c2', campaignName: 'Campanha Lead Focado - Zona Sul', platform: 'Google Ads', clicks: 3800, impressions: 40000, ctr: 9.5, leads: 250, conversions: 32, spend: 6500, cpl: 26.0, cac: 203.12 },
      { campaignId: 'c3', campaignName: 'Conversão Família & Individual', platform: 'Meta Ads', clicks: 6500, impressions: 95000, ctr: 6.84, leads: 450, conversions: 58, spend: 10000, cpl: 22.22, cac: 172.41 },
      { campaignId: 'c4', campaignName: 'Remarketing - Fechamento Urgente', platform: 'Meta Ads', clicks: 2500, impressions: 35000, ctr: 7.14, leads: 230, conversions: 30, spend: 5000, cpl: 21.73, cac: 166.67 }
    ]
  },
  '2026-04': {
    summary: {
      month: '2026-04',
      monthLabel: 'Abril/2026',
      activeBeneficiaries: 3085,
      newBeneficiaries: 290,
      canceledBeneficiaries: 40,
      growthRate: 8.82,
      leads: 2200,
      conversions: 290,
      conversionRate: 13.18,
      cac: 279.31,
      ltv: 4320,
      totalRevenue: 370200,
      churnRate: 1.30
    },
    trafficSources: [
      { source: 'Google Ads', leads: 950, conversions: 125, conversionRate: 13.16, investment: 25000 },
      { source: 'Meta Ads', leads: 820, conversions: 108, conversionRate: 13.17, investment: 18000 },
      { source: 'Parcerias / Eventos', leads: 230, conversions: 38, conversionRate: 16.52, investment: 6000 },
      { source: 'Tráfego Orgânico', leads: 200, conversions: 19, conversionRate: 9.5, investment: 0 }
    ],
    acquisitionChannels: [
      { channel: 'Digital (Inbound)', channelType: 'digital', leads: 1770, conversions: 233, conversionRate: 13.16 },
      { channel: 'Venda Direta (Outbound)', channelType: 'direct', leads: 250, conversions: 33, conversionRate: 13.2 },
      { channel: 'Canais / Corretores', channelType: 'partners', leads: 180, conversions: 24, conversionRate: 13.33 }
    ] as any,
    cityDistribution: [
      { city: 'São Paulo', beneficiaries: 1210, leads: 880, conversions: 116 },
      { city: 'Campinas', beneficiaries: 635, leads: 500, conversions: 66 },
      { city: 'Santos', beneficiaries: 495, leads: 370, conversions: 49 },
      { city: 'São Bernardo', beneficiaries: 405, leads: 260, conversions: 34 },
      { city: 'Guarulhos', beneficiaries: 340, leads: 190, conversions: 25 }
    ],
    campaigns: [
      { campaignId: 'c1', campaignName: 'Institucional SP - Max Performance', platform: 'Google Ads', clicks: 5500, impressions: 55000, ctr: 10.0, leads: 380, conversions: 50, spend: 11000, cpl: 28.94, cac: 220.0 },
      { campaignId: 'c2', campaignName: 'Campanha Lead Focado - Zona Sul', platform: 'Google Ads', clicks: 4200, impressions: 42000, ctr: 10.0, leads: 290, conversions: 38, spend: 7500, cpl: 25.86, cac: 197.36 },
      { campaignId: 'c3', campaignName: 'Conversão Família & Individual', platform: 'Meta Ads', clicks: 7500, impressions: 100000, ctr: 7.5, leads: 520, conversions: 69, spend: 12000, cpl: 23.07, cac: 173.91 },
      { campaignId: 'c4', campaignName: 'Remarketing - Fechamento Urgente', platform: 'Meta Ads', clicks: 3000, impressions: 40000, ctr: 7.5, leads: 300, conversions: 39, spend: 6000, cpl: 20.0, cac: 153.84 }
    ]
  },
  '2026-05': {
    summary: {
      month: '2026-05',
      monthLabel: 'Maio/2026',
      activeBeneficiaries: 3360,
      newBeneficiaries: 320,
      canceledBeneficiaries: 45,
      growthRate: 8.91,
      leads: 2500,
      conversions: 320,
      conversionRate: 12.8,
      cac: 290.63,
      ltv: 4320,
      totalRevenue: 403200,
      churnRate: 1.34
    },
    trafficSources: [
      { source: 'Google Ads', leads: 1100, conversions: 140, conversionRate: 12.72, investment: 28000 },
      { source: 'Meta Ads', leads: 920, conversions: 118, conversionRate: 12.82, investment: 22000 },
      { source: 'Parcerias / Eventos', leads: 260, conversions: 42, conversionRate: 16.15, investment: 7000 },
      { source: 'Tráfego Orgânico', leads: 220, conversions: 20, conversionRate: 9.09, investment: 0 }
    ],
    acquisitionChannels: [
      { channel: 'Digital (Inbound)', channelType: 'digital', leads: 2020, conversions: 258, conversionRate: 12.77 },
      { channel: 'Venda Direta (Outbound)', channelType: 'direct', leads: 280, conversions: 36, conversionRate: 12.86 },
      { channel: 'Canais / Corretores', channelType: 'partners', leads: 200, conversions: 26, conversionRate: 13.0 }
    ] as any,
    cityDistribution: [
      { city: 'São Paulo', beneficiaries: 1315, leads: 980, conversions: 125 },
      { city: 'Campinas', beneficiaries: 690, leads: 580, conversions: 74 },
      { city: 'Santos', beneficiaries: 535, leads: 420, conversions: 54 },
      { city: 'São Bernardo', beneficiaries: 440, leads: 300, conversions: 39 },
      { city: 'Guarulhos', beneficiaries: 380, leads: 220, conversions: 28 }
    ],
    campaigns: [
      { campaignId: 'c1', campaignName: 'Institucional SP - Max Performance', platform: 'Google Ads', clicks: 6200, impressions: 60000, ctr: 10.33, leads: 430, conversions: 55, spend: 12500, cpl: 29.06, cac: 227.27 },
      { campaignId: 'c2', campaignName: 'Campanha Lead Focado - Zona Sul', platform: 'Google Ads', clicks: 4800, impressions: 45000, ctr: 10.67, leads: 340, conversions: 43, spend: 8500, cpl: 25.0, cac: 197.67 },
      { campaignId: 'c3', campaignName: 'Conversão Família & Individual', platform: 'Meta Ads', clicks: 8200, impressions: 110000, ctr: 7.45, leads: 570, conversions: 73, spend: 14000, cpl: 24.56, cac: 191.78 },
      { campaignId: 'c4', campaignName: 'Remarketing - Fechamento Urgente', platform: 'Meta Ads', clicks: 3500, impressions: 45000, ctr: 7.78, leads: 350, conversions: 45, spend: 8000, cpl: 22.85, cac: 177.78 }
    ]
  }
};
