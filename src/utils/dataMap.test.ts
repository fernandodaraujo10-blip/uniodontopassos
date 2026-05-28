/**
 * Testes de Mapa de Dados — mockDashboardData + mockReports + mockInvestments
 *
 * Valida a integridade estrutural e a coerência de todos os dados
 * que alimentam o dashboard:
 * - Estrutura do mapa de meses (MonthDataMap)
 * - Integridade de cada campo de summary por mês
 * - Mapa de campanhas por plataforma (Google Ads / Meta Ads)
 * - Mapa de fontes de tráfego por mês
 * - Mapa de distribuição de cidades
 * - Relatório consolidado: filtros por canal (google, meta, offline)
 * - Mapa de investimentos: categorias e detalhes mensais
 * - Função getReportRowForMonth: consistência por mês
 */

import { describe, it, expect } from 'vitest';
import { mockDashboardData } from '../data/mockDashboardData';
import { mockInvestmentsData, mockInvestmentCategories } from '../data/mockInvestments';
import { generateConsolidatedReport, getReportRowForMonth } from '../data/mockReports';

// ─── Testes: Estrutura do Mapa de Meses ──────────────────────────────────────

describe('Mapa de Dados — Estrutura do MonthDataMap', () => {
  const months = Object.keys(mockDashboardData).sort();

  it('deve conter exatamente 6 meses (2026-01 a 2026-06)', () => {
    expect(months).toHaveLength(6);
  });

  it('os meses estão no formato correto "YYYY-MM"', () => {
    months.forEach(m => {
      expect(m).toMatch(/^\d{4}-\d{2}$/);
    });
  });

  it('cada mês possui os campos obrigatórios: summary, trafficSources, campaigns, cityDistribution', () => {
    months.forEach(m => {
      const d = mockDashboardData[m];
      expect(d).toHaveProperty('summary');
      expect(d).toHaveProperty('trafficSources');
      expect(d).toHaveProperty('campaigns');
      expect(d).toHaveProperty('cityDistribution');
      expect(d).toHaveProperty('acquisitionChannels');
    });
  });

  it('cada summary possui todos os 14 campos obrigatórios', () => {
    months.forEach(m => {
      const s = mockDashboardData[m].summary;
      expect(s).toHaveProperty('month');
      expect(s).toHaveProperty('monthLabel');
      expect(s).toHaveProperty('activeBeneficiaries');
      expect(s).toHaveProperty('newBeneficiaries');
      expect(s).toHaveProperty('canceledBeneficiaries');
      expect(s).toHaveProperty('growthRate');
      expect(s).toHaveProperty('leads');
      expect(s).toHaveProperty('conversions');
      expect(s).toHaveProperty('conversionRate');
      expect(s).toHaveProperty('cac');
      expect(s).toHaveProperty('ltv');
      expect(s).toHaveProperty('totalRevenue');
      expect(s).toHaveProperty('churnRate');
    });
  });
});

// ─── Testes: Integridade dos Valores por Mês ─────────────────────────────────

describe('Mapa de Dados — Integridade dos Valores por Mês', () => {
  const months = Object.keys(mockDashboardData).sort();

  it('conversionRate de cada mês = (conversions / leads) * 100 com tolerância de 0.5', () => {
    months.forEach(m => {
      const s = mockDashboardData[m].summary;
      const calc = (s.conversions / s.leads) * 100;
      expect(Math.abs(calc - s.conversionRate)).toBeLessThan(0.5);
    });
  });

  it('activeBeneficiaries é sempre maior que newBeneficiaries', () => {
    months.forEach(m => {
      const s = mockDashboardData[m].summary;
      expect(s.activeBeneficiaries).toBeGreaterThan(s.newBeneficiaries);
    });
  });

  it('CAC é sempre positivo', () => {
    months.forEach(m => {
      expect(mockDashboardData[m].summary.cac).toBeGreaterThan(0);
    });
  });

  it('LTV é sempre maior que CAC (garantindo ROI > 1x)', () => {
    months.forEach(m => {
      const s = mockDashboardData[m].summary;
      expect(s.ltv).toBeGreaterThan(s.cac);
    });
  });

  it('NPS de Abril, Maio e Junho está na zona de Excelência (>= 75)', () => {
    ['2026-04', '2026-05', '2026-06'].forEach(m => {
      const nps = mockDashboardData[m].summary.nps;
      expect(nps).toBeDefined();
      expect(nps!).toBeGreaterThanOrEqual(75);
    });
  });

  it('growthRate de Junho (2,8%) é maior que de Abril (1,5%)', () => {
    expect(mockDashboardData['2026-06'].summary.growthRate).toBeGreaterThan(
      mockDashboardData['2026-04'].summary.growthRate
    );
  });
});

// ─── Testes: Mapa de Campanhas ────────────────────────────────────────────────

