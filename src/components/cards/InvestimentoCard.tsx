import React, { useState } from 'react';
import { CreditCard, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { InvestimentoData } from '../../types/dashboard';

interface InvestimentoCardProps {
  data: InvestimentoData;
  className?: string;
  compact?: boolean;
}

export const InvestimentoCard: React.FC<InvestimentoCardProps> = ({ data, className, compact = false }) => {
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
            <CreditCard className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </div>
          <h3 className={`font-bold text-pink-700 uppercase ${compact ? 'text-[9px]' : 'text-[10px]'}`}>Investimento</h3>
        </div>
        
        <div className={`${compact ? 'text-[22px]' : 'text-2xl'} font-bold text-gray-900 mb-0.5 value-transition`}>
          {data.total}
        </div>
        
        <div className={`font-semibold flex items-center value-transition ${compact ? 'text-[10px] mb-1.5' : 'text-[11px] mb-3'} ${
          isUp ? 'text-green-500' : 'text-red-500'
        }`}>
          {isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
          <span>{data.percentText}</span>
          <span className="text-gray-400 font-normal ml-1">vs. anterior</span>
        </div>
        
        <div className={`space-y-1.5 mt-2 pt-2 border-t border-gray-50 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
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
      
      <div className={`shrink-0 ${compact ? 'mt-1.5' : 'mt-2.5'}`}>
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

      {showHelp && (
        <div className="absolute inset-0 bg-white rounded-2xl p-4 border border-gray-100 shadow-xl flex flex-col justify-between z-30 animate-fadeIn text-left">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-pink-700 uppercase flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                Explicação: Investimento
              </h4>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowHelp(false); }}
                className="text-gray-400 hover:text-pink-700 font-semibold text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
            <div className="text-[10px] text-gray-600 space-y-2 leading-relaxed font-normal normal-case">
              <p><strong>Investimento Total ({data.total}):</strong> Reflete a soma de toda a verba alocada no mês para captação comercial (canais pagos de marketing, publicidade offline e ferramentas).</p>
              <p><strong>Investido ({data.atual}):</strong> Valor que já foi efetivamente executado em campanhas, ferramentas ou comissões no período corrente.</p>
              <p><strong>Orçado ({data.orcamento}):</strong> Limite orçamentário previsto e planejado pela diretoria para investimentos na área no respectivo mês.</p>
              <p><strong>% Utilizado ({data.progressoPercent}):</strong> Percentual de consumo da verba orçada. Ajuda a monitorar se o marketing está rodando dentro do orçamento.</p>
            </div>
          </div>
          <div className="text-[9px] text-gray-400 border-t border-gray-50 pt-2 text-center">
            Dica: Um investimento constante com aumento de leads indica otimização e ganho de escala comercial!
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestimentoCard;
