import { useDashboard as useDashboardContext } from '../context/DashboardContext';
import { ConsolidatedReportRow } from '../types/reports';

export const useDashboard = () => {
  const context = useDashboardContext();

  // Função utilitária para converter e baixar dados tabulares em formato CSV
  const exportToCSV = (headers: string[], rows: (string | number)[][], filename: string) => {
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(val => {
        // Trata strings com ponto e vírgula e substitui pontos decimais por vírgulas para padrão PT-BR no Excel
        if (typeof val === 'number') {
          return val.toString().replace('.', ',');
        }
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(';'))
    ].join('\n');

    // Cria um Blob e dispara o download no navegador
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exportação dedicada para o Relatório Consolidado Mensal
  const exportConsolidatedReportCSV = () => {
    const report = context.consolidatedReport;
    const headers = [
      'Mês',
      'Beneficiários Ativos',
      'Novas Vendas',
      'Cancelados (Churn)',
      'Taxa de Churn (%)',
      'Leads Gerados',
      'Conversões',
      'Taxa de Conversão (%)',
      'Inv. Marketing (R$)',
      'Inv. Vendas (R$)',
      'Investimento Total (R$)',
      'CAC (R$)',
      'CPL (R$)'
    ];

    const rows = report.rows.map((row: ConsolidatedReportRow) => [
      row.monthLabel,
      row.activeBeneficiaries,
      row.newBeneficiaries,
      row.canceledBeneficiaries,
      row.churnRate,
      row.leads,
      row.conversions,
      row.conversionRate,
      row.marketingSpend,
      row.salesSpend,
      row.totalSpend,
      row.cac,
      row.cpl
    ]);

    // Adiciona linha de totais / médias no final
    const totals = report.totals;
    rows.push([
      'TOTAL/MÉDIA CONSOLIDADA',
      '-',
      totals.totalNewBeneficiaries,
      totals.totalCanceledBeneficiaries,
      totals.averageChurnRate,
      totals.totalLeads,
      totals.totalConversions,
      totals.averageConversionRate,
      totals.totalMarketingSpend,
      totals.totalSalesSpend,
      totals.totalSpend,
      totals.averageCac,
      totals.averageCpl
    ]);

    const filename = `relatorio-consolidado-${report.filter.startMonth}-a-${report.filter.endMonth}.csv`;
    exportToCSV(headers, rows, filename);
  };

  return {
    ...context,
    exportToCSV,
    exportConsolidatedReportCSV
  };
};
