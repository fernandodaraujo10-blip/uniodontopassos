/**
 * Testes de Sincronização de Estado — DashboardContext
 *
 * Valida que o contexto central do dashboard sincroniza
 * corretamente os dados entre os estados de:
 * - Mês selecionado ↔ dados do mês atual (currentMonthData)
 * - Filtro de relatório ↔ relatório consolidado gerado
 * - upsertMonthData: cálculo de KPIs ao inserir novos dados
 * - availableMonths: lista ordenada de meses disponíveis
 * - resetToDefaultData: restauração do estado original
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, renderHook, act, screen } from '@testing-library/react';
import { DashboardProvider, useDashboard } from '../context/DashboardContext';
import { mockDashboardData } from '../data/mockDashboardData';
import { mockInvestmentsData } from '../data/mockInvestments';

// ─── Wrapper para renderHook ──────────────────────────────────────────────────

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <DashboardProvider>{children}</DashboardProvider>
);

// ─── Setup: limpar localStorage antes de cada teste ──────────────────────────

beforeEach(() => {
  localStorage.clear();
});

// ─── Testes: Estado Inicial do Contexto ──────────────────────────────────────

describe('Sincronização — Estado Inicial do Contexto', () => {
  it('o mês inicial selecionado é "2026-05" (Maio/2026)', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current.selectedMonth).toBe('2026-05');
  });

  it('currentMonthData retorna os dados corretos do mês selecionado', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current.currentMonthData).toBeDefined();
    expect(result.current.currentMonthData?.summary.month).toBe('2026-05');
  });

  it('availableMonths contém todos os 6 meses do mock (Jan a Jun/2026)', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current.availableMonths).toHaveLength(6);
  });

  it('availableMonths está ordenado cronologicamente', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    const months = result.current.availableMonths.map(m => m.value);
    const sorted = [...months].sort();
    expect(months).toEqual(sorted);
  });

  it('o primeiro mês disponível é "2026-01" (Janeiro/2026)', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current.availableMonths[0].value).toBe('2026-01');
    expect(result.current.availableMonths[0].label).toBe('Janeiro/2026');
  });

  it('o último mês disponível é "2026-06" (Junho/2026)', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    const months = result.current.availableMonths;
    const last = months[months.length - 1];
    expect(last?.value).toBe('2026-06');
    expect(last?.label).toBe('Junho/2026');
  });

  it('allDashboardData contém dados para 6 meses', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(Object.keys(result.current.allDashboardData)).toHaveLength(6);
  });
});

// ─── Testes: Sincronização da Troca de Mês ────────────────────────────────────

describe('Sincronização — Troca de Mês', () => {
  it('ao mudar para "2026-04", currentMonthData reflete Abril/2026', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    act(() => {
      result.current.setSelectedMonth('2026-04');
    });
    expect(result.current.selectedMonth).toBe('2026-04');
    expect(result.current.currentMonthData?.summary.monthLabel).toBe('Abril/2026');
  });

  it('ao mudar para "2026-06", currentMonthData reflete Junho/2026', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    act(() => {
      result.current.setSelectedMonth('2026-06');
    });
    expect(result.current.currentMonthData?.summary.monthLabel).toBe('Junho/2026');
  });

  it('ao mudar para Abril, os leads do currentMonthData são 132', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    act(() => {
      result.current.setSelectedMonth('2026-04');
    });
    expect(result.current.currentMonthData?.summary.leads).toBe(132);
  });

  it('ao mudar para Junho, os beneficiários ativos são 10.320', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    act(() => {
      result.current.setSelectedMonth('2026-06');
    });
    expect(result.current.currentMonthData?.summary.activeBeneficiaries).toBe(10320);
  });

  it('mês inválido retorna currentMonthData como undefined', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    act(() => {
      result.current.setSelectedMonth('2030-99');
    });
    expect(result.current.currentMonthData).toBeUndefined();
  });
});

// ─── Testes: Sincronização do Relatório Consolidado ───────────────────────────

describe('Sincronização — Relatório Consolidado', () => {
  it('relatório gerado com filtro padrão (Jan-Mai) contém 5 linhas', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current.consolidatedReport.rows).toHaveLength(5);
  });

  it('ao mudar o filtro para "2026-04" a "2026-06", o relatório tem 3 linhas', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    act(() => {
      result.current.setReportFilter({
        startMonth: '2026-04',
        endMonth: '2026-06',
        reportType: 'executive'
      });
    });
    expect(result.current.consolidatedReport.rows).toHaveLength(3);
  });

  it('ao filtrar apenas "2026-05", o relatório tem 1 linha com dados de Maio', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    act(() => {
      result.current.setReportFilter({
        startMonth: '2026-05',
        endMonth: '2026-05',
        reportType: 'executive'
      });
    });
    expect(result.current.consolidatedReport.rows).toHaveLength(1);
    expect(result.current.consolidatedReport.rows[0].monthLabel).toBe('Maio/2026');
    expect(result.current.consolidatedReport.rows[0].leads).toBe(145);
  });

  it('totais consolidados: total de leads de Jan a Mai é a soma dos 5 meses', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    // Soma dos leads dos 5 meses: Jan(1500)+Fev(1680)+Mar(1850)+Abr(132)+Mai(145)
    const expectedTotal = 1500 + 1680 + 1850 + 132 + 145;
    expect(result.current.consolidatedReport.totals.totalLeads).toBe(expectedTotal);
  });

  it('totais consolidados: total de conversões de Jan a Mai é correto', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    // Jan(180)+Fev(210)+Mar(240)+Abr(15)+Mai(18)
    const expectedConversions = 180 + 210 + 240 + 15 + 18;
    expect(result.current.consolidatedReport.totals.totalConversions).toBe(expectedConversions);
  });

  it('a taxa de conversão média é positiva', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current.consolidatedReport.totals.averageConversionRate).toBeGreaterThan(0);
  });

  it('o relatório tem campo generatedAt preenchido como ISO string', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(() => new Date(result.current.consolidatedReport.generatedAt)).not.toThrow();
  });
});

// ─── Testes: upsertMonthData (Inserção de Novos Dados) ───────────────────────

describe('Sincronização — upsertMonthData', () => {
  it('ao inserir novo mês "2026-07", o availableMonths passa a ter 7 itens', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    act(() => {
      result.current.upsertMonthData(
        '2026-07',
        { activeBeneficiaries: 10500, newBeneficiaries: 60, canceledBeneficiaries: 20, leads: 170, conversions: 25, nps: 82 },
        [{ source: 'Google Ads', leads: 100, conversions: 15, investment: 4500 }],
        [{ channel: 'Digital', channelType: 'digital', leads: 100, conversions: 15 }],
        [{ city: 'Passos', beneficiaries: 8500, leads: 90, conversions: 12 }],
        [{ campaignId: 'c1', campaignName: 'Test', platform: 'Google Ads', clicks: 2000, impressions: 25000, leads: 100, conversions: 15, spend: 4500 }],
        [{ categoryId: 'marketing_google', amount: 4500, isFixed: false }]
      );
    });
    expect(result.current.availableMonths).toHaveLength(7);
  });

  it('ao inserir "2026-07", o selectedMonth é atualizado para "2026-07"', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    act(() => {
      result.current.upsertMonthData(
        '2026-07',
        { activeBeneficiaries: 10500, newBeneficiaries: 60, canceledBeneficiaries: 20, leads: 170, conversions: 25 },
        [], [], [],
        [],
        [{ categoryId: 'marketing_google', amount: 4500, isFixed: false }]
      );
    });
    expect(result.current.selectedMonth).toBe('2026-07');
  });

  it('upsertMonthData calcula conversionRate corretamente (25/170 * 100 ≈ 14,7)', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    act(() => {
      result.current.upsertMonthData(
        '2026-07',
        { activeBeneficiaries: 10500, newBeneficiaries: 60, canceledBeneficiaries: 20, leads: 170, conversions: 25 },
        [], [], [], [],
        [{ categoryId: 'marketing_google', amount: 4500, isFixed: false }]
      );
    });
    const convRate = result.current.currentMonthData?.summary.conversionRate;
    expect(convRate).toBeGreaterThan(14);
    expect(convRate).toBeLessThan(15);
  });

  it('upsertMonthData calcula churnRate corretamente (20/10500 * 100 ≈ 0,19)', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    act(() => {
      result.current.upsertMonthData(
        '2026-07',
        { activeBeneficiaries: 10500, newBeneficiaries: 60, canceledBeneficiaries: 20, leads: 170, conversions: 25 },
        [], [], [], [],
        [{ categoryId: 'marketing_google', amount: 4500, isFixed: false }]
      );
    });
    const churn = result.current.currentMonthData?.summary.churnRate;
    expect(churn).toBeCloseTo(0.19, 1);
  });

  it('upsertMonthData gera o monthLabel correto para Julho/2026', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    act(() => {
      result.current.upsertMonthData(
        '2026-07',
        { activeBeneficiaries: 10500, newBeneficiaries: 60, canceledBeneficiaries: 20, leads: 170, conversions: 25 },
        [], [], [], [],
        []
      );
    });
    expect(result.current.currentMonthData?.summary.monthLabel).toBe('Julho/2026');
  });
});

// ─── Testes: resetToDefaultData ───────────────────────────────────────────────

describe('Sincronização — resetToDefaultData', () => {
  it('após inserir novo mês e resetar, os dados voltam ao estado inicial', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    act(() => {
      result.current.upsertMonthData(
        '2026-07',
        { activeBeneficiaries: 10500, newBeneficiaries: 60, canceledBeneficiaries: 20, leads: 170, conversions: 25 },
        [], [], [], [], []
      );
    });
    expect(result.current.availableMonths).toHaveLength(7);
    act(() => {
      result.current.resetToDefaultData();
    });
    expect(result.current.availableMonths).toHaveLength(6);
  });

  it('após reset, o mês selecionado volta para "2026-05"', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    act(() => {
      result.current.setSelectedMonth('2026-01');
      result.current.resetToDefaultData();
    });
    expect(result.current.selectedMonth).toBe('2026-05');
  });
});

// ─── Testes: useDashboard fora do Provider ────────────────────────────────────

describe('Sincronização — Segurança do Hook', () => {
  it('useDashboard lança erro quando usado fora do DashboardProvider', () => {
    // Suprime o console.error do React durante o teste de erro esperado
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useDashboard())).toThrow(
      'useDashboard deve ser utilizado sob o provedor DashboardProvider'
    );
    spy.mockRestore();
  });
});
