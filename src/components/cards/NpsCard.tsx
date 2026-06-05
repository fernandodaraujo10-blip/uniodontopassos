import React, { useState } from 'react';
import { Smile, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { NpsData } from '../../types/dashboard';

interface NpsCardProps {
  data: NpsData;
  className?: string;
  compact?: boolean;
}

export const NpsCard: React.FC<NpsCardProps> = ({ data, className, compact = false }) => {
  const [showHelp, setShowHelp] = useState(false);
  const isUp = data.diffType === 'up';

  return (
    <div className={className || `kpi-card bg-white relative overflow-hidden card-shadow flex flex-col justify-between transition-all duration-300 h-full ${compact ? 'mobile-card min-h-[176px] p-2 border border-gray-100' : 'p-4 rounded-2xl border border-gray-100'}`}>
      <button 
        onClick={(e) => { e.stopPropagation(); setShowHelp(true); }}
        className={`absolute text-gray-400 hover:text-pink-700 transition-colors p-1 rounded-full hover:bg-gray-50 focus:outline-none shrink-0 cursor-pointer z-20 ${compact ? 'hidden' : 'top-3.5 right-3.5'}`}
        title="Explicar métrica"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      <div>
        <div className={`flex items-center gap-2 ${compact ? 'mb-1' : 'mb-2'}`}>
          <div className={`bg-pink-100 rounded-lg flex items-center justify-center text-pink-700 shrink-0 ${compact ? 'w-6 h-6' : 'w-7 h-7'}`}>
            <Smile className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </div>
          <h3 className={`font-bold text-pink-700 uppercase ${compact ? 'text-[9px]' : 'text-[10px]'}`}>Satisfação (NPS)</h3>
        </div>
        
        <div className={`${compact ? 'mobile-card-value' : 'text-3xl'} font-bold text-gray-900 mb-0.5 value-transition`}>
          {data.total}
        </div>
        
        <div className={`font-semibold flex items-center value-transition ${compact ? 'text-[10px] mb-1.5' : 'text-[11px] mb-3'} ${
          isUp ? 'text-green-500' : 'text-red-500'
        }`}>
          {isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
          <span>{data.diff}</span>
          <span className="text-gray-400 font-normal ml-1">vs. anterior</span>
        </div>
        
        <div className={`space-y-1.5 mt-2 pt-2 border-t border-gray-50 ${compact ? 'mobile-small' : 'text-[11px]'}`}>
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
      
      <div className={`shrink-0 ${compact ? 'mt-1.5' : 'mt-2.5'}`}>
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

      {showHelp && (
        <div className="absolute inset-0 bg-white rounded-2xl p-4 border border-gray-100 shadow-xl flex flex-col justify-between z-30 animate-fadeIn text-left">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-pink-700 uppercase flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5" />
                Explicação: NPS
              </h4>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowHelp(false); }}
                className="text-gray-400 hover:text-pink-700 font-semibold text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
            <div className="text-[10px] text-gray-600 space-y-2 leading-relaxed font-normal normal-case">
              <p><strong>NPS ({data.total}):</strong> Net Promoter Score. Métrica de 0 a 100 que avalia a satisfação e lealdade dos beneficiários com os serviços e atendimento da Uniodonto Passos.</p>
              <p><strong>Classificação ({data.status}):</strong> A zona de pontuação da cooperativa. Notas acima de 75 representam a prestigiada <strong>Zona de Excelência</strong>.</p>
              <p><strong>Total de respostas ({data.respostas}):</strong> Número amostral de clientes que participaram da pesquisa de satisfação no período.</p>
              <p><strong>Detratores / Promotores ({data.proDet}):</strong> Percentual de detratores (notas de 0 a 6) versus promotores (notas 9 ou 10) na base respondente.</p>
            </div>
          </div>
          <div className="text-[9px] text-gray-400 border-t border-gray-50 pt-2 text-center">
            Dica: Ouvir e dar retorno aos clientes detratores é a melhor forma de melhorar a qualidade do serviço!
          </div>
        </div>
      )}
    </div>
  );
};

export default NpsCard;
