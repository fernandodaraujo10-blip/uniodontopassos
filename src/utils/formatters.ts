// Formatação regional pt-BR

export const formatarNumero = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR').format(valor);
};

export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

export const formatarPorcentagem = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(valor) + '%';
};

// Abrevia valores em milhares (ex: 12500 -> "R$ 12,5 mil")
export const formatarMilharMoeda = (valor: number): string => {
  if (valor >= 1000) {
    const mil = valor / 1000;
    return `R$ ${mil.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mil`;
  }
  return formatarMoeda(valor);
};
