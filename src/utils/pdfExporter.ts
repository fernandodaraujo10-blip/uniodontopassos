import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConsolidatedReport } from '../types/reports';
import { ReportFilter } from '../types/reports';

const formatMoeda = (valor: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

const formatNum = (valor: number) =>
  new Intl.NumberFormat('pt-BR').format(valor);

const formatPct = (valor: number) =>
  `${valor.toFixed(1).replace('.', ',')}%`;

// Cor primária da Uniodonto Passos
const BRAND_PINK: [number, number, number] = [216, 27, 96]; // #D81B60
const BRAND_DARK: [number, number, number] = [136, 14, 79]; // #880E4F
const GRAY_HEADER: [number, number, number] = [248, 249, 250];
const GRAY_TEXT: [number, number, number] = [55, 65, 81];
const GRAY_LIGHT: [number, number, number] = [156, 163, 175];

export const exportarPDF = (
  report: ConsolidatedReport,
  filter: ReportFilter,
  showChannelDetails: boolean
): void => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // ─── CABEÇALHO TIMBRADO ──────────────────────────────────────────────
  // Faixa rosa de topo
  doc.setFillColor(...BRAND_PINK);
  doc.rect(0, 0, pageWidth, 18, 'F');

  // Logo circular com letra "U"
  doc.setFillColor(...BRAND_DARK);
  doc.circle(margin + 5, 9, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('U', margin + 5, 9 + 3, { align: 'center' });

  // Nome da empresa
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Uniodonto Passos', margin + 13, 8);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 200, 220);
  doc.text('RELATÓRIO EXECUTIVO DE CAPTAÇÃO', margin + 13, 13.5);

  // Data e período (lado direito)
  const now = new Date();
  const dataHora = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}`;
  const periodo = `Período: ${filter.startMonth} a ${filter.endMonth}`;

  doc.setFontSize(7);
  doc.setTextColor(255, 230, 240);
  doc.text(dataHora, pageWidth - margin, 7, { align: 'right' });
  doc.text(periodo, pageWidth - margin, 12, { align: 'right' });

  const topY = 26;

  // ─── CARDS DE KPIs ───────────────────────────────────────────────────
  const kpis = [
    { label: 'Novos Beneficiários', value: formatNum(report.totals.totalNewBeneficiaries) },
    { label: 'Total Investido', value: formatMoeda(report.totals.totalSpend) },
    { label: 'CAC Médio', value: formatMoeda(report.totals.averageCac) },
    { label: 'Taxa de Conversão', value: formatPct(report.totals.averageConversionRate) },
  ];

  const cardW = (pageWidth - margin * 2 - 9) / 4;
  const cardH = 18;
  const cardGap = 3;

  kpis.forEach((kpi, i) => {
    const x = margin + i * (cardW + cardGap);
    const y = topY;

    // Fundo do card
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, cardW, cardH, 2, 2, 'F');

    // Borda superior colorida
    doc.setFillColor(...BRAND_PINK);
    doc.rect(x, y, cardW, 1.5, 'F');

    // Label
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GRAY_LIGHT);
    doc.text(kpi.label.toUpperCase(), x + 4, y + 7);

    // Valor
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GRAY_TEXT);
    doc.text(kpi.value, x + 4, y + 15);
  });

  const tableStartY = topY + cardH + 6;

  // ─── TÍTULO DA TABELA ─────────────────────────────────────────────────
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND_DARK);
  doc.text('Detalhamento Mensal Consolidado', margin, tableStartY - 2);

  // ─── TABELA DE DADOS ─────────────────────────────────────────────────
  const baseHead = [
    'Mês',
    'Novos Benef.',
    'Leads',
    'Conversões',
    'Tx. Conv.',
    'Total Investido',
    'CAC',
    'Churn',
  ];

  const channelHead = showChannelDetails
    ? ['Google Ads', 'Meta Ads', 'Offline']
    : [];

  // Insere colunas de canal entre Tx. Conv. e Total Investido
  const fullHead = showChannelDetails
    ? [
        'Mês',
        'Novos Benef.',
        'Leads',
        'Conversões',
        'Tx. Conv.',
        'Google Ads',
        'Meta Ads',
        'Offline',
        'Total Investido',
        'CAC',
        'Churn',
      ]
    : baseHead;

  const bodyRows = report.rows.map((row) => {
    const base = [
      row.monthLabel,
      formatNum(row.newBeneficiaries),
      formatNum(row.leads),
      formatNum(row.conversions),
      formatPct(row.conversionRate),
    ];
    const channels = showChannelDetails
      ? [
          formatMoeda(row.googleAdsSpend),
          formatMoeda(row.metaAdsSpend),
          formatMoeda(row.offlineSpend),
        ]
      : [];
    const tail = [
      formatMoeda(row.totalSpend),
      formatMoeda(row.cac),
      row.churnRate > 0 ? formatPct(row.churnRate) : '—',
    ];
    return [...base, ...channels, ...tail];
  });

  // Linha de totais
  const totalsBase = [
    'Total / Média',
    formatNum(report.totals.totalNewBeneficiaries),
    formatNum(report.totals.totalLeads),
    formatNum(report.totals.totalConversions),
    formatPct(report.totals.averageConversionRate),
  ];
  const totalsChannels = showChannelDetails
    ? [
        formatMoeda(report.totals.totalGoogleAdsSpend),
        formatMoeda(report.totals.totalMetaAdsSpend),
        formatMoeda(report.totals.totalOfflineSpend),
      ]
    : [];
  const totalsTail = [
    formatMoeda(report.totals.totalSpend),
    formatMoeda(report.totals.averageCac),
    report.totals.averageChurnRate > 0 ? formatPct(report.totals.averageChurnRate) : '—',
  ];
  const totalsRow = [...totalsBase, ...totalsChannels, ...totalsTail];

  autoTable(doc, {
    startY: tableStartY + 2,
    head: [fullHead],
    body: [...bodyRows, totalsRow],
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 7.5,
      cellPadding: 3,
      font: 'helvetica',
      textColor: [...GRAY_TEXT] as [number, number, number],
      lineColor: [229, 231, 235],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [...BRAND_PINK] as [number, number, number],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7,
      halign: 'center',
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'left' },
    },
    alternateRowStyles: {
      fillColor: [250, 250, 252],
    },
    // Destaca a linha de totais (última)
    didParseCell: (data) => {
      if (data.row.index === bodyRows.length) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [255, 240, 246];
        data.cell.styles.textColor = [...BRAND_DARK] as [number, number, number];
      }
    },
  });

  // ─── RODAPÉ ──────────────────────────────────────────────────────────
  const footerY = pageHeight - 8;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY_LIGHT);
  doc.text('Uniodonto Passos Ltda. • Departamento Comercial', margin, footerY);
  doc.text('Página 1 de 1', pageWidth - margin, footerY, { align: 'right' });

  // ─── DOWNLOAD DIRETO ─────────────────────────────────────────────────
  const filename = `Relatorio_Uniodonto_${filter.startMonth}_a_${filter.endMonth}.pdf`;
  doc.save(filename);
};
