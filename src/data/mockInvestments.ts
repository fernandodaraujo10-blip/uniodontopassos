import { InvestmentPayload, InvestmentCategory } from '../types/investments';

export const mockInvestmentCategories: InvestmentCategory[] = [
  { id: 'offline_radio_vida', name: 'Rádio Vida (Passos)', type: 'marketing' },
  { id: 'offline_radio_itau', name: 'Rádio (Itaú de Minas)', type: 'marketing' },
  { id: 'offline_radio_paraiso', name: 'Rádio (S. S. Paraíso)', type: 'marketing' },
  { id: 'offline_radio_cassia', name: 'Rádio (Cássia)', type: 'marketing' },
  { id: 'offline_jornal', name: 'Jornal (Folha da Manhã)', type: 'marketing' },
  { id: 'offline_led', name: 'Telão/Painel LED (Paraíso)', type: 'marketing' },
  { id: 'online_meta', name: 'Meta (Facebook/Instagram)', type: 'marketing' },
  { id: 'online_google', name: 'Google Ads', type: 'marketing' },
  { id: 'marketing_agency', name: 'Agencia de Marketing', type: 'marketing' },
  { id: 'tools_rd_station', name: 'RD Station (Mkt e Conversas)', type: 'sales' },
  { id: 'tools_rd_conversas', name: 'RD Conversas', type: 'sales' },
  { id: 'tools_rd_marketing', name: 'RD Marketing', type: 'sales' },
  { id: 'tools_rd_crm', name: 'RD CRM', type: 'sales' },
  { id: 'tools_fertaise', name: 'FerTaise', type: 'sales' }
];

const mockHistoricalInvestments = [
  { categoryId: 'offline_radio_vida', amount: 1750.00 },
  { categoryId: 'offline_radio_itau', amount: 240.00 },
  { categoryId: 'offline_radio_paraiso', amount: 79.00 },
  { categoryId: 'offline_radio_cassia', amount: 271.00 },
  { categoryId: 'offline_jornal', amount: 120.18 },
  { categoryId: 'offline_led', amount: 400.00 },
  { categoryId: 'online_meta', amount: 1242.00 },
  { categoryId: 'online_google', amount: 800.00 },
  { categoryId: 'marketing_agency', amount: 2000.00 },
  { categoryId: 'tools_rd_station', amount: 1121.00 },
  { categoryId: 'tools_rd_conversas', amount: 2087.28 },
  { categoryId: 'tools_rd_marketing', amount: 1121.00 },
  { categoryId: 'tools_rd_crm', amount: 786.00 },
  { categoryId: 'tools_fertaise', amount: 2000.00 }
];

export const mockInvestmentsData: InvestmentPayload = {
  categories: mockInvestmentCategories,
  monthlyDetails: {
    '2026-01': {
      month: '2026-01',
      investments: [...mockHistoricalInvestments],
      totalMarketing: 6902.18,
      totalSales: 7115.28,
      totalOperational: 0,
      totalAmount: 14017.46
    },
    '2026-02': {
      month: '2026-02',
      investments: [...mockHistoricalInvestments],
      totalMarketing: 6902.18,
      totalSales: 7115.28,
      totalOperational: 0,
      totalAmount: 14017.46
    },
    '2026-03': {
      month: '2026-03',
      investments: [...mockHistoricalInvestments],
      totalMarketing: 6902.18,
      totalSales: 7115.28,
      totalOperational: 0,
      totalAmount: 14017.46
    },
    '2026-04': {
      month: '2026-04',
      investments: [...mockHistoricalInvestments],
      totalMarketing: 6902.18,
      totalSales: 7115.28,
      totalOperational: 0,
      totalAmount: 14017.46
    },
    '2026-05': {
      month: '2026-05',
      investments: [...mockHistoricalInvestments],
      totalMarketing: 6902.18,
      totalSales: 7115.28,
      totalOperational: 0,
      totalAmount: 14017.46
    },
    '2026-06': {
      month: '2026-06',
      investments: [
        { categoryId: 'offline_radio_vida', amount: 613.32 },
        { categoryId: 'offline_radio_itau', amount: 0 },
        { categoryId: 'offline_radio_paraiso', amount: 0 },
        { categoryId: 'offline_radio_cassia', amount: 0 },
        { categoryId: 'offline_jornal', amount: 0 },
        { categoryId: 'offline_led', amount: 0 },
        { categoryId: 'online_meta', amount: 3200.00 },
        { categoryId: 'online_google', amount: 4200.00 },
        { categoryId: 'marketing_agency', amount: 0 },
        { categoryId: 'tools_rd_station', amount: 2300.00 },
        { categoryId: 'tools_rd_conversas', amount: 2486.68 },
        { categoryId: 'tools_rd_marketing', amount: 0 },
        { categoryId: 'tools_rd_crm', amount: 0 },
        { categoryId: 'tools_fertaise', amount: 0 }
      ],
      totalMarketing: 8013.32,
      totalSales: 4786.68,
      totalOperational: 0,
      totalAmount: 12800.00
    }
  }
};
