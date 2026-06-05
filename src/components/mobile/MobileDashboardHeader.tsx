import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

interface MobileDashboardHeaderProps {
  title: string;
  currentMonthKey: string;
  onChangeMonth: (month: string) => void;
  compact?: boolean;
}

export const MobileDashboardHeader: React.FC<MobileDashboardHeaderProps> = ({
  title,
  currentMonthKey,
  onChangeMonth,
  compact = false,
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
    <div className={`w-full shrink-0 select-none ${compact ? 'h-[56px] px-2 flex items-center justify-between gap-2' : 'flex items-center justify-between gap-3 py-1'}`}>
      <h1 className={`font-bold text-slate-800 tracking-tight leading-none ${compact ? 'text-[16px]' : 'text-xl md:text-[22px]'}`}>
        {title}
      </h1>

      <div className={`flex items-center bg-slate-50/80 rounded-[14px] shadow-sm border border-slate-100 p-0.5 shrink-0 backdrop-blur-sm ${compact ? '' : ''}`}>
        <button
          onClick={() => navigateMonth(-1)}
          disabled={currentIndex <= 0}
          className="w-8 h-8 flex items-center justify-center hover:bg-white active:scale-95 rounded-xl text-slate-400 hover:text-slate-700 transition-all disabled:opacity-20 disabled:scale-100 cursor-pointer disabled:cursor-not-allowed hover:shadow-sm"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <span className={`text-pink-700 font-bold uppercase tracking-wider ${compact ? 'px-2 text-[10px]' : 'px-3 text-xs'}`}>
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
