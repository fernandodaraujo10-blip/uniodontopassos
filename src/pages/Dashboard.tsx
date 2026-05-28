import React, { useState, useMemo } from 'react';
import Header from '../components/layout/Header';
import KPICardGrid from '../components/cards/KPICardGrid';
import AdPerformanceChart from '../components/charts/AdPerformanceChart';
import ConversionFunnelTabs from '../components/charts/ConversionFunnelTabs';
import InvestmentTable from '../components/tables/InvestmentTable';
import { DashboardArea } from '../components/filters/FilterTabs';
import { useDashboard } from '../hooks/useDashboard';
import { adaptModernToLegacy } from '../utils/dashboardAdapter';

export const Dashboard: React.FC = () => {
  const { 
    selectedMonth, 
    setSelectedMonth, 
    currentMonthData,
    allDashboardData,
    investmentsData
  } = useDashboard();
  
  const [currentArea, setCurrentArea] = useState<DashboardArea>('geral');

  // Obter o mês anterior para cálculo de taxas de variação
  const previousMonthData = useMemo(() => {
    const months = Object.keys(allDashboardData).sort();
    const idx = months.indexOf(selectedMonth);
    if (idx > 0) {
      return allDashboardData[months[idx - 1]];
    }
    return undefined;
  }, [allDashboardData, selectedMonth]);

  // Adaptar os dados dinâmicos do contexto para o formato esperado pelos componentes da UI
  const activeMonthData = useMemo(() => {
    if (!currentMonthData) return null;
    return adaptModernToLegacy(currentMonthData, previousMonthData, investmentsData);
  }, [currentMonthData, previousMonthData, investmentsData]);

  // Mapeamento do título da página com base na área ativa
  const getHeaderTitle = () => {
    switch (currentArea) {
      case 'marketing':
        return 'Desempenho de Marketing';
      case 'analise':
        return 'Análise de Crescimento & Conversão';
      default:
        return 'Visão geral';
    }
  };

  if (!activeMonthData) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#F8F9FA] text-gray-500 font-sans">
        Nenhum dado disponível para este período.
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-hidden p-5 bg-[#F8F9FA] scrollbar-hide flex flex-col h-full max-h-screen page-transition">
      {/* Top Header Bar */}
      <Header
        title={getHeaderTitle()}
        currentArea={currentArea}
        onChangeArea={setCurrentArea}
        currentMonthKey={selectedMonth}
        onChangeMonth={setSelectedMonth}
      />

      {/* Grid Principal */}
      <div className="grid grid-cols-12 gap-4 items-stretch flex-grow min-h-0">
        
        {/* Coluna Esquerda: KPIs (Linha Superior) + Gráficos (Linha Inferior) */}
        <div className="col-span-12 xl:col-span-9 flex flex-col gap-4 h-full min-h-0">
          
          {/* Linha dos KPIs (Carrossel ou Grid estático) */}
          <KPICardGrid data={activeMonthData} area={currentArea} />

          {/* Linha dos Gráficos */}
          <div className="grid grid-cols-12 gap-4 flex-grow min-h-0">
            {/* Gráfico de Desempenho de Anúncios */}
            <AdPerformanceChart
              anunciosData={activeMonthData.anuncios}
              monthLabel={currentMonthData?.summary.monthLabel || ''}
            />

            {/* Abas do Funil de Conversão / Origens / Cidades */}
            <ConversionFunnelTabs
              funnelData={activeMonthData.funil}
              leadsData={activeMonthData.leads}
              cidadesData={activeMonthData.cidades}
            />
          </div>
        </div>

        {/* Coluna Direita: Tabela de Investimentos (Vertical Completo) */}
        <div className="col-span-12 xl:col-span-3 flex flex-col h-full min-h-0">
          <InvestmentTable
            investimentos={activeMonthData.investimentosTabela}
            timestamp={activeMonthData.timestamp}
            monthLabel={currentMonthData?.summary.monthLabel || ''}
          />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
