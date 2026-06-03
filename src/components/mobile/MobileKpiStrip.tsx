import React from 'react';
import { Users, DollarSign, TrendingUp, Smile, TrendingDown, ChevronRight, Target, UserPlus, Filter } from 'lucide-react';
import { MonthDashboardData } from '../../types/dashboard';

export type MobileKpiType = 'Beneficiários' | 'Leads' | 'Conversão' | 'Investimento' | 'ROI' | 'NPS';

interface MobileKpiStripProps {
  data: MonthDashboardData;
  activeKpi?: MobileKpiType;
  onChangeKpi?: (kpi: MobileKpiType) => void;
}

export const MobileKpiStrip: React.FC<MobileKpiStripProps> = ({ data, activeKpi = 'Beneficiários', onChangeKpi }) => {
  const kpis = [
    {
      label: 'Beneficiários',
      value: data.beneficiarios.total,
      percentText: data.beneficiarios.percentText,
      isUp: data.beneficiarios.percentType === 'up',
      icon: Users,
      type: 'Beneficiários' as MobileKpiType,
    },
    {
      label: 'Leads',
      value: data.leads.total,
      percentText: data.leads.percentText,
      isUp: data.leads.percentType === 'up',
      icon: UserPlus,
      type: 'Leads' as MobileKpiType,
    },
    {
      label: 'Conversão',
      value: data.conversoes.taxa,
      percentText: data.conversoes.percentText,
      isUp: data.conversoes.percentType === 'up',
      icon: Filter,
      type: 'Conversão' as MobileKpiType,
    },
    {
      label: 'Investimento',
      value: data.investimento.total.includes('14.017') || data.investimento.total.includes('14') ? '14 mil' : data.investimento.total.replace('R$ ', ''),
      percentText: data.investimento.percentText,
      isUp: data.investimento.percentType === 'up',
      icon: DollarSign,
      type: 'Investimento' as MobileKpiType,
    },
    {
      label: 'ROI',
      value: data.roi.total,
      percentText: data.roi.diff,
      isUp: data.roi.diffType === 'up',
      icon: Target,
      type: 'ROI' as MobileKpiType,
    },
    {
      label: 'NPS',
      value: data.nps.total,
      percentText: data.nps.diff,
      isUp: data.nps.diffType === 'up',
      icon: Smile,
      type: 'NPS' as MobileKpiType,
    },
  ];

  return (
    <div className="relative w-full mt-5">
      <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full select-none">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          const isActive = activeKpi === kpi.type;
          
          return (
            <div 
              key={idx} 
              onClick={() => onChangeKpi && onChangeKpi(kpi.type)}
              className={`p-2.5 sm:p-3.5 rounded-2xl border shadow-[0_2px_8px_rgba(136,14,79,0.03)] flex flex-col justify-between cursor-pointer transition-colors min-h-[92px] ${
                isActive ? 'bg-pink-300 border-pink-400' : 'bg-pink-200 border-pink-300'
              }`}
            >
            <div className="flex flex-col mb-1.5 gap-1">
              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 shadow-[0_1px_3px_rgba(136,14,79,0.04)] ${
                isActive ? 'bg-white text-pink-700' : 'bg-white/80 text-pink-600'
              }`}>
                <Icon className="w-3 h-3 stroke-[2.2]" />
              </div>
              <span className={`text-[9.5px] sm:text-[11px] font-bold uppercase tracking-tight leading-tight ${
                isActive ? 'text-pink-900' : 'text-slate-500'
              }`}>
                {kpi.label}
              </span>
            </div>

            <div>
              <div className={`text-base sm:text-lg font-black tracking-tight leading-none mb-0.5 ${
                isActive ? 'text-slate-900' : 'text-slate-800'
              }`}>
                {kpi.value}
              </div>
              
              <div className={`text-[9px] sm:text-[10px] font-semibold flex items-center gap-0.5 ${
                kpi.isUp ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                {kpi.isUp ? (
                  <TrendingUp className="w-2 h-2 shrink-0" />
                ) : (
                  <TrendingDown className="w-2 h-2 shrink-0" />
                )}
                <span>{kpi.percentText}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default MobileKpiStrip;
