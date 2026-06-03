import React, { useState } from 'react';
import { BarChart3, Clock, ChevronRight } from 'lucide-react';
import { InvestmentItem } from '../../types/dashboard';

interface MobileInvestmentsPreviewCardProps {
  investimentos: InvestmentItem[];
  timestamp: string;
  monthLabel: string;
}

type InvestmentCategory = 'Todos' | 'Marketing' | 'Ads' | 'Offline' | 'Ferramentas';

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
      return 'bg-purple-50 text-purple-700 border-purple-100';
    case 'Ads':
    case 'Online':
      return 'bg-pink-50 text-pink-700 border-pink-100';
    case 'Offline':
      return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'Ferramentas':
      return 'bg-teal-50 text-teal-700 border-teal-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-100';
  }
};

export const MobileInvestmentsPreviewCard: React.FC<MobileInvestmentsPreviewCardProps> = ({
  investimentos,
  timestamp,
  monthLabel,
}) => {
  const [activeCategory, setActiveCategory] = useState<InvestmentCategory>('Todos');
  const [showAll, setShowAll] = useState(false);

  const INITIAL_LIMIT = 3;
  const categories: InvestmentCategory[] = ['Todos', 'Marketing', 'Ads', 'Offline', 'Ferramentas'];

  const filteredInvestments = (investimentos || []).filter(
    (item) =>
      activeCategory === 'Todos' ||
      item.categoria === activeCategory ||
      (activeCategory === 'Ads' && item.categoria === 'Online')
  );

  const totalFiltrado = filteredInvestments.reduce((acc, item) => acc + item.valorInt, 0);
  const displayedItems = showAll ? filteredInvestments : filteredInvestments.slice(0, INITIAL_LIMIT);
  const hasMore = filteredInvestments.length > INITIAL_LIMIT;

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden w-full select-none flex flex-col min-h-[350px] mb-8">
      {/* Cabeçalho */}
      <div className="p-4 pb-3 border-b border-slate-50 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
              <BarChart3 className="w-4 h-4 text-slate-600 shrink-0" />
            </div>
            <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
              Investimentos do Mês
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none mb-1">TOTAL</p>
            <p className="text-base font-bold text-slate-800 leading-none">
              {totalFiltrado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>

        {/* Chips de filtro com scroll horizontal */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-2 px-2">
          {categories.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setShowAll(false);
                }}
                className={`px-3.5 py-1.5 text-[11px] rounded-xl font-semibold transition-all duration-200 cursor-pointer shrink-0 border min-h-[32px] ${
                  active
                    ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Rows */}
      <div className="divide-y divide-slate-100 flex-grow overflow-y-auto">
        {filteredInvestments.length === 0 ? (
          <div className="px-4 py-8 text-center text-slate-400 text-xs font-medium">
            Nenhum investimento nesta categoria.
          </div>
        ) : (
          filteredInvestments.map((item, index) => (
            <div
              key={`${activeCategory}-${item.metric}-${index}`}
              className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-grow">
                {/* Marcador colorido */}
                <div className={`w-2 h-2 rounded-full shrink-0 shadow-xs ${getTagColorClass(item.categoria)}`} />
                
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate leading-tight mb-1">
                    {item.metric}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${getCategoryBadge(item.categoria)}`}>
                      {item.categoria}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">{monthLabel}</span>
                  </div>
                </div>
              </div>

              {/* Valor */}
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-slate-800 leading-none">{item.valor}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Timestamp */}
      <div className="flex items-center justify-between text-slate-400 text-[10px] border-t border-slate-100 px-4 py-3 bg-slate-50/50 mt-auto shrink-0">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>
            Última atualização: <span className="font-semibold text-slate-500">{timestamp}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileInvestmentsPreviewCard;
