import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  ScriptableContext
} from 'chart.js';
import { ConsolidatedReportRow, ReportType } from '../../types/reports';

// Registrando módulos do Chart.js necessários para gráficos de linha
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface TrendChartsProps {
  rows: ConsolidatedReportRow[];
  reportType?: ReportType;
  allDashboardData?: any;
  compact?: boolean;
}

export const TrendCharts: React.FC<TrendChartsProps> = ({ rows, reportType, allDashboardData, compact = false }) => {
  const [isDark, setIsDark] = React.useState(() => document.documentElement.classList.contains('dark'));
  const [activeChart, setActiveChart] = React.useState(0);

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const labels = rows.map(r => r.monthLabel.split('/')[0]); // Ex: "Janeiro" ao invés de "Janeiro/2026"
  const type = reportType || 'executive';

  // Lógica para retornar conjuntos de dados dos três gráficos dependendo do tipo do relatório
  const obterDadosGraficos = () => {
    switch (type) {
      case 'commercial':
        return {
          g1: {
            title: 'Geração Mensal de Leads',
            badge: 'Leads Totais',
            color: '#D81B60',
            data: rows.map(r => r.leads),
            label: 'Leads',
            prefix: '',
            suffix: '',
            isCurrency: false
          },
          g2: {
            title: 'Conversões Efetivas',
            badge: 'Contratos Fechados',
            color: '#475569',
            data: rows.map(r => r.conversions),
            label: 'Conversões',
            prefix: '',
            suffix: '',
            isCurrency: false
          },
          g3: {
            title: 'Taxa de Conversão Comercial',
            badge: 'Eficiência Funil',
            color: '#2563EB',
            data: rows.map(r => r.conversionRate),
            label: 'Taxa de Conversão',
            prefix: '',
            suffix: '%',
            isCurrency: false
          }
        };
      case 'churn':
        return {
          g1: {
            title: 'Base de Beneficiários Ativos',
            badge: 'Vidas Ativas',
            color: '#0D9488',
            data: rows.map(r => r.activeBeneficiaries),
            label: 'Beneficiários',
            prefix: '',
            suffix: '',
            isCurrency: false
          },
          g2: {
            title: 'Cancelamentos Mensais',
            badge: 'Evasão Absoluta',
            color: '#64748B',
            data: rows.map(r => r.canceledBeneficiaries),
            label: 'Cancelamentos',
            prefix: '',
            suffix: '',
            isCurrency: false
          },
          g3: {
            title: 'Taxa de Evasão (Churn Rate)',
            badge: '% Mensal',
            color: '#D81B60',
            data: rows.map(r => r.churnRate),
            label: 'Churn Rate',
            prefix: '',
            suffix: '%',
            isCurrency: false
          }
        };
      case 'financial':
        return {
          g1: {
            title: 'Investimento Total no Período',
            badge: 'Budget Total',
            color: '#475569',
            data: rows.map(r => r.totalSpend),
            label: 'Investimento',
            prefix: 'R$ ',
            suffix: '',
            isCurrency: true
          },
          g2: {
            title: 'Eficiência de Custo (CAC)',
            badge: 'Custo por Cliente',
            color: '#D81B60',
            data: rows.map(r => r.cac),
            label: 'CAC',
            prefix: 'R$ ',
            suffix: '',
            isCurrency: true
          },
          g3: {
            title: 'Custo Médio por Lead (CPL)',
            badge: 'Custo Unitário',
            color: '#D97706',
            data: rows.map(r => r.cpl),
            label: 'CPL',
            prefix: 'R$ ',
            suffix: '',
            isCurrency: true
          }
        };
      case 'satisfaction':
        const npsValues = rows.map(r => {
          const md = allDashboardData ? allDashboardData[r.month] : null;
          return md ? (md.summary.nps ?? 78) : 78;
        });
        const ltvValues = rows.map(r => {
          const md = allDashboardData ? allDashboardData[r.month] : null;
          return md ? (md.summary.ltv || 1200) : 1200;
        });
        const ratioValues = rows.map(r => {
          const md = allDashboardData ? allDashboardData[r.month] : null;
          const ltv = md ? (md.summary.ltv || 1200) : 1200;
          const cac = r.cac || 99;
          return Number((ltv / cac).toFixed(1));
        });
        return {
          g1: {
            title: 'Evolução de Satisfação (NPS)',
            badge: 'Score NPS',
            color: '#D81B60',
            data: npsValues,
            label: 'NPS',
            prefix: '',
            suffix: ' pts',
            isCurrency: false
          },
          g2: {
            title: 'Valor Vitalício do Cliente (LTV)',
            badge: 'LTV Médio',
            color: '#475569',
            data: ltvValues,
            label: 'LTV',
            prefix: 'R$ ',
            suffix: '',
            isCurrency: true
          },
          g3: {
            title: 'Multiplicador LTV / CAC',
            badge: 'Retorno ROI',
            color: '#10B981',
            data: ratioValues,
            label: 'LTV/CAC',
            prefix: '',
            suffix: 'x',
            isCurrency: false
          }
        };
      case 'executive':
      default:
        return {
          g1: {
            title: 'Novos Beneficiários',
            badge: 'Captação Mensal',
            color: '#0D9488',
            data: rows.map(r => r.newBeneficiaries),
            label: 'Beneficiários',
            prefix: '',
            suffix: '',
            isCurrency: false
          },
          g2: {
            title: 'Custo de Aquisição (CAC)',
            badge: 'R$ / Cliente',
            color: '#D81B60',
            data: rows.map(r => r.cac),
            label: 'CAC',
            prefix: 'R$ ',
            suffix: '',
            isCurrency: true
          },
          g3: {
            title: 'Investimento Geral Consolidado',
            badge: 'Total Investido',
            color: '#475569',
            data: rows.map(r => r.totalSpend),
            label: 'Investimento',
            prefix: 'R$ ',
            suffix: '',
            isCurrency: true
          }
        };
    }
  };

  const config = obterDadosGraficos();
  const chartCards = [config.g1, config.g2, config.g3];

  // Função para retornar datasets configurados dinamicamente
  const getChartConfig = (g: any) => {
    return {
      labels,
      datasets: [
        {
          label: g.label,
          data: g.data,
          borderColor: g.color,
          borderWidth: 2.5,
          backgroundColor: (context: ScriptableContext<'line'>) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(0, 0, 0, 0.01)';
            const hexColor = g.color;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, hexColor + '20'); // Suave opacidade
            gradient.addColorStop(1, hexColor + '01');
            return gradient;
          },
          fill: true,
          tension: 0.4,
          pointBackgroundColor: g.color,
          pointBorderColor: '#FFF',
          pointBorderWidth: 1.5,
          pointRadius: 3.5,
          pointHoverRadius: 5.5,
        }
      ]
    };
  };

  // Opções compartilhadas dos gráficos de linha compactos
  const getOptions = (prefix: string, suffix: string = '', isCurrency: boolean = false) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#0F172A' : '#1E293B',
        titleColor: isDark ? '#F1F5F9' : '#F8FAFC',
        bodyColor: isDark ? '#E2E8F0' : '#F1F5F9',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        borderWidth: isDark ? 1 : 0,
        padding: 6,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            const val = context.raw;
            const formattedVal = isCurrency
              ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
              : new Intl.NumberFormat('pt-BR').format(val);
            return `${context.dataset.label}: ${isCurrency ? '' : prefix}${formattedVal}${suffix}`;
          }
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
        },
        ticks: {
          color: isDark ? '#94A3B8' : '#64748B',
          font: {
            size: 8,
            family: 'Inter',
          },
          callback: (value: any) => {
            if (isCurrency) {
              return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
            }
            return `${prefix}${value}${suffix}`;
          }
        },
        border: {
          display: false,
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#94A3B8' : '#64748B',
          font: {
            size: 8.5,
            family: 'Inter',
            weight: 'bold' as const,
          }
        }
      }
    }
  });

  return (
    <div className={`${compact ? 'select-none' : 'grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 select-none print:grid-cols-3 print:gap-4 print:mb-4'}`}>
      {compact ? (
        <div className="bg-white rounded-2xl border border-gray-100 card-shadow p-2.5 flex flex-col justify-between h-full min-h-0 overflow-hidden">
          <div className="flex items-center justify-between gap-2 shrink-0 mb-2">
            <div className="min-w-0">
              <p className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Gráficos de Tendência</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5">Toque para alternar os painéis</p>
            </div>
            <span className="text-[9px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full whitespace-nowrap">
              {chartCards[activeChart].badge}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 shrink-0 mb-2">
            {chartCards.map((chart, idx) => {
              const active = idx === activeChart;
              return (
                <button
                  key={chart.title}
                  onClick={() => setActiveChart(idx)}
                  className={`rounded-xl px-2 py-1 text-[9px] font-bold leading-tight border transition-all duration-200 ${
                    active
                      ? 'bg-pink-700 text-white border-pink-700 shadow-sm'
                      : 'bg-slate-50 text-slate-500 border-slate-100'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-2 shrink-0 mb-1.5">
            <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider truncate">
              {chartCards[activeChart].title}
            </span>
          </div>

          <div className="relative flex-grow min-h-0 w-full h-[150px]">
            <Line
              data={getChartConfig(chartCards[activeChart])}
              options={getOptions(chartCards[activeChart].prefix, chartCards[activeChart].suffix, chartCards[activeChart].isCurrency)}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Card do Gráfico 1 */}
          <div className="bg-slate-50/40 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-[150px] transition-colors hover:border-pink-200 dark:hover:border-pink-900/50 print:bg-white print:border-gray-200/80 print:p-3 print:h-[135px]">
            <div className="flex items-center justify-between shrink-0 mb-1.5">
              <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-slate-400 tracking-wider">
                {config.g1.title}
              </span>
              <span className="text-[10px] font-bold text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/30 px-2.5 py-0.5 rounded-full print:bg-transparent print:border print:border-pink-200 print:p-0.5">
                {config.g1.badge}
              </span>
            </div>
            <div className="relative flex-grow min-h-0 w-full h-[100px] print:h-[90px]">
              <Line data={getChartConfig(config.g1)} options={getOptions(config.g1.prefix, config.g1.suffix, config.g1.isCurrency)} />
            </div>
          </div>

          {/* Card do Gráfico 2 */}
          <div className="bg-slate-50/40 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-[150px] transition-colors hover:border-slate-200 dark:hover:border-slate-700 print:bg-white print:border-gray-200/80 print:p-3 print:h-[135px]">
            <div className="flex items-center justify-between shrink-0 mb-1.5">
              <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-slate-400 tracking-wider">
                {config.g2.title}
              </span>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60 px-2.5 py-0.5 rounded-full print:bg-transparent print:border print:border-slate-200 print:p-0.5">
                {config.g2.badge}
              </span>
            </div>
            <div className="relative flex-grow min-h-0 w-full h-[100px] print:h-[90px]">
              <Line data={getChartConfig(config.g2)} options={getOptions(config.g2.prefix, config.g2.suffix, config.g2.isCurrency)} />
            </div>
          </div>

          {/* Card do Gráfico 3 */}
          <div className="bg-slate-50/40 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-[150px] transition-colors hover:border-slate-200 dark:hover:border-slate-700 print:bg-white print:border-gray-200/80 print:p-3 print:h-[135px]">
            <div className="flex items-center justify-between shrink-0 mb-1.5">
              <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-slate-400 tracking-wider">
                {config.g3.title}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full print:bg-transparent print:border print:border-emerald-200 print:p-0.5">
                {config.g3.badge}
              </span>
            </div>
            <div className="relative flex-grow min-h-0 w-full h-[100px] print:h-[90px]">
              <Line data={getChartConfig(config.g3)} options={getOptions(config.g3.prefix, config.g3.suffix, config.g3.isCurrency)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TrendCharts;
