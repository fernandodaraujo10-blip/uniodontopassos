import React, { useState, useMemo } from 'react';
import { Database, Send } from 'lucide-react';
import Header from '../components/layout/Header';
import KPICardGrid from '../components/cards/KPICardGrid';
import AdPerformanceChart from '../components/charts/AdPerformanceChart';
import ConversionFunnelTabs from '../components/charts/ConversionFunnelTabs';
import InvestmentTable from '../components/tables/InvestmentTable';
import { DashboardArea } from '../components/filters/FilterTabs';
import { useDashboard } from '../hooks/useDashboard';
import { adaptModernToLegacy } from '../utils/dashboardAdapter';

// Componentes exclusivos Mobile
import MobileDashboardHeader from '../components/mobile/MobileDashboardHeader';
import MobileDashboardTabs from '../components/mobile/MobileDashboardTabs';
import MobileKpiStrip from '../components/mobile/MobileKpiStrip';
import MobileBeneficiariesCard from '../components/mobile/MobileBeneficiariesCard';
import MobileAdsPerformanceCard from '../components/mobile/MobileAdsPerformanceCard';
import MobileInvestmentsPreviewCard from '../components/mobile/MobileInvestmentsPreviewCard';
import MobileFunnelCard from '../components/mobile/MobileFunnelCard';

interface DashboardProps {
  setCurrentPage?: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage }) => {
  const {
    selectedMonth,
    setSelectedMonth,
    currentMonthData,
    allDashboardData,
    investmentsData,
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
      <div className="flex-grow flex items-center justify-center bg-[#F8F9FA] dark:bg-slate-950 p-6 select-none animate-fadeIn h-full w-full">
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.03)] text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-pink-50 dark:bg-pink-950/30 rounded-2xl flex items-center justify-center text-pink-700 dark:text-pink-400 mb-6 shadow-sm">
            <Database className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">
            Nenhum dado disponível
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mb-6 leading-relaxed">
            Não encontramos registros estatísticos ou financeiros importados para o mês selecionado. Envie os lançamentos deste mês para gerar o relatório consolidado.
          </p>
          {setCurrentPage && (
            <button
              onClick={() => setCurrentPage('envio-manual')}
              className="w-full py-3 bg-gradient-to-r from-[#D81B60] to-[#E91E63] text-white font-extrabold rounded-xl shadow-[0_4px_12px_rgba(216,27,96,0.25)] hover:scale-102 transition-transform duration-200 cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Dados deste Mês</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto overflow-x-hidden bg-[#F8F9FA] page-transition h-full">
      {/* ═══════════════════════════════════════════════
          LAYOUT MOBILE (< md): coluna única empilhada
          ═══════════════════════════════════════════════ */}
      <div className="flex flex-col md:hidden px-4 pt-4 pb-28 gap-4">
        {/* Header compacto mobile */}
        <MobileDashboardHeader
          title={getHeaderTitle()}
          currentMonthKey={selectedMonth}
          onChangeMonth={setSelectedMonth}
        />

        {/* Tabs superiores */}
        <MobileDashboardTabs
          currentArea={currentArea}
          onChangeArea={setCurrentArea}
        />

        {/* KPIs rápidos */}
        <MobileKpiStrip data={activeMonthData} />

        {/* Bloco de Beneficiários e Anúncios lado a lado no mobile largo ou empilhados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <MobileBeneficiariesCard data={activeMonthData.beneficiarios} />
          <MobileAdsPerformanceCard 
            anunciosData={activeMonthData.anuncios} 
            monthLabel={currentMonthData?.summary.monthLabel || ''} 
          />
        </div>

        {/* Investimentos do Mês */}
        <MobileInvestmentsPreviewCard
          investimentos={activeMonthData.investimentosTabela}
          timestamp={activeMonthData.timestamp}
          monthLabel={currentMonthData?.summary.monthLabel || ''}
        />

        {/* Funil de Conversão */}
        <MobileFunnelCard
          funnelData={activeMonthData.funil}
          leadsData={activeMonthData.leads}
          cidadesData={activeMonthData.cidades}
        />
      </div>

      {/* ═══════════════════════════════════════════════
          LAYOUT DESKTOP (md+): grid de 12 colunas
          ═══════════════════════════════════════════════ */}
      <div className="hidden md:flex flex-col p-5 h-full max-h-screen gap-4">
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
    </div>
  );
};

export default Dashboard;
