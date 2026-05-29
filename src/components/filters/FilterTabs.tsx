import React from 'react';

export type DashboardArea = 'geral' | 'marketing' | 'analise';

interface FilterTabsProps {
  currentArea: DashboardArea;
  onChangeArea: (area: DashboardArea) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ currentArea, onChangeArea }) => {
  const tabs: { id: DashboardArea; label: string; labelShort: string }[] = [
    { id: 'geral', label: 'Geral', labelShort: 'Geral' },
    { id: 'marketing', label: 'Marketing', labelShort: 'Marketing' },
    { id: 'analise', label: 'Análise & Crescimento', labelShort: 'Análise' },
  ];

  return (
    <div className="flex bg-white rounded-xl p-1 gap-1 border border-gray-100 shadow-sm w-fit shrink-0 select-none max-w-full overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = tab.id === currentArea;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeArea(tab.id)}
            className={`px-3 md:px-4 py-1.5 text-xs rounded-lg font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap min-h-[36px] ${
              isActive
                ? 'bg-pink-700 text-white shadow-sm'
                : 'text-gray-600 hover:text-pink-700 hover:bg-pink-50/50'
            }`}
          >
            {/* Rótulo curto no mobile, completo no desktop */}
            <span className="md:hidden">{tab.labelShort}</span>
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
