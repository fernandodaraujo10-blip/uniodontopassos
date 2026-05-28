import React, { useState } from 'react';
import { BarChart3, Clock } from 'lucide-react';
import { InvestmentItem } from '../../types/dashboard';

interface InvestmentTableProps {
  investimentos: InvestmentItem[];
  timestamp: string;
  monthLabel: string;
}

type InvestmentCategory = 'Todos' | 'Marketing' | 'Ads' | 'Offline';

export const InvestmentTable: React.FC<InvestmentTableProps> = ({
  investimentos,
  timestamp,
  monthLabel,
}) => {
  const [activeCategory, setActiveCategory] = useState<InvestmentCategory>('Todos');

  const categories: InvestmentCategory[] = ['Todos', 'Marketing', 'Ads', 'Offline'];

  // Filtra itens de acordo com a categoria selecionada
  const filteredInvestments = investimentos.filter(
    (item) => activeCategory === 'Todos' || item.categoria === activeCategory
  );

  // Calcula o total consolidado dos itens filtrados
  const totalFiltrado = filteredInvestments.reduce((acc, item) => acc + item.valorInt, 0);

  // Helper para obter a cor da tag da categoria
  const getTagColorClass = (categoria: string) => {
    switch (categoria) {
      case 'Marketing':
        return 'bg-purple-500';
      case 'Ads':
        return 'bg-pink-500';
      case 'Offline':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 card-shadow flex flex-col flex-grow h-full min-h-0 justify-between select-none">
      <div className="flex flex-col flex-grow min-h-0">
        
        {/* Título */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-700" />
            <h2 className="text-md font-bold text-gray-800 tracking-tight">Investimentos do Mês</h2>
          </div>
        </div>
        
        {/* Total Consolidado */}
        <div className="text-right mb-2 shrink-0">
          <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Total</p>
          <p className="text-2xl font-bold text-pink-700 transition-all duration-300">
            {totalFiltrado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
        
        {/* Filtros de Investimento */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-2 scrollbar-hide shrink-0">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-[9px] rounded-lg font-bold transition-all duration-200 cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-pink-700 text-white border-pink-700 shadow-sm'
                    : 'border-pink-100 text-gray-600 hover:border-pink-200 hover:bg-pink-50/20'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        
        {/* Tabela com scroll inteligente */}
        <div className="overflow-y-auto flex-grow custom-scrollbar pr-1 min-h-0">
          <table className="w-full text-[10px] text-left border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 sticky top-0 bg-white pb-2 z-10">
                <th className="pb-2 font-semibold">Mês</th>
                <th className="pb-2 font-semibold">Métrica</th>
                <th className="pb-2 font-semibold text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInvestments.map((item, index) => (
                <tr key={`${item.metric}-${index}`} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-1.5 font-medium text-gray-400">{monthLabel}</td>
                  <td className="py-1.5 text-gray-800 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${getTagColorClass(item.categoria)}`}></span>
                    {item.metric}
                  </td>
                  <td className="py-1.5 text-right font-bold text-gray-900">{item.valor}</td>
                </tr>
              ))}
              {filteredInvestments.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-400 italic">
                    Nenhum investimento registrado nesta categoria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer Timestamp */}
      <div className="flex items-center gap-2 text-gray-400 text-[10px] border-t border-gray-100 pt-3 mt-4 shrink-0">
        <Clock className="w-3.5 h-3.5 text-gray-400" />
        <span>
          Última atualização: <span className="font-semibold">{timestamp}</span>
        </span>
      </div>
      
    </div>
  );
};

export default InvestmentTable;
