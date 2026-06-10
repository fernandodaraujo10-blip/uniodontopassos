import React, { useMemo, useState } from 'react';
import { Database, Send } from 'lucide-react';
import Header from '../components/layout/Header';
import KPICardGrid from '../components/cards/KPICardGrid';
import AdPerformanceChart from '../components/charts/AdPerformanceChart';
import ConversionFunnelTabs from '../components/charts/ConversionFunnelTabs';
import InvestmentTable from '../components/tables/InvestmentTable';
import { DashboardArea } from '../components/filters/FilterTabs';
import { useDashboard } from '../hooks/useDashboard';
import { adaptModernToLegacy } from '../utils/dashboardAdapter';

import MobileDashboardHeader from '../components/mobile/MobileDashboardHeader';
import MobileDashboardSectionTabs, { MobileDashboardSection } from '../components/mobile/MobileDashboardSectionTabs';
import MobileInvestmentList from '../components/tables/MobileInvestmentList';

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
  const [mobileSection, setMobileSection] = useState<MobileDashboardSection>('visao-geral');

  const previousMonthData = useMemo(() => {
    const months = Object.keys(allDashboardData).sort();
    const idx = months.indexOf(selectedMonth);
    if (idx > 0) return allDashboardData[months[idx - 1]];
    return undefined;
  }, [allDashboardData, selectedMonth]);

  const activeMonthData = useMemo(() => {
    if (!currentMonthData) return null;
    return adaptModernToLegacy(currentMonthData, previousMonthData, investmentsData);
  }, [currentMonthData, previousMonthData, investmentsData]);

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

  const getMobileSectionTitle = () => {
    switch (mobileSection) {
      case 'desempenho':
        return 'Análise de Desempenho';
      case 'investimentos':
        return 'Investimentos do Mês';
      default:
        return 'Visão Geral';
    }
  };

  const isPerformanceMobile = mobileSection === 'desempenho';

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
    <div className="flex-grow overflow-hidden md:overflow-y-auto overflow-x-hidden bg-[#F8F9FA] page-transition h-full scrollbar-hide">
      {isPerformanceMobile ? (
        <div className="md:hidden mobile-page bg-slate-50 flex flex-col">
          <div className="shrink-0 h-[56px] px-2 flex items-center justify-between">
            <MobileDashboardHeader
              title={getMobileSectionTitle()}
              currentMonthKey={selectedMonth}
              onChangeMonth={setSelectedMonth}
              compact
            />
          </div>

          <div className="shrink-0 h-[40px] px-2">
            <MobileDashboardSectionTabs
              currentSection={mobileSection}
              onChangeSection={setMobileSection}
              compact
            />
          </div>

          <div className="mobile-content flex-1 mobile-scroll">
            <div className="flex flex-col gap-2 h-full min-h-0">
              <div className="flex-[1.3] min-h-0">
                <AdPerformanceChart
                  anunciosData={activeMonthData.anuncios}
                  monthLabel={currentMonthData?.summary.monthLabel || ''}
                  compact
                />
              </div>
              <div className="flex-[1] min-h-0">
                <ConversionFunnelTabs
                  funnelData={activeMonthData.funil}
                  leadsData={activeMonthData.leads}
                  cidadesData={activeMonthData.cidades}
                  compact
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:hidden w-full h-full min-h-0 px-0 pt-2 pb-0 gap-1">
          <div className="shrink-0 space-y-1.5">
            <MobileDashboardHeader
              title={getMobileSectionTitle()}
              currentMonthKey={selectedMonth}
              onChangeMonth={setSelectedMonth}
              compact
            />
            <MobileDashboardSectionTabs
              currentSection={mobileSection}
              onChangeSection={setMobileSection}
              compact
            />
          </div>

          <div className="mobile-content flex-1 min-h-0 mobile-scroll">
            {mobileSection === 'visao-geral' && (
              <div className="flex flex-col gap-1 animate-fadeIn h-full min-h-0">
                <section className="space-y-1 h-full min-h-0">
                  <div className="min-h-0">
                    <KPICardGrid data={activeMonthData} area="geral" compact />
                  </div>
                </section>
              </div>
            )}

            {mobileSection === 'investimentos' && (
              <div className="flex flex-col gap-1.5 animate-fadeIn h-full min-h-0">
                <section className="space-y-1.5 h-full min-h-0">
                  <MobileInvestmentList
                    investimentos={activeMonthData.investimentosTabela}
                    timestamp={activeMonthData.timestamp}
                    monthLabel={currentMonthData?.summary.monthLabel || ''}
                    showFooter={false}
                    dense
                  />
                </section>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="hidden md:flex flex-col p-5 h-full max-h-screen gap-4">
        <Header
          title={getHeaderTitle()}
          currentArea={currentArea}
          onChangeArea={setCurrentArea}
          currentMonthKey={selectedMonth}
          onChangeMonth={setSelectedMonth}
        />

        <div className="grid grid-cols-12 gap-4 items-stretch flex-grow min-h-0">
          <div className="col-span-12 xl:col-span-9 flex flex-col gap-4 h-full min-h-0">
            <KPICardGrid data={activeMonthData} area={currentArea} />
            <div className="grid grid-cols-12 gap-4 flex-grow min-h-0">
              <AdPerformanceChart
                anunciosData={activeMonthData.anuncios}
                monthLabel={currentMonthData?.summary.monthLabel || ''}
              />
              <ConversionFunnelTabs
                funnelData={activeMonthData.funil}
                leadsData={activeMonthData.leads}
                cidadesData={activeMonthData.cidades}
              />
            </div>
          </div>

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
