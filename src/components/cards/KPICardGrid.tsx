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
}

export const KPICardGrid: React.FC<KPICardGridProps> = ({ data, area }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
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

  // Se a área for 'marketing' ou 'analise', mostramos grids estáticos de 4 colunas (sem carrossel)
  if (area === 'marketing') {
    return (
      <div className="w-full shrink-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-300">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-300">
          <BeneficiariosCard data={data.beneficiarios} />
          <LeadsCard data={data.leads} />
          <ConversoesCard data={data.conversoes} />
          <NpsCard data={data.nps} />
        </div>
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
