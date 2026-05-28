import { MonthlyCategoryInvestment } from '../types/investments';
import { CityDistribution } from '../types/dashboard';

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Utilitário de validação estrita e tratamento de anomalias para dados carregados.
 * Garante segurança matemática, consistência lógica e validação de limites de negócio.
 */
export const validateUploadedData = (
  month: string,
  summaryInput: {
    activeBeneficiaries: number;
    newBeneficiaries: number;
    canceledBeneficiaries: number;
    leads: number;
    conversions: number;
    ltv?: number;
    nps?: number;
  },
  trafficInput: any[],
  channelsInput: any[],
  citiesInput: CityDistribution[],
  campaignsInput: any[],
  investmentsInput: MonthlyCategoryInvestment[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // 1. Validação de Mês
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    errors.push({
      field: 'month',
      message: 'O formato do mês deve ser estritamente YYYY-MM (ex: 2026-07).',
      type: 'error'
    });
  } else {
    const monthNum = parseInt(month.split('-')[1], 10);
    if (monthNum < 1 || monthNum > 12) {
      errors.push({
        field: 'month',
        message: 'O mês deve estar no intervalo de 01 a 12.',
        type: 'error'
      });
    }
  }

  // Helper para validar números não negativos
  const validateNonNegative = (val: number, name: string, field: string) => {
    if (typeof val !== 'number' || isNaN(val)) {
      errors.push({
        field,
        message: `O campo "${name}" deve ser um número válido.`,
        type: 'error'
      });
      return false;
    }
    if (val < 0) {
      errors.push({
        field,
        message: `O campo "${name}" não pode ser um número negativo (${val}).`,
        type: 'error'
      });
      return false;
    }
    return true;
  };

  // 2. Validação do Resumo (Summary)
  validateNonNegative(summaryInput.activeBeneficiaries, 'Beneficiários Ativos', 'activeBeneficiaries');
  validateNonNegative(summaryInput.newBeneficiaries, 'Novos Beneficiários (Vendas)', 'newBeneficiaries');
  validateNonNegative(summaryInput.canceledBeneficiaries, 'Beneficiários Cancelados', 'canceledBeneficiaries');
  validateNonNegative(summaryInput.leads, 'Total de Leads', 'leads');
  validateNonNegative(summaryInput.conversions, 'Total de Conversões', 'conversions');

  if (summaryInput.conversions > summaryInput.leads) {
    errors.push({
      field: 'conversions',
      message: `Consistência Lógica: As conversões (${summaryInput.conversions}) não podem ser maiores do que o número de leads (${summaryInput.leads}).`,
      type: 'error'
    });
  }

  if (summaryInput.nps !== undefined && summaryInput.nps !== null) {
    if (typeof summaryInput.nps !== 'number' || isNaN(summaryInput.nps)) {
      errors.push({
        field: 'nps',
        message: 'NPS deve ser um número válido.',
        type: 'error'
      });
    } else if (summaryInput.nps < -100 || summaryInput.nps > 100) {
      errors.push({
        field: 'nps',
        message: `NPS fora de escala: O score NPS deve estar entre -100 e 100. Valor informado: ${summaryInput.nps}.`,
        type: 'error'
      });
    }
  }

  // Alertas de Negócio (Warnings - não impedem upload)
  if (summaryInput.activeBeneficiaries === 0) {
    warnings.push({
      field: 'activeBeneficiaries',
      message: 'Alerta de Volume: O total de beneficiários ativos está zerado. Isso zerará o cálculo de Churn.',
      type: 'warning'
    });
  }

  if (summaryInput.newBeneficiaries === 0) {
    warnings.push({
      field: 'newBeneficiaries',
      message: 'Alerta de Vendas: Nenhuma nova venda (novos beneficiários) registrada. O CAC disparará para o infinito (será exibido como R$ 0).',
      type: 'warning'
    });
  }

  if (summaryInput.canceledBeneficiaries === 0) {
    warnings.push({
      field: 'canceledBeneficiaries',
      message: 'Fidelidade Máxima: Nenhum cancelamento registrado. Churn será computado como 0%!',
      type: 'warning'
    });
  }

  // 3. Validação de Tráfego
  trafficInput.forEach((t, idx) => {
    const prefix = `trafficInput[${idx}]`;
    if (!t.source) {
      errors.push({
        field: `${prefix}.source`,
        message: `Origem de Tráfego na posição ${idx + 1} precisa ter um nome válido.`,
        type: 'error'
      });
    }
    validateNonNegative(t.leads, `Leads da origem ${t.source || idx}`, `${prefix}.leads`);
    validateNonNegative(t.conversions, `Conversões da origem ${t.source || idx}`, `${prefix}.conversions`);
    
    if (t.conversions > t.leads) {
      errors.push({
        field: `${prefix}.conversions`,
        message: `Origem "${t.source}": Conversões (${t.conversions}) não podem superar leads (${t.leads}).`,
        type: 'error'
      });
    }
  });

  // 4. Validação de Canais
  channelsInput.forEach((c, idx) => {
    const prefix = `channelsInput[${idx}]`;
    if (!c.channel) {
      errors.push({
        field: `${prefix}.channel`,
        message: `Canal de Aquisição na posição ${idx + 1} precisa ter um nome válido.`,
        type: 'error'
      });
    }
    validateNonNegative(c.leads, `Leads do canal ${c.channel || idx}`, `${prefix}.leads`);
    validateNonNegative(c.conversions, `Conversões do canal ${c.channel || idx}`, `${prefix}.conversions`);
    
    if (c.conversions > c.leads) {
      errors.push({
        field: `${prefix}.conversions`,
        message: `Canal "${c.channel}": Conversões (${c.conversions}) não podem superar leads (${c.leads}).`,
        type: 'error'
      });
    }
  });

  // 5. Validação de Cidades
  let totalCityBeneficiaries = 0;
  citiesInput.forEach((cityItem, idx) => {
    const prefix = `citiesInput[${idx}]`;
    if (!cityItem.city) {
      errors.push({
        field: `${prefix}.city`,
        message: `Município na posição ${idx + 1} precisa de um nome válido.`,
        type: 'error'
      });
    }
    validateNonNegative(cityItem.beneficiaries, `Beneficiários em ${cityItem.city || idx}`, `${prefix}.beneficiaries`);
    validateNonNegative(cityItem.leads, `Leads em ${cityItem.city || idx}`, `${prefix}.leads`);
    validateNonNegative(cityItem.conversions, `Conversões em ${cityItem.city || idx}`, `${prefix}.conversions`);

    totalCityBeneficiaries += cityItem.beneficiaries || 0;
    
    if (cityItem.conversions > cityItem.leads) {
      errors.push({
        field: `${prefix}.conversions`,
        message: `Município "${cityItem.city}": Conversões (${cityItem.conversions}) não podem superar leads (${cityItem.leads}).`,
        type: 'error'
      });
    }
  });

  // Validação cruzada de beneficiários por cidade com o total geral
  if (totalCityBeneficiaries > 0 && Math.abs(totalCityBeneficiaries - summaryInput.activeBeneficiaries) > 0.05 * summaryInput.activeBeneficiaries) {
    warnings.push({
      field: 'citiesInput',
      message: `Divergência Regional: A soma dos beneficiários das cidades (${totalCityBeneficiaries}) diverge em mais de 5% do total consolidado ativo (${summaryInput.activeBeneficiaries}).`,
      type: 'warning'
    });
  }

  // 6. Validação de Campanhas
  campaignsInput.forEach((camp, idx) => {
    const prefix = `campaignsInput[${idx}]`;
    if (!camp.campaignName) {
      errors.push({
        field: `${prefix}.campaignName`,
        message: `Campanha na posição ${idx + 1} precisa ter um nome válido.`,
        type: 'error'
      });
    }
    validateNonNegative(camp.impressions, `Impressões na campanha ${camp.campaignName || idx}`, `${prefix}.impressions`);
    validateNonNegative(camp.clicks, `Cliques na campanha ${camp.campaignName || idx}`, `${prefix}.clicks`);
    validateNonNegative(camp.leads, `Leads na campanha ${camp.campaignName || idx}`, `${prefix}.leads`);
    validateNonNegative(camp.conversions, `Conversões na campanha ${camp.campaignName || idx}`, `${prefix}.conversions`);
    validateNonNegative(camp.spend, `Investimento na campanha ${camp.campaignName || idx}`, `${prefix}.spend`);

    if (camp.clicks > camp.impressions) {
      errors.push({
        field: `${prefix}.clicks`,
        message: `Campanha "${camp.campaignName}": Cliques (${camp.clicks}) excedem impressões (${camp.impressions}).`,
        type: 'error'
      });
    }
    
    if (camp.conversions > camp.leads) {
      errors.push({
        field: `${prefix}.conversions`,
        message: `Campanha "${camp.campaignName}": Conversões (${camp.conversions}) excedem leads (${camp.leads}).`,
        type: 'error'
      });
    }
  });

  // 7. Validação de Investimentos
  let totalInvestedCategory = 0;
  investmentsInput.forEach((inv, idx) => {
    const prefix = `investmentsInput[${idx}]`;
    if (!inv.categoryId) {
      errors.push({
        field: `${prefix}.categoryId`,
        message: `Categoria de investimento na posição ${idx + 1} requer identificador válido.`,
        type: 'error'
      });
    }
    validateNonNegative(inv.amount, `Valor na categoria ${inv.categoryId || idx}`, `${prefix}.amount`);
    totalInvestedCategory += inv.amount || 0;
  });

  if (totalInvestedCategory === 0) {
    warnings.push({
      field: 'investmentsInput',
      message: 'Custo Zero: O somatório dos investimentos detalhados é R$ 0,00.',
      type: 'warning'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Trata divisões matemáticas sensíveis para evitar NaN ou Infinity
 */
export const safeDivide = (numerator: number, denominator: number): number => {
  if (!denominator || denominator === 0 || isNaN(denominator) || isNaN(numerator)) {
    return 0;
  }
  return numerator / denominator;
};
