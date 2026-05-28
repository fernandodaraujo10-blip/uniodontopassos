/**
 * Testes Unitários: dashboardAdapter.ts
 * 
 * Valida a precisão matemática e a consistência dos dados
 * convertidos para os meses de Abril, Maio e Junho de 2026,
 * conforme especificado em docs/qa-checklist.md (seção 3).
 */

import { describe, it, expect } from 'vitest';
import {
  formatarNumero,
  formatarMoeda,
  formatarPorcentagem,
  formatarMilharMoeda,
  adaptModernToLegacy,
} from './dashboardAdapter';
import { mockDashboardData } from '../data/mockDashboardData';

// ─── Testes: Funções de Formatação ────────────────────────────────────────────

describe('Formatação Regional pt-BR', () => {
  it('formatarNumero: formata números com separadores de milhar', () => {
    expect(formatarNumero(10289)).toBe('10.289');
    expect(formatarNumero(1000)).toBe('1.000');
    expect(formatarNumero(42)).toBe('42');
  });

  it('formatarMoeda: formata valores monetários em BRL', () => {
    expect(formatarMoeda(295)).toContain('295');
    expect(formatarMoeda(11500)).toContain('11.500');
    const result = formatarMoeda(283.69);
    expect(result).toContain('283');
  });

  it('formatarPorcentagem: formata com uma casa decimal e símbolo %', () => {
    expect(formatarPorcentagem(11.8)).toBe('11,8%');
    expect(formatarPorcentagem(12.4)).toBe('12,4%');
    expect(formatarPorcentagem(13.1)).toBe('13,1%');
  });

  it('formatarMilharMoeda: abrevia valores >= 1000 com "mil"', () => {
    expect(formatarMilharMoeda(12100)).toBe('R$ 12,1 mil');
    expect(formatarMilharMoeda(12500)).toBe('R$ 12,5 mil');
    expect(formatarMilharMoeda(14000)).toBe('R$ 14,0 mil');
    expect(formatarMilharMoeda(999)).not.toContain('mil');
  });
});

// ─── Testes: Abril de 2026 ────────────────────────────────────────────────────

describe('Dados de Abril/2026 (QA Spec §3)', () => {
  const abril = mockDashboardData['2026-04'];
  const marco = mockDashboardData['2026-03'];
  const data = adaptModernToLegacy(abril, marco);

  it('Beneficiários: total = 10.289', () => {
    expect(data.beneficiarios.total).toBe('10.289');
  });

  it('Beneficiários: novos = 35', () => {
    expect(data.beneficiarios.novos).toBe('35');
  });

  it('Beneficiários: cancelados = 15', () => {
    expect(data.beneficiarios.cancelados).toBe('15');
  });

  it('Beneficiários: PJ = 95%, PF = 5% (mês != maio)', () => {
    expect(data.beneficiarios.pjPercent).toBe(95);
    expect(data.beneficiarios.pfPercent).toBe(5);
  });

  it('Leads: total = 132', () => {
    expect(data.leads.total).toBe('132');
  });

  it('Leads: google ≈ 45% (dos 60 leads de Google / 132 total)', () => {
    const googlePct = data.leads.origemInt.google;
    expect(googlePct).toBe(45); // 60/132 = 45%
  });

  it('Conversões: taxa = 11,8%', () => {
    expect(data.conversoes.taxa).toBe('11,8%');
  });

  it('Conversões: vendas = 15', () => {
    expect(data.conversoes.vendas).toBe('15');
  });

  it('ROI: CAC = R$ 934,50', () => {
    expect(data.roi.cac).toContain('934');
  });

  it('ROI: LTV = R$ 1.120,00', () => {
    expect(data.roi.ltv).toContain('1.120');
  });

  it('NPS: score = 76', () => {
    expect(data.nps.total).toBe('76');
  });

  it('NPS: classificação = Excelência (>= 75)', () => {
    expect(data.nps.status).toBe('Excelência');
  });

  it('Timestamp: indica mês de Abril', () => {
    expect(data.timestamp).toContain('04/2026');
  });
});

// ─── Testes: Maio de 2026 ─────────────────────────────────────────────────────

describe('Dados de Maio/2026 (QA Spec §3)', () => {
  const maio = mockDashboardData['2026-05'];
  const abril = mockDashboardData['2026-04'];
  const data = adaptModernToLegacy(maio, abril);

  it('Beneficiários: total = 10.289', () => {
    expect(data.beneficiarios.total).toBe('10.289');
  });

  it('Beneficiários: novos = 42', () => {
    expect(data.beneficiarios.novos).toBe('42');
  });

  it('Beneficiários: cancelados = 18', () => {
    expect(data.beneficiarios.cancelados).toBe('18');
  });

  it('Beneficiários: PF = 59%, PJ = 41% (regra exclusiva de Maio)', () => {
    expect(data.beneficiarios.pfPercent).toBe(59);
    expect(data.beneficiarios.pjPercent).toBe(41);
  });

  it('Leads: total = 145', () => {
    expect(data.leads.total).toBe('145');
  });

  it('Conversões: taxa = 12,4%', () => {
    expect(data.conversoes.taxa).toBe('12,4%');
  });

  it('Conversões: vendas = 18', () => {
    expect(data.conversoes.vendas).toBe('18');
  });

  it('ROI: fator = 1,5x (LTV 1190 / CAC 778.75)', () => {
    const factor = 1190.0 / 778.75;
    expect(data.roi.total).toBe(`${factor.toFixed(1).replace('.', ',')}x`);
  });

  it('ROI: CAC = R$ 778,75', () => {
    expect(data.roi.cac).toContain('778');
  });

  it('ROI: LTV = R$ 1.190,00', () => {
    expect(data.roi.ltv).toContain('1.190');
  });

  it('NPS: score = 78', () => {
    expect(data.nps.total).toBe('78');
  });

  it('NPS: classificação = Excelência (>= 75)', () => {
    expect(data.nps.status).toBe('Excelência');
  });
});

