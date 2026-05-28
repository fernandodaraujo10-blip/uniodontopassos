import React from 'react';
import { Calendar } from 'lucide-react';

interface MonthNavigatorProps {
  currentMonthKey: 'abril' | 'maio' | 'junho';
  onChangeMonth: (month: 'abril' | 'maio' | 'junho') => void;
}

const monthsMap = {
  abril: 'Abril de 2026',
  maio: 'Maio de 2026',
  junho: 'Junho de 2026',
};

const monthsOrder: ('abril' | 'maio' | 'junho')[] = ['abril', 'maio', 'junho'];

export const MonthNavigator: React.FC<MonthNavigatorProps> = ({
  currentMonthKey,
  onChangeMonth,
}) => {
  const currentIndex = monthsOrder.indexOf(currentMonthKey);

  const navigateMonth = (direction: number) => {
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < monthsOrder.length) {
      onChangeMonth(monthsOrder[nextIndex]);
    }
  };

  return (
    <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-100 p-1 select-none shrink-0">
      {/* Botão Retroceder */}
      <button
        onClick={() => navigateMonth(-1)}
        disabled={currentIndex === 0}
        className="px-3 py-1.5 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed font-semibold"
      >
        &lt;
      </button>

      {monthsOrder.map((monthKey, index) => {
        const isCurrent = monthKey === currentMonthKey;
        if (isCurrent) {
          return (
            <button
              key={monthKey}
              onClick={() => onChangeMonth(monthKey)}
              className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg font-semibold text-xs flex items-center gap-2 transition-all duration-300 shadow-sm cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{monthsMap[monthKey]}</span>
            </button>
          );
        } else {
          return (
            <button
              key={monthKey}
              onClick={() => onChangeMonth(monthKey)}
              className="px-3 py-1.5 hover:bg-gray-50 rounded-lg text-xs text-gray-500 font-medium transition-all duration-200 cursor-pointer"
            >
              {monthsMap[monthKey]}
            </button>
          );
        }
      })}

      {/* Botão Avançar */}
      <button
        onClick={() => navigateMonth(1)}
        disabled={currentIndex === monthsOrder.length - 1}
        className="px-3 py-1.5 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed font-semibold"
      >
        &gt;
      </button>
    </div>
  );
};

export default MonthNavigator;
