import React from 'react';

export type MobileDashboardSection = 'visao-geral' | 'desempenho' | 'investimentos';

interface MobileDashboardSectionTabsProps {
  currentSection: MobileDashboardSection;
  onChangeSection: (section: MobileDashboardSection) => void;
  compact?: boolean;
}

export const MobileDashboardSectionTabs: React.FC<MobileDashboardSectionTabsProps> = ({
  currentSection,
  onChangeSection,
  compact = false,
}) => {
  const tabs: { id: MobileDashboardSection; label: string }[] = [
    { id: 'visao-geral', label: 'Visão Geral' },
    { id: 'desempenho', label: 'Desempenho' },
    { id: 'investimentos', label: 'Investimentos' },
  ];

  return (
    <div className={`w-full bg-slate-100/80 rounded-2xl flex items-center select-none border border-slate-200/60 ${compact ? 'px-2 h-[40px]' : 'p-1.5 h-12'}`}>
      {tabs.map((tab) => {
        const active = currentSection === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeSection(tab.id)}
              className={`flex-1 h-full rounded-xl font-semibold transition-all duration-200 cursor-pointer ${compact ? 'mobile-small' : 'text-[12px]'} ${
                active
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

export default MobileDashboardSectionTabs;
