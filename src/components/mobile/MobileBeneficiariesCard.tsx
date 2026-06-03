import React, { useState } from 'react';
import { User, Plus, Minus, HelpCircle, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { BeneficiariosData } from '../../types/dashboard';

interface MobileBeneficiariesCardProps {
  data: BeneficiariosData;
}

export const MobileBeneficiariesCard: React.FC<MobileBeneficiariesCardProps> = ({ data }) => {
  const [showHelp, setShowHelp] = useState(false);
  const isUp = data.percentType === 'up';

  return (
    <div className="flex flex-col gap-3 w-full animate-fadeIn select-none relative">
      {/* Header Modal / Tooltip Overlay */}
      {showHelp && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-[24px] p-5 shadow-xl flex flex-col justify-between z-20 animate-fadeIn text-left border border-slate-100">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-600" />
                Dicionário de Métricas
              </h4>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowHelp(false); }}
                className="text-slate-400 hover:text-slate-700 font-semibold text-[11px] bg-slate-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
            <div className="text-xs text-slate-500 space-y-3 leading-relaxed font-medium">
              <p><strong className="text-slate-700">Total de Beneficiários:</strong> Quantidade consolidada de vidas ativas (clientes) cobertas pela Uniodonto Passos no momento atual.</p>
              <p><strong className="text-slate-700">Novos do mês / Cancelamentos:</strong> Volume de entradas e saídas de vidas na cooperativa durante o mês selecionado, indicando o churn e aquisição real.</p>
              <p><strong className="text-slate-700">Distribuição PF vs PJ:</strong> Divisão percentual e bruta de vidas entre planos individuais (Pessoa Física) e corporativos (Pessoa Jurídica).</p>
            </div>
          </div>
        </div>
      )}

      {/* Card Principal: Resumo Macro */}
      <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative">
        <button 
          onClick={(e) => { e.stopPropagation(); setShowHelp(true); }}
          className="absolute top-4 right-4 text-slate-300 hover:text-pink-600 transition-colors p-1.5 rounded-full hover:bg-pink-50"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total de Beneficiários
            </h3>
            <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-bold">
              Parcial
            </span>
          </div>

          <div className="text-4xl font-bold text-slate-800 tracking-tight leading-none mb-2">
            {data.total}
          </div>

          <div className={`text-[11px] font-semibold flex items-center gap-1 ${
            isUp ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{data.percentText}</span>
            <span className="text-slate-400 font-medium ml-1">vs. mês anterior</span>
          </div>
        </div>
      </div>

      {/* Grade de Sub-cards: Detalhamento de Movimentação */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-[11px] text-slate-500 font-semibold leading-tight">Adições</span>
          </div>
          <span className="font-bold text-slate-800 text-sm">{data.novos}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 shrink-0">
              <Minus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-[11px] text-slate-500 font-semibold leading-tight">Perdas</span>
          </div>
          <span className="font-bold text-slate-800 text-sm">{data.cancelados}</span>
        </div>
      </div>

      {/* Card de Distribuição PF/PJ */}
      <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center gap-5">
        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path
              className="text-pink-600 transition-all duration-1000 ease-out"
              strokeDasharray={`${data.pfPercent}, 100`}
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-[10px] font-bold text-slate-700">{data.pfPercent}%</span>
        </div>
        <div className="text-xs text-slate-600 space-y-1.5 flex-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-600"></span>
              <span className="font-semibold text-slate-700">Pessoa Física</span>
            </div>
            <span className="font-medium text-slate-400">{data.pfVal}</span>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-200 border border-slate-300"></span>
              <span className="font-semibold text-slate-700">Pessoa Jurídica</span>
            </div>
            <span className="font-medium text-slate-400">{data.pjVal}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MobileBeneficiariesCard;
