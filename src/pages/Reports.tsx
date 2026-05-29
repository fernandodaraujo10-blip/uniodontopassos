import React, { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, Printer, Calendar, DollarSign, Users, Award, Info } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { TrendCharts } from '../components/charts/TrendCharts';
import { exportarPDF } from '../utils/pdfExporter';

export const Reports: React.FC = () => {
  const { 
    reportFilter, 
    setReportFilter, 
    consolidatedReport, 
    availableMonths,
    selectedMonth
  } = useDashboard();

  // Estado local para controlar se exibe colunas detalhadas na tabela do relatório
  const [showChannelDetails, setShowChannelDetails] = useState<boolean>(false);

  // Estado para controlar se filtra apenas o mês atual do dashboard
  const [isCurrentMonthOnly, setIsCurrentMonthOnly] = useState<boolean>(false);
  const [prevMonths, setPrevMonths] = useState<{ start: string; end: string }>({
    start: reportFilter.startMonth,
    end: reportFilter.endMonth
  });

  // Atualiza os meses de início/fim caso o mês selecionado no painel mude e a caixa esteja ativa
  useEffect(() => {
    if (isCurrentMonthOnly) {
      setReportFilter({
        ...reportFilter,
        startMonth: selectedMonth,
        endMonth: selectedMonth
      });
    }
  }, [selectedMonth, isCurrentMonthOnly]);

  const handleCurrentMonthOnlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsCurrentMonthOnly(checked);
    if (checked) {
      setPrevMonths({
        start: reportFilter.startMonth,
        end: reportFilter.endMonth
      });
      setReportFilter({
        ...reportFilter,
        startMonth: selectedMonth,
        endMonth: selectedMonth
      });
    } else {
      setReportFilter({
        ...reportFilter,
        startMonth: prevMonths.start,
        endMonth: prevMonths.end
      });
    }
  };

  // Função para formatar moeda pt-BR
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  // Função para formatar número inteiro pt-BR
  const formatarNumero = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR').format(valor);
  };

  // Lógica de exportação real para CSV detalhado com canais
  const exportarCSV = () => {
    const headers = [
      'Mes',
      'Novos Beneficiarios',
      'Cancelados',
      'Leads',
      'Conversoes',
      'Taxa de Conversao (%)',
      'Investimento Marketing (R$)',
      'Investimento Vendas (R$)',
      'Gasto Google Ads (R$)',
      'Gasto Meta Ads (R$)',
      'Gasto Offline (R$)',
      'Investimento Total (R$)',
      'CAC (R$)',
      'CPL (R$)',
      'Churn Rate (%)'
    ];

    const dataRows = consolidatedReport.rows.map(row => [
      row.monthLabel,
      row.newBeneficiaries,
      row.canceledBeneficiaries,
      row.leads,
      row.conversions,
      row.conversionRate.toFixed(2).replace('.', ','),
      row.marketingSpend.toFixed(2).replace('.', ','),
      row.salesSpend.toFixed(2).replace('.', ','),
      row.googleAdsSpend.toFixed(2).replace('.', ','),
      row.metaAdsSpend.toFixed(2).replace('.', ','),
      row.offlineSpend.toFixed(2).replace('.', ','),
      row.totalSpend.toFixed(2).replace('.', ','),
      row.cac.toFixed(2).replace('.', ','),
      row.cpl.toFixed(2).replace('.', ','),
      row.churnRate.toFixed(2).replace('.', ',')
    ]);

    const totalsRow = [
      'TOTAL E MEDIAS',
      consolidatedReport.totals.totalNewBeneficiaries,
      consolidatedReport.totals.totalCanceledBeneficiaries,
      consolidatedReport.totals.totalLeads,
      consolidatedReport.totals.totalConversions,
      consolidatedReport.totals.averageConversionRate.toFixed(2).replace('.', ','),
      consolidatedReport.totals.totalMarketingSpend.toFixed(2).replace('.', ','),
      consolidatedReport.totals.totalSalesSpend.toFixed(2).replace('.', ','),
      consolidatedReport.totals.totalGoogleAdsSpend.toFixed(2).replace('.', ','),
      consolidatedReport.totals.totalMetaAdsSpend.toFixed(2).replace('.', ','),
      consolidatedReport.totals.totalOfflineSpend.toFixed(2).replace('.', ','),
      consolidatedReport.totals.totalSpend.toFixed(2).replace('.', ','),
      consolidatedReport.totals.averageCac.toFixed(2).replace('.', ','),
      consolidatedReport.totals.averageCpl.toFixed(2).replace('.', ','),
      consolidatedReport.totals.averageChurnRate.toFixed(2).replace('.', ',')
    ];

    // Adiciona Byte Order Mark (BOM) para compatibilidade perfeita com Excel no Windows
    const csvContent = '\uFEFF' + [
      headers.join(';'),
      ...dataRows.map(r => r.join(';')),
      totalsRow.join(';')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Relatorio_Consolidado_Uniodonto_${reportFilter.startMonth}_a_${reportFilter.endMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    exportarPDF(consolidatedReport, reportFilter, showChannelDetails);
  };

  return (
    <div className="flex-grow overflow-y-auto p-4 md:p-5 pb-28 lg:pb-5 bg-[#F8F9FA] flex flex-col h-full md:max-h-screen page-transition print:p-0 print:bg-white print:max-w-full">
      {/* Estilos CSS Embutidos para Impressão Premium A4 de Alto Contraste */}
      <style>{`
        @media print {
          html, body {
            background-color: #ffffff !important;
            color: #000000 !important;
            font-family: 'Inter', sans-serif !important;
            font-size: 11px !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Remove barras de rolagem e alturas fixas de contêineres na impressão */
          .overflow-y-auto, .flex-grow, .max-h-screen {
            overflow: visible !important;
            max-height: none !important;
            height: auto !important;
          }
          
          /* Otimiza espaçamento e margens no papel A4 */
          .print\\:p-0 {
            padding: 0 !important;
          }
          .p-8 {
            padding: 1.5rem !important;
          }
          .mb-6 {
            margin-bottom: 1rem !important;
          }
          .mt-8 {
            margin-top: 1.5rem !important;
          }
          
          /* Força textos e bordas em preto de alta definição */
          .text-gray-800, .text-gray-900, .text-gray-700, .text-gray-500, .text-gray-400 {
            color: #000000 !important;
          }
          .text-pink-700 {
            color: #880E4F !important; /* Rosa bem escuro para legibilidade na impressão */
          }
          
          /* Borda fina de alta fidelidade para tabelas e divisórias */
          .border-b, .border-t, .divide-y > * {
            border-color: #cbd5e1 !important;
          }
          
          /* Oculta sombras de cards */
          .card-shadow, .shadow-md, .shadow-sm {
            box-shadow: none !important;
            border: 1px solid #cbd5e1 !important;
          }
          
          /* Otimização de layouts do grid executivo */
          .grid {
            display: grid !important;
            gap: 0.75rem !important;
          }
          
          /* Impede quebra órfã de páginas dentro de blocos essenciais */
          table, tr, .bg-gray-50\\/50 {
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      <header className="mb-3 lg:mb-6 shrink-0 print:hidden select-none">
        <h1 className="text-[30px] lg:text-3xl font-bold text-gray-800 leading-tight">
          <span className="lg:hidden">Relatórios</span>
          <span className="hidden lg:inline">Relatórios Analíticos</span>
        </h1>
        <p className="text-[15px] lg:text-sm text-gray-500 mt-1 leading-relaxed">
          <span className="lg:hidden">Exporte análises comerciais e de marketing.</span>
          <span className="hidden lg:inline">Gere e exporte relatórios consolidados de investimentos, captação comercial e CAC de forma modular.</span>
        </p>
      </header>

      {/* Grid de Conteúdo Principal */}
      <div className="flex flex-col xl:grid xl:grid-cols-12 gap-6 flex-grow overflow-y-auto pr-1 print:overflow-visible print:block print:p-0">
        
        {/* Lado Esquerdo: Prévia do Relatório Executivo A4 (Apenas Desktop e Impressão) */}
        <div className="w-full xl:col-span-9 bg-white rounded-2xl md:rounded-3xl border border-gray-100 card-shadow p-4 md:p-8 flex-col min-h-0 print:border-none print:shadow-none print:p-0 print:rounded-none hidden lg:flex print:flex">
          
          {/* Cabeçalho do Relatório Timbrado */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-700/20 pb-4 mb-6 print:border-pink-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-700 to-pink-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md print:from-black print:to-black">
                U
              </div>
              <div className="text-left">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 font-sans tracking-wide">Uniodonto Passos</h2>
                <p className="text-[10px] sm:text-xs text-pink-700 font-bold uppercase tracking-widest leading-none print:text-pink-800">Relatório Executivo de Captação</p>
              </div>
            </div>
            
            <div className="text-left sm:text-right text-[9px] sm:text-[10px] text-gray-400 font-medium leading-relaxed">
              <p>Gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
              <p>Período: {reportFilter.startMonth} a {reportFilter.endMonth} {reportFilter.channel && reportFilter.channel !== 'all' ? `• Canal: ${reportFilter.channel.toUpperCase()}` : ''}</p>
            </div>
          </div>

          {/* Seção 1: Métricas Consolidadas do Topo do Relatório */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 select-none">
            <div className="bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100 flex flex-col justify-between hover:border-pink-200 transition-colors print:bg-white print:border-gray-200">
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3 text-pink-700 print:text-black" /> Novos Beneficiários
              </span>
              <span className="text-xl font-bold text-gray-900 mt-1">
                {formatarNumero(consolidatedReport.totals.totalNewBeneficiaries)}
              </span>
            </div>
            <div className="bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100 flex flex-col justify-between hover:border-pink-200 transition-colors print:bg-white print:border-gray-200">
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-pink-700 print:text-black" /> Total Investido
              </span>
              <span className="text-xl font-bold text-gray-900 mt-1">
                {formatarMoeda(consolidatedReport.totals.totalSpend)}
              </span>
            </div>
            <div className="bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100 flex flex-col justify-between hover:border-pink-200 transition-colors print:bg-white print:border-gray-200">
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                <Award className="w-3 h-3 text-pink-700 print:text-black" /> CAC Médio
              </span>
              <span className="text-xl font-bold text-pink-700 mt-1 print:text-black">
                {formatarMoeda(consolidatedReport.totals.averageCac)}
              </span>
            </div>
            <div className="bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100 flex flex-col justify-between hover:border-pink-200 transition-colors print:bg-white print:border-gray-200">
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-pink-700 print:text-black" /> Taxa de Conversão
              </span>
              <span className="text-xl font-bold text-gray-900 mt-1">
                {consolidatedReport.totals.averageConversionRate.toFixed(1).replace('.', ',')}%
              </span>
            </div>
          </div>

          {/* NOVO: Gráficos de Linha de Tendência de CAC e Churn */}
          <TrendCharts rows={consolidatedReport.rows} />

          {/* Tabela de Dados Consolidados */}
          <div className="flex-grow overflow-x-auto min-h-0 print:overflow-visible -mx-4 px-4 md:mx-0 md:px-0">
            <table className={`text-left text-xs border-collapse ${showChannelDetails && reportFilter.channel === 'all' ? 'min-w-[1000px]' : 'min-w-[650px]'} w-full`}>
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-[10px] uppercase font-bold text-gray-500 select-none print:bg-transparent">
                  <th className="py-3 px-3">Mês</th>
                  <th className="py-3 px-3 text-right">Novos Benef.</th>
                  <th className="py-3 px-3 text-right">Leads</th>
                  <th className="py-3 px-3 text-right">Conv.</th>
                  <th className="py-3 px-3 text-right">Tx. Conv.</th>
                  
                  {/* Colunas Opcionais de Detalhamento por Canal */}
                  {showChannelDetails && reportFilter.channel === 'all' && (
                    <>
                      <th className="py-3 px-3 text-right">Google Ads</th>
                      <th className="py-3 px-3 text-right">Meta Ads</th>
                      <th className="py-3 px-3 text-right">Offline</th>
                    </>
                  )}

                  <th className="py-3 px-3 text-right">Total Investido</th>
                  <th className="py-3 px-3 text-right">CAC</th>
                  <th className="py-3 px-3 text-right">Churn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {consolidatedReport.rows.map((row) => (
                  <tr key={row.month} className="hover:bg-gray-50/30 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-gray-800">{row.monthLabel}</td>
                    <td className="py-2.5 px-3 text-right">{formatarNumero(row.newBeneficiaries)}</td>
                    <td className="py-2.5 px-3 text-right">{formatarNumero(row.leads)}</td>
                    <td className="py-2.5 px-3 text-right">{formatarNumero(row.conversions)}</td>
                    <td className="py-2.5 px-3 text-right">{row.conversionRate.toFixed(1).replace('.', ',')}%</td>
                    
                    {/* Exibe valores individuais dos canais se o checkbox estiver ativo */}
                    {showChannelDetails && reportFilter.channel === 'all' && (
                      <>
                        <td className="py-2.5 px-3 text-right text-gray-500">{formatarMoeda(row.googleAdsSpend)}</td>
                        <td className="py-2.5 px-3 text-right text-gray-500">{formatarMoeda(row.metaAdsSpend)}</td>
                        <td className="py-2.5 px-3 text-right text-gray-500">{formatarMoeda(row.offlineSpend)}</td>
                      </>
                    )}

                    <td className="py-2.5 px-3 text-right font-medium">{formatarMoeda(row.totalSpend)}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-pink-700 print:text-black">{formatarMoeda(row.cac)}</td>
                    <td className="py-2.5 px-3 text-right text-gray-400">
                      {row.churnRate > 0 ? `${row.churnRate.toFixed(2).replace('.', ',')}%` : '▬'}
                    </td>
                  </tr>
                ))}
                
                {/* Linha Consolidada de Totais */}
                <tr className="border-t-2 border-gray-100 font-bold bg-pink-50/10 text-gray-900 select-none print:bg-transparent">
                  <td className="py-3 px-3 text-pink-700 uppercase tracking-wide print:text-black">Total/Média</td>
                  <td className="py-3 px-3 text-right">{formatarNumero(consolidatedReport.totals.totalNewBeneficiaries)}</td>
                  <td className="py-3 px-3 text-right">{formatarNumero(consolidatedReport.totals.totalLeads)}</td>
                  <td className="py-3 px-3 text-right">{formatarNumero(consolidatedReport.totals.totalConversions)}</td>
                  <td className="py-3 px-3 text-right">{consolidatedReport.totals.averageConversionRate.toFixed(1).replace('.', ',')}%</td>
                  
                  {/* Totais das Colunas de Detalhamento */}
                  {showChannelDetails && reportFilter.channel === 'all' && (
                    <>
                      <td className="py-3 px-3 text-right text-pink-700/80 print:text-black">{formatarMoeda(consolidatedReport.totals.totalGoogleAdsSpend)}</td>
                      <td className="py-3 px-3 text-right text-pink-700/80 print:text-black">{formatarMoeda(consolidatedReport.totals.totalMetaAdsSpend)}</td>
                      <td className="py-3 px-3 text-right text-pink-700/80 print:text-black">{formatarMoeda(consolidatedReport.totals.totalOfflineSpend)}</td>
                    </>
                  )}

                  <td className="py-3 px-3 text-right text-pink-700 print:text-black">{formatarMoeda(consolidatedReport.totals.totalSpend)}</td>
                  <td className="py-3 px-3 text-right text-pink-700 font-extrabold print:text-black">{formatarMoeda(consolidatedReport.totals.averageCac)}</td>
                  <td className="py-3 px-3 text-right text-gray-400">
                    {consolidatedReport.totals.averageChurnRate > 0 
                      ? `${consolidatedReport.totals.averageChurnRate.toFixed(2).replace('.', ',')}%` 
                      : '▬'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 select-none print:mt-4 print:border-pink-800">
            <span>Uniodonto Passos Ltda. • Departamento Comercial</span>
            <span>Página 1 de 1</span>
          </div>
        </div>

        {/* Lado Direito: Filtros e Configurações Globais no Desktop (Sidebar Oculta na Impressão e no Mobile) */}
        <div className="hidden lg:flex lg:flex-col xl:col-span-3 space-y-6 print:hidden">
          <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 card-shadow p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3 select-none">
              <Calendar className="w-5 h-5 text-pink-700" />
              <h2 className="text-md font-bold text-gray-800">Configurações de Filtro</h2>
            </div>
            
            <div className="space-y-4 text-xs font-medium text-gray-500 select-none">
              {/* Checkbox Mês Atual */}
              <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                <input 
                  type="checkbox" 
                  id="currentMonthOnly"
                  checked={isCurrentMonthOnly}
                  onChange={handleCurrentMonthOnlyChange}
                  className="w-4 h-4 text-pink-700 border-gray-200 rounded focus:ring-pink-500 accent-pink-700 cursor-pointer"
                />
                <label htmlFor="currentMonthOnly" className="text-gray-700 font-bold cursor-pointer select-none">
                  Filtrar apenas Mês Atual
                </label>
              </div>

              <div>
                <label className={`block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 transition-opacity duration-200 ${isCurrentMonthOnly ? 'opacity-50' : ''}`}>Mês de Início</label>
                <select 
                  value={reportFilter.startMonth}
                  onChange={(e) => setReportFilter({ ...reportFilter, startMonth: e.target.value })}
                  disabled={isCurrentMonthOnly}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 focus:outline-none focus:border-pink-200 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100/50 transition-all duration-200 cursor-pointer"
                >
                  {availableMonths.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 transition-opacity duration-200 ${isCurrentMonthOnly ? 'opacity-50' : ''}`}>Mês de Fim</label>
                <select 
                  value={reportFilter.endMonth}
                  onChange={(e) => setReportFilter({ ...reportFilter, endMonth: e.target.value })}
                  disabled={isCurrentMonthOnly}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 focus:outline-none focus:border-pink-200 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100/50 transition-all duration-200 cursor-pointer"
                >
                  {availableMonths.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Dropdown de Filtro de Canal Comercial */}
              <div>
                <label className="block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Canal Comercial</label>
                <select 
                  value={reportFilter.channel || 'all'}
                  onChange={(e) => setReportFilter({ ...reportFilter, channel: e.target.value as any })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 focus:outline-none focus:border-pink-200 text-gray-700 font-semibold cursor-pointer"
                >
                  <option value="all">Todos os Canais</option>
                  <option value="google">Google Ads</option>
                  <option value="meta">Meta Ads</option>
                  <option value="offline">Offline (Eventos & Parcerias)</option>
                </select>
              </div>

              {/* Checkbox para detalhamento de canais na tabela */}
              {reportFilter.channel === 'all' && (
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                  <input 
                    type="checkbox" 
                    id="showChannelDetails"
                    checked={showChannelDetails}
                    onChange={(e) => setShowChannelDetails(e.target.checked)}
                    className="w-4 h-4 text-pink-700 border-gray-200 rounded focus:ring-pink-500 accent-pink-700 cursor-pointer"
                  />
                  <label htmlFor="showChannelDetails" className="text-gray-600 font-semibold cursor-pointer select-none">
                    Detalhar Canais na Tabela
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 card-shadow p-4 md:p-6 select-none">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
              <FileText className="w-5 h-5 text-pink-700" />
              <h2 className="text-md font-bold text-gray-800">Ações de Exportação</h2>
            </div>

            <div className="space-y-3">
              <button
                onClick={exportarCSV}
                className="w-full py-3 bg-pink-700 text-white font-bold rounded-xl shadow-md hover:scale-103 active:scale-98 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <Download className="w-4 h-4" />
                <span>Exportar em CSV</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="w-full py-3 bg-white border border-pink-700/30 text-pink-700 font-bold rounded-xl shadow-sm hover:bg-pink-50/50 active:scale-98 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Salvar como PDF</span>
              </button>

              <button
                onClick={handlePrint}
                className="w-full py-3 bg-white border border-pink-700/30 text-pink-700 font-bold rounded-xl shadow-sm hover:bg-pink-50/50 active:scale-98 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Relatório (A4)</span>
              </button>
              
              <p className="text-[10px] text-gray-400 mt-2 text-center select-none leading-normal">
                💡 <b>Dica de PDF:</b> Ao clicar em <i>Salvar como PDF</i> ou <i>Imprimir</i>, a janela do navegador se abrirá. Selecione <b>"Salvar como PDF"</b> no campo <i>Destino</i> para fazer o download digital do relatório A4.
              </p>
            </div>
          </div>
        </div>

        {/* Layout Mobile Específico (Oculto no Desktop e na Impressão) */}
        <div className="flex flex-col space-y-4 lg:hidden print:hidden pb-12 w-full">
          {/* Card de Filtros Compacto */}
          <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-4">
            <div className="flex items-center gap-2 mb-3 border-b border-gray-50 pb-2.5 select-none">
              <Calendar className="w-5 h-5 text-pink-700" />
              <h2 className="text-[15px] font-bold text-gray-800">Filtros</h2>
            </div>
            
            <div className="space-y-3 text-xs font-semibold text-gray-500">
              {/* Checkbox Mês Atual */}
              <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                <input 
                  type="checkbox" 
                  id="currentMonthOnlyMob"
                  checked={isCurrentMonthOnly}
                  onChange={handleCurrentMonthOnlyChange}
                  className="w-4 h-4 text-pink-700 border-gray-200 rounded focus:ring-pink-500 accent-pink-700 cursor-pointer"
                />
                <label htmlFor="currentMonthOnlyMob" className="text-gray-700 font-bold cursor-pointer select-none">
                  Filtrar apenas Mês Atual
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 transition-opacity duration-200 ${isCurrentMonthOnly ? 'opacity-50' : ''}`}>Início</label>
                  <select 
                    value={reportFilter.startMonth}
                    onChange={(e) => setReportFilter({ ...reportFilter, startMonth: e.target.value })}
                    disabled={isCurrentMonthOnly}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 focus:outline-none focus:border-pink-200 text-gray-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100/50 transition-all duration-200 cursor-pointer"
                  >
                    {availableMonths.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 transition-opacity duration-200 ${isCurrentMonthOnly ? 'opacity-50' : ''}`}>Fim</label>
                  <select 
                    value={reportFilter.endMonth}
                    onChange={(e) => setReportFilter({ ...reportFilter, endMonth: e.target.value })}
                    disabled={isCurrentMonthOnly}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 focus:outline-none focus:border-pink-200 text-gray-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100/50 transition-all duration-200 cursor-pointer"
                  >
                    {availableMonths.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Canal Comercial</label>
                <select 
                  value={reportFilter.channel || 'all'}
                  onChange={(e) => setReportFilter({ ...reportFilter, channel: e.target.value as any })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 focus:outline-none focus:border-pink-200 text-gray-700 font-bold cursor-pointer"
                >
                  <option value="all">Todos os Canais</option>
                  <option value="google">Google Ads</option>
                  <option value="meta">Meta Ads</option>
                  <option value="offline">Offline (Eventos & Parcerias)</option>
                </select>
              </div>

              {reportFilter.channel === 'all' && (
                <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                  <input 
                    type="checkbox" 
                    id="showChannelDetailsMob"
                    checked={showChannelDetails}
                    onChange={(e) => setShowChannelDetails(e.target.checked)}
                    className="w-4 h-4 text-pink-700 border-gray-200 rounded focus:ring-pink-500 accent-pink-700 cursor-pointer"
                  />
                  <label htmlFor="showChannelDetailsMob" className="text-gray-600 font-bold cursor-pointer select-none">
                    Detalhar Canais na Tabela
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Card de Ações de Exportação */}
          <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-4 select-none">
            <div className="flex items-center gap-2 mb-3 border-b border-gray-50 pb-2.5">
              <FileText className="w-5 h-5 text-pink-700" />
              <h2 className="text-[15px] font-bold text-gray-800">Ações de Exportação</h2>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  alert('Relatório processado e gerado com sucesso!');
                }}
                className="w-full h-12 bg-pink-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md active:scale-98 transition-all duration-200 cursor-pointer"
              >
                <span>Gerar Relatório</span>
              </button>

              <div className="flex gap-3">
                <button
                  onClick={exportarCSV}
                  className="w-1/2 h-12 bg-white border border-pink-700/30 text-pink-700 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm hover:bg-pink-50/50 active:scale-98 transition-all duration-200 cursor-pointer"
                >
                  <Download className="w-4 h-4 animate-bounce" />
                  <span>CSV</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="w-1/2 h-12 bg-white border border-pink-700/30 text-pink-700 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm hover:bg-pink-50/50 active:scale-98 transition-all duration-200 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-pink-700" />
                  <span>PDF</span>
                </button>
              </div>

              <button
                onClick={handlePrint}
                className="w-full h-12 bg-white border border-pink-700/30 text-pink-700 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm hover:bg-pink-50/50 active:scale-98 transition-all duration-200 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-pink-700" />
                <span>Imprimir Relatório (A4)</span>
              </button>
            </div>
          </div>

          {/* Card Informativo de PDF */}
          <div className="bg-slate-50 border border-gray-100 rounded-2xl p-3 flex items-start gap-2.5 select-none">
            <Info className="w-4 h-4 text-pink-700 shrink-0 mt-0.5" />
            <p className="text-[13px] text-gray-500 font-medium leading-normal text-left">
              Para salvar em PDF, toque em 'PDF'. A janela do navegador será aberta para concluir o download.
            </p>
          </div>

          {/* Card de Prévia do Relatório */}
          <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-4 select-none">
            <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-2.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pink-700" />
                <h2 className="text-[15px] font-bold text-gray-800">Prévia do Relatório</h2>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full">
                Pronto para exportar
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-50 py-1 text-left">
                <span className="text-gray-400 font-medium">Período</span>
                <span className="font-bold text-gray-700">{reportFilter.startMonth} a {reportFilter.endMonth}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 py-1 text-left">
                <span className="text-gray-400 font-medium">Canal</span>
                <span className="font-bold text-gray-700">
                  {reportFilter.channel === 'all' ? 'Todos os Canais' : reportFilter.channel === 'google' ? 'Google Ads' : reportFilter.channel === 'meta' ? 'Meta Ads' : 'Offline'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-50 py-1 text-left">
                <span className="text-gray-400 font-medium">Investimento</span>
                <span className="font-bold text-gray-700">{formatarMoeda(consolidatedReport.totals.totalSpend)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 py-1 text-left">
                <span className="text-gray-400 font-medium">Leads</span>
                <span className="font-bold text-gray-700">{formatarNumero(consolidatedReport.totals.totalLeads)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 py-1 text-left">
                <span className="text-gray-400 font-medium">Conversões</span>
                <span className="font-bold text-gray-700">{formatarNumero(consolidatedReport.totals.totalConversions)}</span>
              </div>
              <div className="flex justify-between py-1 text-left">
                <span className="text-gray-400 font-medium">CAC Médio</span>
                <span className="font-bold text-pink-700">{formatarMoeda(consolidatedReport.totals.averageCac)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
