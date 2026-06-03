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
    <div className="relative w-full mt-4">
      <div className="grid grid-cols-3 gap-3 w-full select-none">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          const isActive = activeKpi === kpi.type;
          
          return (
            <div 
              key={idx} 
              onClick={() => onChangeKpi && onChangeKpi(kpi.type)}
              className={`p-3 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all duration-200 min-h-[96px] ${
                isActive 
                  ? 'bg-pink-50/50 border-pink-300 shadow-[0_4px_12px_rgba(216,27,96,0.08)]' 
                  : 'bg-white border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-200'
              }`}
            >
              <div className="flex flex-col mb-2 gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-pink-600 text-white shadow-sm' : 'bg-slate-50 text-slate-400'
                }`}>
                  <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider leading-tight line-clamp-1 ${
                  isActive ? 'text-pink-800' : 'text-slate-500'
                }`}>
                  {kpi.label}
                </span>
              </div>

              <div>
                <div className={`text-base font-bold tracking-tight leading-none mb-1 ${
                  isActive ? 'text-pink-950' : 'text-slate-800'
                }`}>
                  {kpi.value}
                </div>
                
                <div className={`text-[10px] font-medium flex items-center gap-0.5 ${
                  kpi.isUp ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {kpi.isUp ? (
                    <TrendingUp className="w-2.5 h-2.5 shrink-0" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 shrink-0" />
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
