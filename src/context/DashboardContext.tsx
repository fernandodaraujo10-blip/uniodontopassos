import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { MonthDataMap, DashboardDataPayload, MonthlySummary, TrafficSource, AcquisitionChannel, CityDistribution, CampaignPerformance } from '../types/dashboard';
import { InvestmentPayload, MonthlyCategoryInvestment } from '../types/investments';
import { ReportFilter, ConsolidatedReport } from '../types/reports';
import { mockDashboardData } from '../data/mockDashboardData';
import { mockInvestmentsData } from '../data/mockInvestments';
import { generateConsolidatedReport } from '../data/mockReports';
import { safeDivide } from '../utils/dataValidator';
import { 
  calcularTaxaConversao, 
  calcularCAC, 
  calcularChurn, 
  calcularLTV, 
  processarInvestimentos, 
  formatarMonthLabel 
} from '../utils/dashboardCalculations';

interface DashboardContextProps {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  availableMonths: { value: string; label: string }[];
  currentMonthData: DashboardDataPayload | undefined;
  allDashboardData: MonthDataMap;
  investmentsData: InvestmentPayload;
  reportFilter: ReportFilter;
  setReportFilter: (filter: ReportFilter) => void;
  consolidatedReport: ConsolidatedReport;
  resetToDefaultData: () => void;
  upsertMonthData: (
    month: string,
    summaryInput: {
      activeBeneficiaries: number;
      newBeneficiaries: number;
      canceledBeneficiaries: number;
      leads: number;
      conversions: number;
      ltv?: number;
      nps?: number;
    },
    trafficInput: Omit<TrafficSource, 'conversionRate'>[],
    channelsInput: Omit<AcquisitionChannel, 'conversionRate'>[],
    citiesInput: CityDistribution[],
    campaignsInput: Omit<CampaignPerformance, 'ctr' | 'cpl' | 'cac'>[],
    investmentsInput: MonthlyCategoryInvestment[]
  ) => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  // Estado para os dados de dashboard mensais e investimentos com controle de versão para limpar caches antigos
  const [allDashboardData, setAllDashboardData] = useState<MonthDataMap>(() => {
    const version = localStorage.getItem('uniodonto_dashboard_version');
    if (version !== 'v1.5') {
      localStorage.setItem('uniodonto_dashboard_version', 'v1.5');
      localStorage.setItem('uniodonto_dashboard_data', JSON.stringify(mockDashboardData));
      localStorage.setItem('uniodonto_investments_data', JSON.stringify(mockInvestmentsData));
      return mockDashboardData;
    }
    const saved = localStorage.getItem('uniodonto_dashboard_data');
    return saved ? JSON.parse(saved) : mockDashboardData;
  });
  
  // Estado para os investimentos
  const [investmentsData, setInvestmentsData] = useState<InvestmentPayload>(() => {
    const version = localStorage.getItem('uniodonto_dashboard_version');
    if (version !== 'v1.5') {
      return mockInvestmentsData;
    }
    const saved = localStorage.getItem('uniodonto_investments_data');
    return saved ? JSON.parse(saved) : mockInvestmentsData;
  });

  // Salvar no LocalStorage sempre que houver alteração
  useEffect(() => {
    localStorage.setItem('uniodonto_dashboard_data', JSON.stringify(allDashboardData));
  }, [allDashboardData]);

  useEffect(() => {
    localStorage.setItem('uniodonto_investments_data', JSON.stringify(investmentsData));
  }, [investmentsData]);

  // Função para limpar o banco de dados local e restaurar mocks
  const resetToDefaultData = () => {
    localStorage.removeItem('uniodonto_dashboard_data');
    localStorage.removeItem('uniodonto_investments_data');
    setAllDashboardData(mockDashboardData);
    setInvestmentsData(mockInvestmentsData);
    setSelectedMonth('2026-05');
  };

  // Mês selecionado no dashboard
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-05');

  // Filtro dos relatórios
  const [reportFilter, setReportFilter] = useState<ReportFilter>({
    startMonth: '2026-01',
    endMonth: '2026-05',
    reportType: 'executive'
  });

  // Lista de meses disponíveis ordenada
  const availableMonths = useMemo(() => {
    return Object.keys(allDashboardData)
      .sort()
      .map(month => ({
        value: month,
        label: allDashboardData[month].summary.monthLabel
      }));
  }, [allDashboardData]);

  // Dados do mês selecionado
  const currentMonthData = useMemo(() => {
    return allDashboardData[selectedMonth];
  }, [allDashboardData, selectedMonth]);

  // Relatório consolidado gerado dinamicamente com base nos filtros
  const consolidatedReport = useMemo(() => {
    return generateConsolidatedReport(reportFilter, allDashboardData, investmentsData);
  }, [reportFilter, allDashboardData, investmentsData]);

