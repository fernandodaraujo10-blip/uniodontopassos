import React from 'react';
import { FileText, Download, TrendingUp, Printer } from 'lucide-react';

export const Reports: React.FC = () => {
  const mockReports = [
    { id: '1', title: 'Relatório Consolidado de Captação - Maio 2026', date: '28/05/2026', size: '2.4 MB', type: 'PDF' },
    { id: '2', title: 'Performance Financeira vs. Meta Anual - Q1 2026', date: '15/05/2026', size: '4.8 MB', type: 'XLSX' },
    { id: '3', title: 'Análise de Churn e Satisfação NPS - Maio 2026', date: '12/05/2026', size: '1.2 MB', type: 'PDF' },
    { id: '4', title: 'Auditoria de Anúncios e Custos por Canal - Abril 2026', date: '05/05/2026', size: '3.1 MB', type: 'PDF' },
  ];

  return (
    <div className="flex-grow overflow-hidden p-5 bg-[#F8F9FA] flex flex-col h-full max-h-screen">
      <header className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-800">Relatórios</h1>
        <p className="text-sm text-gray-500 mt-1">
          Acesse e exporte relatórios consolidados de captação, investimentos e satisfação.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow overflow-y-auto pr-1">
        {/* Coluna de Relatórios Disponíveis (Span 2) */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 card-shadow p-6 flex flex-col h-fit">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
            <FileText className="w-6 h-6 text-pink-700" />
            <h2 className="text-lg font-bold text-gray-800">Relatórios Gerados</h2>
          </div>

          <div className="space-y-4">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-pink-200 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-pink-700 font-bold text-xs">
                    {report.type}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">{report.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Gerado em {report.date} • {report.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Imprimindo relatório: ${report.title}`)}
                    className="p-2 hover:bg-pink-50 rounded-lg text-gray-500 hover:text-pink-700 transition-colors cursor-pointer"
                    title="Imprimir"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => alert(`Iniciando download do relatório: ${report.title}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-700 text-white text-xs font-bold rounded-xl shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna Lateral de Filtros e Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
              <TrendingUp className="w-5 h-5 text-pink-700" />
              <h2 className="text-md font-bold text-gray-800">Filtro Rápido</h2>
            </div>
            
            <div className="space-y-3 text-sm select-none">
              <label className="block">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Categoria</span>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 focus:outline-none focus:border-pink-200 text-gray-700">
                  <option>Todos os Relatórios</option>
                  <option>Financeiro</option>
                  <option>Marketing & Captação</option>
                  <option>Satisfação (NPS)</option>
                </select>
              </label>

              <label className="block pt-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Período</span>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 focus:outline-none focus:border-pink-200 text-gray-700">
                  <option>Últimos 30 dias</option>
                  <option>Últimos 3 meses</option>
                  <option>Ano corrente (2026)</option>
                  <option>Personalizado...</option>
                </select>
              </label>

              <button
                onClick={() => alert('Filtro aplicado com sucesso!')}
                className="w-full mt-4 py-2.5 bg-pink-700 text-white font-bold rounded-xl shadow-md hover:scale-102 transition-transform duration-200 cursor-pointer text-center block text-xs"
              >
                Aplicar Filtro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