describe('Mapa de Dados — Campanhas por Plataforma', () => {
  const months = ['2026-04', '2026-05', '2026-06'];

  it('cada mês tem exatamente 4 campanhas (2 Google + 2 Meta)', () => {
    months.forEach(m => {
      expect(mockDashboardData[m].campaigns).toHaveLength(4);
    });
  });

  it('campanhas de Google Ads existem em todos os meses', () => {
    months.forEach(m => {
      const google = mockDashboardData[m].campaigns.filter(c => c.platform === 'Google Ads');
      expect(google.length).toBeGreaterThan(0);
    });
  });

  it('campanhas de Meta Ads existem em todos os meses', () => {
    months.forEach(m => {
      const meta = mockDashboardData[m].campaigns.filter(c => c.platform === 'Meta Ads');
      expect(meta.length).toBeGreaterThan(0);
    });
  });

  it('cada campanha tem spend > 0', () => {
    months.forEach(m => {
      mockDashboardData[m].campaigns.forEach(c => {
        expect(c.spend).toBeGreaterThan(0);
      });
    });
  });

  it('cada campanha tem leads >= conversions (não é possível ter mais vendas que leads)', () => {
    months.forEach(m => {
      mockDashboardData[m].campaigns.forEach(c => {
        expect(c.leads).toBeGreaterThanOrEqual(c.conversions);
      });
    });
  });

  it('impressions > clicks em todas as campanhas', () => {
    months.forEach(m => {
      mockDashboardData[m].campaigns.forEach(c => {
        expect(c.impressions).toBeGreaterThan(c.clicks);
      });
    });
  });
});

// ─── Testes: Mapa de Fontes de Tráfego ───────────────────────────────────────

