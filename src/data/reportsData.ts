export interface MarketingData {
  id: string;
  mes: string;
  canal: string;
  cidade: string;
  cliques: number;
  impressoes: number;
  conversoes: number;
  custo: number;
  receita: number;
}

export const CANAIS = ['Google Ads', 'Meta Ads', 'Email Marketing', 'Influenciadores', 'Orgânico'];
export const CIDADES = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre'];
export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Gerador de dados fictícios consistentes
const gerarDadosFicticios = (): MarketingData[] => {
  const dados: MarketingData[] = [];
  let idCounter = 1;

  // Fatores de performance por canal
  const performanceCanal: Record<string, { custoMedio: number; conversaoMult: number; receitaMult: number }> = {
    'Google Ads': { custoMedio: 15000, conversaoMult: 1.2, receitaMult: 2.8 },
    'Meta Ads': { custoMedio: 18000, conversaoMult: 1.4, receitaMult: 2.5 },
    'Email Marketing': { custoMedio: 2000, conversaoMult: 2.0, receitaMult: 4.5 }, // Excelente ROI
    'Influenciadores': { custoMedio: 25000, conversaoMult: 0.8, receitaMult: 2.1 },
    'Orgânico': { custoMedio: 4000, conversaoMult: 1.5, receitaMult: 5.0 } // Altíssimo ROI
  };

  // Fatores de tamanho por cidade
  const pesoCidade: Record<string, number> = {
    'São Paulo': 2.5,
    'Rio de Janeiro': 1.8,
    'Belo Horizonte': 1.2,
    'Curitiba': 1.0,
    'Porto Alegre': 0.9
  };

  // Fatores de sazonalidade por mês
  const sazonalidadeMes: Record<string, number> = {
    'Janeiro': 0.95,
    'Fevereiro': 0.85,
    'Março': 1.0,
    'Abril': 1.05,
    'Maio': 1.15, // Dia das Mães
    'Junho': 1.1,
    'Julho': 0.9,
    'Agosto': 1.0,
    'Setembro': 1.05,
    'Outubro': 1.1,
    'Novembro': 1.4, // Black Friday
    'Dezembro': 1.5 // Natal
  };

  MESES.forEach(mes => {
    CANAIS.forEach(canal => {
      CIDADES.forEach(cidade => {
        const pesoC = pesoCidade[cidade];
        const sazon = sazonalidadeMes[mes];
        const perf = performanceCanal[canal];

        // Variações aleatórias controladas
        const seed = Math.sin(idCounter) * 0.15 + 1; // Variação determinística baseada no contador
        
        const custo = Math.round(perf.custoMedio * pesoC * sazon * seed);
        const impressoes = Math.round(custo * (10 + seed * 2));
        const cliques = Math.round(impressoes * (0.02 + (perf.conversaoMult * 0.005) * seed));
        const conversoes = Math.round(cliques * (0.05 * perf.conversaoMult * seed));
        const receita = Math.round(custo * perf.receitaMult * seed);

        dados.push({
          id: `rep-${idCounter++}`,
          mes,
          canal,
          cidade,
          cliques,
          impressoes,
          conversoes,
          custo,
          receita
        });
      });
    });
  });

  return dados;
};

export const marketingRawData = gerarDadosFicticios();

// Funções utilitárias de agregação
export interface AggregatedSummary {
  custoTotal: number;
  receitaTotal: number;
  conversoesTotal: number;
  cliquesTotal: number;
  impressoesTotal: number;
  roiMedio: number;
  cpaMedio: number;
  cpcMedio: number;
  ctrMedio: number;
  taxaConversaoMedia: number;
}

export const calcularResumo = (dados: MarketingData[]): AggregatedSummary => {
  const custoTotal = dados.reduce((sum, item) => sum + item.custo, 0);
  const receitaTotal = dados.reduce((sum, item) => sum + item.receita, 0);
  const conversoesTotal = dados.reduce((sum, item) => sum + item.conversoes, 0);
  const cliquesTotal = dados.reduce((sum, item) => sum + item.cliques, 0);
  const impressoesTotal = dados.reduce((sum, item) => sum + item.impressoes, 0);

  const roiMedio = custoTotal > 0 ? (receitaTotal - custoTotal) / custoTotal : 0;
  const cpaMedio = conversoesTotal > 0 ? custoTotal / conversoesTotal : 0;
  const cpcMedio = cliquesTotal > 0 ? custoTotal / cliquesTotal : 0;
  const ctrMedio = impressoesTotal > 0 ? (cliquesTotal / impressoesTotal) * 100 : 0;
  const taxaConversaoMedia = cliquesTotal > 0 ? (conversoesTotal / cliquesTotal) * 100 : 0;

  return {
    custoTotal,
    receitaTotal,
    conversoesTotal,
    cliquesTotal,
    impressoesTotal,
    roiMedio,
    cpaMedio,
    cpcMedio,
    ctrMedio,
    taxaConversaoMedia
  };
};

export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

export const formatarNumero = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR').format(valor);
};

export const formatarPorcentagem = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor / 100);
};
