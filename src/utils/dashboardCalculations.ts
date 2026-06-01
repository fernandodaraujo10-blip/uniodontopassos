import { safeDivide } from './dataValidator';
import { MonthlyCategoryInvestment, InvestmentCategory } from '../types/investments';

export const calcularTaxaConversao = (conversions: number, leads: number): number => {
  return safeDivide(conversions, leads) * 100;
};

export const calcularCAC = (totalAmount: number, newBeneficiaries: number): number => {
  return safeDivide(totalAmount, newBeneficiaries);
};

export const calcularChurn = (canceledBeneficiaries: number, activeBeneficiaries: number): number => {
  return safeDivide(canceledBeneficiaries, activeBeneficiaries) * 100;
};

export const calcularLTV = (ticketMedio: number, churnRate: number, inputLtv?: number): number => {
  return inputLtv || (ticketMedio * safeDivide(1, churnRate / 100 || 0.01));
};

export const processarInvestimentos = (
  investmentsInput: MonthlyCategoryInvestment[],
  categories: InvestmentCategory[]
) => {
  let totalMarketing = 0;
  let totalSales = 0;
  let totalOperational = 0;

  investmentsInput.forEach(inv => {
    const cat = categories.find(c => c.id === inv.categoryId);
    if (cat) {
      if (cat.type === 'marketing') totalMarketing += inv.amount;
      else if (cat.type === 'sales') totalSales += inv.amount;
      else if (cat.type === 'operational') totalOperational += inv.amount;
    }
  });

  const totalAmount = totalMarketing + totalSales + totalOperational;

  return {
    totalMarketing,
    totalSales,
    totalOperational,
    totalAmount
  };
};

export const formatarMonthLabel = (month: string): string => {
  const parts = month.split('-');
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const monthsNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return `${monthsNames[monthIndex]}/${year}`;
};
