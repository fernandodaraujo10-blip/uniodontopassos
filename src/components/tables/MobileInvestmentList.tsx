import React, { useState } from 'react';
import { BarChart3, Clock } from 'lucide-react';
import { InvestmentItem } from '../../types/dashboard';

interface MobileInvestmentListProps {
  investimentos: InvestmentItem[];
  timestamp: string;
  monthLabel: string;
  dense?: boolean;
  showFooter?: boolean;
}

type InvestmentCategory = 'Todos' | 'Offline' | 'Ads' | 'Marketing' | 'Ferramentas';

const categories: InvestmentCategory[] = ['Todos', 'Offline', 'Ads', 'Marketing', 'Ferramentas'];

const getTagColorClass = (categoria: string): string => {
  switch (categoria) {
    case 'Marketing':
      return 'bg-purple-500';
    case 'Ads':
    case 'Online':
      return 'bg-pink-500';
    case 'Offline':
      return 'bg-amber-500';
    case 'Ferramentas':
      return 'bg-teal-500';
    default:
      return 'bg-gray-400';
  }
};

const getCategoryBadge = (categoria: string): string => {
  switch (categoria) {
    case 'Marketing':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Ads':
    case 'Online':
      return 'bg-pink-50 text-pink-700 border-pink-200';
    case 'Offline':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Ferramentas':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const MobileInvestmentList: React.FC<MobileInvestmentListProps> = ({
  investimentos,
  timestamp,
  monthLabel,
  dense = false,
  showFooter = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<InvestmentCategory>('Todos');

  const filteredInvestments =
    selectedCategory === 'Todos'
      ? investimentos
      : investimentos.filter((item) => item.categoria === selectedCategory);

  const total = filteredInvestments.reduce((acc, item) => acc + item.valorInt, 0);

  if (dense) {
    return (
      <div className="bg-white rounded-[20px] border border-pink-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col min-h-0">
        <div className="px-3 pt-3 pb-2.5 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 min-w-0">
              <BarChart3 className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <h2 className="text-[17px] leading-none font-extrabold text-slate-900 tracking-tight">
                  Investimentos do Mês
                </h2>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 leading-none">
                Total
              </p>
              <p className="mt-1 text-[22px] leading-none font-black text-pink-700">
                {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          </div>

          <div className="mt-3 flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`h-8 px-3 rounded-lg border whitespace-nowrap font-bold transition-all duration-200 cursor-pointer text-[11px] shrink-0 ${
                    active
                      ? 'bg-pink-700 text-white border-pink-700 shadow-sm'
                      : 'bg-white text-slate-500 border-pink-100 hover:bg-pink-50 hover:text-slate-700'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-3 pt-3 pb-2">
          <div className="grid grid-cols-[72px_1fr_auto] gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wide pb-2 border-b border-gray-100">
            <span>Mês</span>
            <span>Métrica</span>
            <span className="text-right">Valor</span>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto mobile-scroll px-3 pb-2">
          <div className="divide-y divide-gray-50">
            {filteredInvestments.length === 0 ? (
              <div className="py-6 text-center text-[12px] text-gray-400 italic">
                Nenhum investimento nesta categoria.
              </div>
            ) : (
              filteredInvestments.map((item, index) => (
                <div
                  key={`${selectedCategory}-${item.metric}-${index}`}
                  className="grid grid-cols-[72px_1fr_auto] gap-2 items-center py-2.5"
                >
                  <span className="text-[11px] font-semibold text-slate-400">
                    {monthLabel}
                  </span>

                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${getTagColorClass(item.categoria)}`}
                    />
                    <span className="text-[12px] font-medium text-slate-700 truncate">
                      {item.metric}
                    </span>
                  </div>

                  <span className="text-[12px] font-extrabold text-slate-900 text-right whitespace-nowrap">
                    {item.valor}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {showFooter && (
          <div className="safe-bottom px-3 py-2 text-[9px] flex items-center gap-2 text-gray-400 border-t border-gray-50">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              Última atualização: <span className="font-semibold">{timestamp}</span>
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden ${dense ? 'flex flex-col h-full min-h-0' : ''}`}>
      <div className={`${dense ? 'px-3 pt-2 pb-2' : 'px-4 pt-4 pb-3'} border-b border-gray-50`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <BarChart3 className={`${dense ? 'w-4 h-4' : 'w-5 h-5'} text-gray-700 flex-shrink-0`} />
            <span className={`${dense ? 'text-[9px]' : 'text-[10px]'} font-bold uppercase text-slate-400`}>
              Resumo
            </span>
          </div>

          <div className="flex flex-wrap gap-1 flex-1 min-w-0 px-1">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`h-8 px-2.5 rounded-full border whitespace-nowrap font-bold transition-all duration-200 cursor-pointer text-[11px] ${
                    active
                      ? 'bg-pink-700 text-white border-pink-700'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="text-right shrink-0">
            <span className="block text-[9px] uppercase text-slate-400 font-bold leading-none">Total</span>
            <p className={`${dense ? 'text-[13px]' : 'text-sm'} font-bold text-pink-600 leading-none mt-1`}>
              {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
      </div>

      <div className={`${dense ? 'flex-1 min-h-0 overflow-y-auto divide-y divide-gray-50 mobile-scroll' : 'divide-y divide-gray-50'}`}>
        {filteredInvestments.length === 0 ? (
          <div className={`${dense ? 'px-3 py-3 text-[11px]' : 'px-4 py-8 text-sm'} text-center text-gray-400 italic`}>
            Nenhum investimento nesta categoria.
          </div>
        ) : (
          filteredInvestments.map((item, index) => (
            <div
              key={`${selectedCategory}-${item.metric}-${index}`}
              className={`${dense ? 'px-3 py-2' : 'px-4 py-3'} hover:bg-gray-50/60 transition-colors`}
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex-grow min-w-0">
                  <div className={`flex items-center gap-2 ${dense ? 'mb-0.5' : 'mb-1'}`}>
                    <span className={`${dense ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full flex-shrink-0 ${getTagColorClass(item.categoria)}`} />
                    <p className={`${dense ? 'mobile-small' : 'text-[14px]'} font-semibold text-gray-800 truncate leading-tight`}>
                      {item.metric}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 ${dense ? 'pl-3' : 'pl-4'}`}>
                    <span className={`inline-flex items-center border font-bold ${getCategoryBadge(item.categoria)} ${dense ? 'px-1.5 py-0.5 rounded-md text-[8px]' : 'px-2 py-0.5 rounded-full text-[10px]'}`}>
                      {item.categoria}
                    </span>
                    <span className={`${dense ? 'text-[9px]' : 'text-[11px]'} text-gray-400 font-medium`}>{monthLabel}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className={`${dense ? 'mobile-subtitle' : 'text-[15px]'} font-bold text-gray-900`}>{item.valor}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showFooter && (
        <div className={`${dense ? 'safe-bottom px-3 py-2 text-[9px]' : 'px-4 py-3 text-[10px]'} flex items-center gap-2 text-gray-400 border-t border-gray-50`}>
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            Última atualização: <span className="font-semibold">{timestamp}</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default MobileInvestmentList;
