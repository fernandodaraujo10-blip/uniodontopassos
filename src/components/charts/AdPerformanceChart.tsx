import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ScriptableContext
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AdPlatformData } from '../../types/dashboard';

// Registrando módulos do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface AdPerformanceChartProps {
  anunciosData: Record<string, AdPlatformData>;
  monthLabel: string;
  compact?: boolean;
}

export const AdPerformanceChart: React.FC<AdPerformanceChartProps> = ({
  anunciosData,
  monthLabel,
  compact = false,
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

  // Configuração dos dados para o react-chartjs-2
  const data = {
    labels: ['Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom', 'Seg'],
    datasets: [
      {
        label: 'Pistas geradas',
        data: activePlatformData.semanal,
        backgroundColor: (context: ScriptableContext<'bar'>) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return '#E91E63'; // fallback
          }
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, '#E91E63'); // Rosa secundário
          gradient.addColorStop(1, '#D81B60'); // Rosa primário
          return gradient;
        },
        hoverBackgroundColor: '#FF4081',
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 16,
      },
    ],
  };

  // Configuração das opções do gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1A0A14',
        titleColor: '#FF4081',
        bodyColor: '#FFF',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        padding: 8,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => `Pistas: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.4)',
          font: {
            size: 9,
            family: 'Inter',
          },
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.4)',
          font: {
            size: 9,
            family: 'Inter',
          },
        },
      },
    },
  };

  // Helper para renderizar a badge de variação das campanhas
  const renderGroupsChange = (change: string) => {
    const isUp = change.includes('▲');
    const isDown = change.includes('▼');

    let Icon = Minus;
    let colorClass = 'text-gray-400';

    if (isUp) {
      Icon = TrendingUp;
      colorClass = 'text-green-500';
    } else if (isDown) {
      Icon = TrendingDown;
      colorClass = 'text-red-500';
    }

    return (
      <span className={`text-[10px] ml-1 font-semibold flex items-center gap-0.5 ${colorClass}`}>
        <Icon className="w-3 h-3 inline" />
        {change.replace(/[▲▼▬\s]/g, '')}
      </span>
    );
  };

  return (
    <div className={`col-span-12 lg:col-span-7 bg-[#0D040A] text-white rounded-3xl shadow-xl flex flex-col justify-between h-full min-h-0 w-full min-w-0 overflow-hidden ${compact ? 'p-2' : 'p-4 md:p-5'}`}>
      <div className="shrink-0">
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center ${compact ? 'mb-1 gap-1.5' : 'mb-2 gap-3'}`}>
          <h2 className={`${compact ? 'mobile-subtitle' : 'text-xl'} font-bold text-pink-500`}>Desempenho de Anúncios</h2>
          
          {/* Seleção da Plataforma de Anúncio */}
          <div className={`flex bg-[#1A0A14] rounded-xl p-1 gap-1 border border-white/5 self-end ${compact ? 'scale-[0.8] origin-right flex-wrap' : ''}`}>
            {platforms.map((p) => {
              const isActive = p === platform;
              return (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-2.5 py-1 text-[9px] whitespace-nowrap rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-pink-700 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  } ${compact ? 'px-2 py-0.5 text-[8px]' : ''}`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
        
        <p className={`${compact ? 'text-[8px] mb-0.5 leading-tight' : 'text-[10px] mb-1'} text-gray-400`}>
          Desempenho semanal em {platform} (Pistas geradas por dia)
        </p>
      </div>
      
      {/* Gráfico Canvas */}
      <div className={`relative flex-grow min-h-0 w-full flex items-center justify-center ${compact ? 'py-0 h-[145px]' : 'py-2 h-[120px] md:h-[160px]'}`}>
        <Bar
          data={data}
          options={{
            ...options,
            scales: {
              y: {
                ...options.scales.y,
                ticks: {
                  ...options.scales.y.ticks,
                  font: {
                    size: compact ? 5 : 9,
                    family: 'Inter',
                  },
                },
              },
              x: {
                ...options.scales.x,
                ticks: {
                  ...options.scales.x.ticks,
                  font: {
                    size: compact ? 5 : 9,
                    family: 'Inter',
                  },
                },
              },
            },
          }}
        />
      </div>
      
      {/* Grid de métricas do anúncio — 2 colunas no mobile, 3 no desktop */}
      <div className={`grid grid-cols-2 md:grid-cols-3 ${compact ? 'gap-1 mt-0.5 text-[10px]' : 'gap-2 mt-3 text-xs'} shrink-0 select-none`}>
        <div className={`bg-[#1A0A14] rounded-xl border border-white/5 transition-all duration-200 hover:border-pink-500/20 ${compact ? 'p-1' : 'p-2'}`}>
          <p className="text-gray-500 text-[7px] uppercase font-bold tracking-wider">Visualizações</p>
          <p className={`${compact ? 'mobile-small' : 'text-sm'} font-bold text-white transition-all duration-300`}>{activePlatformData.views}</p>
        </div>
        <div className={`bg-[#1A0A14] rounded-xl border border-white/5 transition-all duration-200 hover:border-pink-500/20 flex flex-col justify-between ${compact ? 'p-1' : 'p-2'}`}>
          <p className="text-gray-500 text-[7px] uppercase font-bold tracking-wider">Campanhas</p>
          <div className="flex items-baseline justify-between">
            <p className={`${compact ? 'mobile-small' : 'text-sm'} font-bold text-white transition-all duration-300`}>
              {activePlatformData.groups.split(' ')[0]}
            </p>
            {renderGroupsChange(activePlatformData.groupsChange)}
          </div>
        </div>
        <div className={`bg-[#1A0A14] rounded-xl border border-white/5 transition-all duration-200 hover:border-pink-500/20 ${compact ? 'p-1' : 'p-2'}`}>
          <p className="text-gray-500 text-[7px] uppercase font-bold tracking-wider">Investido</p>
          <p className={`${compact ? 'mobile-small' : 'text-sm'} font-bold text-white transition-all duration-300`}>{activePlatformData.invested}</p>
        </div>
        <div className={`bg-[#1A0A14] rounded-xl border border-white/5 transition-all duration-200 hover:border-pink-500/20 ${compact ? 'p-1' : 'p-2'}`}>
          <p className="text-gray-500 text-[7px] uppercase font-bold tracking-wider">Leads</p>
          <p className={`${compact ? 'mobile-small' : 'text-sm'} font-bold text-white transition-all duration-300`}>{activePlatformData.leads}</p>
        </div>
        <div className={`bg-[#1A0A14] rounded-xl border border-white/5 transition-all duration-200 hover:border-pink-500/20 ${compact ? 'p-1' : 'p-2'}`}>
          <p className="text-gray-500 text-[7px] uppercase font-bold tracking-wider">Conversões</p>
          <p className={`${compact ? 'mobile-small' : 'text-sm'} font-bold text-white transition-all duration-300`}>{activePlatformData.conversions}</p>
        </div>
        <div className={`bg-[#1A0A14] rounded-xl border border-white/5 transition-all duration-200 hover:border-pink-500/20 ${compact ? 'p-1' : 'p-2'}`}>
          <p className="text-gray-500 text-[7px] uppercase font-bold tracking-wider">Tx. Agendamento</p>
          <p className={`${compact ? 'mobile-small' : 'text-sm'} font-bold text-white transition-all duration-300`}>{activePlatformData.schedRate}</p>
        </div>
      </div>
      
      <p className={`${compact ? 'text-[7px] mt-1' : 'text-[8px] mt-2'} text-gray-600 text-right shrink-0`}>
        Fonte: Envio de Dados ({monthLabel})
      </p>
    </div>
  );
};

export default AdPerformanceChart;
