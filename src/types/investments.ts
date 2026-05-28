export type InvestmentType = 'marketing' | 'sales' | 'operational';

export interface InvestmentCategory {
  id: string;
  name: string; // Ex: 'Google Ads', 'Meta Ads', 'Comissões', 'Eventos', 'SDR/CRM Tools'
  type: InvestmentType;
}

export interface MonthlyCategoryInvestment {
  categoryId: string;
  amount: number;
}

export interface MonthlyInvestmentDetail {
  month: string; // Formato 'YYYY-MM'
  investments: MonthlyCategoryInvestment[];
  totalMarketing: number;
  totalSales: number;
  totalOperational: number;
  totalAmount: number;
}

export interface InvestmentPayload {
  categories: InvestmentCategory[];
  monthlyDetails: {
    [month: string]: MonthlyInvestmentDetail;
  };
}
