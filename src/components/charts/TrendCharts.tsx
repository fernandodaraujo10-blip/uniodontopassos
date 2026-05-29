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
}

export const TrendCharts: React.FC<TrendChartsProps> = ({ rows, reportType, allDashboardData }) => {
  const labels = rows.map(r => r.monthLabel.split('/')[0]); // Ex: "Janeiro" ao invés de "Janeiro/2026"
  const type = reportType || 'executive';

  // Lógica para retornar conjuntos de dados dos dois gráficos dependendo do tipo do relatório
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
          }
        };
    }
  };

  const config = obterDadosGraficos();

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
        backgroundColor: '#1E293B',
        titleColor: '#F8FAFC',
        bodyColor: '#F1F5F9',
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
          color: 'rgba(0, 0, 0, 0.04)',
        },
        ticks: {
          color: '#64748B',
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
          color: '#64748B',
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 select-none print:grid-cols-2 print:gap-4 print:mb-4">
      {/* Card do Gráfico 1 */}
      <div className="bg-slate-50/40 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between h-[150px] transition-colors hover:border-pink-200 print:bg-white print:border-gray-200/80 print:p-3 print:h-[135px]">
        <div className="flex items-center justify-between shrink-0 mb-1.5">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            {config.g1.title}
          </span>
          <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-full print:bg-transparent print:border print:border-pink-200 print:p-0.5">
            {config.g1.badge}
          </span>
        </div>
        <div className="relative flex-grow min-h-0 w-full h-[100px] print:h-[90px]">
          <Line data={getChartConfig(config.g1)} options={getOptions(config.g1.prefix, config.g1.suffix, config.g1.isCurrency)} />
        </div>
      </div>

      {/* Card do Gráfico 2 */}
      <div className="bg-slate-50/40 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between h-[150px] transition-colors hover:border-slate-200 print:bg-white print:border-gray-200/80 print:p-3 print:h-[135px]">
        <div className="flex items-center justify-between shrink-0 mb-1.5">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            {config.g2.title}
          </span>
          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full print:bg-transparent print:border print:border-slate-200 print:p-0.5">
            {config.g2.badge}
          </span>
        </div>
        <div className="relative flex-grow min-h-0 w-full h-[100px] print:h-[90px]">
          <Line data={getChartConfig(config.g2)} options={getOptions(config.g2.prefix, config.g2.suffix, config.g2.isCurrency)} />
        </div>
      </div>
    </div>
  );
};

export default TrendCharts;
