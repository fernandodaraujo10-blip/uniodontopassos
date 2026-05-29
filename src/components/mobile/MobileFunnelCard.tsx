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
    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between w-full h-[335px] select-none overflow-hidden">
      {/* Abas Superiores Compactas */}
      <div className="flex gap-1 mb-3.5 bg-slate-50 border border-slate-100 p-0.5 rounded-xl shrink-0 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[30px] ${
                active
                  ? 'bg-pink-700 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conteúdo 1: Funil de Conversão */}
      {activeTab === 'funnel' && (
        <div className="flex-grow flex items-center justify-between gap-1.5 min-h-0">
          {/* Métricas da Esquerda (Volumes) */}
          <div className="flex flex-col justify-between h-[215px] py-1 text-[9px] w-[65px] shrink-0">
            <div>
              <p className="text-gray-400 font-medium leading-none">Impressões</p>
              <p className="font-extrabold text-slate-700 text-[11px] mt-0.5 leading-none">{funnelData.impressoes}</p>
              {renderTrendValue(funnelData.impressoesChange, funnelData.impressoesChangeType)}
            </div>
            <div>
              <p className="text-gray-400 font-medium leading-none">Cliques</p>
              <p className="font-extrabold text-slate-700 text-[11px] mt-0.5 leading-none">{funnelData.cliques}</p>
              {renderTrendValue(funnelData.cliquesChange, funnelData.cliquesChangeType)}
            </div>
            <div>
              <p className="text-gray-400 font-medium leading-none">Leads</p>
              <p className="font-extrabold text-slate-700 text-[11px] mt-0.5 leading-none">{funnelData.leads}</p>
              {renderTrendValue(funnelData.leadsChange, funnelData.leadsChangeType)}
            </div>
          </div>

          {/* Gráfico do Funil de Conversão (Design Pirâmide Invertida Rosa/Magenta) */}
          <div className="flex-grow flex flex-col items-center gap-1.5 max-w-[125px]">
            {/* Bloco 1 - Impressões */}
            <div className="w-full h-[42px] bg-pink-50 rounded-lg flex items-center justify-center text-pink-700 border border-pink-100 shadow-2xs hover:scale-102 transition-transform select-none">
              <Eye className="w-4 h-4 stroke-[2.2]" />
            </div>

            {/* Bloco 2 - Cliques */}
            <div className="w-[82%] h-[42px] bg-pink-100 rounded-lg flex items-center justify-center text-pink-700 border border-pink-200/50 shadow-2xs hover:scale-102 transition-transform select-none">
              <MousePointerClick className="w-4 h-4 stroke-[2.2]" />
            </div>

            {/* Bloco 3 - Leads */}
            <div className="w-[64%] h-[42px] bg-pink-200 rounded-lg flex items-center justify-center text-pink-700 border border-pink-300/40 shadow-2xs hover:scale-102 transition-transform select-none">
              <Users className="w-4 h-4 stroke-[2.2]" />
            </div>

            {/* Bloco 4 - Vendas */}
            <div className="w-[46%] h-[42px] bg-pink-500 rounded-lg flex items-center justify-center text-white shadow-2xs hover:scale-102 transition-transform select-none">
              <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>

          {/* Métricas da Direita (Taxas de Conversão) */}
          <div className="flex flex-col justify-between h-[215px] py-1 text-[8.5px] w-[80px] shrink-0 border-l border-slate-50 pl-2">
            <div>
              <p className="text-gray-400 font-medium leading-none">CTR (Cliques/Imp.)</p>
              <p className="font-extrabold text-slate-700 text-[10px] mt-0.5 leading-none">{funnelData.txCtr}</p>
              {renderTrendValue(funnelData.txCtrChange, funnelData.txCtrChangeType)}
            </div>
            <div>
              <p className="text-gray-400 font-medium leading-none">Conversão Leads</p>
              <p className="font-extrabold text-slate-700 text-[10px] mt-0.5 leading-none">{funnelData.txLeads}</p>
              {renderTrendValue(funnelData.txLeadsChange, funnelData.txLeadsChangeType)}
            </div>
            <div>
              <p className="text-gray-400 font-medium leading-none">Tx. Agendamento</p>
              <p className="font-extrabold text-slate-700 text-[10px] mt-0.5 leading-none">{funnelData.txAgendamentos}</p>
              {renderTrendValue(funnelData.txAgendamentosChange, funnelData.txAgendamentosChangeType)}
            </div>
            <div>
              <p className="text-gray-400 font-medium leading-none">Aprov. Comercial</p>
              <p className="font-extrabold text-slate-700 text-[10px] mt-0.5 leading-none">{funnelData.txVendas}</p>
              {renderTrendValue(funnelData.txVendasChange, funnelData.txVendasChangeType)}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo 2: Origem dos Leads */}
      {activeTab === 'origin' && (
        <div className="flex-grow flex flex-col justify-between py-1 min-h-0 animate-fadeIn">
          <div className="flex justify-between items-center mb-2 shrink-0">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Leads Qualificados</h4>
            <span className="px-2 py-0.5 bg-pink-50 text-pink-700 font-extrabold text-[10px] rounded-full border border-pink-100 leading-none">
              {leadsData.total} Leads
            </span>
          </div>

          <div className="space-y-2 flex-grow overflow-y-auto pr-1">
            {/* Google Ads */}
            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="font-semibold text-slate-600">Google Ads</span>
                <span className="font-extrabold text-pink-700">{leadsData.origem.google}</span>
              </div>
              <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                <div
                  className="bg-pink-700 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: leadsData.origem.google }}
                ></div>
              </div>
            </div>

            {/* Meta ADS */}
            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="font-semibold text-slate-600">Meta ADS</span>
                <span className="font-extrabold text-pink-700">{leadsData.origem.meta}</span>
              </div>
              <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                <div
                  className="bg-pink-700 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: leadsData.origem.meta }}
                ></div>
              </div>
            </div>

            {/* Indicação */}
            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="font-semibold text-slate-600">Indicação</span>
                <span className="font-extrabold text-pink-700">{leadsData.origem.indicacao}</span>
              </div>
              <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                <div
                  className="bg-pink-700 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: leadsData.origem.indicacao }}
                ></div>
              </div>
            </div>

            {/* Outros */}
            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="font-semibold text-slate-600">Outros</span>
                <span className="font-extrabold text-pink-700">{leadsData.origem.outros}</span>
              </div>
              <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                <div
                  className="bg-pink-700 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: leadsData.origem.outros }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo 3: Cidades */}
      {activeTab === 'cities' && (
        <div className="flex-grow flex flex-col min-h-0 justify-between animate-fadeIn">
          <div className="overflow-y-auto pr-1 flex-grow min-h-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[8.5px] font-extrabold uppercase tracking-tight border-b border-slate-50 sticky top-0 bg-white pb-1.5 z-10">
                  <th className="pb-1.5 font-bold">Cidade</th>
                  <th className="pb-1.5 font-bold text-right pr-4">Beneficiários</th>
                  <th className="pb-1.5 font-bold text-right">Crescimento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {cidadesData.map((cidade) => (
                  <tr key={cidade.nome} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2 font-bold text-slate-700 text-[11px]">{cidade.nome}</td>
                    <td className="py-2 text-right pr-4 font-bold text-slate-700 text-[11px]">{cidade.beneficiarios}</td>
                    <td className="py-2 text-right">
                      <span className="inline-block px-2.5 py-0.5 bg-green-50 text-green-600 font-extrabold text-[9px] rounded-full border border-green-100">
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
