import React from 'react';
import FilterTabs, { DashboardArea } from '../filters/FilterTabs';
import MonthNavigator from '../navigation/MonthNavigator';

interface HeaderProps {
  title: string;
  currentArea: DashboardArea;
  onChangeArea: (area: DashboardArea) => void;
  currentMonthKey: string;
  onChangeMonth: (month: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  currentArea,
  onChangeArea,
  currentMonthKey,
  onChangeMonth,
}) => {
  return (
    <header className="flex flex-col gap-3 mb-4 shrink-0 w-full min-w-0">
      {/* Linha 1: Título + Seletor de Mês (lado a lado no mobile) */}
      <div className="flex items-center justify-between gap-3 w-full min-w-0">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800 transition-all duration-300 truncate shrink min-w-0">
          {title}
        </h1>

        {/* Seletor de Período — compacto no mobile */}
        <div className="shrink-0">
          <MonthNavigator currentMonthKey={currentMonthKey} onChangeMonth={onChangeMonth} />
        </div>
      </div>

      {/* Linha 2: Filtros de Área (Geral, Marketing, Análise) */}
      <FilterTabs currentArea={currentArea} onChangeArea={onChangeArea} />
    </header>
  );
};

export default Header;
