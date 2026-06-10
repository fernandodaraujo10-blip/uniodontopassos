import React, { useState } from 'react';
import { Eye, MousePointerClick, Users, Calendar, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';
import { FunnelMetric, LeadsData, CidadeItem } from '../../types/dashboard';

interface ConversionFunnelTabsProps {
  funnelData: FunnelMetric;
  leadsData: LeadsData;
  cidadesData: CidadeItem[];
  compact?: boolean;
}

type TabType = 'funnel' | 'origin' | 'cities';

export const ConversionFunnelTabs: React.FC<ConversionFunnelTabsProps> = ({
  funnelData,
  leadsData,
  cidadesData,
  compact = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('funnel');
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'funnel', label: 'Funil de Conversão' },
    { id: 'origin', label: 'Origem dos Leads' },
    { id: 'cities', label: 'Cidades' },
  ];

  const renderTrend = (change: string, type: 'up' | 'down') => {
    const isUp = type === 'up';
    return (
      <span className={`font-bold text-[9px] leading-none flex items-center gap-0.5 ${
        isUp ? 'text-green-500' : 'text-red-500'
      }`}>
        {isUp ? <TrendingUp className="w-2.5 h-2.5 inline" /> : <TrendingDown className="w-2.5 h-2.5 inline" />}
        {change.replace(/[▲▼\s]/g, '')}
      </span>
    );
  };

  const renderFunnelTaxaTrend = (change: string, type: 'up' | 'down') => {
    const isUp = type === 'up';
    return (
      <span className={`font-medium text-[8px] leading-none flex items-center gap-0.5 ${
        isUp ? 'text-green-500' : 'text-red-500'
      }`}>
        {isUp ? <TrendingUp className="w-2.5 h-2.5 inline" /> : <TrendingDown className="w-2.5 h-2.5 inline" />}
        {change.replace(/[▲▼\s]/g, '')}
      </span>
    );
  };

  const compactCities = cidadesData.slice(0, 3);

  return (
    <div className={`col-span-12 lg:col-span-5 bg-white rounded-2xl border border-gray-100 card-shadow flex flex-col justify-between h-full min-h-0 w-full min-w-0 overflow-hidden ${compact ? 'p-2.5' : 'p-4'}`}>
      
      {/* Abas Superiores */}
      <div className={`flex gap-1 md:gap-1.5 bg-gray-50 p-1 rounded-xl shrink-0 select-none overflow-x-auto scrollbar-hide ${compact ? 'mb-1' : 'mb-3'}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2 md:px-3 font-bold rounded-lg transition-all duration-300 cursor-pointer whitespace-nowrap min-h-[34px] ${
                compact ? 'py-1 text-[10px]' : 'py-1.5 text-[11px] md:text-xs'
              } ${
                isActive
                  ? 'bg-pink-700 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conteúdo 1: Funil de Conversão */}
      {activeTab === 'funnel' && (
        <div
          className={`flex-grow flex items-center justify-between min-h-0 animate-fade-in-tab overflow-hidden ${compact ? 'gap-0.5' : 'gap-1 md:gap-2'}`}
          style={{ minHeight: compact ? '0' : '200px' }}
        >
          
          {/* Funil Métrica Esquerda (Absoluto) */}
          <div className={`flex flex-col justify-between h-full shrink-0 select-none ${compact ? 'py-[2px] text-[7px] w-10' : 'py-1 text-[10px] w-16 md:w-20'}`}>
            <div className="hover:scale-105 transition-transform duration-200">
              <p className="text-gray-400 font-medium leading-none">Impressões</p>
              <p className={`font-bold text-gray-800 ${compact ? 'text-[9px]' : 'text-xs'} mt-0.5`}>{funnelData.impressoes}</p>
              {renderTrend(funnelData.impressoesChange, funnelData.impressoesChangeType)}
            </div>
            <div className="hover:scale-105 transition-transform duration-200">
              <p className="text-gray-400 font-medium leading-none">Cliques</p>
              <p className={`font-bold text-gray-800 ${compact ? 'text-[9px]' : 'text-xs'} mt-0.5`}>{funnelData.cliques}</p>
              {renderTrend(funnelData.cliquesChange, funnelData.cliquesChangeType)}
            </div>
            <div className="hover:scale-105 transition-transform duration-200">
              <p className="text-gray-400 font-medium leading-none">Leads</p>
              <p className={`font-bold text-gray-800 ${compact ? 'text-[9px]' : 'text-xs'} mt-0.5`}>{funnelData.leads}</p>
              {renderTrend(funnelData.leadsChange, funnelData.leadsChangeType)}
            </div>
            <div className="hover:scale-105 transition-transform duration-200">
              <p className="text-gray-400 font-medium leading-none">Agendamentos</p>
              <p className={`font-bold text-gray-800 ${compact ? 'text-[9px]' : 'text-xs'} mt-0.5`}>{funnelData.agendamentos}</p>
              {renderTrend(funnelData.agendamentosChange, funnelData.agendamentosChangeType)}
            </div>
            <div className="hover:scale-105 transition-transform duration-200">
              <p className="text-gray-400 font-medium leading-none">Vendas</p>
              <p className={`font-bold text-gray-800 ${compact ? 'text-[9px]' : 'text-xs'} mt-0.5`}>{funnelData.vendas}</p>
              {renderTrend(funnelData.vendasChange, funnelData.vendasChangeType)}
            </div>
          </div>
          
          {/* Representação Visual do Funil */}
          <div className={`flex-grow flex flex-col items-center min-w-0 select-none ${compact ? 'gap-[3px]' : 'gap-1.5 md:gap-2'}`}>
            {/* Step 1 - Impressões */}
            <div
              onMouseEnter={() => setHoveredStep(1)}
              onMouseLeave={() => setHoveredStep(null)}
              style={{ opacity: hoveredStep === null || hoveredStep === 1 ? 1 : 0.5 }}
              className={`funnel-step bg-pink-50 w-full flex-1 min-h-[22px] flex items-center justify-center text-pink-700 shadow-sm cursor-pointer ${compact ? '' : 'h-9 md:h-[46px]'}`}
              title="Impressões"
            >
              <Eye className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </div>

            {/* Step 2 - Cliques */}
            <div
              onMouseEnter={() => setHoveredStep(2)}
              onMouseLeave={() => setHoveredStep(null)}
              style={{ opacity: hoveredStep === null || hoveredStep === 2 ? 1 : 0.5 }}
              className={`funnel-step bg-pink-100 w-[85%] flex-1 min-h-[22px] flex items-center justify-center text-pink-700 shadow-sm cursor-pointer ${compact ? '' : 'h-9 md:h-[46px]'}`}
              title="Cliques"
            >
              <MousePointerClick className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </div>

            {/* Step 3 - Leads */}
            <div
              onMouseEnter={() => setHoveredStep(3)}
              onMouseLeave={() => setHoveredStep(null)}
              style={{ opacity: hoveredStep === null || hoveredStep === 3 ? 1 : 0.5 }}
              className={`funnel-step bg-pink-200 w-[70%] flex-1 min-h-[22px] flex items-center justify-center text-pink-700 shadow-sm cursor-pointer ${compact ? '' : 'h-9 md:h-[46px]'}`}
              title="Leads"
            >
              <Users className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </div>

            {/* Step 4 - Agendamentos */}
            <div
              onMouseEnter={() => setHoveredStep(4)}
              onMouseLeave={() => setHoveredStep(null)}
              style={{ opacity: hoveredStep === null || hoveredStep === 4 ? 1 : 0.5 }}
              className={`funnel-step bg-pink-300 w-[55%] flex-1 min-h-[22px] flex items-center justify-center text-pink-700 shadow-sm cursor-pointer ${compact ? '' : 'h-9 md:h-[46px]'}`}
              title="Agendamentos"
            >
              <Calendar className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </div>

            {/* Step 5 - Vendas */}
            <div
              onMouseEnter={() => setHoveredStep(5)}
              onMouseLeave={() => setHoveredStep(null)}
              style={{ opacity: hoveredStep === null || hoveredStep === 5 ? 1 : 0.5 }}
              className={`funnel-step bg-pink-400 w-[40%] flex-1 min-h-[22px] flex items-center justify-center text-white shadow-sm cursor-pointer ${compact ? '' : 'h-9 md:h-[46px]'}`}
              title="Vendas"
            >
              <ShoppingCart className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </div>
          </div>
          
          {/* Funil Taxa Direita (Conversão Relativa) */}
          <div className={`flex flex-col justify-around h-full shrink-0 border-l border-gray-50 select-none ${compact ? 'py-[2px] text-[7px] w-12 pl-1' : 'py-1 text-[8px] md:text-[9px] w-20 md:w-24 pl-1.5 md:pl-2'}`}>
            <div>
              <p className="text-gray-400 font-medium leading-none">CTR (Cliques/Imp.)</p>
              <p className={`font-bold text-gray-800 ${compact ? 'text-[9px]' : 'text-xs'} mt-0.5`}>{funnelData.txCtr}</p>
              {renderFunnelTaxaTrend(funnelData.txCtrChange, funnelData.txCtrChangeType)}
            </div>
            <div>
              <p className="text-gray-400 font-medium leading-none">Conversão Leads</p>
              <p className={`font-bold text-gray-800 ${compact ? 'text-[9px]' : 'text-xs'} mt-0.5`}>{funnelData.txLeads}</p>
              {renderFunnelTaxaTrend(funnelData.txLeadsChange, funnelData.txLeadsChangeType)}
            </div>
            <div>
              <p className="text-gray-400 font-medium leading-none">Tx. Agendamento</p>
              <p className={`font-bold text-gray-800 ${compact ? 'text-[9px]' : 'text-xs'} mt-0.5`}>{funnelData.txAgendamentos}</p>
              {renderFunnelTaxaTrend(funnelData.txAgendamentosChange, funnelData.txAgendamentosChangeType)}
            </div>
            <div>
              <p className="text-gray-400 font-medium leading-none">Aprov. Comercial</p>
              <p className={`font-bold text-gray-800 ${compact ? 'text-[9px]' : 'text-xs'} mt-0.5`}>{funnelData.txVendas}</p>
              {renderFunnelTaxaTrend(funnelData.txVendasChange, funnelData.txVendasChangeType)}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo 2: Origem dos Leads */}
      {activeTab === 'origin' && (
        <div className={`flex-grow flex flex-col justify-between min-h-0 animate-fade-in-tab ${compact ? 'py-1' : 'py-2'}`}>
          <div className={`flex justify-between items-center shrink-0 select-none ${compact ? 'mb-2' : 'mb-3'}`}>
            <h4 className={`font-bold text-gray-700 uppercase ${compact ? 'text-[10px]' : 'text-xs'}`}>Leads Qualificados</h4>
            <span className={`bg-pink-50 text-pink-700 font-bold rounded-full border border-pink-100 ${compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-0.5 text-[11px]'}`}>
              {leadsData.total} Leads
            </span>
          </div>

          <div className={`space-y-3.5 flex-grow select-none ${compact ? 'overflow-hidden space-y-2' : 'overflow-y-auto pr-1'}`}>
            {/* Google Ads */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-600">Google Ads</span>
                <span className="font-bold text-pink-700">{leadsData.origem.google}</span>
              </div>
              <div className="w-full bg-pink-50 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-pink-700 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: leadsData.origem.google }}
                ></div>
              </div>
            </div>

            {/* Meta ADS */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-600">Meta ADS</span>
                <span className="font-bold text-pink-700">{leadsData.origem.meta}</span>
              </div>
              <div className="w-full bg-pink-50 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-pink-700 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: leadsData.origem.meta }}
                ></div>
              </div>
            </div>

            {/* Indicação */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-600">Indicação</span>
                <span className="font-bold text-pink-700">{leadsData.origem.indicacao}</span>
              </div>
              <div className="w-full bg-pink-50 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-pink-700 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: leadsData.origem.indicacao }}
                ></div>
              </div>
            </div>

            {/* Outros */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-600">Outros</span>
                <span className="font-bold text-pink-700">{leadsData.origem.outros}</span>
              </div>
              <div className="w-full bg-pink-50 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-pink-700 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: leadsData.origem.outros }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo 3: Cidades */}
      {activeTab === 'cities' && (
        <div className="flex-grow flex flex-col min-h-0 justify-between animate-fade-in-tab">
          <div className={`${compact ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar pr-1'} flex-grow min-h-0`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100 sticky top-0 bg-white pb-2 z-10 select-none">
                  <th className="pb-2 font-semibold">Cidade</th>
                  <th className={`pb-2 font-semibold text-right ${compact ? 'pr-3' : 'pr-6'}`}>Beneficiários</th>
                  <th className="pb-2 font-semibold text-right">Crescimento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 select-none">
                {(compact ? compactCities : cidadesData).map((cidade) => (
                  <tr key={cidade.nome} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className={`font-bold text-gray-800 ${compact ? 'py-1.5 text-[11px]' : 'py-2.5 text-[12px]'}`}>{cidade.nome}</td>
                    <td className={`text-right font-bold text-gray-800 ${compact ? 'py-1.5 pr-3 text-[11px]' : 'py-2.5 pr-6 text-[12px]'}`}>{cidade.beneficiarios}</td>
                    <td className="py-2.5 text-right">
                      <span className={`inline-block bg-green-50 text-green-600 font-bold rounded-full border border-green-100 ${compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-0.5 text-[10px]'}`}>
                        {cidade.crescimento}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default ConversionFunnelTabs;
