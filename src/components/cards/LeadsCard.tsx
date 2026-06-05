import React, { useState } from 'react';
import { Users, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { LeadsData } from '../../types/dashboard';

interface LeadsCardProps {
  data: LeadsData;
  className?: string;
  compact?: boolean;
}

export const LeadsCard: React.FC<LeadsCardProps> = ({ data, className, compact = false }) => {
  const [showHelp, setShowHelp] = useState(false);
  const isUp = data.percentType === 'up';

  return (
    <div className={className || `bg-white relative overflow-hidden card-shadow flex flex-col justify-between transition-all duration-300 h-full ${compact ? 'p-2 rounded-xl border border-gray-100' : 'p-4 rounded-2xl border border-gray-100'}`}>
      <button 
        onClick={(e) => { e.stopPropagation(); setShowHelp(true); }}
        className={`absolute text-gray-400 hover:text-pink-700 transition-colors p-1 rounded-full hover:bg-gray-50 focus:outline-none shrink-0 cursor-pointer z-20 ${compact ? 'top-2 right-2' : 'top-3.5 right-3.5'}`}
        title="Explicar métrica"
      >
        <HelpCircle className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>

      <div>
        <div className={`flex items-center gap-2 ${compact ? 'mb-1' : 'mb-2'}`}>
          <div className={`bg-pink-100 rounded-lg flex items-center justify-center text-pink-700 shrink-0 ${compact ? 'w-6 h-6' : 'w-7 h-7'}`}>
            <Users className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </div>
          <h3 className={`font-bold text-pink-700 uppercase ${compact ? 'text-[9px]' : 'text-[10px]'}`}>Leads no Período</h3>
        </div>
        
        <div className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-0.5 value-transition`}>
          {data.total}
        </div>
        
        <div className={`font-semibold flex items-center value-transition ${compact ? 'text-[10px] mb-1.5' : 'text-[11px] mb-3'} ${
          isUp ? 'text-green-500' : 'text-red-500'
        }`}>
          {isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
          <span>{data.percentText}</span>
          <span className="text-gray-400 font-normal ml-1">vs. anterior</span>
        </div>
      </div>
      
      <div className={`space-y-1.5 mt-2 pt-2 border-t border-gray-50 shrink-0 ${compact ? 'text-[9px]' : 'text-[11px]'}`}>
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Origem principal</p>
        <div className={`space-y-1.5 ${compact ? 'space-y-1' : ''}`}>
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

      {showHelp && (
        <div className="absolute inset-0 bg-white rounded-2xl p-4 border border-gray-100 shadow-xl flex flex-col justify-between z-30 animate-fadeIn text-left">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-pink-700 uppercase flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Explicação: Leads
              </h4>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowHelp(false); }}
                className="text-gray-400 hover:text-pink-700 font-semibold text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
            <div className="text-[10px] text-gray-600 space-y-2 leading-relaxed font-normal normal-case">
              <p><strong>Leads no Período ({data.total}):</strong> Quantidade total de pessoas ou empresas que demonstraram interesse real nos planos (preenchendo formulários, enviando mensagens ou ligando).</p>
              <p><strong>Canais de Origem:</strong> Indica onde os leads foram captados: anúncios patrocinados no Google Ads, redes sociais do Meta Ads (Facebook/Instagram), indicações comerciais diretas ou canais orgânicos.</p>
              <p><strong>Função no Funil:</strong> Os leads são as oportunidades geradas que o time de vendas (SDR/comercial) aborda para qualificar e converter em clientes ativos.</p>
            </div>
          </div>
          <div className="text-[9px] text-gray-400 border-t border-gray-50 pt-2 text-center">
            Dica: Identificar e focar nos canais que geram leads com maior taxa de conversão reduz drasticamente o CAC!
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsCard;
