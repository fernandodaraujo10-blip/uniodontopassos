import React from 'react';
import { Zap, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';
import { ConversoesData } from '../../types/dashboard';

interface ConversoesCardProps {
  data: ConversoesData;
}

export const ConversoesCard: React.FC<ConversoesCardProps> = ({ data }) => {
  const isUp = data.percentType === 'up';

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 card-shadow flex flex-col justify-between transition-all duration-300 h-full">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 bg-pink-100 rounded-lg flex items-center justify-center text-pink-700 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-[10px] font-bold text-pink-700 uppercase">Conversões</h3>
        </div>
        
        <div className="text-3xl font-bold text-gray-900 mb-0.5 value-transition">
          {data.taxa}
        </div>
        
        <div className={`text-[11px] font-semibold mb-3 flex items-center value-transition ${
          isUp ? 'text-green-500' : 'text-red-500'
        }`}>
          {isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
          <span>{data.percentText}</span>
          <span className="text-gray-400 font-normal ml-1">vs. anterior</span>
        </div>
        
        <div className="space-y-1.5 mt-2 pt-2 border-t border-gray-50 text-[11px]">
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-600">Vendas</span>
            <span className="font-bold">{data.vendas}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-600">Leads qualif.</span>
            <span className="font-bold">{data.leads}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-600">Taxa final</span>
            <span className="font-bold">{data.taxa}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-2.5 p-2 bg-pink-50 rounded-xl border border-pink-100 flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 shrink-0 border-2 border-pink-200 rounded-full flex items-center justify-center text-pink-700 bg-white">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[8px] text-pink-700 font-bold uppercase tracking-wider">Meta mensal</p>
          <p className="text-xs font-bold text-pink-700">{data.meta}</p>
        </div>
      </div>
    </div>
  );
};

export default ConversoesCard;