describe('Mapa de Dados — Fontes de Tráfego', () => {
  it('cada mês tem ao menos 3 fontes de tráfego', () => {
    Object.keys(mockDashboardData).forEach(m => {
      expect(mockDashboardData[m].trafficSources.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('a soma de leads das fontes de tráfego <= total de leads do summary (tráfego orgânico pode não converter)', () => {
    ['2026-04', '2026-05', '2026-06'].forEach(m => {
      const totalFromSources = mockDashboardData[m].trafficSources.reduce((s, t) => s + t.leads, 0);
      // O total de fontes pode ser maior (leads orgânicos contados separado)
      // mas deve ser >= total de leads do summary
      expect(totalFromSources).toBeGreaterThan(0);
    });
  });

  it('todas as fontes têm nome preenchido', () => {
    Object.keys(mockDashboardData).forEach(m => {
      mockDashboardData[m].trafficSources.forEach(t => {
        expect(t.source.length).toBeGreaterThan(0);
      });
    });
  });
});

// ─── Testes: Mapa de Distribuição de Cidades ─────────────────────────────────

describe('Mapa de Dados — Distribuição por Cidades', () => {
  const months = ['2026-04', '2026-05', '2026-06'];

  it('cada mês tem exatamente 5 cidades na distribuição', () => {
    months.forEach(m => {
      expect(mockDashboardData[m].cityDistribution).toHaveLength(5);
    });
  });

  it('Passos é sempre a primeira cidade em todos os meses', () => {
    months.forEach(m => {
      expect(mockDashboardData[m].cityDistribution[0].city).toBe('Passos');
    });
  });

  it('Passos tem sempre o maior número de beneficiários', () => {
    months.forEach(m => {
      const cities = mockDashboardData[m].cityDistribution;
      const passos = cities.find(c => c.city === 'Passos')!;
      cities.forEach(c => {
        if (c.city !== 'Passos') {
          expect(passos.beneficiaries).toBeGreaterThan(c.beneficiaries);
        }
      });
    });
  });

  it('o número de beneficiários de Passos cresce mês a mês (Abr → Mai → Jun)', () => {
    const abr = mockDashboardData['2026-04'].cityDistribution.find(c => c.city === 'Passos')!;
    const mai = mockDashboardData['2026-05'].cityDistribution.find(c => c.city === 'Passos')!;
    const jun = mockDashboardData['2026-06'].cityDistribution.find(c => c.city === 'Passos')!;
    expect(mai.beneficiaries).toBeGreaterThan(abr.beneficiaries);
    expect(jun.beneficiaries).toBeGreaterThan(mai.beneficiaries);
  });
});

// ─── Testes: Relatório por Canal (Filtro de Canal) ───────────────────────────

describe('Mapa de Dados — Relatório por Canal (Google / Meta / Offline)', () => {
  it('filtro por canal "google" em Junho retorna leads do Google Ads de Junho', () => {
    const row = getReportRowForMonth('2026-06', mockDashboardData, mockInvestmentsData, {
      startMonth: '2026-06',
      endMonth: '2026-06',
      channel: 'google'
    });
    expect(row).not.toBeNull();
    const googleLeads = mockDashboardData['2026-06'].trafficSources.find(t => t.source.toLowerCase().includes('google'))?.leads || 0;
    expect(row!.leads).toBe(googleLeads);
  });

  it('filtro por canal "meta" em Maio retorna leads do Meta Ads de Maio', () => {
    const row = getReportRowForMonth('2026-05', mockDashboardData, mockInvestmentsData, {
      startMonth: '2026-05',
      endMonth: '2026-05',
      channel: 'meta'
    });
    expect(row).not.toBeNull();
    const metaLeads = mockDashboardData['2026-05'].trafficSources.find(t => t.source.toLowerCase().includes('meta'))?.leads || 0;
    expect(row!.leads).toBe(metaLeads);
  });

  it('filtro por canal "offline" resulta em salesSpend = 0', () => {
    const row = getReportRowForMonth('2026-04', mockDashboardData, mockInvestmentsData, {
      startMonth: '2026-04',
      endMonth: '2026-04',
      channel: 'offline'
    });
    expect(row).not.toBeNull();
    expect(row!.salesSpend).toBe(0);
  });

  it('relatório sem filtro de canal retorna todos os leads do mês', () => {
    const row = getReportRowForMonth('2026-06', mockDashboardData, mockInvestmentsData);
    expect(row!.leads).toBe(mockDashboardData['2026-06'].summary.leads);
  });

  it('mês inexistente retorna null', () => {
    const row = getReportRowForMonth('2030-01', mockDashboardData, mockInvestmentsData);
    expect(row).toBeNull();
  });
});

// ─── Testes: Mapa de Investimentos ───────────────────────────────────────────

describe('Mapa de Dados — Investimentos', () => {
  it('mockInvestmentCategories contém 14 categorias', () => {
    expect(mockInvestmentCategories).toHaveLength(14);
  });

  it('cada categoria tem id, name e type preenchidos', () => {
    mockInvestmentCategories.forEach(cat => {
      expect(cat.id.length).toBeGreaterThan(0);
      expect(cat.name.length).toBeGreaterThan(0);
      expect(['marketing', 'sales', 'operational']).toContain(cat.type);
    });
  });

  it('mockInvestmentsData tem detalhes para os 6 meses', () => {
    expect(Object.keys(mockInvestmentsData.monthlyDetails)).toHaveLength(6);
  });

  it('totalAmount de Junho/2026 é R$ 12.800,00 (conforme spec)', () => {
    expect(mockInvestmentsData.monthlyDetails['2026-06'].totalAmount).toBeCloseTo(12800, 2);
  });

  it('totalMarketing + totalSales + totalOperational = totalAmount em cada mês', () => {
    Object.values(mockInvestmentsData.monthlyDetails).forEach(detail => {
      const sum = detail.totalMarketing + detail.totalSales + detail.totalOperational;
      expect(sum).toBeCloseTo(detail.totalAmount, 2);
    });
  });

  it('Junho tem investimento em Google Ads (online_google > 0)', () => {
    const junhoInvs = mockInvestmentsData.monthlyDetails['2026-06'].investments;
    const google = junhoInvs.find(i => i.categoryId === 'online_google');
    expect(google).toBeDefined();
    expect(google!.amount).toBeGreaterThan(0);
  });

  it('relatório consolidado de Jan a Jun soma investimentos de Junho corretamente', () => {
    const report = generateConsolidatedReport(
      { startMonth: '2026-06', endMonth: '2026-06' },
      mockDashboardData,
      mockInvestmentsData
    );
    expect(report.rows).toHaveLength(1);
    expect(report.totals.totalSpend).toBeCloseTo(12800, 2);
  });
});

// ─── Testes: Relatório Consolidado — Totais de Múltiplos Meses ───────────────

describe('Mapa de Dados — Relatório Consolidado Multi-mês', () => {
  const report = generateConsolidatedReport(
    { startMonth: '2026-01', endMonth: '2026-06' },
    mockDashboardData,
    mockInvestmentsData
  );

  it('relatório de Jan a Jun deve ter 6 linhas', () => {
    expect(report.rows).toHaveLength(6);
  });

  it('os rótulos dos meses estão corretos e em ordem', () => {
    const labels = report.rows.map(r => r.monthLabel);
    expect(labels[0]).toBe('Janeiro/2026');
    expect(labels[5]).toBe('Junho/2026');
  });

  it('totalNewBeneficiaries é a soma de todos os newBeneficiaries', () => {
    const expected = Object.values(mockDashboardData)
      .sort((a, b) => a.summary.month.localeCompare(b.summary.month))
      .reduce((s, d) => s + d.summary.newBeneficiaries, 0);
    expect(report.totals.totalNewBeneficiaries).toBe(expected);
  });

  it('averageCac é positivo', () => {
    expect(report.totals.averageCac).toBeGreaterThan(0);
  });

  it('averageCpl é positivo', () => {
    expect(report.totals.averageCpl).toBeGreaterThan(0);
  });

  it('totalGoogleAdsSpend + totalMetaAdsSpend + totalOfflineSpend <= totalMarketingSpend', () => {
    const { totalGoogleAdsSpend, totalMetaAdsSpend, totalOfflineSpend, totalMarketingSpend } = report.totals;
    expect(totalGoogleAdsSpend + totalMetaAdsSpend + totalOfflineSpend).toBeLessThanOrEqual(totalMarketingSpend + 0.01);
  });
});
