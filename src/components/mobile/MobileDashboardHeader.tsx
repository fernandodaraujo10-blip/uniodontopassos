import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

interface MobileDashboardHeaderProps {
  title: string;
  currentMonthKey: string;
  onChangeMonth: (month: string) => void;
}

export const MobileDashboardHeader: React.FC<MobileDashboardHeaderProps> = ({
  title,
  currentMonthKey,
  onChangeMonth,
}) => {
  const { availableMonths } = useDashboard();
  const currentIndex = availableMonths.findIndex((m) => m.value === currentMonthKey);

  const navigateMonth = (direction: number) => {
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < availableMonths.length) {
      onChangeMonth(availableMonths[nextIndex].value);
    }
  };

  const currentMonthLabel =
    availableMonths.find((m) => m.value === currentMonthKey)?.label || '';

  return (
    <div className="flex items-center justify-between gap-3 w-full py-1 shrink-0 select-none">
      <h1 className="text-xl md:text-[22px] font-bold text-slate-800 tracking-tight leading-none">
        {title}
      </h1>

      {/* Pill do Seletor de Mês (Premium) */}
      <div className="flex items-center bg-slate-50/80 rounded-[14px] shadow-sm border border-slate-100 p-0.5 shrink-0 backdrop-blur-sm">
        <button
          onClick={() => navigateMonth(-1)}
          disabled={currentIndex <= 0}
          className="w-8 h-8 flex items-center justify-center hover:bg-white active:scale-95 rounded-xl text-slate-400 hover:text-slate-700 transition-all disabled:opacity-20 disabled:scale-100 cursor-pointer disabled:cursor-not-allowed hover:shadow-sm"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <span className="px-3 text-pink-700 font-bold text-xs uppercase tracking-wider">
          {currentMonthLabel}
        </span>

        <button
          onClick={() => navigateMonth(1)}
          disabled={currentIndex === -1 || currentIndex === availableMonths.length - 1}
          className="w-8 h-8 flex items-center justify-center hover:bg-white active:scale-95 rounded-xl text-slate-400 hover:text-slate-700 transition-all disabled:opacity-20 disabled:scale-100 cursor-pointer disabled:cursor-not-allowed hover:shadow-sm"
          aria-label="Próximo mês"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};

export default MobileDashboardHeader;