  // Função avançada para inserir ou atualizar dados mensais (usada na tela de Envio de Dados)
  const upsertMonthData = (
    month: string,
    summaryInput: {
      activeBeneficiaries: number;
      newBeneficiaries: number;
      canceledBeneficiaries: number;
      leads: number;
      conversions: number;
      ltv?: number;
      nps?: number;
    },
    trafficInput: Omit<TrafficSource, 'conversionRate'>[],
    channelsInput: Omit<AcquisitionChannel, 'conversionRate'>[],
    citiesInput: CityDistribution[],
    campaignsInput: Omit<CampaignPerformance, 'ctr' | 'cpl' | 'cac'>[],
    investmentsInput: MonthlyCategoryInvestment[]
  ) => {
    // 1. Processar Investimentos
    let categories = [...investmentsData.categories];
    let categoriesUpdated = false;

    investmentsInput.forEach(inv => {
      const exists = categories.some(c => c.id === inv.categoryId);
      if (!exists) {
        categories.push({
          id: inv.categoryId,
          name: inv.customName || inv.categoryId,
          type: inv.customType || 'marketing'
        });
        categoriesUpdated = true;
      }
    });
    
    // Processar usando a biblioteca de cálculos centralizada
    const { totalMarketing, totalSales, totalOperational, totalAmount } = processarInvestimentos(investmentsInput, categories);

    const newMonthlyInvestmentDetail = {
      month,
      investments: investmentsInput.map(inv => ({ categoryId: inv.categoryId, amount: inv.amount, isFixed: !!inv.isFixed })),
      totalMarketing,
      totalSales,
      totalOperational,
      totalAmount
    };

    const updatedMonthlyDetails = {
      ...investmentsData.monthlyDetails,
      [month]: newMonthlyInvestmentDetail
    };

    const nextInvestmentsData: InvestmentPayload = {
      categories,
      monthlyDetails: updatedMonthlyDetails
    };

    setInvestmentsData(nextInvestmentsData);

    // 2. Calcular KPIs usando a central de cálculos
    const conversionRate = calcularTaxaConversao(summaryInput.conversions, summaryInput.leads);
    const cac = calcularCAC(totalAmount, summaryInput.newBeneficiaries);
    const churnRate = calcularChurn(summaryInput.canceledBeneficiaries, summaryInput.activeBeneficiaries);

    // Calcular taxa de crescimento comparando com o mês anterior
    let growthRate = 0;
    const monthsSorted = [...Object.keys(allDashboardData), month].filter((v, i, a) => a.indexOf(v) === i).sort();
    const currentIdx = monthsSorted.indexOf(month);
    
    if (currentIdx > 0) {
      const prevMonth = monthsSorted[currentIdx - 1];
      const prevData = allDashboardData[prevMonth];
      if (prevData && prevData.summary.activeBeneficiaries > 0) {
        growthRate = safeDivide(summaryInput.activeBeneficiaries - prevData.summary.activeBeneficiaries, prevData.summary.activeBeneficiaries) * 100;
      }
    }

    const ticketMedio = 120; // Ticket médio hipotético padrão
    const totalRevenue = summaryInput.activeBeneficiaries * ticketMedio;
    const ltv = calcularLTV(ticketMedio, churnRate, summaryInput.ltv);

    // Formatar rótulo do mês usando a central
    const monthLabel = formatarMonthLabel(month);

    const summary: MonthlySummary = {
      month,
      monthLabel,
      activeBeneficiaries: summaryInput.activeBeneficiaries,
      newBeneficiaries: summaryInput.newBeneficiaries,
      canceledBeneficiaries: summaryInput.canceledBeneficiaries,
      growthRate: Math.round(growthRate * 100) / 100,
      leads: summaryInput.leads,
      conversions: summaryInput.conversions,
      conversionRate: Math.round(conversionRate * 100) / 100,
      cac: Math.round(cac * 100) / 100,
      ltv: Math.round(ltv * 100) / 100,
      totalRevenue,
      churnRate: Math.round(churnRate * 100) / 100,
      nps: summaryInput.nps
    };

    // Processar origens de tráfego com taxa de conversão calculada
    const trafficSources: TrafficSource[] = trafficInput.map(t => {
      // Tenta achar investimento específico correspondente
      let investment = 0;
      if (t.source.toLowerCase().includes('google')) {
        investment = investmentsInput.find(i => i.categoryId === 'marketing_google')?.amount || 0;
      } else if (t.source.toLowerCase().includes('meta')) {
        investment = investmentsInput.find(i => i.categoryId === 'marketing_meta')?.amount || 0;
      }

      return {
        ...t,
        conversionRate: t.leads > 0 ? Math.round((t.conversions / t.leads) * 10000) / 100 : 0,
        investment
      };
    });

    // Processar canais
    const acquisitionChannels: AcquisitionChannel[] = channelsInput.map(c => ({
      ...c,
      conversionRate: c.leads > 0 ? Math.round((c.conversions / c.leads) * 10000) / 100 : 0
    }));

    // Processar campanhas usando divisão segura
    const campaigns: CampaignPerformance[] = campaignsInput.map(c => {
      const ctr = safeDivide(c.clicks, c.impressions) * 100;
      const cpl = safeDivide(c.spend, c.leads);
      const cacCamp = safeDivide(c.spend, c.conversions);

      return {
        ...c,
        ctr: Math.round(ctr * 100) / 100,
        cpl: Math.round(cpl * 100) / 100,
        cac: Math.round(cacCamp * 100) / 100
      };
    });

    const newPayload: DashboardDataPayload = {
      summary,
      trafficSources,
      acquisitionChannels,
      cityDistribution: citiesInput,
      campaigns
    };

    setAllDashboardData((prev: MonthDataMap) => ({
      ...prev,
      [month]: newPayload
    }));

    // Se inserirmos dados de um mês mais recente ou o mês inserido for o atual, selecionamos ele
    setSelectedMonth(month);
  };

  return (
    <DashboardContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        availableMonths,
        currentMonthData,
        allDashboardData,
        investmentsData,
        reportFilter,
        setReportFilter,
        consolidatedReport,
        resetToDefaultData,
        upsertMonthData
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard deve ser utilizado sob o provedor DashboardProvider');
  }
  return context;
};
