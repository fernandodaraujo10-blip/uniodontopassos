import { InvestmentPayload, InvestmentCategory } from '../types/investments';

export const mockInvestmentCategories: InvestmentCategory[] = [
  { id: 'marketing_google', name: 'Google Ads', type: 'marketing' },
  { id: 'marketing_meta', name: 'Meta Ads', type: 'marketing' },
  { id: 'marketing_events', name: 'Eventos & Feiras', type: 'marketing' },
  { id: 'sales_commissions', name: 'Comissões de Corretores', type: 'sales' },
  { id: 'sales_tools', name: 'SDR/CRM & Ferramentas', type: 'sales' },
  { id: 'sales_team', name: 'Equipe de SDR/Vendas', type: 'sales' }
];

export const mockInvestmentsData: InvestmentPayload = {
  categories: mockInvestmentCategories,
  monthlyDetails: {
    '2026-01': {
      month: '2026-01',
      investments: [
        { categoryId: 'marketing_google', amount: 15000 },
        { categoryId: 'marketing_meta', amount: 12000 },
        { categoryId: 'marketing_events', amount: 3000 },
        { categoryId: 'sales_commissions', amount: 8000 },
        { categoryId: 'sales_tools', amount: 2500 },
        { categoryId: 'sales_team', amount: 14000 }
      ],
      totalMarketing: 30000,
      totalSales: 24500,
      totalOperational: 0,
      totalAmount: 54500
    },
    '2026-02': {
      month: '2026-02',
      investments: [
        { categoryId: 'marketing_google', amount: 18000 },
        { categoryId: 'marketing_meta', amount: 13500 },
        { categoryId: 'marketing_events', amount: 4000 },
        { categoryId: 'sales_commissions', amount: 9500 },
        { categoryId: 'sales_tools', amount: 2500 },
        { categoryId: 'sales_team', amount: 14500 }
      ],
      totalMarketing: 35500,
      totalSales: 26500,
      totalOperational: 0,
      totalAmount: 62000
    },
    '2026-03': {
      month: '2026-03',
      investments: [
        { categoryId: 'marketing_google', amount: 21000 },
        { categoryId: 'marketing_meta', amount: 15000 },
        { categoryId: 'marketing_events', amount: 5000 },
        { categoryId: 'sales_commissions', amount: 11000 },
        { categoryId: 'sales_tools', amount: 3000 },
        { categoryId: 'sales_team', amount: 15000 }
      ],
      totalMarketing: 41000,
      totalSales: 29000,
      totalOperational: 0,
      totalAmount: 70000
    },
    '2026-04': {
      month: '2026-04',
      investments: [
        { categoryId: 'marketing_google', amount: 25000 },
        { categoryId: 'marketing_meta', amount: 18000 },
        { categoryId: 'marketing_events', amount: 6000 },
        { categoryId: 'sales_commissions', amount: 13000 },
        { categoryId: 'sales_tools', amount: 3000 },
        { categoryId: 'sales_team', amount: 16000 }
      ],
      totalMarketing: 49000,
      totalSales: 32000,
      totalOperational: 0,
      totalAmount: 81000
    },
    '2026-05': {
      month: '2026-05',
      investments: [
        { categoryId: 'marketing_google', amount: 28000 },
        { categoryId: 'marketing_meta', amount: 22000 },
        { categoryId: 'marketing_events', amount: 7000 },
        { categoryId: 'sales_commissions', amount: 15000 },
        { categoryId: 'sales_tools', amount: 3500 },
        { categoryId: 'sales_team', amount: 17500 }
      ],
      totalMarketing: 57000,
      totalSales: 36000,
      totalOperational: 0,
      totalAmount: 93000
    }
  }
};
