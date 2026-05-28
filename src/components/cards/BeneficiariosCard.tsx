import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { BeneficiariosData } from '../../types/dashboard';

interface BeneficiariosCardProps {
  data: BeneficiariosData;
}

export const BeneficiariosCard: React.FC<BeneficiariosCardProps> = ({ data }) => {
  const isUp = data.percentType === 'up';

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 relative overflow-hidden card-shadow flex flex-col justify-between transition-all duration-300 h-full">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-[10px] font-bold text-pink-700 uppercase tracking-wider">Total de Beneficiários</h3>
          <span className="text-[10px] px-2 py-0.5 bg-pink-50 text-pink-700 border border-pink-700/20 rounded-full cursor-pointer hover:bg-pink-100 transition-colors">
            Parcial ▾
          </span>
        </div>
        
        <div className="text-3xl font-bold text-gray-900 mb-0.5 value-transition">
          {data.total}
        </div>
        
        <div className={`text-[11px] font-semibold mb-3 flex items-center value-transition ${
          isUp ? 'text-green-500' : 'text-red-500'
        }`}>
          {isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
          <span>{data.percentText}</span>
          <span className="text-gray-400 font-normal ml-1">vs. anterior</span>
        </div>
        
        <div className="space-y-1 text-[10px] text-gray-500">
          <div className="flex justify-between border-b border-gray-50 pb-0.5">
            <span>Base <span className="text-[9px] block">Resumo</span></span>
            <span className="text-right">versus período anterior <span className="block font-medium">Nomes: {data.novos}</span></span>
          </div>
          <div className="flex justify-between pt-0.5">
            <span>Total de ativos</span>
            <span className="font-bold text-gray-800">{data.ativos}</span>
          </div>
          <div className="flex justify-between">
            <span>Novos do mês</span>
            <span className="font-bold text-gray-800">{data.novos}</span>
          </div>
          <div className="flex justify-between">
            <span>Cancelamentos</span>
            <span className="font-bold text-gray-800">{data.cancelados}</span>
          </div>
        </div>
      </div>
      
      {/* Gráfico Rosca Minimalista */}
      <div className="mt-3 flex items-center gap-4 border-t border-gray-50 pt-2 shrink-0">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-pink-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path
              className="text-pink-700 transition-all duration-1000 ease-out"
              strokeDasharray={`${data.pfPercent}, 100`}
              strokeWidth="3.7"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-[8px] font-bold text-pink-700">{data.pfPercent}%</span>
        </div>
        <div className="text-[9px]">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-pink-700"></span>
            <span>PF {data.pfPercent}% ({data.pfVal})</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-pink-200"></span>
            <span>PJ {data.pjPercent}% ({data.pjVal})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiariosCard;
