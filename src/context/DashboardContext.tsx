import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { MonthDataMap, DashboardDataPayload, MonthlySummary, TrafficSource, AcquisitionChannel, CityDistribution, CampaignPerformance } from '../types/dashboard';
import { InvestmentPayload, MonthlyCategoryInvestment } from '../types/investments';
import { ReportFilter, ConsolidatedReport } from '../types/reports';
import { mockDashboardData } from '../data/mockDashboardData';
import { mockInvestmentsData } from '../data/mockInvestments';
import { generateConsolidatedReport } from '../data/mockReports';

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
  upsertMonthData: (
    month: string,
    summaryInput: {
      activeBeneficiaries: number;
      newBeneficiaries: number;
      canceledBeneficiaries: number;
      leads: number;
      conversions: number;
      ltv?: number;
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
  // Estado para os dados de dashboard mensais
  const [allDashboardData, setAllDashboardData] = useState<MonthDataMap>(mockDashboardData);
  
  // Estado para os investimentos
  const [investmentsData, setInvestmentsData] = useState<InvestmentPayload>(mockInvestmentsData);

  // Mês selecionado no dashboard
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-05');

  // Filtro dos relatórios
  const [reportFilter, setReportFilter] = useState<ReportFilter>({
    startMonth: '2026-01',
    endMonth: '2026-05'
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
    },
    trafficInput: Omit<TrafficSource, 'conversionRate'>[],
    channelsInput: Omit<AcquisitionChannel, 'conversionRate'>[],
    citiesInput: CityDistribution[],
    campaignsInput: Omit<CampaignPerformance, 'ctr' | 'cpl' | 'cac'>[],
    investmentsInput: MonthlyCategoryInvestment[]
  ) => {
    // 1. Processar Investimentos
    const categories = investmentsData.categories;
    
    let totalMarketing = 0;
    let totalSales = 0;
    let totalOperational = 0;

    investmentsInput.forEach(inv => {
      const cat = categories.find(c => c.id === inv.categoryId);
      if (cat) {
        if (cat.type === 'marketing') totalMarketing += inv.amount;
        else if (cat.type === 'sales') totalSales += inv.amount;
        else if (cat.type === 'operational') totalOperational += inv.amount;
      }
    });

    const totalAmount = totalMarketing + totalSales + totalOperational;

    const newMonthlyInvestmentDetail = {
      month,
      investments: investmentsInput,
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

    // 2. Calcular KPIs para o Dashboard
    const conversionRate = summaryInput.leads > 0 
      ? (summaryInput.conversions / summaryInput.leads) * 100 
      : 0;

    const cac = summaryInput.newBeneficiaries > 0 
      ? totalAmount / summaryInput.newBeneficiaries 
      : 0;

    const churnRate = summaryInput.activeBeneficiaries > 0 
      ? (summaryInput.canceledBeneficiaries / summaryInput.activeBeneficiaries) * 100 
      : 0;

    // Calcular taxa de crescimento comparando com o mês anterior
    let growthRate = 0;
    const monthsSorted = [...Object.keys(allDashboardData), month].filter((v, i, a) => a.indexOf(v) === i).sort();
    const currentIdx = monthsSorted.indexOf(month);
    
    if (currentIdx > 0) {
      const prevMonth = monthsSorted[currentIdx - 1];
      const prevData = allDashboardData[prevMonth];
      if (prevData && prevData.summary.activeBeneficiaries > 0) {
        growthRate = ((summaryInput.activeBeneficiaries - prevData.summary.activeBeneficiaries) / prevData.summary.activeBeneficiaries) * 100;
      }
    }

    const ticketMedio = 120; // Ticket médio hipotético padrão
    const totalRevenue = summaryInput.activeBeneficiaries * ticketMedio;
    const ltv = summaryInput.ltv || (ticketMedio * (1 / (churnRate / 100 || 0.01)));

    // Formatar rótulo do mês (Ex: '2026-06' -> 'Junho/2026')
    const parts = month.split('-');
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const monthsNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const monthLabel = `${monthsNames[monthIndex]}/${year}`;

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
      churnRate: Math.round(churnRate * 100) / 100
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

    // Processar campanhas
    const campaigns: CampaignPerformance[] = campaignsInput.map(c => {
      const ctr = c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0;
      const cpl = c.leads > 0 ? c.spend / c.leads : 0;
      const cacCamp = c.conversions > 0 ? c.spend / c.conversions : 0;

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
