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
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden w-full select-none">
      {/* Cabeçalho */}
      <div className="p-4 pb-3 border-b border-slate-50">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-slate-700 shrink-0" />
            <h2 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">
              Investimentos do Mês
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[8px] uppercase tracking-wider text-slate-400 font-bold leading-none mb-0.5">TOTAL</p>
            <p className="text-[14px] font-black text-pink-700 leading-none">
              {totalFiltrado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>

        {/* Chips de filtro com scroll horizontal */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5 -mx-1 px-1">
          {categories.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setShowAll(false);
                }}
                className={`px-3 py-1.5 text-[10px] rounded-full font-bold transition-all duration-200 cursor-pointer shrink-0 border min-h-[28px] ${
                  active
                    ? 'bg-pink-700 text-white border-pink-700 shadow-xs'
                    : 'border-slate-100 text-slate-500 hover:border-pink-200 hover:bg-pink-50 bg-slate-50/50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Rows */}
      <div className="divide-y divide-slate-50/80">
        {displayedItems.length === 0 ? (
          <div className="px-4 py-6 text-center text-slate-400 text-[10px] italic">
            Nenhum investimento nesta categoria.
          </div>
        ) : (
          displayedItems.map((item, index) => (
            <div
              key={`${activeCategory}-${item.metric}-${index}`}
              className="px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/30 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0 flex-grow">
                {/* Marcador colorido */}
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getTagColorClass(item.categoria)}`} />
                
                <div className="min-w-0">
                  <p className="text-[11.5px] font-bold text-slate-700 truncate leading-tight mb-0.5">
                    {item.metric}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex px-1.5 py-0.5 rounded-md text-[8px] font-bold border ${getCategoryBadge(item.categoria)}`}>
                      {item.categoria}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">{monthLabel}</span>
                  </div>
                </div>
              </div>

              {/* Valor */}
              <div className="text-right shrink-0">
                <p className="text-[12px] font-black text-slate-800 leading-none">{item.valor}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Botão Ver todos / Ver menos */}
      {hasMore && (
        <div className="px-4 py-2.5 border-t border-slate-50/80 flex justify-end">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[9px] font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 transition-colors cursor-pointer border border-pink-100"
          >
            <span>{showAll ? 'Ver menos' : `Ver todos (${filteredInvestments.length})`}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Footer Timestamp */}
      <div className="flex items-center gap-1.5 text-slate-400 text-[8.5px] border-t border-slate-50/80 px-4 py-2 bg-slate-50/30">
        <Clock className="w-3 h-3 shrink-0" />
        <span>
          Última atualização: <span className="font-semibold">{timestamp}</span>
        </span>
      </div>
    </div>
  );
};

export default MobileInvestmentsPreviewCard;
