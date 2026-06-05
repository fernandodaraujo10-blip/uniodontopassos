import React, { useState } from 'react';
import { Eye, MousePointerClick, Users, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';
import { FunnelMetric, LeadsData, CidadeItem } from '../../types/dashboard';

interface MobileFunnelCardProps {
  funnelData: FunnelMetric;
  leadsData: LeadsData;
  cidadesData: CidadeItem[];
  compact?: boolean;
  analysisMode?: boolean;
}

type TabType = 'funnel' | 'origin' | 'cities';

export const MobileFunnelCard: React.FC<MobileFunnelCardProps> = ({
  funnelData,
  leadsData,
  cidadesData,
  compact = false,
  analysisMode = false,
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
      <span className={`text-[8px] font-bold flex items-center gap-0.5 leading-none mt-0.5 ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isUp ? <TrendingUp className="w-2.5 h-2.5 shrink-0" /> : <TrendingDown className="w-2.5 h-2.5 shrink-0" />}
        {cleanValue}
      </span>
    );
  };

  const topCities = cidadesData.slice(0, 3);

  if (analysisMode) {
    return (
      <div className="flex-[0.95] min-h-0 rounded-2xl p-2.5 overflow-hidden bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col">
        <div className="flex items-center bg-slate-100/80 rounded-[12px] p-0.5 gap-1 border border-slate-200/60 h-[28px] shrink-0">
          {tabs.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 h-full rounded-[10px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap text-[9px] ${
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

        <div className="flex-1 min-h-0 overflow-hidden mt-1.5">
          {activeTab === 'funnel' && (
            <div className="h-full grid grid-cols-[1fr_1fr] gap-1.5">
              <div className="grid grid-rows-4 gap-1 min-h-0">
                {[
                  ['Impressões', funnelData.impressoes, funnelData.impressoesChange, funnelData.impressoesChangeType],
                  ['Cliques', funnelData.cliques, funnelData.cliquesChange, funnelData.cliquesChangeType],
                  ['Leads', funnelData.leads, funnelData.leadsChange, funnelData.leadsChangeType],
                  ['Agend.', funnelData.agendamentos, funnelData.agendamentosChange, funnelData.agendamentosChangeType],
                ].map(([label, value, change, type]) => (
                  <div key={String(label)} className="rounded-xl bg-slate-50 border border-slate-100 px-2 py-1 flex items-center justify-between overflow-hidden">
                    <div className="min-w-0">
                      <p className="text-[7px] uppercase text-slate-400 font-bold leading-none">{label}</p>
                      <p className="text-[10px] font-bold text-slate-800 leading-none mt-0.5 truncate">{value as string}</p>
                    </div>
                    {renderTrendValue(change as string, type as 'up' | 'down')}
                  </div>
                ))}
              </div>

              <div className="grid grid-rows-4 gap-1 min-h-0">
                {[
                  { icon: Eye, label: 'CTR', value: funnelData.txCtr },
                  { icon: MousePointerClick, label: 'Leads', value: funnelData.txLeads },
                  { icon: Users, label: 'Agend.', value: funnelData.txAgendamentos },
                  { icon: ShoppingCart, label: 'Vendas', value: funnelData.txVendas },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl bg-pink-50 border border-pink-100 px-2 py-1 flex items-center gap-2 overflow-hidden">
                    <div className="w-5 h-5 rounded-lg bg-white flex items-center justify-center text-pink-700 shrink-0">
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[7px] uppercase text-slate-400 font-bold leading-none">{label}</p>
                      <p className="text-[10px] font-bold text-slate-800 leading-none mt-0.5 truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'origin' && (
            <div className="h-full grid grid-rows-4 gap-1">
              {[
                ['Google Ads', leadsData.origem.google, 'bg-pink-600'],
                ['Meta ADS', leadsData.origem.meta, 'bg-pink-500'],
                ['Indicação', leadsData.origem.indicacao, 'bg-pink-400'],
                ['Outros', leadsData.origem.outros, 'bg-slate-300'],
              ].map(([label, value, color]) => (
                <div key={String(label)} className="rounded-xl bg-slate-50 border border-slate-100 px-2 py-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[7px] uppercase text-slate-400 font-bold leading-none">{label}</span>
                    <span className="text-[9px] font-bold text-slate-800 leading-none">{value as string}</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: value as string }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'cities' && (
            <div className="h-full grid grid-rows-3 gap-1">
              {topCities.map((cidade) => (
                <div key={cidade.nome} className="rounded-xl bg-slate-50 border border-slate-100 px-2 py-1 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-slate-800 truncate leading-none">{cidade.nome}</p>
                    <p className="text-[7px] uppercase text-slate-400 font-bold mt-0.5 leading-none">Leads</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-bold text-slate-800 leading-none">{cidade.beneficiarios}</p>
                    <p className="text-[7px] font-semibold text-emerald-600 leading-none mt-0.5">{cidade.crescimento}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between w-full select-none overflow-hidden ${
        compact ? 'p-4 min-h-[340px]' : 'p-5 min-h-[410px]'
      }`}
    >
      <div className={`flex bg-slate-100/80 rounded-[14px] p-1 gap-1 border border-slate-200/60 shrink-0 overflow-x-auto scrollbar-hide ${compact ? 'mb-3' : 'mb-5'}`}>
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 font-semibold rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[32px] ${
                active
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 bg-transparent'
              } ${compact ? 'px-2.5 py-1.5 text-[10px]' : 'px-3 py-1.5 text-[11px]'}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'funnel' && (
        <div className={`flex-grow flex items-center justify-between gap-3 min-h-0 ${compact ? 'gap-2' : ''}`}>
          <div className={`flex flex-col justify-between shrink-0 ${compact ? 'h-[220px] py-1 text-[9px] w-[64px]' : 'h-[280px] py-2 text-[10px] w-[70px]'}`}>
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

          <div className={`flex-grow flex flex-col items-center max-w-[130px] ${compact ? 'gap-2' : 'gap-2.5'}`}>
            <div className={`w-full bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 border border-pink-100/50 shadow-sm ${compact ? 'h-[46px]' : 'h-[54px]'}`}>
              <Eye className="w-4 h-4 stroke-[2]" />
            </div>
            <div className={`w-[82%] bg-pink-100 rounded-xl flex items-center justify-center text-pink-700 shadow-sm ${compact ? 'h-[46px]' : 'h-[54px]'}`}>
              <MousePointerClick className="w-4 h-4 stroke-[2]" />
            </div>
            <div className={`w-[64%] bg-pink-200 rounded-xl flex items-center justify-center text-pink-800 shadow-sm ${compact ? 'h-[46px]' : 'h-[54px]'}`}>
              <Users className="w-4 h-4 stroke-[2]" />
            </div>
            <div className={`w-[46%] bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-md ${compact ? 'h-[46px]' : 'h-[54px]'}`}>
              <ShoppingCart className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          <div className={`flex flex-col justify-between shrink-0 border-l border-slate-100 pl-3 ${compact ? 'h-[220px] py-1 text-[8px] w-[78px]' : 'h-[280px] py-2 text-[9px] w-[85px]'}`}>
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

      {activeTab === 'origin' && (
        <div className={`flex-grow flex flex-col justify-between min-h-0 animate-fadeIn ${compact ? 'py-0.5' : 'py-1'}`}>
          <div className={`flex justify-between items-center shrink-0 ${compact ? 'mb-3' : 'mb-4'}`}>
            <h4 className={`font-bold text-slate-500 uppercase tracking-wider ${compact ? 'text-[10px]' : 'text-xs'}`}>Leads Qualificados</h4>
            <span className="px-2.5 py-1 bg-slate-50 text-slate-700 font-bold text-[10px] rounded-lg border border-slate-100 leading-none">
              {leadsData.total} Total
            </span>
          </div>

          <div className={`space-y-4 flex-grow overflow-hidden pr-2 ${compact ? 'space-y-3' : ''}`}>
            {[
              ['Google Ads', leadsData.origem.google],
              ['Meta ADS', leadsData.origem.meta],
              ['Indicação', leadsData.origem.indicacao],
              ['Outros', leadsData.origem.outros],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-500">{label}</span>
                  <span className="font-bold text-slate-800">{value as string}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      label === 'Google Ads' ? 'bg-pink-600' : label === 'Meta ADS' ? 'bg-pink-500' : label === 'Indicação' ? 'bg-pink-400' : 'bg-slate-300'
                    }`}
                    style={{ width: value as string }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'cities' && (
        <div className="flex-grow flex flex-col min-h-0 animate-fadeIn">
          <div className="overflow-hidden pr-1 flex-grow min-h-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100 sticky top-0 bg-white pb-2 z-10">
                  <th className="pb-2 font-semibold">Cidade</th>
                  <th className="pb-2 font-semibold text-right pr-4">Leads</th>
                  <th className="pb-2 font-semibold text-right">Crescimento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topCities.map((cidade) => (
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
