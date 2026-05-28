import React from 'react';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { LeadsData } from '../../types/dashboard';

interface LeadsCardProps {
  data: LeadsData;
}

export const LeadsCard: React.FC<LeadsCardProps> = ({ data }) => {
  const isUp = data.percentType === 'up';

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 card-shadow flex flex-col justify-between transition-all duration-300 h-full">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 bg-pink-100 rounded-lg flex items-center justify-center text-pink-700 shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-[10px] font-bold text-pink-700 uppercase">Leads no Período</h3>
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
      </div>
      
      <div className="space-y-1.5 mt-2 pt-2 border-t border-gray-50 shrink-0">
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Origem principal</p>
        <div className="text-[11px] space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Google Ads</span>
            <span className="font-bold">{data.origem.google}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Meta ADS</span>
            <span className="font-bold">{data.origem.meta}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Indicação</span>
            <span className="font-bold">{data.origem.indicacao}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Outros</span>
            <span className="font-bold">{data.origem.outros}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsCard;
