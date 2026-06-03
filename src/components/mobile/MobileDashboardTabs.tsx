import React from 'react';
import { DashboardArea } from '../filters/FilterTabs';

interface MobileDashboardTabsProps {
  currentArea: DashboardArea;
  onChangeArea: (area: DashboardArea) => void;
}

export const MobileDashboardTabs: React.FC<MobileDashboardTabsProps> = ({
  currentArea,
  onChangeArea,
}) => {
  const tabs: { id: DashboardArea; label: string }[] = [
    { id: 'geral', label: 'Geral' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'analise', label: 'Análise' },
  ];

  return (
    <div className="w-full bg-slate-100/80 rounded-2xl p-1.5 flex items-center h-12 select-none border border-slate-200/60">
      {tabs.map((tab) => {
        const active = currentArea === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeArea(tab.id)}
            className={`flex-1 h-full rounded-xl font-semibold text-[13px] transition-all duration-200 cursor-pointer 
              ${active 
                ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' 
                : 'bg-transparent text-slate-500 hover:text-slate-700'
              }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default MobileDashboardTabs;
