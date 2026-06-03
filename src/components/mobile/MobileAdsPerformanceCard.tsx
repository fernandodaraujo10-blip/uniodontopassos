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
          if (!chartArea) return '#D81B60';
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, '#E91E63');
          gradient.addColorStop(1, '#D81B60');
          return gradient;
        },
        hoverBackgroundColor: '#FF4081',
        borderRadius: 4,
        borderSkipped: false,
        maxBarThickness: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E0E1B',
        titleColor: '#FF4081',
        bodyColor: '#FFF',
        padding: 6,
        cornerRadius: 6,
        displayColors: false,
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: {
          color: 'rgba(255, 255, 255, 0.3)',
          font: { size: 8, family: 'Inter' },
        },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: 'rgba(255, 255, 255, 0.3)',
          font: { size: 8.5, family: 'Inter' },
        },
      },
    },
  };

  const renderGroupsChange = (change: string) => {
    const isUp = change.includes('▲');
    const isDown = change.includes('▼');

    let Icon = Minus;
    let colorClass = 'text-gray-400';

    if (isUp) {
      Icon = TrendingUp;
      colorClass = 'text-green-400';
    } else if (isDown) {
      Icon = TrendingDown;
      colorClass = 'text-rose-400';
    }

    return (
      <span className={`text-[8px] font-bold flex items-center gap-0.5 ${colorClass}`}>
        <Icon className="w-2.5 h-2.5" />
        {change.replace(/[▲▼▬\s]/g, '')}
      </span>
    );
  };

  return (
    <div className="bg-[#0D040A] text-white p-4 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between w-full h-[365px] select-none overflow-hidden">
      <div>
        {/* Título e Abas */}
        <div className="flex justify-between items-center mb-1 gap-2">
          <h2 className="text-[11px] font-black text-pink-500 uppercase tracking-tight">
            Desempenho de Anúncios
          </h2>
          
          <div className="flex bg-[#1A0A14] rounded-xl p-0.5 gap-0.5 border border-white/5 shrink-0">
            {platforms.map((p) => {
              const active = p === platform;
              return (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-2.5 py-1 text-[9.5px] rounded-lg font-bold transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-pink-700 text-white shadow-xs'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
        
        <p className="text-[9px] text-gray-400 leading-none mb-2">
          Pistas geradas por dia (últimos 7 dias)
        </p>
      </div>

      {/* Gráfico Canvas */}
      <div className="relative flex-grow min-h-0 w-full h-[115px] py-1 flex items-center justify-center">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-3 gap-1.5 mt-2.5 text-xs shrink-0 select-none">
        <div className="bg-[#1A0A14] p-1.5 rounded-xl border border-white/5">
          <p className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider leading-none mb-1">Visualizações</p>
          <p className="text-xs font-black text-white leading-none">{activePlatformData.views}</p>
        </div>
        <div className="bg-[#1A0A14] p-1.5 rounded-xl border border-white/5 flex flex-col justify-between">
          <p className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider leading-none mb-1">Campanhas</p>
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-white leading-none">
              {activePlatformData.groups.split(' ')[0]}
            </p>
            {renderGroupsChange(activePlatformData.groupsChange)}
          </div>
        </div>
        <div className="bg-[#1A0A14] p-1.5 rounded-xl border border-white/5">
          <p className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider leading-none mb-1">Investido</p>
          <p className="text-xs font-black text-white leading-none">{activePlatformData.invested}</p>
        </div>
        <div className="bg-[#1A0A14] p-1.5 rounded-xl border border-white/5">
          <p className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider leading-none mb-1">Leads</p>
          <p className="text-xs font-black text-white leading-none">{activePlatformData.leads}</p>
        </div>
        <div className="bg-[#1A0A14] p-1.5 rounded-xl border border-white/5">
          <p className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider leading-none mb-1">Conversões</p>
          <p className="text-xs font-black text-white leading-none">{activePlatformData.conversions}</p>
        </div>
        <div className="bg-[#1A0A14] p-1.5 rounded-xl border border-white/5">
          <p className="text-gray-500 text-[7.5px] uppercase font-bold tracking-wider leading-none mb-1">Tx. Agend.</p>
          <p className="text-xs font-black text-white leading-none">{activePlatformData.schedRate}</p>
        </div>
      </div>
      
      <p className="text-[7px] text-gray-500 mt-2 text-right shrink-0 leading-none">
        Fonte: Envio de Dados ({monthLabel})
      </p>
    </div>
  );
};

export default MobileAdsPerformanceCard;
