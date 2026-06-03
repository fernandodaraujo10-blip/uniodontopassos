import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AdPlatformData } from '../../types/dashboard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ScriptableContext
} from 'chart.js';

// Garantir que os módulos do Chart.js estão registrados
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface MobileAdsPerformanceCardProps {
  anunciosData: Record<string, AdPlatformData>;
  monthLabel: string;
}

export const MobileAdsPerformanceCard: React.FC<MobileAdsPerformanceCardProps> = ({
  anunciosData,
  monthLabel,
}) => {
  const [platform, setPlatform] = useState<string>('Google Ads');

  const activePlatformData = anunciosData[platform] || {
    semanal: [0, 0, 0, 0, 0, 0, 0],
    views: '0',
    groups: '0',
    groupsChange: '▬ 0',
    invested: 'R$ 0,00',
    leads: '0',
    conversions: '0',
    schedRate: '0,00%',
  };

  const platforms = ['Instagram', 'Meta ADS', 'Google Ads'];

  // Configuração dos dados
  const chartData = {
    labels: ['Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom', 'Seg'],
    datasets: [
      {
        label: 'Pistas',
        data: activePlatformData.semanal,
        backgroundColor: (context: ScriptableContext<'bar'>) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return '#be185d';
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, '#f472b6'); // pink-400
          gradient.addColorStop(1, '#be185d'); // pink-700
          return gradient;
        },
        hoverBackgroundColor: '#db2777', // pink-600
        borderRadius: 4,
        borderSkipped: false,
        maxBarThickness: 12,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#be185d',
        bodyColor: '#334155', // slate-700
        borderColor: '#e2e8f0', // slate-200
        borderWidth: 1,
        padding: 8,
        cornerRadius: 8,
        displayColors: false,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.6)' }, // slate-200/60
        ticks: {
          color: '#64748b', // slate-500
          font: { size: 9, family: 'Inter' },
        },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: '#64748b', // slate-500
          font: { size: 9, family: 'Inter' },
        },
      },
    },
  };

  const renderGroupsChange = (change: string) => {
    const isUp = change.includes('▲');
    const isDown = change.includes('▼');

    let Icon = Minus;
    let colorClass = 'text-slate-400';

    if (isUp) {
      Icon = TrendingUp;
      colorClass = 'text-emerald-500';
    } else if (isDown) {
      Icon = TrendingDown;
      colorClass = 'text-rose-500';
    }

    return (
      <span className={`text-[9px] font-bold flex items-center gap-0.5 ${colorClass}`}>
        <Icon className="w-3 h-3" />
        {change.replace(/[▲▼▬\s]/g, '')}
      </span>
    );
  };

  return (
    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between w-full select-none overflow-hidden min-h-[440px]">
      <div className="flex flex-col mb-4">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Desempenho de Anúncios
        </h2>
        
        {/* Abas das Plataformas (Segmented Control style) */}
        <div className="flex bg-slate-100/80 rounded-[14px] p-1 gap-1 border border-slate-200/60 w-full mb-2">
          {platforms.map((p) => {
            const active = p === platform;
            return (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`flex-1 py-1.5 text-[10px] rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-white text-pink-700 shadow-sm border border-slate-200/50'
                    : 'text-slate-500 hover:text-slate-700 bg-transparent'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-400">
          Pistas geradas por dia (últimos 7 dias)
        </p>
      </div>

      {/* Gráfico Canvas */}
      <div className="relative w-full h-[140px] mb-4">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Grid de Métricas (Mini-cards Premium) */}
      <div className="grid grid-cols-2 gap-2 text-xs shrink-0 select-none">
        
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex flex-col justify-center">
          <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-1">Visualizações</p>
          <p className="text-sm font-bold text-slate-800">{activePlatformData.views}</p>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex flex-col justify-center">
          <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-1">Campanhas</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-800">
              {activePlatformData.groups.split(' ')[0]}
            </p>
            {renderGroupsChange(activePlatformData.groupsChange)}
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex flex-col justify-center">
          <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-1">Investido</p>
          <p className="text-sm font-bold text-slate-800">{activePlatformData.invested}</p>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex flex-col justify-center">
          <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-1">Leads</p>
          <p className="text-sm font-bold text-slate-800">{activePlatformData.leads}</p>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex flex-col justify-center">
          <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-1">Conversões</p>
          <p className="text-sm font-bold text-slate-800">{activePlatformData.conversions}</p>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex flex-col justify-center">
          <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-1">Tx. Agendamento</p>
          <p className="text-sm font-bold text-slate-800">{activePlatformData.schedRate}</p>
        </div>
      </div>
      
      <p className="text-[9px] text-slate-400 mt-4 text-right shrink-0">
        Fonte: Envio de Dados ({monthLabel})
      </p>
    </div>
  );
};

export default MobileAdsPerformanceCard;
