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
import { ConsolidatedReportRow } from '../../types/reports';

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
}

export const TrendCharts: React.FC<TrendChartsProps> = ({ rows }) => {
  const labels = rows.map(r => r.monthLabel.split('/')[0]); // Ex: "Janeiro" ao invés de "Janeiro/2026"
  const cacData = rows.map(r => r.cac);
  const churnData = rows.map(r => r.churnRate);

  // Configuração do Gráfico de CAC (Rosa da Uniodonto com gradiente suave)
  const cacChartData = {
    labels,
    datasets: [
      {
        label: 'CAC (R$)',
        data: cacData,
        borderColor: '#D81B60',
        borderWidth: 2.5,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(216, 27, 96, 0.05)';
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(216, 27, 96, 0.2)');
          gradient.addColorStop(1, 'rgba(216, 27, 96, 0.01)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#D81B60',
        pointBorderColor: '#FFF',
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  // Configuração do Gráfico de Churn (Cinza escuro/Slate de alta precisão)
  const churnChartData = {
    labels,
    datasets: [
      {
        label: 'Churn Rate (%)',
        data: churnData,
        borderColor: '#475569',
        borderWidth: 2.5,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(71, 85, 105, 0.05)';
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(71, 85, 105, 0.15)');
          gradient.addColorStop(1, 'rgba(71, 85, 105, 0.01)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#475569',
        pointBorderColor: '#FFF',
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  // Opções compartilhadas dos gráficos de linha compactos
  const getOptions = (prefix: string, suffix: string = '') => ({
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
          label: (context: any) => `${context.dataset.label}: ${prefix}${context.raw.toFixed(2).replace('.', ',')}${suffix}`,
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
          callback: (value: any) => `${prefix}${value}${suffix}`
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
      {/* Card do Gráfico de CAC */}
      <div className="bg-slate-50/40 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between h-[150px] transition-colors hover:border-pink-200 print:bg-white print:border-gray-200/80 print:p-3 print:h-[135px]">
        <div className="flex items-center justify-between shrink-0 mb-1.5">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Tendência de Custo de Aquisição (CAC)
          </span>
          <span className="text-xs font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full print:bg-transparent print:p-0">
            R$ / Cliente
          </span>
        </div>
        <div className="relative flex-grow min-h-0 w-full h-[100px] print:h-[90px]">
          <Line data={cacChartData} options={getOptions('R$ ')} />
        </div>
      </div>

      {/* Card do Gráfico de Churn */}
      <div className="bg-slate-50/40 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between h-[150px] transition-colors hover:border-slate-200 print:bg-white print:border-gray-200/80 print:p-3 print:h-[135px]">
        <div className="flex items-center justify-between shrink-0 mb-1.5">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Evolução de Evasão (Churn Rate)
          </span>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full print:bg-transparent print:p-0">
            % Mensal
          </span>
        </div>
        <div className="relative flex-grow min-h-0 w-full h-[100px] print:h-[90px]">
          <Line data={churnChartData} options={getOptions('', '%')} />
        </div>
      </div>
    </div>
  );
};

export default TrendCharts;
