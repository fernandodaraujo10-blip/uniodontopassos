import React, { useState } from 'react';
import { BarChart3, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { InvestmentItem } from '../../types/dashboard';

interface MobileInvestmentListProps {
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
      return 'bg-yellow-500';
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
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
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
}) => {
  const [activeCategory, setActiveCategory] = useState<InvestmentCategory>('Todos');
  const [showAll, setShowAll] = useState(false);

  const INITIAL_LIMIT = 5;
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
    <div className="bg-white rounded-2xl border border-gray-100 card-shadow overflow-hidden">
      {/* Cabeçalho */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-700 flex-shrink-0" />
            <h2 className="text-[15px] font-bold text-gray-800 tracking-tight">
              Investimentos do Mês
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Total</p>
            <p className="text-lg font-bold text-pink-700 leading-tight">
              {totalFiltrado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>

        {/* Chips de filtro com scroll horizontal */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setShowAll(false);
                }}
                className={`px-3 py-1.5 text-[11px] rounded-full font-bold transition-all duration-200 cursor-pointer shrink-0 border min-h-[32px] ${
                  isActive
                    ? 'bg-pink-700 text-white border-pink-700 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-pink-200 hover:bg-pink-50/30 bg-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Cards */}
      <div className="divide-y divide-gray-50">
        {displayedItems.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400 text-sm italic">
            Nenhum investimento registrado nesta categoria.
          </div>
        ) : (
          displayedItems.map((item, index) => (
            <div
              key={`${activeCategory}-${item.metric}-${index}`}
              className="px-4 py-3 flex items-start justify-between gap-3 hover:bg-gray-50/60 transition-colors"
            >
              {/* Info do investimento */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${getTagColorClass(item.categoria)}`}
                  />
                  <p className="text-[14px] font-semibold text-gray-800 truncate leading-tight">
                    {item.metric}
                  </p>
                </div>
                <div className="flex items-center gap-2 pl-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryBadge(item.categoria)}`}
                  >
                    {item.categoria}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">{monthLabel}</span>
                </div>
              </div>

              {/* Valor */}
              <div className="text-right flex-shrink-0">
                <p className="text-[15px] font-bold text-gray-900">{item.valor}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Botão "Ver todos" / "Ver menos" */}
      {hasMore && (
        <div className="px-4 py-3 border-t border-gray-50">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 transition-colors min-h-[44px] cursor-pointer border border-pink-100"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Ver menos
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Ver todos ({filteredInvestments.length} itens)
              </>
            )}
          </button>
        </div>
      )}

      {/* Footer Timestamp */}
      <div className="flex items-center gap-2 text-gray-400 text-[10px] border-t border-gray-50 px-4 py-3">
        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
        <span>
          Última atualização: <span className="font-semibold">{timestamp}</span>
        </span>
      </div>
    </div>
  );
};

export default MobileInvestmentList;
