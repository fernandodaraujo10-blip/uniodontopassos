/**
 * Testes de Componente: InvestmentTable.tsx
 * 
 * Valida a lógica de filtragem reativa por categoria e o
 * cálculo dinâmico do total consolidado de investimentos,
 * conforme docs/qa-checklist.md (seção 4 — Tabela de Investimentos).
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InvestmentTable from '../components/tables/InvestmentTable';
import { InvestmentItem } from '../types/dashboard';

// ─── Mock de dados de investimentos ───────────────────────────────────────────

const mockInvestimentos: InvestmentItem[] = [
  { categoria: 'Ads', metric: 'Meta Ads Facebook/Instagram', valor: 'R$ 3.240,00', valorInt: 3240 },
  { categoria: 'Ads', metric: 'Google Ads', valor: 'R$ 3.960,00', valorInt: 3960 },
  { categoria: 'Marketing', metric: 'RD Conversas', valor: 'R$ 1.108,80', valorInt: 1108.8 },
  { categoria: 'Marketing', metric: 'RD CRM', valor: 'R$ 924,00', valorInt: 924 },
  { categoria: 'Marketing', metric: 'Outros custos e ferramentas', valor: 'R$ 1.663,20', valorInt: 1663.2 },
  { categoria: 'Offline', metric: 'Rádio Passos / Rádio Vida', valor: 'R$ 672,00', valorInt: 672 },
  { categoria: 'Offline', metric: 'Patrocínios e eventos', valor: 'R$ 288,00', valorInt: 288 },
];

const totalGeral = mockInvestimentos.reduce((s, i) => s + i.valorInt, 0);
const totalAds = mockInvestimentos.filter(i => i.categoria === 'Ads').reduce((s, i) => s + i.valorInt, 0);
const totalMarketing = mockInvestimentos.filter(i => i.categoria === 'Marketing').reduce((s, i) => s + i.valorInt, 0);
const totalOffline = mockInvestimentos.filter(i => i.categoria === 'Offline').reduce((s, i) => s + i.valorInt, 0);

const defaultProps = {
  investimentos: mockInvestimentos,
  timestamp: '05/04/2026 18:45',
  monthLabel: 'Abril/2026',
};

// ─── Testes: Renderização Inicial ─────────────────────────────────────────────

describe('InvestmentTable — Renderização Inicial', () => {
  it('renderiza o título "Investimentos do Mês"', () => {
    render(<InvestmentTable {...defaultProps} />);
    expect(screen.getByText('Investimentos do Mês')).toBeInTheDocument();
  });

  it('exibe os 4 botões de filtro: Todos, Marketing, Ads, Offline', () => {
    render(<InvestmentTable {...defaultProps} />);
    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('Ads')).toBeInTheDocument();
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('exibe os 7 itens de investimento no filtro "Todos" (padrão)', () => {
    render(<InvestmentTable {...defaultProps} />);
    const linhas = screen.getAllByText('Abril/2026');
    expect(linhas.length).toBe(7);
  });

  it('exibe o timestamp de atualização', () => {
    render(<InvestmentTable {...defaultProps} />);
    expect(screen.getByText('05/04/2026 18:45')).toBeInTheDocument();
  });
});

// ─── Testes: Filtragem Reativa ─────────────────────────────────────────────────

describe('InvestmentTable — Filtragem por Categoria', () => {
  it('filtro "Ads": exibe apenas 2 itens de Ads', () => {
    render(<InvestmentTable {...defaultProps} />);
    fireEvent.click(screen.getByText('Ads'));
    const linhas = screen.getAllByText('Abril/2026');
    expect(linhas.length).toBe(2);
  });

  it('filtro "Marketing": exibe apenas 3 itens de Marketing', () => {
    render(<InvestmentTable {...defaultProps} />);
    fireEvent.click(screen.getByText('Marketing'));
    const linhas = screen.getAllByText('Abril/2026');
    expect(linhas.length).toBe(3);
  });

  it('filtro "Offline": exibe apenas 2 itens de Offline', () => {
    render(<InvestmentTable {...defaultProps} />);
    fireEvent.click(screen.getByText('Offline'));
    const linhas = screen.getAllByText('Abril/2026');
    expect(linhas.length).toBe(2);
  });

  it('filtro "Todos" após outros filtros: volta a exibir 7 itens', () => {
    render(<InvestmentTable {...defaultProps} />);
    fireEvent.click(screen.getByText('Ads'));
    fireEvent.click(screen.getByText('Todos'));
    const linhas = screen.getAllByText('Abril/2026');
    expect(linhas.length).toBe(7);
  });
});

// ─── Testes: Total Dinâmico ────────────────────────────────────────────────────

describe('InvestmentTable — Total Consolidado Dinâmico', () => {
  // Helper: extrai valor numérico do texto formatado pt-BR
  const extrairValor = (texto: string): number => {
    const limpo = texto.replace(/R\$\s?/g, '').replace(/\./g, '').replace(',', '.');
    return parseFloat(limpo);
  };

  // Helper: busca o parágrafo de total (classe específica do componente)
  const getTotalElement = (container: HTMLElement) =>
    container.querySelector('p.text-2xl.font-bold.text-pink-700')!;

  it('total em "Todos": deve ser a soma de todos os 7 itens', () => {
    const { container } = render(<InvestmentTable {...defaultProps} />);
    const valorExibido = extrairValor(getTotalElement(container).textContent || '0');
    expect(valorExibido).toBeCloseTo(totalGeral, 1);
  });

  it('total em "Ads": deve ser a soma dos 2 itens de Ads', () => {
    const { container } = render(<InvestmentTable {...defaultProps} />);
    fireEvent.click(screen.getByText('Ads'));
    const valorExibido = extrairValor(getTotalElement(container).textContent || '0');
    expect(valorExibido).toBeCloseTo(totalAds, 1);
  });

  it('total em "Marketing": deve ser a soma dos 3 itens de Marketing', () => {
    const { container } = render(<InvestmentTable {...defaultProps} />);
    fireEvent.click(screen.getByText('Marketing'));
    const valorExibido = extrairValor(getTotalElement(container).textContent || '0');
    expect(valorExibido).toBeCloseTo(totalMarketing, 1);
  });

  it('total em "Offline": deve ser a soma dos 2 itens de Offline', () => {
    const { container } = render(<InvestmentTable {...defaultProps} />);
    fireEvent.click(screen.getByText('Offline'));
    const valorExibido = extrairValor(getTotalElement(container).textContent || '0');
    expect(valorExibido).toBeCloseTo(totalOffline, 1);
  });
});

// ─── Testes: Estado Vazio ──────────────────────────────────────────────────────

describe('InvestmentTable — Estado Vazio', () => {
  it('exibe mensagem amigável quando não há investimentos', () => {
    render(<InvestmentTable investimentos={[]} timestamp="00/00/0000" monthLabel="Teste" />);
    expect(screen.getByText('Nenhum investimento registrado nesta categoria.')).toBeInTheDocument();
  });
});
