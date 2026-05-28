import React, { useState } from 'react';
import { Zap, CheckCircle2, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { ConversoesData } from '../../types/dashboard';

interface ConversoesCardProps {
  data: ConversoesData;
}

export const ConversoesCard: React.FC<ConversoesCardProps> = ({ data }) => {
  const [showHelp, setShowHelp] = useState(false);
  const isUp = data.percentType === 'up';

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 relative overflow-hidden card-shadow flex flex-col justify-between transition-all duration-300 h-full">
      <button 
        onClick={(e) => { e.stopPropagation(); setShowHelp(true); }}
        className="absolute top-3.5 right-3.5 text-gray-400 hover:text-pink-700 transition-colors p-1 rounded-full hover:bg-gray-50 focus:outline-none shrink-0 cursor-pointer z-20"
        title="Explicar métrica"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

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

      {showHelp && (
        <div className="absolute inset-0 bg-white rounded-2xl p-4 border border-gray-100 shadow-xl flex flex-col justify-between z-30 animate-fadeIn text-left">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-pink-700 uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Explicação: Conversões
              </h4>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowHelp(false); }}
                className="text-gray-400 hover:text-pink-700 font-semibold text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
            <div className="text-[10px] text-gray-600 space-y-2 leading-relaxed font-normal normal-case">
              <p><strong>Taxa de Conversão ({data.taxa}):</strong> Percentual de leads qualificados que foram convertidos em vendas reais. Avalia a eficácia de fechamento do time comercial.</p>
              <p><strong>Vendas ({data.vendas}):</strong> Número absoluto de novos contratos assinados e ativados no período.</p>
              <p><strong>Leads qualificados ({data.leads}):</strong> Quantidade de oportunidades de negócio prontas para abordagem comercial que entraram no funil.</p>
              <p><strong>Meta ({data.meta}):</strong> Taxa de conversão alvo estabelecida pela diretoria da cooperativa para garantir o crescimento ideal da base.</p>
            </div>
          </div>
          <div className="text-[9px] text-gray-400 border-t border-gray-50 pt-2 text-center">
            Dica: Se a conversão estiver baixa, analise o tempo de resposta do time comercial ou o nível de qualificação dos leads gerados!
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversoesCard;
