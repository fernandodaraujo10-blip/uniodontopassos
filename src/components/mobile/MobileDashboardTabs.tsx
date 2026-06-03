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
    <div className="w-full bg-pink-50/50 rounded-2xl p-1.5 flex items-center h-14 select-none">
      {tabs.map((tab) => {
        const active = currentArea === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeArea(tab.id)}
            className={`flex-1 h-full rounded-xl font-bold text-xs transition-all duration-250 cursor-pointer active:scale-98
              ${active 
                ? 'bg-pink-700 text-white shadow-xs' 
                : 'bg-transparent text-slate-600 hover:text-slate-800'
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
