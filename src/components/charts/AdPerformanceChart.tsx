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
}

export const AdPerformanceChart: React.FC<AdPerformanceChartProps> = ({
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
    <div className="col-span-12 lg:col-span-7 bg-[#0D040A] text-white p-5 rounded-3xl shadow-xl flex flex-col justify-between h-full min-h-0">
      <div className="shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-3">
          <h2 className="text-xl font-bold text-pink-500">Desempenho de Anúncios</h2>
          
          {/* Seleção da Plataforma de Anúncio */}
          <div className="flex bg-[#1A0A14] rounded-xl p-1 gap-1 border border-white/5 self-end">
            {platforms.map((p) => {
              const isActive = p === platform;
              return (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-1 text-[9px] rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-pink-700 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
        
        <p className="text-[10px] text-gray-400 mb-1">
          Desempenho semanal em {platform} (Pistas geradas por dia)
        </p>
      </div>
      
      {/* Gráfico Canvas */}
      <div className="relative flex-grow min-h-0 w-full flex items-center justify-center py-2 h-[160px]">
        <Bar data={data} options={options} />
      </div>
      
      {/* Grid de métricas do anúncio */}
      <div className="grid grid-cols-3 gap-2 mt-3 text-xs shrink-0 select-none">
        <div className="bg-[#1A0A14] p-2 rounded-xl border border-white/5 transition-all duration-200 hover:border-pink-500/20">
          <p className="text-gray-500 text-[8px] uppercase font-bold tracking-wider">Visualizações</p>
          <p className="text-sm font-bold text-white transition-all duration-300">{activePlatformData.views}</p>
        </div>
        <div className="bg-[#1A0A14] p-2 rounded-xl border border-white/5 transition-all duration-200 hover:border-pink-500/20 flex flex-col justify-between">
          <p className="text-gray-500 text-[8px] uppercase font-bold tracking-wider">Campanhas</p>
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-bold text-white transition-all duration-300">
              {activePlatformData.groups.split(' ')[0]}
            </p>
            {renderGroupsChange(activePlatformData.groupsChange)}
          </div>
        </div>
        <div className="bg-[#1A0A14] p-2 rounded-xl border border-white/5 transition-all duration-200 hover:border-pink-500/20">
          <p className="text-gray-500 text-[8px] uppercase font-bold tracking-wider">Investido</p>
          <p className="text-sm font-bold text-white transition-all duration-300">{activePlatformData.invested}</p>
        </div>
        <div className="bg-[#1A0A14] p-2 rounded-xl border border-white/5 transition-all duration-200 hover:border-pink-500/20">
          <p className="text-gray-500 text-[8px] uppercase font-bold tracking-wider">Leads</p>
          <p className="text-sm font-bold text-white transition-all duration-300">{activePlatformData.leads}</p>
        </div>
        <div className="bg-[#1A0A14] p-2 rounded-xl border border-white/5 transition-all duration-200 hover:border-pink-500/20">
          <p className="text-gray-500 text-[8px] uppercase font-bold tracking-wider">Conversões</p>
          <p className="text-sm font-bold text-white transition-all duration-300">{activePlatformData.conversions}</p>
        </div>
        <div className="bg-[#1A0A14] p-2 rounded-xl border border-white/5 transition-all duration-200 hover:border-pink-500/20">
          <p className="text-gray-500 text-[8px] uppercase font-bold tracking-wider">Tx. Agendamento</p>
          <p className="text-sm font-bold text-white transition-all duration-300">{activePlatformData.schedRate}</p>
        </div>
      </div>
      
      <p className="text-[8px] text-gray-600 mt-2 text-right shrink-0">
        Fonte: Envio de Dados ({monthLabel})
      </p>
    </div>
  );
};

export default AdPerformanceChart;
