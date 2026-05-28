import React from 'react';
import FilterTabs, { DashboardArea } from '../filters/FilterTabs';
import MonthNavigator from '../navigation/MonthNavigator';

interface HeaderProps {
  title: string;
  currentArea: DashboardArea;
  onChangeArea: (area: DashboardArea) => void;
  currentMonthKey: 'abril' | 'maio' | 'junho';
  onChangeMonth: (month: 'abril' | 'maio' | 'junho') => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  currentArea,
  onChangeArea,
  currentMonthKey,
  onChangeMonth,
}) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 shrink-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
        <h1 className="text-3xl font-bold text-gray-800 transition-all duration-300">
          {title}
        </h1>
        
        {/* Filtros de Área (Geral, Marketing, Análise) */}
        <FilterTabs currentArea={currentArea} onChangeArea={onChangeArea} />
      </div>
      
      {/* Seletor de Período Dinâmico */}
      <MonthNavigator currentMonthKey={currentMonthKey} onChangeMonth={onChangeMonth} />
    </header>
  );
};

export default Header;
