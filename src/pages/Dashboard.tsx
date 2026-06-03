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
import MobileKpiStrip, { MobileKpiType } from '../components/mobile/MobileKpiStrip';
import MobileBeneficiariesCard from '../components/mobile/MobileBeneficiariesCard';
import MobileAdsPerformanceCard from '../components/mobile/MobileAdsPerformanceCard';
import MobileInvestmentsPreviewCard from '../components/mobile/MobileInvestmentsPreviewCard';
import MobileFunnelCard from '../components/mobile/MobileFunnelCard';

// Cards padrão (Desktop/Responsivos) reutilizados no Mobile
import InvestimentoCard from '../components/cards/InvestimentoCard';
import RoiCard from '../components/cards/RoiCard';
import NpsCard from '../components/cards/NpsCard';
import LeadsCard from '../components/cards/LeadsCard';
import ConversoesCard from '../components/cards/ConversoesCard';

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
  const [activeMobileKpi, setActiveMobileKpi] = useState<MobileKpiType>('Beneficiários');

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
    <div className="flex-grow overflow-y-auto overflow-x-hidden bg-[#F8F9FA] page-transition h-full scrollbar-hide">
      {/* ═══════════════════════════════════════════════
          LAYOUT MOBILE (< md)
          ═══════════════════════════════════════════════ */}
      <div className="flex flex-col md:hidden w-full h-full pb-28">
        {/* Seção Superior (Header, Tabs e KPIs) */}
        <div className="bg-white rounded-b-3xl pt-5 pb-6 px-4 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-6 w-full z-10 relative">
          <MobileDashboardHeader
            title={getHeaderTitle()}
            currentMonthKey={selectedMonth}
            onChangeMonth={setSelectedMonth}
          />

          <MobileDashboardTabs
            currentArea={currentArea}
            onChangeArea={setCurrentArea}
          />

          <MobileKpiStrip 
            data={activeMonthData} 
            activeKpi={activeMobileKpi}
            onChangeKpi={setActiveMobileKpi}
          />
        </div>

        {/* Conteúdo Dinâmico (Card Principal) */}
        <div className="flex flex-col px-4 pt-6 gap-6 w-full relative z-0">
          <div className="w-full flex-shrink-0 min-h-0">
            {activeMobileKpi === 'Beneficiários' && (
              <MobileBeneficiariesCard data={activeMonthData.beneficiarios} />
            )}
            
            {activeMobileKpi === 'Leads' && (
              <LeadsCard 
                data={activeMonthData.leads} 
                className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-between w-full min-h-[220px]"
              />
            )}
            
            {activeMobileKpi === 'Conversão' && (
              <ConversoesCard 
                data={activeMonthData.conversoes} 
                className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-between w-full min-h-[220px]"
              />
            )}
            
            {activeMobileKpi === 'Investimento' && (
              <InvestimentoCard 
                data={activeMonthData.investimento} 
                className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-between w-full min-h-[220px]"
              />
            )}
            
            {activeMobileKpi === 'ROI' && (
              <RoiCard 
                data={activeMonthData.roi} 
                className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-between w-full min-h-[220px]"
              />
            )}
            
            {activeMobileKpi === 'NPS' && (
              <NpsCard 
                data={activeMonthData.nps} 
                className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-between w-full min-h-[220px]"
              />
            )}
          </div>

          <MobileAdsPerformanceCard 
            anunciosData={activeMonthData.anuncios} 
            monthLabel={currentMonthData?.summary.monthLabel || ''} 
          />

          <MobileFunnelCard
            funnelData={activeMonthData.funil}
            leadsData={activeMonthData.leads}
            cidadesData={activeMonthData.cidades}
          />

          <MobileInvestmentsPreviewCard
            investimentos={activeMonthData.investimentosTabela}
            timestamp={activeMonthData.timestamp}
            monthLabel={currentMonthData?.summary.monthLabel || ''}
          />
        </div>
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
