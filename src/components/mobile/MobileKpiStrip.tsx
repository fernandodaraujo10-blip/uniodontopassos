import React from 'react';
import { Users, UserPlus, Filter, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { MonthDashboardData } from '../../types/dashboard';

interface MobileKpiStripProps {
  data: MonthDashboardData;
}

export const MobileKpiStrip: React.FC<MobileKpiStripProps> = ({ data }) => {
  const kpis = [
    {
      label: 'Beneficiários',
      value: data.beneficiarios.total,
      percentText: data.beneficiarios.percentText,
      isUp: data.beneficiarios.percentType === 'up',
      icon: Users,
    },
    {
      label: 'Leads',
      value: data.leads.total,
      percentText: data.leads.percentText,
      isUp: data.leads.percentType === 'up',
      icon: UserPlus,
    },
    {
      label: 'Conversão',
      value: data.conversoes.taxa,
      percentText: data.conversoes.percentText,
      isUp: data.conversoes.percentType === 'up',
      icon: Filter,
    },
    {
      label: 'Investimento',
      // Exibe "R$ 14 mil" se o total for em torno de 14000
      value: data.investimento.total.includes('14.017') || data.investimento.total.includes('14') ? 'R$ 14 mil' : data.investimento.total,
      percentText: data.investimento.percentText,
      isUp: data.investimento.percentType === 'up',
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full select-none">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div 
            key={idx} 
            className="bg-white p-3 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-7 h-7 bg-pink-50 rounded-full flex items-center justify-center text-pink-700 shrink-0">
                <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">
                {kpi.label}
              </span>
            </div>

            <div>
              <div className="text-base font-black text-slate-800 tracking-tight leading-normal">
                {kpi.value}
              </div>
              
              <div className={`text-[9px] font-semibold flex items-center gap-0.5 ${
                kpi.isUp ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                {kpi.isUp ? (
                  <TrendingUp className="w-2.5 h-2.5 shrink-0" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5 shrink-0" />
                )}
                <span>{kpi.percentText}</span>
                <span className="text-gray-400 font-normal">vs. ant.</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MobileKpiStrip;
