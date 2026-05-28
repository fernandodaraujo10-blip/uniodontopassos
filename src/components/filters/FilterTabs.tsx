import React from 'react';

export type DashboardArea = 'geral' | 'marketing' | 'analise';

interface FilterTabsProps {
  currentArea: DashboardArea;
  onChangeArea: (area: DashboardArea) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ currentArea, onChangeArea }) => {
  const tabs: { id: DashboardArea; label: string }[] = [
    { id: 'geral', label: 'Geral' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'analise', label: 'Análise & Crescimento' },
  ];

  return (
    <div className="flex bg-white rounded-xl p-1 gap-1 border border-gray-100 shadow-sm w-fit shrink-0 select-none">
      {tabs.map((tab) => {
        const isActive = tab.id === currentArea;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeArea(tab.id)}
            className={`px-4 py-1.5 text-xs rounded-lg font-semibold transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-pink-700 text-white shadow-sm'
                : 'text-gray-600 hover:text-pink-700 hover:bg-pink-50/50'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
