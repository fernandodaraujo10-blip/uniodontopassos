import React, { useState } from 'react';
import Header from '../components/layout/Header';
import KPICardGrid from '../components/cards/KPICardGrid';
import AdPerformanceChart from '../components/charts/AdPerformanceChart';
import ConversionFunnelTabs from '../components/charts/ConversionFunnelTabs';
import InvestmentTable from '../components/tables/InvestmentTable';
import { dashboardData } from '../data/mockData';
import { DashboardArea } from '../components/filters/FilterTabs';

export const Dashboard: React.FC = () => {
  const [currentMonthKey, setCurrentMonthKey] = useState<'abril' | 'maio' | 'junho'>('maio');
  const [currentArea, setCurrentArea] = useState<DashboardArea>('geral');

  // Dados do mês selecionado
  const activeMonthData = dashboardData[currentMonthKey];

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

  // Mapeamento da label do mês para exibição nas tabelas
  const getMonthLabel = () => {
    switch (currentMonthKey) {
      case 'abril':
        return 'Abril/2026';
      case 'junho':
        return 'Junho/2026';
      default:
        return 'Maio/2026';
    }
  };

  return (
    <div className="flex-grow overflow-hidden p-5 bg-[#F8F9FA] scrollbar-hide flex flex-col h-full max-h-screen">
      {/* Top Header Bar */}
      <Header
        title={getHeaderTitle()}
        currentArea={currentArea}
        onChangeArea={setCurrentArea}
        currentMonthKey={currentMonthKey}
        onChangeMonth={setCurrentMonthKey}
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
              monthLabel={getMonthLabel()}
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
            monthLabel={getMonthLabel()}
          />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
