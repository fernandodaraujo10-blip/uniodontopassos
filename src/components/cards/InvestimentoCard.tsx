import React from 'react';
import { CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import { InvestimentoData } from '../../types/dashboard';

interface InvestimentoCardProps {
  data: InvestimentoData;
}

export const InvestimentoCard: React.FC<InvestimentoCardProps> = ({ data }) => {
  const isUp = data.percentType === 'up';

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 card-shadow flex flex-col justify-between transition-all duration-300 h-full">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 bg-pink-100 rounded-lg flex items-center justify-center text-pink-700 shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <h3 className="text-[10px] font-bold text-pink-700 uppercase">Investimento</h3>
        </div>
        
        <div className="text-2xl font-bold text-gray-900 mb-0.5 value-transition">
          {data.total}
        </div>
        
        <div className={`text-[11px] font-semibold mb-3 flex items-center value-transition ${
          isUp ? 'text-green-500' : 'text-red-500'
        }`}>
          {isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
          <span>{data.percentText}</span>
          <span className="text-gray-400 font-normal ml-1">vs. anterior</span>
        </div>
        
        <div className="space-y-1.5 mt-2 pt-2 border-t border-gray-50 text-[11px]">
          <div>
            <p className="text-gray-400 text-[10px]">Investido no mês</p>
            <p className="font-bold text-gray-800">{data.atual}</p>
          </div>
          <div className="pt-0.5">
            <p className="text-gray-400 text-[10px]">Orçado para o mês</p>
            <p className="font-bold text-gray-800">{data.orcamento}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-2.5 shrink-0">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-gray-500">% utilizado</span>
          <span className="font-bold">{data.progressoPercent}</span>
        </div>
        <div className="w-full bg-pink-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-pink-700 h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: data.progressoPercent }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default InvestimentoCard;
