import React from 'react';
import { Smile, TrendingUp, TrendingDown } from 'lucide-react';
import { NpsData } from '../../types/dashboard';

interface NpsCardProps {
  data: NpsData;
}

export const NpsCard: React.FC<NpsCardProps> = ({ data }) => {
  const isUp = data.diffType === 'up';

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 card-shadow flex flex-col justify-between transition-all duration-300 h-full">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 bg-pink-100 rounded-lg flex items-center justify-center text-pink-700 shrink-0">
            <Smile className="w-4 h-4" />
          </div>
          <h3 className="text-[10px] font-bold text-pink-700 uppercase">Satisfação (NPS)</h3>
        </div>
        
        <div className="text-3xl font-bold text-gray-900 mb-0.5 value-transition">
          {data.total}
        </div>
        
        <div className={`text-[11px] font-semibold mb-3 flex items-center value-transition ${
          isUp ? 'text-green-500' : 'text-red-500'
        }`}>
          {isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
          <span>{data.diff}</span>
          <span className="text-gray-400 font-normal ml-1">vs. anterior</span>
        </div>
        
        <div className="space-y-1.5 mt-2 pt-2 border-t border-gray-50 text-[11px]">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Classificação</span>
            <span className={`font-bold ${data.statusColor}`}>{data.status}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total de respostas</span>
            <span className="font-bold text-gray-800">{data.respostas}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Detratores / Promotores</span>
            <span className="font-bold text-gray-800">{data.proDet}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-2.5 shrink-0">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-gray-500">Taxa de Promotores</span>
          <span className="font-bold">{data.progress}%</span>
        </div>
        <div className="w-full bg-pink-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-pink-700 h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${data.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NpsCard;