// ─── Testes: Junho de 2026 ────────────────────────────────────────────────────

describe('Dados de Junho/2026 (QA Spec §3)', () => {
  const junho = mockDashboardData['2026-06'];
  const maio = mockDashboardData['2026-05'];
  const data = adaptModernToLegacy(junho, maio);

  it('Beneficiários: total = 10.320', () => {
    expect(data.beneficiarios.total).toBe('10.320');
  });

  it('Beneficiários: novos = 55', () => {
    expect(data.beneficiarios.novos).toBe('55');
  });

  it('Beneficiários: cancelados = 24', () => {
    expect(data.beneficiarios.cancelados).toBe('24');
  });

  it('Beneficiários: PJ = 95%, PF = 5% (mês != maio)', () => {
    expect(data.beneficiarios.pjPercent).toBe(95);
    expect(data.beneficiarios.pfPercent).toBe(5);
  });

  it('Leads: total = 160', () => {
    expect(data.leads.total).toBe('160');
  });

  it('Conversões: taxa = 13,1%', () => {
    expect(data.conversoes.taxa).toBe('13,1%');
  });

  it('Conversões: vendas = 21', () => {
    expect(data.conversoes.vendas).toBe('21');
  });

  it('ROI: fator = 4,5x (LTV 1220 / CAC 272)', () => {
    const factor = 1220.0 / 272.0;
    expect(data.roi.total).toBe(`${factor.toFixed(1).replace('.', ',')}x`);
  });

  it('ROI: CAC = R$ 272,00', () => {
    expect(data.roi.cac).toContain('272');
  });

  it('ROI: LTV = R$ 1.220,00', () => {
    expect(data.roi.ltv).toContain('1.220');
  });

  it('NPS: score = 80', () => {
    expect(data.nps.total).toBe('80');
  });

  it('NPS: classificação = Excelência (>= 75)', () => {
    expect(data.nps.status).toBe('Excelência');
  });
});

// ─── Testes: Funil de Conversão ────────────────────────────────────────────────

describe('Funil de Conversão - Cálculos Derivados', () => {
  const junho = mockDashboardData['2026-06'];
  const maio = mockDashboardData['2026-05'];
  const data = adaptModernToLegacy(junho, maio);

  it('Funil: campo impressoes deve ser preenchido', () => {
    expect(data.funil.impressoes).toBeTruthy();
    expect(data.funil.impressoes.length).toBeGreaterThan(0);
  });

  it('Funil: campo leads coincide com total de leads do mês', () => {
    expect(data.funil.leads).toBe('160');
  });

  it('Funil: campo vendas coincide com conversões do mês', () => {
    expect(data.funil.vendas).toBe('21');
  });

  it('Funil: txCtr deve terminar em %', () => {
    expect(data.funil.txCtr.endsWith('%')).toBe(true);
  });
});

// ─── Testes: Tabela de Investimentos ──────────────────────────────────────────

describe('Tabela de Investimentos - Estrutura e Categorias', () => {
  const junho = mockDashboardData['2026-06'];
  const data = adaptModernToLegacy(junho);

  it('InvestimentosTabela: deve conter todos os 14 canais mapeados', () => {
    expect(data.investimentosTabela.length).toBe(14);
  });

  it('InvestimentosTabela: deve ter itens com categoria Ads', () => {
    const ads = data.investimentosTabela.filter((i) => i.categoria === 'Ads');
    expect(ads.length).toBe(2);
  });

  it('InvestimentosTabela: deve ter itens com categoria Ferramentas', () => {
    const ferramentas = data.investimentosTabela.filter((i) => i.categoria === 'Ferramentas');
    expect(ferramentas.length).toBe(5);
  });

  it('InvestimentosTabela: deve ter itens com categoria Offline', () => {
    const offline = data.investimentosTabela.filter((i) => i.categoria === 'Offline');
    expect(offline.length).toBe(6);
  });

  it('InvestimentosTabela: soma de valorInt deve ser positiva', () => {
    const total = data.investimentosTabela.reduce((s, i) => s + i.valorInt, 0);
    expect(total).toBeGreaterThan(0);
  });

  it('InvestimentosTabela: trata valores zerados como string vazia para exibir em branco', () => {
    data.investimentosTabela.forEach((item) => {
      expect(item.metric.length).toBeGreaterThan(0);
      if (item.valorInt === 0) {
        expect(item.valor).toBe('');
      } else {
        expect(item.valor.startsWith('R$')).toBe(true);
      }
    });
  });
});

// ─── Testes: Cidades ──────────────────────────────────────────────────────────

describe('Distribuição por Cidades', () => {
  const junho = mockDashboardData['2026-06'];
  const data = adaptModernToLegacy(junho);

  it('Cidades: deve retornar 5 municípios', () => {
    expect(data.cidades.length).toBe(5);
  });

  it('Cidades: Passos deve ser a primeira cidade', () => {
    expect(data.cidades[0].nome).toBe('Passos');
  });

  it('Cidades: crescimento de Passos em Junho = "+ 14,1%"', () => {
    const passos = data.cidades.find((c) => c.nome === 'Passos');
    expect(passos?.crescimento).toBe('+ 14,1%');
  });

  it('Cidades: Alpinópolis deve ter crescimento "+ 20,1%" em Junho', () => {
    const alpinopolis = data.cidades.find((c) => c.nome === 'Alpinópolis');
    expect(alpinopolis?.crescimento).toBe('+ 20,1%');
  });
});
