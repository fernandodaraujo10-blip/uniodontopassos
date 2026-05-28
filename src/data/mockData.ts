import { DashboardDataMap } from '../types/dashboard';

export const dashboardData: DashboardDataMap = {
  abril: {
    timestamp: "05/04/2026 18:45",
    beneficiarios: {
      total: "10.289",
      percentText: "1,5%",
      percentType: "up",
      ativos: "10.289",
      novos: "35",
      cancelados: "15",
      pfPercent: 5,
      pfVal: "515",
      pjPercent: 95,
      pjVal: "9.774"
    },
    leads: {
      total: "132",
      percentText: "8,5%",
      percentType: "up",
      origem: { google: "60%", meta: "22%", indicacao: "10%", outros: "8%" },
      origemInt: { google: 60, meta: 22, indicacao: 10, outros: 8 }
    },
    conversoes: {
      taxa: "11,8%",
      percentText: "0,5 p.p.",
      percentType: "up",
      vendas: "15",
      leads: "132",
      meta: "12%"
    },
    investimento: {
      total: "R$ 12,1 mil",
      percentText: "-1,8%",
      percentType: "down",
      atual: "R$ 11.500,00",
      orcamento: "R$ 12.100,00",
      progressoPercent: "95,0%"
    },
    roi: { total: "3,8x", diff: "+0,2x", diffType: "up", cac: "R$ 295,00", ltv: "R$ 1.120,00", fator: "3,8x", progress: 76 },
    nps: { total: "76", diff: "+1 pt", diffType: "up", status: "Excelência", statusColor: "text-green-500", respostas: "310", proDet: "5% / 81%", progress: 81 },
    investimentosTabela: [
      { categoria: "Ads", metric: "Meta anúncios do Facebook/Instagram", valor: "R$ 2.800,00", valorInt: 2800 },
      { categoria: "Ads", metric: "Anúncios do Google", valor: "R$ 3.700,00", valorInt: 3700 },
      { categoria: "Marketing", metric: "RD Conversas", valor: "R$ 1.200,00", valorInt: 1200 },
      { categoria: "Marketing", metric: "RD CRM", valor: "R$ 950,00", valorInt: 950 },
      { categoria: "Offline", metric: "Rádio Passos / Rádio Vida", valor: "R$ 613,32", valorInt: 613.32 },
      { categoria: "Marketing", metric: "Outros custos e ferramentas", valor: "R$ 1.100,00", valorInt: 1100 },
      { categoria: "Marketing", metric: "E-mail Marketing", valor: "R$ 250,00", valorInt: 250 },
      { categoria: "Offline", metric: "Impressos e materiais", valor: "R$ 350,00", valorInt: 350 },
      { categoria: "Offline", metric: "Eventos e patrocínios", valor: "R$ 300,00", valorInt: 300 },
      { categoria: "Marketing", metric: "Assessoria de imprensa", valor: "R$ 236,68", valorInt: 236.68 }
    ],
    anuncios: {
      "Google Ads": {
        semanal: [10, 55, 74, 68, 80, 55, 48],
        views: "295.120",
        groups: "18.150",
        groupsChange: "▼ 5",
        invested: "R$ 15.220,00",
        leads: "48",
        conversions: "210",
        schedRate: "39,80%"
      },
      "Meta ADS": {
        semanal: [32, 45, 58, 62, 70, 48, 39],
        views: "185.000",
        groups: "9.200",
        groupsChange: "▲ 1",
        invested: "R$ 8.900,00",
        leads: "52",
        conversions: "144",
        schedRate: "42,10%"
      },
      "Instagram": {
        semanal: [22, 38, 48, 55, 72, 50, 41],
        views: "142.300",
        groups: "6.800",
        groupsChange: "▬ 0",
        invested: "R$ 6.100,00",
        leads: "38",
        conversions: "95",
        schedRate: "35,40%"
      }
    },
    funil: {
      impressoes: "395.200", impressoesChange: "▲ 2,1%", impressoesChangeType: "up",
      cliques: "26.540", cliquesChange: "▼ -1,2%", cliquesChangeType: "down",
      leads: "81", leadsChange: "▼ -5,4%", leadsChangeType: "down",
      agendamentos: "41", agendamentosChange: "▲ 4,3%", agendamentosChangeType: "up",
      vendas: "37", vendasChange: "▲ 5,0%", vendasChangeType: "up",
      txCtr: "6,71%", txCtrChange: "▲ 0,8%", txCtrChangeType: "up",
      txLeads: "0,31%", txLeadsChange: "▲ 0,5%", txLeadsChangeType: "up",
      txAgendamentos: "50,62%", txAgendamentosChange: "▲ 1,5%", txAgendamentosChangeType: "up",
      txVendas: "90,24%", txVendasChange: "▼ -2,1%", txVendasChangeType: "down"
    },
    cidades: [
      { nome: "Passos", beneficiarios: "7.980", crescimento: "+ 10,2%" },
      { nome: "Itaú de Minas", beneficiarios: "6.610", crescimento: "+ 8,5%" },
      { nome: "São Seb. Paraíso", beneficiarios: "5.750", crescimento: "+ 12,1%" },
      { nome: "Cássia", beneficiarios: "4.720", crescimento: "+ 6,3%" },
      { nome: "Alpinópolis", beneficiarios: "4.110", crescimento: "+ 15,2%" }
    ]
  },
  maio: {
    timestamp: "05/05/2026 08:30",
    beneficiarios: {
      total: "10.289",
      percentText: "2,1%",
      percentType: "up",
      ativos: "10.289",
      novos: "42",
      cancelados: "18",
      pfPercent: 5,
      pfVal: "515",
      pjPercent: 95,
      pjVal: "9.774"
    },
    leads: {
      total: "145",
      percentText: "14,7%",
      percentType: "up",
      origem: { google: "65%", meta: "20%", indicacao: "8%", outros: "7%" },
      origemInt: { google: 65, meta: 20, indicacao: 8, outros: 7 }
    },
    conversoes: {
      taxa: "12,4%",
      percentText: "1,8 p.p.",
      percentType: "up",
      vendas: "18",
      leads: "145",
      meta: "12%"
    },
    investimento: {
      total: "R$ 12,5 mil",
      percentText: "-5,2%",
      percentType: "down",
      atual: "R$ 11.915,32",
      orcamento: "R$ 13.000,00",
      progressoPercent: "91,7%"
    },
    roi: { total: "4,2x", diff: "+0,4x", diffType: "up", cac: "R$ 283,69", ltv: "R$ 1.190,00", fator: "4,2x", progress: 84 },
    nps: { total: "78", diff: "+2 pts", diffType: "up", status: "Excelência", statusColor: "text-green-500", respostas: "342", proDet: "4% / 82%", progress: 82 },
    investimentosTabela: [
      { categoria: "Ads", metric: "Meta anúncios do Facebook/Instagram", valor: "R$ 3.000,00", valorInt: 3000 },
      { categoria: "Ads", metric: "Anúncios do Google", valor: "R$ 3.950,00", valorInt: 3950 },
      { categoria: "Marketing", metric: "RD Conversas", valor: "R$ 1.200,00", valorInt: 1200 },
      { categoria: "Marketing", metric: "Marketing de P&D", valor: "R$ 1.000,00", valorInt: 1000 },
      { categoria: "Marketing", metric: "RD CRM", valor: "R$ 950,00", valorInt: 950 },
      { categoria: "Offline", metric: "Rádio Passos / Rádio Vida", valor: "R$ 613,32", valorInt: 613.32 },
      { categoria: "Marketing", metric: "Outros custos e ferramentas", valor: "R$ 1.200,00", valorInt: 1200 },
      { categoria: "Marketing", metric: "E-mail Marketing", valor: "R$ 250,00", valorInt: 250 },
      { categoria: "Offline", metric: "Impressos e materiais", valor: "R$ 350,00", valorInt: 350 },
      { categoria: "Offline", metric: "Eventos e patrocínios", valor: "R$ 400,00", valorInt: 400 },
      { categoria: "Marketing", metric: "Assessoria de imprensa", valor: "R$ 200,00", valorInt: 200 },
      { categoria: "Marketing", metric: "SEO e conteúdo", valor: "R$ 300,00", valorInt: 300 },
      { categoria: "Marketing", metric: "Software e licenças", valor: "R$ 200,00", valorInt: 200 },
      { categoria: "Marketing", metric: "Capacitação e treinamentos", valor: "R$ 150,00", valorInt: 150 },
      { categoria: "Marketing", metric: "Comissões e parcerias", valor: "R$ 150,00", valorInt: 150 }
    ],
    anuncios: {
      "Google Ads": {
        semanal: [12, 69, 84, 75, 88, 61, 57],
        views: "312.850",
        groups: "19.842",
        groupsChange: "▼ 2",
        invested: "R$ 17.171,72",
        leads: "58",
        conversions: "245",
        schedRate: "41,20%"
      },
      "Meta ADS": {
        semanal: [40, 52, 68, 71, 79, 58, 45],
        views: "210.400",
        groups: "11.100",
        groupsChange: "▲ 4",
        invested: "R$ 9.850,00",
        leads: "64",
        conversions: "172",
        schedRate: "43,80%"
      },
      "Instagram": {
        semanal: [28, 42, 55, 68, 85, 60, 48],
        views: "165.200",
        groups: "7.950",
        groupsChange: "▲ 2",
        invested: "R$ 7.200,00",
        leads: "42",
        conversions: "118",
        schedRate: "38,10%"
      }
    },
    funil: {
      impressoes: "414.792", impressoesChange: "▲ 4,3%", impressoesChangeType: "up",
      cliques: "28.875", cliquesChange: "▼ -2,1%", cliquesChangeType: "down",
      leads: "87", leadsChange: "▼ -8,7%", leadsChangeType: "down",
      agendamentos: "46", agendamentosChange: "▲ 6,1%", agendamentosChangeType: "up",
      vendas: "42", vendasChange: "▲ 8,0%", vendasChangeType: "up",
      txCtr: "6,96%", txCtrChange: "▲ 1,1%", txCtrChangeType: "up",
      txLeads: "0,30%", txLeadsChange: "▲ 0,7%", txLeadsChangeType: "up",
      txAgendamentos: "52,87%", txAgendamentosChange: "▲ 2,2%", txAgendamentosChangeType: "up",
      txVendas: "91,30%", txVendasChange: "▼ -4,1%", txVendasChangeType: "down"
    },
    cidades: [
      { nome: "Passos", beneficiarios: "8.125", crescimento: "+ 12,4%" },
      { nome: "Itaú de Minas", beneficiarios: "6.732", crescimento: "+ 9,8%" },
      { nome: "São Seb. Paraíso", beneficiarios: "5.921", crescimento: "+ 14,2%" },
      { nome: "Cássia", beneficiarios: "4.812", crescimento: "+ 7,1%" },
      { nome: "Alpinópolis", beneficiarios: "4.256", crescimento: "+ 18,7%" }
    ]
  },
  junho: {
    timestamp: "05/06/2026 10:15",
    beneficiarios: {
      total: "10.320",
      percentText: "2,8%",
      percentType: "up",
      ativos: "10.320",
      novos: "55",
      cancelados: "24",
      pfPercent: 5,
      pfVal: "516",
      pjPercent: 95,
      pjVal: "9.804"
    },
    leads: {
      total: "160",
      percentText: "21,0%",
      percentType: "up",
      origem: { google: "68%", meta: "18%", indicacao: "9%", outros: "5%" },
      origemInt: { google: 68, meta: 18, indicacao: 9, outros: 5 }
    },
    conversoes: {
      taxa: "13,1%",
      percentText: "2,5 p.p.",
      percentType: "up",
      vendas: "21",
      leads: "160",
      meta: "12%"
    },
    investimento: {
      total: "R$ 14,0 mil",
      percentText: "8,0%",
      percentType: "up",
      atual: "R$ 12.800,00",
      orcamento: "R$ 14.000,00",
      progressoPercent: "91,4%"
    },
    roi: { total: "4,5x", diff: "+0,3x", diffType: "up", cac: "R$ 272,00", ltv: "R$ 1.220,00", fator: "4,5x", progress: 90 },
    nps: { total: "80", diff: "+2 pts", diffType: "up", status: "Excelência", statusColor: "text-green-500", respostas: "385", proDet: "3% / 83%", progress: 83 },
    investimentosTabela: [
      { categoria: "Ads", metric: "Meta anúncios do Facebook/Instagram", valor: "R$ 3.200,00", valorInt: 3200 },
      { categoria: "Ads", metric: "Anúncios do Google", valor: "R$ 4.200,00", valorInt: 4200 },
      { categoria: "Marketing", metric: "RD Conversas", valor: "R$ 1.300,00", valorInt: 1300 },
      { categoria: "Marketing", metric: "Marketing de P&D", valor: "R$ 1.100,00", valorInt: 1100 },
      { categoria: "Marketing", metric: "RD CRM", valor: "R$ 1.000,00", valorInt: 1000 },
      { categoria: "Offline", metric: "Rádio Passos / Rádio Vida", valor: "R$ 613,32", valorInt: 613.32 },
      { categoria: "Marketing", metric: "Outros custos e ferramentas", valor: "R$ 1.386,68", valorInt: 1386.68 }
    ],
    anuncios: {
      "Google Ads": {
        semanal: [15, 78, 92, 85, 96, 68, 62],
        views: "345.800",
        groups: "21.400",
        groupsChange: "▲ 4",
        invested: "R$ 19.450,00",
        leads: "68",
        conversions: "282",
        schedRate: "42,50%"
      },
      "Meta ADS": {
        semanal: [48, 60, 75, 82, 88, 65, 52],
        views: "235.000",
        groups: "12.800",
        groupsChange: "▲ 6",
        invested: "R$ 11.200,00",
        leads: "76",
        conversions: "198",
        schedRate: "45,20%"
      },
      "Instagram": {
        semanal: [35, 50, 68, 79, 98, 72, 58],
        views: "185.000",
        groups: "8.900",
        groupsChange: "▲ 3",
        invested: "R$ 8.500,00",
        leads: "50",
        conversions: "135",
        schedRate: "40,30%"
      }
    },
    funil: {
      impressoes: "438.500", impressoesChange: "▲ 5,7%", impressoesChangeType: "up",
      cliques: "31.200", cliquesChange: "▲ 8,0%", cliquesChangeType: "up",
      leads: "96", leadsChange: "▲ 10,3%", leadsChangeType: "up",
      agendamentos: "52", agendamentosChange: "▲ 13,0%", agendamentosChangeType: "up",
      vendas: "48", vendasChange: "▲ 14,2%", vendasChangeType: "up",
      txCtr: "7,11%", txCtrChange: "▲ 1,5%", txCtrChangeType: "up",
      txLeads: "0,31%", txLeadsChange: "▲ 0,3%", txLeadsChangeType: "up",
      txAgendamentos: "54,17%", txAgendamentosChange: "▲ 2,4%", txAgendamentosChangeType: "up",
      txVendas: "92,31%", txVendasChange: "▲ 1,1%", txVendasChangeType: "up"
    },
    cidades: [
      { nome: "Passos", beneficiarios: "8.310", crescimento: "+ 14,1%" },
      { nome: "Itaú de Minas", beneficiarios: "6.850", crescimento: "+ 11,2%" },
      { nome: "São Seb. Paraíso", beneficiarios: "6.110", crescimento: "+ 15,8%" },
      { nome: "Cássia", beneficiarios: "4.930", crescimento: "+ 8,2%" },
      { nome: "Alpinópolis", beneficiarios: "4.420", crescimento: "+ 20,1%" }
    ]
  }
};
