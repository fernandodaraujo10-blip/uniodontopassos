import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

interface MonthNavigatorProps {
  currentMonthKey: string;
  onChangeMonth: (month: string) => void;
}

export const MonthNavigator: React.FC<MonthNavigatorProps> = ({
  currentMonthKey,
  onChangeMonth,
}) => {
  const { availableMonths } = useDashboard();

  // Encontrar o índice atual com base no valor de mês ('YYYY-MM')
  const currentIndex = availableMonths.findIndex((m) => m.value === currentMonthKey);

  const navigateMonth = (direction: number) => {
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < availableMonths.length) {
      onChangeMonth(availableMonths[nextIndex].value);
    }
  };

  // Rótulo do mês atual abreviado para mobile
  const currentMonthLabel =
    availableMonths.find((m) => m.value === currentMonthKey)?.label || '';

  return (
    <>
      {/* ── MOBILE: apenas setas + mês atual ── */}
      <div className="flex md:hidden items-center bg-white rounded-xl shadow-sm border border-gray-100 p-1 select-none shrink-0 gap-1">
        <button
          onClick={() => navigateMonth(-1)}
          disabled={currentIndex <= 0}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg text-gray-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => {}}
          className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg font-semibold text-[11px] whitespace-nowrap cursor-default min-h-[32px]"
        >
          {currentMonthLabel}
        </button>

        <button
          onClick={() => navigateMonth(1)}
          disabled={currentIndex === -1 || currentIndex === availableMonths.length - 1}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg text-gray-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
          aria-label="Próximo mês"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── DESKTOP: todos os meses em scrollbar ── */}
      <div className="hidden md:flex items-center bg-white rounded-xl shadow-sm border border-gray-100 p-1 select-none shrink-0">
        {/* Botão Retroceder */}
        <button
          onClick={() => navigateMonth(-1)}
          disabled={currentIndex <= 0}
          className="px-3 py-1.5 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed font-semibold"
        >
          &lt;
        </button>

        {availableMonths.map(({ value, label }) => {
          const isCurrent = value === currentMonthKey;
          if (isCurrent) {
            return (
              <button
                key={value}
                onClick={() => onChangeMonth(value)}
                className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg font-semibold text-xs flex items-center gap-2 transition-all duration-300 shadow-sm cursor-pointer"
              >
                <span>{label}</span>
              </button>
            );
          } else {
            return (
              <button
                key={value}
                onClick={() => onChangeMonth(value)}
                className="px-3 py-1.5 hover:bg-gray-50 rounded-lg text-xs text-gray-500 font-medium transition-all duration-200 cursor-pointer"
              >
                {label}
              </button>
            );
          }
        })}

        {/* Botão Avançar */}
        <button
          onClick={() => navigateMonth(1)}
          disabled={currentIndex === -1 || currentIndex === availableMonths.length - 1}
          className="px-3 py-1.5 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed font-semibold"
        >
          &gt;
        </button>
      </div>
    </>
  );
};

export default MonthNavigator;
