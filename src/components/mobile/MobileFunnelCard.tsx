import React, { useState } from 'react';
import { Eye, MousePointerClick, Users, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';
import { FunnelMetric, LeadsData, CidadeItem } from '../../types/dashboard';

interface MobileFunnelCardProps {
  funnelData: FunnelMetric;
  leadsData: LeadsData;
  cidadesData: CidadeItem[];
}

type TabType = 'funnel' | 'origin' | 'cities';

export const MobileFunnelCard: React.FC<MobileFunnelCardProps> = ({
  funnelData,
  leadsData,
  cidadesData,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('funnel');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'funnel', label: 'Funil de Conversão' },
    { id: 'origin', label: 'Origem dos Leads' },
    { id: 'cities', label: 'Cidades' },
  ];

  const renderTrendValue = (change: string, changeType: 'up' | 'down') => {
    const isUp = changeType === 'up';
    const cleanValue = change.replace(/[▲▼▬\s]/g, '');
    return (
      <span className={`text-[8px] font-bold flex items-center gap-0.5 leading-none mt-0.5 ${
        isUp ? 'text-emerald-500' : 'text-rose-500'
      }`}>
        {isUp ? <TrendingUp className="w-2.5 h-2.5 shrink-0" /> : <TrendingDown className="w-2.5 h-2.5 shrink-0" />}
        {cleanValue}
      </span>
    );
  };

  return (
    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between w-full min-h-[410px] select-none overflow-hidden">
      {/* Abas Superiores (Segmented Control Style) */}
      <div className="flex bg-slate-100/80 rounded-[14px] p-1 gap-1 border border-slate-200/60 shrink-0 overflow-x-auto scrollbar-hide mb-5">
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-1.5 text-[11px] font-semibold rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[32px] ${
                active
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 bg-transparent'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conteúdo 1: Funil de Conversão */}
      {activeTab === 'funnel' && (
        <div className="flex-grow flex items-center justify-between gap-3 min-h-0">
          {/* Métricas da Esquerda (Volumes) */}
          <div className="flex flex-col justify-between h-[280px] py-2 text-[10px] w-[70px] shrink-0">
            <div>
              <p className="text-slate-400 font-medium leading-none">Impressões</p>
              <p className="font-bold text-slate-800 text-[12px] mt-1 leading-none">{funnelData.impressoes}</p>
              {renderTrendValue(funnelData.impressoesChange, funnelData.impressoesChangeType)}
            </div>
            <div>
              <p className="text-slate-400 font-medium leading-none">Cliques</p>
              <p className="font-bold text-slate-800 text-[12px] mt-1 leading-none">{funnelData.cliques}</p>
              {renderTrendValue(funnelData.cliquesChange, funnelData.cliquesChangeType)}
            </div>
            <div>
              <p className="text-slate-400 font-medium leading-none">Leads</p>
              <p className="font-bold text-slate-800 text-[12px] mt-1 leading-none">{funnelData.leads}</p>
              {renderTrendValue(funnelData.leadsChange, funnelData.leadsChangeType)}
            </div>
          </div>

          {/* Gráfico do Funil de Conversão (Design Pirâmide Rosa Limpo) */}
          <div className="flex-grow flex flex-col items-center gap-2.5 max-w-[130px]">
            {/* Bloco 1 - Impressões */}
            <div className="w-full h-[54px] bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 border border-pink-100/50 shadow-sm hover:scale-102 transition-transform select-none">
              <Eye className="w-4 h-4 stroke-[2]" />
            </div>

            {/* Bloco 2 - Cliques */}
            <div className="w-[82%] h-[54px] bg-pink-100 rounded-xl flex items-center justify-center text-pink-700 shadow-sm hover:scale-102 transition-transform select-none">
              <MousePointerClick className="w-4 h-4 stroke-[2]" />
            </div>

            {/* Bloco 3 - Leads */}
            <div className="w-[64%] h-[54px] bg-pink-200 rounded-xl flex items-center justify-center text-pink-800 shadow-sm hover:scale-102 transition-transform select-none">
              <Users className="w-4 h-4 stroke-[2]" />
            </div>

            {/* Bloco 4 - Vendas */}
            <div className="w-[46%] h-[54px] bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-md hover:scale-102 transition-transform select-none">
              <ShoppingCart className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          {/* Métricas da Direita (Taxas de Conversão) */}
          <div className="flex flex-col justify-between h-[280px] py-2 text-[9px] w-[85px] shrink-0 border-l border-slate-100 pl-3">
            <div>
              <p className="text-slate-400 font-medium leading-none">CTR (Tx. Cliques)</p>
              <p className="font-bold text-slate-800 text-[11px] mt-1 leading-none">{funnelData.txCtr}</p>
              {renderTrendValue(funnelData.txCtrChange, funnelData.txCtrChangeType)}
            </div>
            <div>
              <p className="text-slate-400 font-medium leading-none">Conv. Leads</p>
              <p className="font-bold text-slate-800 text-[11px] mt-1 leading-none">{funnelData.txLeads}</p>
              {renderTrendValue(funnelData.txLeadsChange, funnelData.txLeadsChangeType)}
            </div>
            <div>
              <p className="text-slate-400 font-medium leading-none">Agendamentos</p>
              <p className="font-bold text-slate-800 text-[11px] mt-1 leading-none">{funnelData.txAgendamentos}</p>
              {renderTrendValue(funnelData.txAgendamentosChange, funnelData.txAgendamentosChangeType)}
            </div>
            <div>
              <p className="text-slate-400 font-medium leading-none">Aprov. Coml.</p>
              <p className="font-bold text-slate-800 text-[11px] mt-1 leading-none">{funnelData.txVendas}</p>
              {renderTrendValue(funnelData.txVendasChange, funnelData.txVendasChangeType)}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo 2: Origem dos Leads */}
      {activeTab === 'origin' && (
        <div className="flex-grow flex flex-col justify-between py-1 min-h-0 animate-fadeIn">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leads Qualificados</h4>
            <span className="px-2.5 py-1 bg-slate-50 text-slate-700 font-bold text-[10px] rounded-lg border border-slate-100 leading-none">
              {leadsData.total} Total
            </span>
          </div>

          <div className="space-y-4 flex-grow overflow-y-auto pr-2">
            {/* Google Ads */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-500">Google Ads</span>
                <span className="font-bold text-slate-800">{leadsData.origem.google}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-pink-600 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: leadsData.origem.google }}
                ></div>
              </div>
            </div>

            {/* Meta ADS */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-500">Meta ADS</span>
                <span className="font-bold text-slate-800">{leadsData.origem.meta}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-pink-500 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: leadsData.origem.meta }}
                ></div>
              </div>
            </div>

            {/* Indicação */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-500">Indicação</span>
                <span className="font-bold text-slate-800">{leadsData.origem.indicacao}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-pink-400 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: leadsData.origem.indicacao }}
                ></div>
              </div>
            </div>

            {/* Outros */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-500">Outros</span>
                <span className="font-bold text-slate-800">{leadsData.origem.outros}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-slate-300 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: leadsData.origem.outros }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo 3: Cidades */}
      {activeTab === 'cities' && (
        <div className="flex-grow flex flex-col min-h-0 animate-fadeIn">
          <div className="overflow-y-auto pr-1 flex-grow min-h-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100 sticky top-0 bg-white pb-2 z-10">
                  <th className="pb-2 font-semibold">Cidade</th>
                  <th className="pb-2 font-semibold text-right pr-4">Leads</th>
                  <th className="pb-2 font-semibold text-right">Crescimento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {cidadesData.map((cidade) => (
                  <tr key={cidade.nome} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 font-semibold text-slate-700 text-xs">{cidade.nome}</td>
                    <td className="py-2.5 text-right pr-4 font-bold text-slate-800 text-xs">{cidade.beneficiarios}</td>
                    <td className="py-2.5 text-right">
                      <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 font-bold text-[10px] rounded-lg">
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

export default MobileFunnelCard;
