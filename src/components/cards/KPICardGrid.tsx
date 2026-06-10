import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MonthDashboardData } from '../../types/dashboard';
import { DashboardArea } from '../filters/FilterTabs';
import BeneficiariosCard from './BeneficiariosCard';
import LeadsCard from './LeadsCard';
import ConversoesCard from './ConversoesCard';
import InvestimentoCard from './InvestimentoCard';
import RoiCard from './RoiCard';
import NpsCard from './NpsCard';

interface KPICardGridProps {
  data: MonthDashboardData;
  area: DashboardArea;
  compact?: boolean;
}

type KpiCardKey = 'beneficiarios' | 'investimento' | 'roi' | 'nps' | 'leads' | 'conversoes';

export const KPICardGrid: React.FC<KPICardGridProps> = ({ data, area, compact = false }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const clickStateRef = useRef<{ key: KpiCardKey | null; count: number; timeoutId: ReturnType<typeof window.setTimeout> | null }>({
    key: null,
    count: 0,
    timeoutId: null,
  });
  const [expandedCard, setExpandedCard] = useState<KpiCardKey | null>(null);
  const [showPrevArrow, setShowPrevArrow] = useState(false);
  const [showNextArrow, setShowNextArrow] = useState(true);

  // Função para controlar a visibilidade das setas com base na posição do scroll
  const updateArrows = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowPrevArrow(scrollLeft > 5);
    setShowNextArrow(scrollLeft < scrollWidth - clientWidth - 5 && scrollWidth > clientWidth);
  };

  // Rola o carrossel na direção especificada
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.firstElementChild?.firstElementChild as HTMLElement;
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = 16; // gap-4 equivale a 16px
    const scrollAmount = (cardWidth + gap) * (direction === 'left' ? -1 : 1);

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });

    // Pequeno timeout para atualizar as setas pós-scroll
    setTimeout(updateArrows, 350);
  };

  // Monitora alterações de redimensionamento e de dados para recalcular setas
  useEffect(() => {
    updateArrows();
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', updateArrows);
      window.addEventListener('resize', updateArrows);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', updateArrows);
      }
      window.removeEventListener('resize', updateArrows);
    };
  }, [data, area]);

  useEffect(() => {
    return () => {
      const timer = clickStateRef.current.timeoutId;
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  const clearCardClickState = () => {
    const state = clickStateRef.current;
    if (state.timeoutId) {
      window.clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }
    state.key = null;
    state.count = 0;
  };

  const handleCardClick = (key: KpiCardKey) => {
    if (!compact || area !== 'geral') return;

    const state = clickStateRef.current;

    if (state.key === key) {
      state.count += 1;
    } else {
      clearCardClickState();
      state.key = key;
      state.count = 1;
    }

    if (state.count >= 3) {
      clearCardClickState();
      setExpandedCard(key);
      return;
    }

    if (state.timeoutId) {
      window.clearTimeout(state.timeoutId);
    }

    state.timeoutId = window.setTimeout(() => {
      clearCardClickState();
    }, 550);
  };

  const closeExpandedCard = () => {
    setExpandedCard(null);
    clearCardClickState();
  };

  const getExpandedCardClassName = () =>
    'bg-white relative overflow-hidden card-shadow flex flex-col justify-between transition-all duration-300 w-full h-full min-h-[calc(100vh-6rem)] p-4 rounded-[28px] border border-gray-100';

  const renderKpiCard = (key: KpiCardKey, fullscreen = false) => {
    const cardClassName = fullscreen ? getExpandedCardClassName() : undefined;
    const cardCompact = fullscreen ? false : compact;
    switch (key) {
      case 'beneficiarios':
        return <BeneficiariosCard data={data.beneficiarios} compact={cardCompact} className={cardClassName} />;
      case 'investimento':
        return <InvestimentoCard data={data.investimento} compact={cardCompact} className={cardClassName} />;
      case 'roi':
        return <RoiCard data={data.roi} compact={cardCompact} className={cardClassName} />;
      case 'nps':
        return <NpsCard data={data.nps} compact={cardCompact} className={cardClassName} />;
      case 'leads':
        return <LeadsCard data={data.leads} compact={cardCompact} className={cardClassName} />;
      case 'conversoes':
        return <ConversoesCard data={data.conversoes} compact={cardCompact} className={cardClassName} />;
      default:
        return null;
    }
  };

  // Se a área for 'marketing' ou 'analise', mostramos grids estáticos de 4 colunas (sem carrossel)
  if (area === 'marketing') {
    return (
      <div className="w-full shrink-0">
        <div className={`grid ${compact ? 'grid-cols-2 gap-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'} transition-all duration-300`}>
          <LeadsCard data={data.leads} />
          <ConversoesCard data={data.conversoes} />
          <InvestimentoCard data={data.investimento} />
          <RoiCard data={data.roi} />
        </div>
      </div>
    );
  }

  if (area === 'analise') {
    return (
      <div className="w-full shrink-0">
        <div className={`grid ${compact ? 'grid-cols-2 gap-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'} transition-all duration-300`}>
          <BeneficiariosCard data={data.beneficiarios} compact={compact} />
          <LeadsCard data={data.leads} compact={compact} />
          <ConversoesCard data={data.conversoes} compact={compact} />
          <NpsCard data={data.nps} compact={compact} />
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="w-full shrink-0 relative">
        <div className="grid grid-cols-2 gap-3 transition-all duration-300">
          <div role="button" tabIndex={0} onClick={() => handleCardClick('beneficiarios')} className="text-left cursor-zoom-in">
            {renderKpiCard('beneficiarios')}
          </div>
          <div role="button" tabIndex={0} onClick={() => handleCardClick('investimento')} className="text-left cursor-zoom-in">
            {renderKpiCard('investimento')}
          </div>
          <div role="button" tabIndex={0} onClick={() => handleCardClick('roi')} className="text-left cursor-zoom-in">
            {renderKpiCard('roi')}
          </div>
          <div role="button" tabIndex={0} onClick={() => handleCardClick('nps')} className="text-left cursor-zoom-in">
            {renderKpiCard('nps')}
          </div>
          <div role="button" tabIndex={0} onClick={() => handleCardClick('leads')} className="text-left cursor-zoom-in">
            {renderKpiCard('leads')}
          </div>
          <div role="button" tabIndex={0} onClick={() => handleCardClick('conversoes')} className="text-left cursor-zoom-in">
            {renderKpiCard('conversoes')}
          </div>
        </div>

        {expandedCard && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md px-3 py-4 flex items-stretch justify-center"
            onClick={closeExpandedCard}
          >
            <div className="w-full max-w-[430px] h-full flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between text-white px-1">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/60 font-bold">Visualização expandida</p>
                  <h3 className="text-lg font-bold leading-tight">Toque em voltar para fechar</h3>
                </div>
                <button
                  type="button"
                  onClick={closeExpandedCard}
                  className="rounded-full bg-white/10 hover:bg-white/20 text-white px-3 py-2 text-xs font-bold transition-colors"
                >
                  Voltar ao normal
                </button>
              </div>

              <div className="flex-1 min-h-0">
                {renderKpiCard(expandedCard, true)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Se for a área 'geral', exibe todos os 6 cards em formato de carrossel
  return (
      <div className="relative w-full shrink-0 group select-none">
      {/* Seta Scroll Anterior */}
      {showPrevArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 md:-left-3 top-1/2 -translate-y-1/2 z-40 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:bg-pink-50 text-pink-700 cursor-pointer"
          aria-label="Rolar para esquerda"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Container de Scroll Oculto */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide scroll-smooth w-full pr-1"
      >
        <div className="grid grid-flow-col auto-cols-[100%] sm:auto-cols-[calc(50%-8px)] lg:auto-cols-[calc(25%-12px)] gap-4 shrink-0 transition-all duration-300">
          <BeneficiariosCard data={data.beneficiarios} />
          <InvestimentoCard data={data.investimento} />
          <RoiCard data={data.roi} />
          <NpsCard data={data.nps} />
          <LeadsCard data={data.leads} />
          <ConversoesCard data={data.conversoes} />
        </div>
      </div>

      {/* Seta Scroll Próxima */}
      {showNextArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 md:-right-3 top-1/2 -translate-y-1/2 z-40 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:bg-pink-50 text-pink-700 cursor-pointer"
          aria-label="Rolar para direita"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default KPICardGrid;
