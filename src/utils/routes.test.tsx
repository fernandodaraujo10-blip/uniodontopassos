/**
 * Testes de Rotas — Navegação SPA
 *
 * Valida o sistema de roteamento interno da SPA testando:
 * - Componente Sidebar: links e estado ativo de cada rota
 * - Componente FilterTabs: sub-rotas de área no dashboard
 * - Componente MonthNavigator: navegação de período
 * - Integração: App completo com login antes das rotas
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import FilterTabs from '../components/filters/FilterTabs';
import { DashboardProvider } from '../context/DashboardContext';
import MonthNavigator from '../components/navigation/MonthNavigator';

// ─── Mock: lucide-react (usa importOriginal para não quebrar ícones) ──────────
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return { ...actual };
});

// ─── Mock: Chart.js (canvas não existe no jsdom) ─────────────────────────────
vi.mock('react-chartjs-2', () => ({
  Bar: () => <canvas data-testid="chart-bar" />,
  Doughnut: () => <canvas data-testid="chart-doughnut" />,
  Line: () => <canvas data-testid="chart-line" />,
}));
vi.mock('chart.js', () => ({
  Chart: { register: vi.fn() },
  CategoryScale: vi.fn(), LinearScale: vi.fn(), BarElement: vi.fn(),
  Title: vi.fn(), Tooltip: vi.fn(), Legend: vi.fn(), ArcElement: vi.fn(),
  LineElement: vi.fn(), PointElement: vi.fn(), Filler: vi.fn(),
}));

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

// ─── Wrapper com Provider ─────────────────────────────────────────────────────
const withProvider = (ui: React.ReactNode) =>
  render(<DashboardProvider>{ui}</DashboardProvider>);

// ─── Testes: Sub-rotas de Área (FilterTabs) ───────────────────────────────────

describe('Rota — FilterTabs (Sub-rota de Área do Dashboard)', () => {
  it('renderiza as 3 abas: Geral, Marketing, Análise & Crescimento', () => {
    const handler = vi.fn();
    render(<FilterTabs currentArea="geral" onChangeArea={handler} />);
    expect(screen.getByText('Geral')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('Análise & Crescimento')).toBeInTheDocument();
  });

  it('"Geral" está ativo por padrão (tem classe de destaque)', () => {
    render(<FilterTabs currentArea="geral" onChangeArea={vi.fn()} />);
    const btn = screen.getByText('Geral');
    expect(btn.className).toContain('bg-pink-700');
  });

  it('clica em "Marketing" → onChangeArea("marketing") é chamado', () => {
    const handler = vi.fn();
    render(<FilterTabs currentArea="geral" onChangeArea={handler} />);
    fireEvent.click(screen.getByText('Marketing'));
    expect(handler).toHaveBeenCalledWith('marketing');
  });

  it('clica em "Análise & Crescimento" → onChangeArea("analise") é chamado', () => {
    const handler = vi.fn();
    render(<FilterTabs currentArea="geral" onChangeArea={handler} />);
    fireEvent.click(screen.getByText('Análise & Crescimento'));
    expect(handler).toHaveBeenCalledWith('analise');
  });

  it('"Marketing" renderiza como ativo quando currentArea="marketing"', () => {
    render(<FilterTabs currentArea="marketing" onChangeArea={vi.fn()} />);
    const btn = screen.getByText('Marketing');
    expect(btn.className).toContain('bg-pink-700');
  });

  it('"Geral" não tem classe ativa quando currentArea="marketing"', () => {
    render(<FilterTabs currentArea="marketing" onChangeArea={vi.fn()} />);
    const btn = screen.getByText('Geral');
    expect(btn.className).not.toContain('bg-pink-700');
  });
});

// ─── Testes: Navegação de Período (MonthNavigator) ───────────────────────────

describe('Rota — MonthNavigator (Navegação de Período Mensal)', () => {
  it('renderiza os 6 meses disponíveis como botões', () => {
    withProvider(<MonthNavigator currentMonthKey="2026-05" onChangeMonth={vi.fn()} />);
    expect(screen.getByText('Maio/2026')).toBeInTheDocument();
    expect(screen.getByText('Abril/2026')).toBeInTheDocument();
    expect(screen.getByText('Junho/2026')).toBeInTheDocument();
  });

  it('"Maio/2026" está ativo (classe bg-pink-100)', () => {
    withProvider(<MonthNavigator currentMonthKey="2026-05" onChangeMonth={vi.fn()} />);
    const btn = screen.getByText('Maio/2026');
    expect(btn.closest('button')?.className).toContain('bg-pink-100');
  });

  it('clica em "Junho/2026" → onChangeMonth("2026-06") é chamado', () => {
    const handler = vi.fn();
    withProvider(<MonthNavigator currentMonthKey="2026-05" onChangeMonth={handler} />);
    fireEvent.click(screen.getByText('Junho/2026'));
    expect(handler).toHaveBeenCalledWith('2026-06');
  });

  it('clica em "Abril/2026" → onChangeMonth("2026-04") é chamado', () => {
    const handler = vi.fn();
    withProvider(<MonthNavigator currentMonthKey="2026-05" onChangeMonth={handler} />);
    fireEvent.click(screen.getByText('Abril/2026'));
    expect(handler).toHaveBeenCalledWith('2026-04');
  });

  it('botão "<" (anterior) está desabilitado no primeiro mês "2026-01"', () => {
    withProvider(<MonthNavigator currentMonthKey="2026-01" onChangeMonth={vi.fn()} />);
    const btns = screen.getAllByRole('button');
    const btnAnterior = btns[0]; // Primeira seta (esquerda)
    expect(btnAnterior).toBeDisabled();
  });

  it('botão ">" (próximo) está desabilitado no último mês "2026-06"', () => {
    withProvider(<MonthNavigator currentMonthKey="2026-06" onChangeMonth={vi.fn()} />);
    const btns = screen.getAllByRole('button');
    const btnProximo = btns[btns.length - 1]; // Última seta (direita)
    expect(btnProximo).toBeDisabled();
  });

  it('botão "<" navega para o mês anterior ao clicar', () => {
    const handler = vi.fn();
    withProvider(<MonthNavigator currentMonthKey="2026-05" onChangeMonth={handler} />);
    const btns = screen.getAllByRole('button');
    fireEvent.click(btns[0]);
    expect(handler).toHaveBeenCalledWith('2026-04');
  });

  it('botão ">" navega para o próximo mês ao clicar', () => {
    const handler = vi.fn();
    withProvider(<MonthNavigator currentMonthKey="2026-05" onChangeMonth={handler} />);
    const btns = screen.getAllByRole('button');
    fireEvent.click(btns[btns.length - 1]);
    expect(handler).toHaveBeenCalledWith('2026-06');
  });
});

// ─── Testes: Fluxo de Autenticação + Rota Dashboard ──────────────────────────

describe('Rota — Fluxo Login → Dashboard (Integração)', () => {
  it('App renderiza a tela de Login antes de autenticar', async () => {
    const { default: App } = await import('../App');
    render(<App />);
    expect(screen.getByText('UNIODONTO PASSOS')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Seu usuário ou e-mail')).toBeInTheDocument();
  });

  it('após login válido, o Dashboard ("Visão geral") é exibido', async () => {
    const { default: App } = await import('../App');
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Usuário ou E-mail/i), {
      target: { value: 'fertaisetech@gmail.com' }
    });
    fireEvent.change(screen.getByLabelText(/Senha de Acesso/i), {
      target: { value: '1234' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Entrar no Painel/i }));

    act(() => { vi.advanceTimersByTime(400); });

    expect(screen.getByText('Visão geral')).toBeInTheDocument();
  });

  it('após login, pode navegar para Relatórios e o Dashboard desaparece', async () => {
    const { default: App } = await import('../App');
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Usuário ou E-mail/i), {
      target: { value: 'fertaisetech@gmail.com' }
    });
    fireEvent.change(screen.getByLabelText(/Senha de Acesso/i), {
      target: { value: '1234' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Entrar no Painel/i }));
    act(() => { vi.advanceTimersByTime(400); });

    // Agora no dashboard — navegar para Relatórios
    fireEvent.click(screen.getByText('Relatórios'));
    expect(screen.queryByText('Visão geral')).not.toBeInTheDocument();
  });

  it('após login, pode voltar para Dashboard pelo link "Dashboard" na Sidebar', async () => {
    const { default: App } = await import('../App');
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Usuário ou E-mail/i), {
      target: { value: 'fertaisetech@gmail.com' }
    });
    fireEvent.change(screen.getByLabelText(/Senha de Acesso/i), {
      target: { value: '1234' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Entrar no Painel/i }));
    act(() => { vi.advanceTimersByTime(400); });

    fireEvent.click(screen.getByText('Relatórios'));
    fireEvent.click(screen.getByText('Dashboard'));
    expect(screen.getByText('Visão geral')).toBeInTheDocument();
  });
});
