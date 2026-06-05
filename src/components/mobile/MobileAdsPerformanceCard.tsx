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
  ScriptableContext,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface MobileAdsPerformanceCardProps {
  anunciosData: Record<string, AdPlatformData>;
  monthLabel: string;
  compact?: boolean;
  analysisMode?: boolean;
}

export const MobileAdsPerformanceCard: React.FC<MobileAdsPerformanceCardProps> = ({
  anunciosData,
  monthLabel,
  compact = false,
  analysisMode = false,
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
          gradient.addColorStop(0, '#f472b6');
          gradient.addColorStop(1, '#be185d');
          return gradient;
        },
        hoverBackgroundColor: '#db2777',
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
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 8,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: {
          color: '#64748b',
          font: { size: 9, family: 'Inter' },
        },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: '#64748b',
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

  if (analysisMode) {
    return (
      <div className="flex-[1.35] min-h-0 rounded-2xl p-2.5 bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
        <div className="shrink-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Desempenho de Anúncios</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Pistas geradas por dia</p>
            </div>
            <span className="text-[9px] text-slate-400 font-medium">{monthLabel}</span>
          </div>

          <div className="flex items-center bg-slate-100/80 rounded-[12px] p-0.5 gap-1 border border-slate-200/60 h-[28px]">
            {platforms.map((p) => {
              const active = p === platform;
              return (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`flex-1 h-full rounded-[10px] font-bold transition-all duration-200 cursor-pointer text-[9px] ${
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
        </div>

        <div className="shrink-0 h-[92px] mt-1.5">
          <Bar
            data={chartData}
            options={chartOptions}
            height={92}
            width={100}
          />
        </div>

        <div className="grid grid-cols-2 gap-1.5 mt-1.5 min-h-0">
          {[
            ['Visualizações', activePlatformData.views],
            ['Campanhas', activePlatformData.groups.split(' ')[0]],
            ['Investido', activePlatformData.invested],
            ['Leads', activePlatformData.leads],
            ['Conversões', activePlatformData.conversions],
            ['Tx. Agendamento', activePlatformData.schedRate],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="h-[38px] rounded-xl px-2.5 py-1.5 bg-slate-50 border border-slate-100 flex flex-col justify-center overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[8px] uppercase text-slate-400 font-bold leading-none">{label}</span>
                {label === 'Campanhas' ? renderGroupsChange(activePlatformData.groupsChange) : null}
              </div>
              <p className="text-[12px] font-bold text-slate-800 leading-none mt-0.5 truncate">{value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between w-full select-none overflow-hidden ${
        compact ? 'p-4 min-h-[340px]' : 'p-5 min-h-[440px]'
      }`}
    >
      <div className={`flex flex-col ${compact ? 'mb-3' : 'mb-4'}`}>
        <h2 className={`font-bold text-slate-500 uppercase tracking-wider ${compact ? 'text-[10px] mb-2' : 'text-xs mb-3'}`}>
          Desempenho de Anúncios
        </h2>

        <div className={`flex bg-slate-100/80 rounded-[14px] p-1 gap-1 border border-slate-200/60 w-full ${compact ? 'mb-2' : 'mb-2'}`}>
          {platforms.map((p) => {
            const active = p === platform;
            return (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`flex-1 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-white text-pink-700 shadow-sm border border-slate-200/50'
                    : 'text-slate-500 hover:text-slate-700 bg-transparent'
                } ${compact ? 'py-1 text-[9px]' : 'py-1.5 text-[10px]'}`}
              >
                {p}
              </button>
            );
          })}
        </div>
        <p className={`text-[10px] text-slate-400 ${compact ? 'leading-tight' : ''}`}>
          Pistas geradas por dia (últimos 7 dias)
        </p>
      </div>

      <div className={`relative w-full ${compact ? 'h-[110px] mb-3' : 'h-[140px] mb-4'}`}>
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className={`grid grid-cols-2 gap-2 text-xs shrink-0 select-none ${compact ? 'gap-1.5' : ''}`}>
        <div className={`bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center ${compact ? 'p-2' : 'p-2.5'}`}>
          <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-1">Visualizações</p>
          <p className={`font-bold text-slate-800 ${compact ? 'text-[13px]' : 'text-sm'}`}>{activePlatformData.views}</p>
        </div>

        <div className={`bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center ${compact ? 'p-2' : 'p-2.5'}`}>
          <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-1">Campanhas</p>
          <div className="flex items-center justify-between">
            <p className={`font-bold text-slate-800 ${compact ? 'text-[13px]' : 'text-sm'}`}>
              {activePlatformData.groups.split(' ')[0]}
            </p>
            {renderGroupsChange(activePlatformData.groupsChange)}
          </div>
        </div>

        <div className={`bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center ${compact ? 'p-2' : 'p-2.5'}`}>
          <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-1">Investido</p>
          <p className={`font-bold text-slate-800 ${compact ? 'text-[13px]' : 'text-sm'}`}>{activePlatformData.invested}</p>
        </div>

        <div className={`bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center ${compact ? 'p-2' : 'p-2.5'}`}>
          <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-1">Leads</p>
          <p className={`font-bold text-slate-800 ${compact ? 'text-[13px]' : 'text-sm'}`}>{activePlatformData.leads}</p>
        </div>

        <div className={`bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center ${compact ? 'p-2' : 'p-2.5'}`}>
          <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-1">Conversões</p>
          <p className={`font-bold text-slate-800 ${compact ? 'text-[13px]' : 'text-sm'}`}>{activePlatformData.conversions}</p>
        </div>

        <div className={`bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center ${compact ? 'p-2' : 'p-2.5'}`}>
          <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-1">Tx. Agendamento</p>
          <p className={`font-bold text-slate-800 ${compact ? 'text-[13px]' : 'text-sm'}`}>{activePlatformData.schedRate}</p>
        </div>
      </div>

      <p className={`text-[9px] text-slate-400 mt-4 text-right shrink-0 ${compact ? 'mt-3' : ''}`}>
        Fonte: Envio de Dados ({monthLabel})
      </p>
    </div>
  );
};

export default MobileAdsPerformanceCard;
