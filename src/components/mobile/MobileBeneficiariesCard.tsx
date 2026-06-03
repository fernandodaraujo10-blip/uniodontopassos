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
    <div className="bg-slate-200 p-5 rounded-3xl border-2 border-slate-400 shadow-[0_4px_20px_rgba(136,14,79,0.03)] relative flex flex-col justify-between w-full h-[335px] select-none">
      {/* Botão de Ajuda */}
      <button 
        onClick={(e) => { e.stopPropagation(); setShowHelp(true); }}
        className="absolute top-4 right-4 text-gray-400 hover:text-pink-700 transition-colors p-1 rounded-full hover:bg-slate-50 focus:outline-none cursor-pointer z-10"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      <div>
        {/* Título e Badge */}
        <div className="flex justify-between items-center mb-2 pr-6">
          <h3 className="text-[11px] font-black text-pink-700 uppercase tracking-tight">
            Total de Beneficiários
          </h3>
          <span className="text-[9px] px-2 py-0.5 bg-pink-50 text-pink-700 border border-pink-100 rounded-full font-bold select-none flex items-center gap-0.5">
            Parcial <span className="text-[7px]">▼</span>
          </span>
        </div>

        {/* Valor Principal */}
        <div className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">
          {data.total}
        </div>

        {/* Variação */}
        <div className={`text-[10px] font-bold mb-4 flex items-center gap-0.5 ${
          isUp ? 'text-emerald-500' : 'text-rose-500'
        }`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{data.percentText}</span>
          <span className="text-gray-400 font-normal">vs. anterior</span>
        </div>

        {/* Linhas de Dados */}
        <div className="space-y-2.5 mb-4">
          {/* Ativos */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-pink-50 rounded-full flex items-center justify-center text-pink-700">
                <User className="w-3 h-3 stroke-[2.5]" />
              </div>
              <span className="text-slate-600 font-medium">Ativos</span>
            </div>
            <span className="font-extrabold text-slate-800">{data.ativos}</span>
          </div>

          {/* Novos */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                <Plus className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-slate-600 font-medium">Novos do mês</span>
            </div>
            <span className="font-extrabold text-slate-800">{data.novos}</span>
          </div>

          {/* Cancelamentos */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
                <Minus className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-slate-600 font-medium">Cancelamentos</span>
            </div>
            <span className="font-extrabold text-slate-800">{data.cancelados}</span>
          </div>
        </div>
      </div>

      {/* Rodapé Circular de Distribuição */}
      <div className="flex items-center gap-4 border-t border-slate-50 pt-3 mt-auto">
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-pink-50" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path
              className="text-pink-700 transition-all duration-1000 ease-out"
              strokeDasharray={`${data.pfPercent}, 100`}
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-[9px] font-black text-pink-700">{data.pfPercent}%</span>
        </div>
        <div className="text-[10px] text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-700"></span>
            <span className="font-semibold">PF {data.pfPercent}% <span className="text-gray-400 font-normal">({data.pfVal})</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-100 border border-pink-200"></span>
            <span className="font-semibold">PJ {data.pjPercent}% <span className="text-gray-400 font-normal">({data.pjVal})</span></span>
          </div>
        </div>
      </div>

      {/* Modal explicativo interno */}
      {showHelp && (
        <div className="absolute inset-0 bg-white rounded-3xl p-4 shadow-xl flex flex-col justify-between z-20 animate-fadeIn text-left border border-slate-50">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-black text-pink-700 uppercase flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Explicação de Métricas
              </h4>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowHelp(false); }}
                className="text-gray-400 hover:text-pink-700 font-bold text-[9px] bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
            <div className="text-[9.5px] text-gray-500 space-y-2 leading-relaxed">
              <p><strong>Total de Beneficiários:</strong> Quantidade consolidada de vidas ativas (clientes) cobertas pela Uniodonto Passos.</p>
              <p><strong>Novos do mês / Cancelamentos:</strong> Volume de entradas e saídas de vidas na cooperativa durante o mês selecionado.</p>
              <p><strong>Distribuição PF vs PJ:</strong> Divisão percentual e em quantidade de vidas entre planos individuais (Pessoa Física) e corporativos (Pessoa Jurídica).</p>
            </div>
          </div>
          <div className="text-[8.5px] text-gray-400 border-t border-slate-50 pt-2 text-center">
            Monitorar a proporção PF/PJ ajuda a definir campanhas comerciais corporativas!
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileBeneficiariesCard;
