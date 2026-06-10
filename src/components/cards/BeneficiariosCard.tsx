import React, { useState } from 'react';
import { TrendingUp, TrendingDown, HelpCircle, Users } from 'lucide-react';
import { BeneficiariosData } from '../../types/dashboard';

interface BeneficiariosCardProps {
  data: BeneficiariosData;
  compact?: boolean;
}

export const BeneficiariosCard: React.FC<BeneficiariosCardProps> = ({ data, compact = false }) => {
  const [showHelp, setShowHelp] = useState(false);
  const isUp = data.percentType === 'up';

  return (
    <div className={`bg-white relative overflow-hidden card-shadow flex flex-col justify-between transition-all duration-300 h-full ${
      compact ? 'mobile-card min-h-[190px] p-2 border border-gray-100' : 'p-4 rounded-2xl border border-gray-100'
    }`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowHelp(true);
        }}
        className={`absolute text-gray-400 hover:text-pink-700 transition-colors p-1 rounded-full hover:bg-gray-50 focus:outline-none shrink-0 cursor-pointer z-20 ${
          compact ? 'top-2 right-2' : 'top-3.5 right-3.5'
        }`}
        title="Explicar métrica"
      >
        <HelpCircle className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>

      <div>
        <div className={`flex justify-between items-start ${compact ? 'mb-1 pr-5' : 'mb-2 pr-7'}`}>
          <h3 className={`font-bold text-pink-700 uppercase tracking-wider ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
            Total de Beneficiários
          </h3>
          <span className={`px-2 py-0.5 bg-pink-50 text-pink-700 border border-pink-700/20 rounded-full cursor-pointer hover:bg-pink-100 transition-colors ${compact ? 'text-[8px]' : 'text-[10px]'}`}>
            Parcial ▾
          </span>
        </div>

        <div className={`flex items-baseline gap-2 ${compact ? 'flex-wrap mb-1' : 'mb-0.5'}`}>
          <div className={`${compact ? 'mobile-card-value' : 'text-3xl'} font-bold text-gray-900 leading-none value-transition`}>
            {data.total}
          </div>

          <div className={`font-semibold flex items-center value-transition whitespace-nowrap ${compact ? 'text-[9px] mt-0.5' : 'text-[11px] mb-3'} ${
            isUp ? 'text-green-500' : 'text-red-500'
          }`}>
            {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
            <span>{data.percentText}</span>
            <span className="text-gray-400 font-normal ml-1">vs. anterior</span>
          </div>
        </div>

        <div className={`space-y-1 text-gray-500 ${compact ? 'mobile-small' : 'text-[10px]'}`}>
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
      <div className={`mt-3 flex items-center gap-4 border-t border-gray-50 pt-2 shrink-0 ${compact ? 'hidden' : ''}`}>
        <div className="relative w-10 h-10 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-pink-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
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

      {showHelp && (
        <div className="absolute inset-0 bg-white rounded-2xl p-4 border border-gray-100 shadow-xl flex flex-col justify-between z-30 animate-fadeIn text-left">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-pink-700 uppercase flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Explicação: Beneficiários
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHelp(false);
                }}
                className="text-gray-400 hover:text-pink-700 font-semibold text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
            <div className="text-[10px] text-gray-600 space-y-2 leading-relaxed font-normal normal-case">
              <p>
                <strong>Total de Beneficiários ({data.total}):</strong> Número absoluto de vidas (clientes) com planos odontológicos ativos sob a cobertura da Uniodonto Passos.
              </p>
              <p>
                <strong>Novos do mês ({data.novos}):</strong> Total de novos beneficiários que ingressaram e ativaram o plano no período corrente.
              </p>
              <p>
                <strong>Cancelamentos ({data.cancelados}):</strong> Vidas que saíram da base de clientes (*churn*) no período.
              </p>
              <p>
                <strong>Distribuição PF vs PJ:</strong> Divisão percentual e quantitativa de clientes entre Pessoa Física (PF - planos individuais/familiares) e Pessoa Jurídica (PJ - planos empresariais).
              </p>
            </div>
          </div>
          <div className="text-[9px] text-gray-400 border-t border-gray-50 pt-2 text-center">
            Dica: Manter uma taxa de cancelamentos (*churn*) baixa é crucial para sustentar o crescimento orgânico da cooperativa!
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiariosCard;
