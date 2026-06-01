"""
Gerador de documentação oficial - Dashboard Uniodonto Passos
Gera PDF com documentação técnica e funcional completa do sistema.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate
from reportlab.pdfgen import canvas
from datetime import datetime

OUTPUT_PATH = r"C:\Users\Public\APPs\00-Rascunhos\Dashboard\01.2-App-Dashboard\docs\documentacao-oficial.pdf"

# Paleta de cores
BRAND_PINK   = colors.HexColor("#D81B60")
BRAND_DARK   = colors.HexColor("#2D0A1B")
BRAND_LIGHT  = colors.HexColor("#FCE4EC")
GRAY_DARK    = colors.HexColor("#374151")
GRAY_MID     = colors.HexColor("#6B7280")
GRAY_LIGHT   = colors.HexColor("#F3F4F6")
WHITE        = colors.white
TABLE_HEADER = colors.HexColor("#880E4F")
TABLE_ALT    = colors.HexColor("#FDF2F8")
BLUE_INFO    = colors.HexColor("#1D4ED8")

PAGE_W, PAGE_H = A4


# ─────────────────────────────────────────────
# Numeração de página + cabeçalho/rodapé
# ─────────────────────────────────────────────
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self._draw_page(total)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def _draw_page(self, total):
        page = self._pageNumber
        w, h = A4

        # Rodapé
        self.setStrokeColor(BRAND_PINK)
        self.setLineWidth(0.5)
        self.line(2*cm, 1.6*cm, w - 2*cm, 1.6*cm)

        self.setFont("Helvetica", 7)
        self.setFillColor(GRAY_MID)
        self.drawString(2*cm, 1.1*cm, "Dashboard Uniodonto Passos — Documentação Oficial")
        self.drawRightString(w - 2*cm, 1.1*cm, f"Página {page} de {total}")

        # Cabeçalho (exceto capa)
        if page > 1:
            self.setStrokeColor(BRAND_LIGHT)
            self.setLineWidth(0.5)
            self.line(2*cm, h - 1.8*cm, w - 2*cm, h - 1.8*cm)
            self.setFont("Helvetica", 7)
            self.setFillColor(GRAY_MID)
            self.drawString(2*cm, h - 1.5*cm, "Uniodonto Passos · Sistema de Dashboard")
            self.drawRightString(w - 2*cm, h - 1.5*cm, "Versão 1.2 · Jun/2026")


# ─────────────────────────────────────────────
# Estilos tipográficos
# ─────────────────────────────────────────────
def build_styles():
    base = getSampleStyleSheet()

    styles = {
        "cover_title": ParagraphStyle(
            "cover_title",
            fontName="Helvetica-Bold",
            fontSize=30,
            leading=36,
            textColor=WHITE,
            alignment=TA_CENTER,
        ),
        "cover_sub": ParagraphStyle(
            "cover_sub",
            fontName="Helvetica",
            fontSize=13,
            leading=18,
            textColor=BRAND_LIGHT,
            alignment=TA_CENTER,
        ),
        "cover_meta": ParagraphStyle(
            "cover_meta",
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=BRAND_LIGHT,
            alignment=TA_CENTER,
        ),
        "toc_title": ParagraphStyle(
            "toc_title",
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=22,
            textColor=BRAND_DARK,
            spaceAfter=8,
        ),
        "toc_item": ParagraphStyle(
            "toc_item",
            fontName="Helvetica",
            fontSize=10,
            leading=16,
            textColor=GRAY_DARK,
            leftIndent=0,
        ),
        "toc_sub": ParagraphStyle(
            "toc_sub",
            fontName="Helvetica",
            fontSize=9,
            leading=14,
            textColor=GRAY_MID,
            leftIndent=14,
        ),
        "h1": ParagraphStyle(
            "h1",
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=22,
            textColor=BRAND_PINK,
            spaceBefore=18,
            spaceAfter=6,
        ),
        "h2": ParagraphStyle(
            "h2",
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=17,
            textColor=BRAND_DARK,
            spaceBefore=12,
            spaceAfter=4,
        ),
        "h3": ParagraphStyle(
            "h3",
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=15,
            textColor=GRAY_DARK,
            spaceBefore=8,
            spaceAfter=2,
        ),
        "body": ParagraphStyle(
            "body",
            fontName="Helvetica",
            fontSize=9.5,
            leading=14,
            textColor=GRAY_DARK,
            alignment=TA_JUSTIFY,
            spaceAfter=5,
        ),
        "body_bold": ParagraphStyle(
            "body_bold",
            fontName="Helvetica-Bold",
            fontSize=9.5,
            leading=14,
            textColor=GRAY_DARK,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            fontName="Helvetica",
            fontSize=9.5,
            leading=14,
            textColor=GRAY_DARK,
            leftIndent=14,
            bulletIndent=0,
            spaceAfter=3,
        ),
        "code": ParagraphStyle(
            "code",
            fontName="Courier",
            fontSize=8,
            leading=12,
            textColor=BRAND_DARK,
            backColor=GRAY_LIGHT,
            leftIndent=10,
            rightIndent=10,
            spaceBefore=4,
            spaceAfter=4,
        ),
        "caption": ParagraphStyle(
            "caption",
            fontName="Helvetica-Oblique",
            fontSize=8,
            leading=11,
            textColor=GRAY_MID,
            alignment=TA_CENTER,
            spaceAfter=8,
        ),
        "badge_pink": ParagraphStyle(
            "badge_pink",
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=11,
            textColor=WHITE,
            backColor=BRAND_PINK,
            leftIndent=4,
            rightIndent=4,
        ),
    }
    return styles


S = build_styles()


# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────
def hr():
    return HRFlowable(width="100%", thickness=0.5, color=BRAND_LIGHT, spaceAfter=6, spaceBefore=6)


def section_header(title, number=None):
    label = f"{number}. {title}" if number else title
    return Paragraph(label, S["h1"])


def sub_header(title):
    return Paragraph(title, S["h2"])


def sub2(title):
    return Paragraph(title, S["h3"])


def body(text):
    return Paragraph(text, S["body"])


def bullet(text):
    return Paragraph(f"• {text}", S["bullet"])


def bold(text):
    return Paragraph(f"<b>{text}</b>", S["body"])


def sp(h=6):
    return Spacer(1, h)


def table_base(data, col_widths, header_rows=1):
    t = Table(data, colWidths=col_widths)
    style = [
        # Header
        ("BACKGROUND", (0, 0), (-1, header_rows - 1), TABLE_HEADER),
        ("TEXTCOLOR",  (0, 0), (-1, header_rows - 1), WHITE),
        ("FONTNAME",   (0, 0), (-1, header_rows - 1), "Helvetica-Bold"),
        ("FONTSIZE",   (0, 0), (-1, header_rows - 1), 8.5),
        ("ALIGN",      (0, 0), (-1, header_rows - 1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, header_rows - 1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, header_rows - 1), 5),
        # Body
        ("FONTNAME",   (0, header_rows), (-1, -1), "Helvetica"),
        ("FONTSIZE",   (0, header_rows), (-1, -1), 8.5),
        ("TOPPADDING", (0, header_rows), (-1, -1), 4),
        ("BOTTOMPADDING", (0, header_rows), (-1, -1), 4),
        ("ALIGN",      (0, header_rows), (-1, -1), "LEFT"),
        # Grid
        ("GRID",       (0, 0), (-1, -1), 0.4, colors.HexColor("#E5E7EB")),
        ("ROWBACKGROUNDS", (0, header_rows), (-1, -1), [WHITE, TABLE_ALT]),
        ("LEFTPADDING",  (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ]
    t.setStyle(TableStyle(style))
    return t


# ─────────────────────────────────────────────
# CAPA
# ─────────────────────────────────────────────
def build_cover():
    story = []

    # Bloco colorido de capa via canvas via Frame — usamos tabela colorida
    cover_data = [[
        Paragraph(
            "<br/><br/><br/>"
            "<b>UNIODONTO PASSOS</b><br/>"
            "<font size=11>Sistema de Dashboard de Gestão</font><br/><br/>"
            "<font size=26><b>Documentação Oficial</b></font><br/><br/>"
            "<font size=11>Versão 1.2 — Junho 2026</font><br/><br/><br/>"
            "<font size=9>Confidencial · Uso Interno</font><br/><br/><br/>",
            ParagraphStyle(
                "ct",
                fontName="Helvetica-Bold",
                fontSize=28,
                leading=36,
                textColor=WHITE,
                alignment=TA_CENTER,
            )
        )
    ]]
    cover_table = Table(cover_data, colWidths=[17*cm], rowHeights=[11*cm])
    cover_table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), BRAND_DARK),
        ("ALIGN", (0,0), (-1,-1), "CENTER"),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
    ]))
    story.append(cover_table)
    story.append(sp(20))

    # Info block
    info_data = [
        ["Produto", "Dashboard de KPIs, Relatórios e Gestão"],
        ["Cliente", "Uniodonto Passos — Cooperativa Odontológica"],
        ["Versão do Sistema", "1.2"],
        ["Stack Principal", "React 19 · TypeScript · Vite · Tailwind CSS v4"],
        ["Plataformas", "Web (Firebase Hosting) · Android (Capacitor)"],
        ["Data do Documento", datetime.now().strftime("%d/%m/%Y")],
        ["Autor", "FerTaise Tech"],
        ["Classificação", "Confidencial — Uso Interno"],
    ]
    t = Table(info_data, colWidths=[5*cm, 12*cm])
    t.setStyle(TableStyle([
        ("FONTNAME",  (0,0), (0,-1), "Helvetica-Bold"),
        ("FONTNAME",  (1,0), (1,-1), "Helvetica"),
        ("FONTSIZE",  (0,0), (-1,-1), 9),
        ("TOPPADDING",(0,0), (-1,-1), 5),
        ("BOTTOMPADDING",(0,0), (-1,-1), 5),
        ("LEFTPADDING",(0,0), (-1,-1), 8),
        ("TEXTCOLOR", (0,0), (0,-1), BRAND_PINK),
        ("TEXTCOLOR", (1,0), (1,-1), GRAY_DARK),
        ("ROWBACKGROUNDS",(0,0),(-1,-1), [WHITE, GRAY_LIGHT]),
        ("GRID",(0,0),(-1,-1), 0.4, colors.HexColor("#E5E7EB")),
    ]))
    story.append(t)
    story.append(PageBreak())
    return story


# ─────────────────────────────────────────────
# SUMÁRIO
# ─────────────────────────────────────────────
def build_toc():
    story = []
    story.append(Paragraph("Sumário", S["toc_title"]))
    story.append(hr())
    story.append(sp(4))

    items = [
        ("1.", "Visão Geral do Produto", None),
        ("2.", "Arquitetura Técnica", [
            "2.1 Stack e Dependências",
            "2.2 Estrutura de Pastas",
            "2.3 Fluxo de Dados",
        ]),
        ("3.", "Páginas e Funcionalidades", [
            "3.1 Dashboard Principal",
            "3.2 Relatórios",
            "3.3 Envio de Dados",
            "3.4 Configurações",
            "3.5 Login / Autenticação",
        ]),
        ("4.", "Componentes de Interface", [
            "4.1 Layout e Navegação",
            "4.2 KPI Cards",
            "4.3 Gráficos",
            "4.4 Tabelas",
            "4.5 Mobile",
        ]),
        ("5.", "Gerenciamento de Estado", None),
        ("6.", "Utilitários e Serviços", [
            "6.1 Adaptador de Dados",
            "6.2 Cálculos e Métricas",
            "6.3 Exportação PDF e CSV",
            "6.4 Parser de Planilhas",
            "6.5 Pipeline de APIs",
        ]),
        ("7.", "Dados Mock e Tipos TypeScript", None),
        ("8.", "Testes", None),
        ("9.", "Deploy e Infraestrutura", None),
        ("10.", "Design System", None),
        ("11.", "Usuários e Segurança", None),
        ("12.", "Roadmap e Pendências", None),
    ]

    for num, title, subs in items:
        story.append(Paragraph(f"<b>{num}</b>   {title}", S["toc_item"]))
        if subs:
            for s in subs:
                story.append(Paragraph(f"      {s}", S["toc_sub"]))
        story.append(sp(2))

    story.append(PageBreak())
    return story


# ─────────────────────────────────────────────
# 1. VISÃO GERAL
# ─────────────────────────────────────────────
def sec_overview():
    story = []
    story.append(section_header("Visão Geral do Produto", 1))
    story.append(hr())

    story.append(body(
        "O <b>Dashboard Uniodonto Passos</b> é uma aplicação web/mobile SPA (Single Page Application) "
        "desenvolvida para centralizar a gestão operacional e estratégica da cooperativa odontológica "
        "Uniodonto Passos. O sistema consolida KPIs de beneficiários, desempenho de campanhas de marketing "
        "digital, análise de investimentos e geração de relatórios gerenciais em PDF."
    ))
    story.append(sp(4))

    story.append(sub_header("Objetivos"))
    bullets = [
        "Substituir planilhas dispersas por um painel centralizado e responsivo.",
        "Oferecer visibilidade em tempo real dos indicadores de saúde da cooperativa.",
        "Automatizar a geração de relatórios executivos para a diretoria.",
        "Permitir upload de dados via planilhas Excel e sincronismo com APIs de anúncios.",
        "Suportar acesso mobile nativo via Android (Capacitor).",
    ]
    for b in bullets:
        story.append(bullet(b))
    story.append(sp(8))

    story.append(sub_header("Público-Alvo"))
    data = [
        ["Perfil", "Descrição", "Acesso Principal"],
        ["Diretores", "Dr. Elcio, Dr. Luiz Fernando, Dr. Mateus José", "Dashboard, Relatórios"],
        ["Gerência", "Janaína Pádua", "Dashboard, Envio de Dados, Relatórios"],
        ["Administrativo TI", "FerTaise Tech Admin", "Todas as áreas + Configurações"],
    ]
    story.append(table_base(data, [4*cm, 8*cm, 5*cm]))
    story.append(sp(8))

    story.append(sub_header("Principais Funcionalidades"))
    feats = [
        ("Dashboard KPIs", "6 cartões dinâmicos: Beneficiários, Leads, Conversões, Investimento, ROI e NPS"),
        ("Filtros de Período", "Navegação mensal com histórico de 6 meses (Jan–Jun 2026)"),
        ("Gráficos Interativos", "Desempenho de anúncios (Chart.js) e funil de conversão geométrico"),
        ("Tabela de Investimentos", "14 categorias, filtros por tipo, totalizações dinâmicas"),
        ("Relatórios PDF", "5 tipos de relatório com análise estratégica (jsPDF + autoTable)"),
        ("Upload Excel", "Parser SheetJS com validação estrita e mapeamento multicolunas"),
        ("Sincronismo APIs", "Pipeline simulado de Google Ads e Meta ADS"),
        ("Gerenciamento de Usuários", "CRUD completo em Settings com autenticação local"),
        ("Tema Dark/Light", "Persistido em localStorage"),
        ("Mobile Nativo", "Capacitor Android com bottom navigation e layout responsivo"),
    ]
    fdata = [["Funcionalidade", "Descrição"]] + [[f, d] for f, d in feats]
    story.append(table_base(fdata, [5.5*cm, 11.5*cm]))
    story.append(PageBreak())
    return story


# ─────────────────────────────────────────────
# 2. ARQUITETURA TÉCNICA
# ─────────────────────────────────────────────
def sec_architecture():
    story = []
    story.append(section_header("Arquitetura Técnica", 2))
    story.append(hr())

    # 2.1 Stack
    story.append(sub_header("2.1 Stack e Dependências"))
    story.append(body(
        "O projeto adota uma stack moderna de front-end, sem backend próprio. "
        "A persistência é feita via <b>localStorage</b> e o deploy via <b>Firebase Hosting</b>."
    ))
    story.append(sp(4))

    deps = [
        ["Camada", "Biblioteca / Ferramenta", "Versão", "Finalidade"],
        ["UI Framework", "React", "19.2.6", "Componentes, hooks, contexto"],
        ["Linguagem", "TypeScript", "6.0.3", "Tipagem estática e segurança"],
        ["Build Tool", "Vite", "8.0.14", "Bundling rápido, dev server porta 3080"],
        ["Estilização", "Tailwind CSS", "4.3.0", "Utility-first, dark mode, breakpoints"],
        ["Gráficos", "Chart.js + react-chartjs-2", "4.5.1 / 5.3.1", "Barras, linhas, funil"],
        ["PDF", "jsPDF + jspdf-autotable", "4.2.1 / 5.0.8", "Geração de relatórios"],
        ["Excel", "XLSX (SheetJS)", "0.18.5", "Parser de planilhas"],
        ["Ícones", "Lucide React", "1.17.0", "SVG icons"],
        ["Mobile", "Capacitor", "8.3.4", "Wrapper Android nativo"],
        ["Testes", "Vitest + Testing Library", "4.1.7 / 16.3.2", "Unit/integration tests"],
        ["Hospedagem", "Firebase Hosting", "—", "CDN global, SPA rewrite rules"],
    ]
    story.append(table_base(deps, [3.5*cm, 4.5*cm, 2.5*cm, 6.5*cm]))
    story.append(sp(10))

    # 2.2 Estrutura
    story.append(sub_header("2.2 Estrutura de Pastas"))
    dirs = [
        ["Pasta / Arquivo", "Descrição"],
        ["src/App.tsx", "Raiz da aplicação — routing via useState, tema, usuário logado"],
        ["src/main.tsx", "Entry point React — monta <App> no DOM"],
        ["src/pages/", "5 páginas: Dashboard, Reports, DataUpload, Login, Settings"],
        ["src/components/layout/", "Sidebar, Header, MobileBottomNav"],
        ["src/components/cards/", "6 KPI cards + KPICardGrid (carrossel)"],
        ["src/components/charts/", "AdPerformanceChart, ConversionFunnelTabs, TrendCharts"],
        ["src/components/tables/", "InvestmentTable (desktop), MobileInvestmentList"],
        ["src/components/mobile/", "7 componentes exclusivos mobile"],
        ["src/context/DashboardContext.tsx", "Estado global via Context API"],
        ["src/hooks/useDashboard.ts", "Hook com exportação CSV"],
        ["src/utils/", "8 utilitários: adapter, calculations, formatters, validator, parser, pdfExporter, adApiPipeline, routes"],
        ["src/data/", "mockDashboardData, mockInvestments, mockReports"],
        ["src/types/", "Interfaces TypeScript: dashboard, reports, investments"],
        ["src/test/", "7 arquivos de teste"],
        ["android/", "Projeto Capacitor Android gerado"],
        ["dist/", "Build otimizado (saída Vite) para deploy"],
        ["firebase.json / .firebaserc", "Config Firebase Hosting (projeto: uni0dontopassos)"],
        ["capacitor.config.ts", "Config Capacitor (App ID: com.dashboard.app)"],
        ["vite.config.ts", "Dev port 3080, alias @→src, vitest jsdom"],
        ["tailwind.config.js", "Cores brand, dark mode, breakpoints customizados"],
    ]
    story.append(table_base(dirs, [6*cm, 11*cm]))
    story.append(sp(10))

    # 2.3 Fluxo
    story.append(sub_header("2.3 Fluxo de Dados"))
    story.append(body(
        "O sistema segue um fluxo unidirecional: dados mock (ou uploaded) são armazenados no "
        "DashboardContext, adaptados para o formato legado dos componentes via dashboardAdapter, "
        "e renderizados nos componentes de UI. Interações do usuário atualizam o contexto via setState, "
        "que persiste no localStorage automaticamente."
    ))
    story.append(sp(4))

    flow = [
        ["Etapa", "Módulo", "Ação"],
        ["1 - Origem", "mockDashboardData.ts / upload", "Dados de 6 meses ou planilha Excel carregada"],
        ["2 - Contexto", "DashboardContext.tsx", "Armazena allDashboardData + investmentsData no state"],
        ["3 - Seleção", "MonthNavigator", "Usuário seleciona mês → currentMonthData atualizado"],
        ["4 - Adaptação", "dashboardAdapter.ts", "adaptModernToLegacy() converte payload para formato UI"],
        ["5 - Cálculos", "dashboardCalculations.ts", "CAC, LTV, Churn, taxa de conversão calculados"],
        ["6 - Render", "Componentes (cards, charts, tables)", "Recebem dados adaptados e renderizam"],
        ["7 - Persistência", "localStorage", "Estado salvo com versão v1.5 para cache automático"],
        ["8 - Export", "pdfExporter.ts / useDashboard.ts", "PDF ou CSV gerado e baixado pelo usuário"],
    ]
    story.append(table_base(flow, [3*cm, 4.5*cm, 9.5*cm]))
    story.append(PageBreak())
    return story


# ─────────────────────────────────────────────
# 3. PÁGINAS
# ─────────────────────────────────────────────
def sec_pages():
    story = []
    story.append(section_header("Páginas e Funcionalidades", 3))
    story.append(hr())

    # 3.1
    story.append(sub_header("3.1 Dashboard Principal"))
    story.append(body(
        "Página central do sistema, acessível após login. Exibe o painel completo de KPIs, "
        "gráficos de desempenho e tabela de investimentos. Layout totalmente responsivo com "
        "3 modos de exibição: desktop (12 colunas), tablet e mobile."
    ))
    story.append(sp(3))
    data = [
        ["Área", "Componentes"],
        ["KPIs (filtro Geral)", "BeneficiariosCard, LeadsCard, ConversoesCard, InvestimentoCard, RoiCard, NpsCard"],
        ["KPIs (filtro Marketing)", "Cards reorganizados para foco em Leads, Conversões e ROI de campanhas"],
        ["KPIs (filtro Análise)", "Cards com métricas de crescimento, churn e LTV"],
        ["Gráfico de Anúncios", "AdPerformanceChart — barras semanais por plataforma (Google/Meta/Instagram)"],
        ["Funil de Conversão", "ConversionFunnelTabs — 3 abas: Funil, Origens, Cidades"],
        ["Investimentos Desktop", "InvestmentTable — 5 filtros de categoria, totalizações"],
        ["Investimentos Mobile", "MobileInvestmentList — cards verticais com mesmos filtros"],
    ]
    story.append(table_base(data, [5*cm, 12*cm]))
    story.append(sp(8))

    # 3.2
    story.append(sub_header("3.2 Relatórios"))
    story.append(body(
        "Página de geração de relatórios consolidados com filtros de período e tipo. "
        "Suporta 5 tipos de relatório, exportação em PDF e CSV."
    ))
    story.append(sp(3))
    rdata = [
        ["Tipo de Relatório", "Conteúdo"],
        ["Executivo", "Resumo completo para diretoria — KPIs, tendências, análise estratégica CEO"],
        ["Comercial", "Foco em vendas — conversões, CAC, CPL, pipeline de leads por canal"],
        ["Churn / Retenção", "Análise de cancelamentos, taxa de churn, identificação de padrões"],
        ["Financeiro", "Investimentos por categoria, ROI, LTV, break-even"],
        ["Satisfação NPS", "Score NPS, promotores, detratores, comparativo histórico"],
    ]
    story.append(table_base(rdata, [4.5*cm, 12.5*cm]))
    story.append(sp(8))

    # 3.3
    story.append(sub_header("3.3 Envio de Dados"))
    story.append(body(
        "Centraliza todas as formas de atualização de dados. Possui 4 sub-abas de navegação."
    ))
    story.append(sp(3))
    for item in [
        ("Resumo (envio)", "Visão geral das fontes de dados e status de sincronismo."),
        ("Envio Manual", "Formulário para digitação direta de KPIs mensais."),
        ("Planilhas", "Upload de arquivo Excel (.xlsx) com validação estrita e mapeamento automático de colunas."),
        ("Conexões", "Pipeline simulado de sincronismo com Google Ads API e Meta ADS API, com logs de progresso."),
    ]:
        story.append(bold(f"{item[0]}:"))
        story.append(body(item[1]))
    story.append(sp(8))

    # 3.4
    story.append(sub_header("3.4 Configurações"))
    story.append(body(
        "Painel administrativo completo para gestão de usuários e preferências do sistema."
    ))
    story.append(sp(3))
    for b in [
        "CRUD de usuários: criar, editar, excluir, redefinir senha.",
        "Alternância de tema (dark/light) persistido em localStorage.",
        "Gerenciamento de sessão e informações de conta.",
        "Configurações de segurança (redefinição de senha).",
    ]:
        story.append(bullet(b))
    story.append(sp(8))

    # 3.5
    story.append(sub_header("3.5 Login / Autenticação"))
    story.append(body(
        "Autenticação local sem backend. Credenciais armazenadas em localStorage "
        "(<b>uniodonto_settings_users</b>). Sem sessão persistente entre abas — "
        "ao recarregar, usuário precisa autenticar novamente."
    ))
    story.append(sp(3))
    udata = [
        ["Nome", "Email", "Role", "Senha Padrão"],
        ["FerTaise Tech Admin", "fertaisetech@gmail.com", "Tech FerTaise", "1234"],
        ["Dr. Elcio Beraldo", "elcio@uniodonto.com", "Diretor", "1234"],
        ["Dr. Luiz Fernando", "luiz@uniodonto.com", "Diretor", "1234"],
        ["Dr. Mateus José", "mateus@uniodonto.com", "Diretor", "1234"],
        ["Janaína Pádua", "gerente@uniodonto.com", "Gerente", "1234"],
    ]
    story.append(table_base(udata, [4.5*cm, 5.5*cm, 3*cm, 4*cm]))
    story.append(PageBreak())
    return story


# ─────────────────────────────────────────────
# 4. COMPONENTES
# ─────────────────────────────────────────────
def sec_components():
    story = []
    story.append(section_header("Componentes de Interface", 4))
    story.append(hr())

    story.append(sub_header("4.1 Layout e Navegação"))
    cdata = [
        ["Componente", "Arquivo", "Descrição"],
        ["Sidebar", "components/layout/Sidebar.tsx", "Menu lateral colapsável. Estado persistido em localStorage. Modal de ajuda com focus trap. Acordeão para sub-menu 'Envio de Dados'."],
        ["Header", "components/layout/Header.tsx", "Título dinâmico conforme filtro ativo. FilterTabs (Geral/Marketing/Análise). MonthNavigator."],
        ["MobileBottomNav", "components/layout/MobileBottomNav.tsx", "Bottom navigation com 4 ícones. Visível apenas em mobile (<md). Área tátil mínima 44px."],
        ["MonthNavigator", "components/navigation/MonthNavigator.tsx", "Seletor de período mensal com botões prev/next e label 'Maio/2026'."],
        ["FilterTabs", "components/filters/FilterTabs.tsx", "3 abas de filtro para área de visualização do dashboard."],
    ]
    story.append(table_base(cdata, [3*cm, 5.5*cm, 8.5*cm]))
    story.append(sp(8))

    story.append(sub_header("4.2 KPI Cards"))
    kdata = [
        ["Card", "Métricas Exibidas"],
        ["BeneficiariosCard", "Total, % vs mês anterior, ativos/novos/cancelados, gráfico rosca PF×PJ"],
        ["LeadsCard", "Total leads, breakdown por origem (Google Ads, Meta, Indicação, Outros)"],
        ["ConversoesCard", "Taxa de conversão %, vendas realizadas, total leads, progresso vs meta"],
        ["InvestimentoCard", "Total investido, % do orçado, barra de progresso, orçado vs real"],
        ["RoiCard", "ROI total, CAC (custo aquisição cliente), LTV, fator LTV/CAC"],
        ["NpsCard", "Score NPS, classificação (Excelente/Bom/Neutro), promotores vs detratores"],
        ["KPICardGrid", "Container: carrossel horizontal em mobile/tablet, grid em desktop"],
    ]
    story.append(table_base(kdata, [4.5*cm, 12.5*cm]))
    story.append(sp(8))

    story.append(sub_header("4.3 Gráficos"))
    chdata = [
        ["Componente", "Tecnologia", "Descrição"],
        ["AdPerformanceChart", "Chart.js", "Barras semanais (7 dias) por plataforma. 6 métricas: views, grupos, investido, leads, conversões, sched. rate. Fundo dark, cores gradiente rosa."],
        ["ConversionFunnelTabs", "CSS clip-path", "3 abas: Funil geométrico (5 etapas: Impressões→Cliques→Leads→Agendamentos→Vendas), Origem dos Leads (pizza), Distribuição Cidades (barras)."],
        ["TrendCharts", "Chart.js", "8 séries temporais para relatórios consolidados. Usado na página Reports."],
    ]
    story.append(table_base(chdata, [4*cm, 3*cm, 10*cm]))
    story.append(sp(8))

    story.append(sub_header("4.4 Tabelas"))
    tdata = [
        ["Componente", "Modo", "Funcionalidades"],
        ["InvestmentTable", "Desktop (md+)", "14 itens, 5 filtros (Todos/Marketing/Ads/Offline/Ferramentas), tags coloridas por categoria, totalizações, timestamp"],
        ["MobileInvestmentList", "Mobile (<md)", "Cards verticais verticais com mesmo filtro de categoria e totalizações"],
    ]
    story.append(table_base(tdata, [4*cm, 3.5*cm, 9.5*cm]))
    story.append(sp(8))

    story.append(sub_header("4.5 Componentes Mobile Exclusivos"))
    mdata = [
        ["Componente", "Descrição"],
        ["MobileDashboardHeader", "Header adaptado para mobile com título e controles compactos"],
        ["MobileDashboardTabs", "Abas de navegação de seções do dashboard em mobile"],
        ["MobileKpiStrip", "Strip horizontal de KPIs scrollável para mobile"],
        ["MobileBeneficiariesCard", "Card de beneficiários otimizado para tela pequena"],
        ["MobileAdsPerformanceCard", "Card de desempenho de anúncios para mobile"],
        ["MobileInvestmentsPreviewCard", "Preview compacto de investimentos"],
        ["MobileFunnelCard", "Funil de conversão simplificado para mobile"],
    ]
    story.append(table_base(mdata, [5.5*cm, 11.5*cm]))
    story.append(PageBreak())
    return story


# ─────────────────────────────────────────────
# 5. ESTADO GLOBAL
# ─────────────────────────────────────────────
def sec_state():
    story = []
    story.append(section_header("Gerenciamento de Estado", 5))
    story.append(hr())

    story.append(body(
        "O sistema utiliza <b>React Context API</b> como solução de estado global, sem Redux ou Zustand. "
        "O contexto principal é o <b>DashboardContext</b>, provedor único no topo da árvore de componentes."
    ))
    story.append(sp(6))

    story.append(sub_header("DashboardContext — Interface"))
    idata = [
        ["Propriedade", "Tipo", "Descrição"],
        ["selectedMonth", "string", "Mês selecionado no formato YYYY-MM (ex.: '2026-05')"],
        ["setSelectedMonth", "function", "Atualiza o mês selecionado e recalcula currentMonthData"],
        ["availableMonths", "array", "Lista de meses com valor e label formatado para o seletor"],
        ["currentMonthData", "DashboardDataPayload", "Dados completos do mês atualmente selecionado"],
        ["allDashboardData", "MonthDataMap", "Mapa indexado por mês com todos os dados históricos"],
        ["investmentsData", "InvestmentPayload", "Dados de investimentos (categorias + detalhes mensais)"],
        ["reportFilter", "ReportFilter", "Filtros aplicados aos relatórios (tipo, período)"],
        ["consolidatedReport", "ConsolidatedReport", "Relatório gerado dinamicamente em tempo real"],
        ["resetToDefaultData", "function", "Restaura dados mock originais e limpa localStorage"],
        ["upsertMonthData", "function", "Insere ou atualiza dados de um mês específico"],
    ]
    story.append(table_base(idata, [4.5*cm, 3.5*cm, 9*cm]))
    story.append(sp(8))

    story.append(sub_header("Persistência — localStorage"))
    ldata = [
        ["Chave", "Conteúdo"],
        ["uniodonto_dashboard_data", "allDashboardData (todos os meses em JSON)"],
        ["uniodonto_investments_data", "investmentsData (categorias e valores mensais)"],
        ["uniodonto_dashboard_version", "Versão atual: 'v1.5' — limpa cache ao atualizar"],
        ["uniodonto_settings_users", "Lista de usuários cadastrados no sistema"],
        ["sidebar-collapsed", "Estado de collapse da Sidebar ('true'/'false')"],
        ["theme", "Tema ativo ('light' ou 'dark')"],
    ]
    story.append(table_base(ldata, [6*cm, 11*cm]))
    story.append(sp(8))

    story.append(sub_header("Estado em App.tsx"))
    story.append(body(
        "Além do DashboardContext, o componente raiz <b>App.tsx</b> mantém estado local para:"
    ))
    for b in [
        "currentPage (string) — rota atual da aplicação (sem react-router).",
        "theme ('light' | 'dark') — aplicado como classe no elemento raiz.",
        "loggedUser (User | null) — usuário autenticado, null se não logado.",
    ]:
        story.append(bullet(b))
    story.append(PageBreak())
    return story


# ─────────────────────────────────────────────
# 6. UTILITÁRIOS
# ─────────────────────────────────────────────
def sec_utils():
    story = []
    story.append(section_header("Utilitários e Serviços", 6))
    story.append(hr())

    story.append(sub_header("6.1 Adaptador de Dados — dashboardAdapter.ts"))
    story.append(body(
        "Converte dados no formato moderno (<b>DashboardDataPayload</b>) para o formato legado "
        "(<b>MonthDashboardData</b>) esperado pelos componentes de UI. "
        "Usa sub-mapeadores especializados em <b>subMappers.ts</b>."
    ))
    smdata = [
        ["Sub-mapeador", "Saída"],
        ["mapBeneficiarios()", "BeneficiariosData — total, ativos, novos, cancelados, PF, PJ"],
        ["mapLeads()", "LeadsData — total, google, meta, indicacao, outros"],
        ["mapConversoes()", "ConversoesData — taxa, vendas, leads, meta"],
        ["mapInvestimento()", "InvestimentoData — total, orcado, percentual"],
        ["mapRoi()", "RoiData — roi, cac, ltv, fatorLtv"],
        ["mapNps()", "NpsData — score, status, respostas, promotores, detratores"],
        ["mapInvestimentosTabela()", "InvestmentRow[] — lista completa para tabela"],
        ["mapAnuncios()", "AnunciosData — métricas semanais por plataforma"],
        ["mapFunil()", "FunilData — 5 etapas de conversão"],
        ["mapCidades()", "CidadesData[] — distribuição geográfica de leads"],
    ]
    story.append(table_base(smdata, [5*cm, 12*cm]))
    story.append(sp(8))

    story.append(sub_header("6.2 Cálculos e Métricas — dashboardCalculations.ts"))
    calcs = [
        ["Função", "Fórmula / Lógica"],
        ["calcularTaxaConversao(c, l)", "conversoes / leads × 100"],
        ["calcularCAC(total, novos)", "totalInvestido / novosBeneficiarios"],
        ["calcularChurn(cancel, ativos)", "cancelados / beneficiariosAtivos × 100"],
        ["calcularLTV(ticket, churn, ltv?)", "ticketMedio / (churnRate/100) — ou inputLtv se fornecido"],
        ["processarInvestimentos(inv, cats)", "Agrupa e soma investimentos por tipo (marketing, sales, operational)"],
        ["formatarMonthLabel(month)", "'2026-05' → 'Maio/2026'"],
    ]
    story.append(table_base(calcs, [6*cm, 11*cm]))
    story.append(sp(8))

    story.append(sub_header("6.3 Formatters — formatters.ts"))
    fmts = [
        ["Função", "Exemplo de Saída"],
        ["formatarNumero(1234)", "1.234"],
        ["formatarMoeda(1234.56)", "R$ 1.234,56"],
        ["formatarPorcentagem(12.5)", "12,5%"],
        ["formatarMilharMoeda(12500)", "R$ 12,5 mil"],
    ]
    story.append(table_base(fmts, [5*cm, 12*cm]))
    story.append(sp(8))

    story.append(sub_header("6.4 Exportação — pdfExporter.ts"))
    story.append(body(
        "Gera PDFs via <b>jsPDF + jspdf-autotable</b>. Função principal: "
        "<b>exportarPDF(consolidatedReport, filter, allDashboardData)</b>. "
        "Cores padronizadas (brand pink #D81B60), análises estratégicas dinâmicas, tabelas com totalizações."
    ))
    story.append(sp(4))

    story.append(sub_header("6.5 Parser de Planilhas — spreadsheetParser.ts"))
    story.append(body(
        "Parser usando <b>SheetJS (XLSX)</b>. Mapeia abas: Resumo, Tráfego, Canais, Cidades, Campanhas, "
        "Investimentos. Busca de colunas flexível (case-insensitive, acentuação). "
        "Retorna <b>ParsedExcelData</b> estruturado. Inclui <b>downloadExcelTemplate()</b> para template de exemplo."
    ))
    story.append(sp(4))

    story.append(sub_header("6.6 Pipeline de APIs — adApiPipeline.ts"))
    story.append(body(
        "Função <b>syncAdsApis(credentials, selectedMonth, callback)</b>. Simula sincronismo com "
        "Google Ads e Meta ADS. Pipeline com logs de progresso (<b>ApiProgressLog[]</b>). "
        "Retorna dados estruturados de campanhas por plataforma."
    ))
    story.append(sp(4))

    story.append(sub_header("6.7 Validação — dataValidator.ts"))
    story.append(body(
        "Validação estrita de dados uploadados. Verifica: campos numéricos, ausência de negativos, "
        "consistência lógica (conversões ≤ leads). Emite <b>warnings</b> de negócio "
        "(volume zero, cancelamentos zero, divergências regionais). "
        "Inclui <b>safeDivide(n, d)</b> para evitar NaN/Infinity."
    ))
    story.append(PageBreak())
    return story


# ─────────────────────────────────────────────
# 7. DADOS MOCK E TIPOS
# ─────────────────────────────────────────────
def sec_data():
    story = []
    story.append(section_header("Dados Mock e Tipos TypeScript", 7))
    story.append(hr())

    story.append(sub_header("Dados Mock — 6 Meses"))
    story.append(body(
        "O sistema opera com dados simulados de Janeiro a Junho de 2026, indexados por "
        "chave YYYY-MM em <b>mockDashboardData.ts</b>. Cada mês contém:"
    ))
    mdata = [
        ["Campo", "Tipo", "Descrição"],
        ["summary", "MonthlySummary", "13 KPIs principais (beneficiários, leads, conversões, ROI, NPS, etc.)"],
        ["trafficSources[]", "TrafficSource[]", "4 origens: Google Ads, Meta ADS, Parcerias, Orgânico"],
        ["acquisitionChannels[]", "AcquisitionChannel[]", "3 canais: Digital, Venda Direta, Corretores"],
        ["cityDistribution[]", "CityDistribution[]", "5 cidades: Passos, Itaú, S.S. Paraíso, Cássia, Alpinópolis"],
        ["campaigns[]", "CampaignPerformance[]", "4 campanhas com métricas completas por plataforma"],
    ]
    story.append(table_base(mdata, [3.5*cm, 4.5*cm, 9*cm]))
    story.append(sp(8))

    story.append(sub_header("Investimentos Mock"))
    story.append(body(
        "<b>mockInvestments.ts</b> — 14 categorias de investimento com histórico mensal."
    ))
    invdata = [
        ["Tipo", "Total Mensal (Referência)"],
        ["Marketing (offline + ferramentas)", "R$ 6.902,00"],
        ["Sales (comissões, eventos)", "R$ 7.115,00"],
        ["Operational", "R$ 0,00"],
        ["TOTAL CONSOLIDADO", "R$ 14.017,46"],
    ]
    story.append(table_base(invdata, [7*cm, 10*cm]))
    story.append(sp(8))

    story.append(sub_header("Hierarquia de Tipos TypeScript"))
    tdata = [
        ["Namespace", "Tipos Principais"],
        ["Tipos Modernos (DashboardDataPayload)", "MonthlySummary, TrafficSource, AcquisitionChannel, CityDistribution, CampaignPerformance"],
        ["Tipos Legados (MonthDashboardData)", "BeneficiariosData, LeadsData, ConversoesData, InvestimentoData, RoiData, NpsData"],
        ["Tipos de Investimentos", "InvestmentCategory, MonthlyCategoryInvestment, InvestmentPayload"],
        ["Tipos de Relatórios", "ReportType (5 valores), ConsolidatedReportRow, ConsolidatedReportTotals, ConsolidatedReport"],
        ["Tipos Globais", "MonthDataMap (index por YYYY-MM), User, Theme"],
    ]
    story.append(table_base(tdata, [5.5*cm, 11.5*cm]))
    story.append(PageBreak())
    return story


# ─────────────────────────────────────────────
# 8. TESTES
# ─────────────────────────────────────────────
def sec_tests():
    story = []
    story.append(section_header("Testes", 8))
    story.append(hr())

    story.append(body(
        "O projeto usa <b>Vitest</b> (compatível com Jest) e <b>@testing-library/react</b>. "
        "Ambiente de teste: <b>jsdom</b>. Configuração em <b>src/vitest.setup.ts</b>."
    ))
    story.append(sp(6))

    testdata = [
        ["Arquivo", "Escopo", "Principais Casos"],
        ["test/Login.test.tsx", "Página Login", "Renderização, validação de credenciais, mensagem de erro, redirect após login"],
        ["test/Settings.test.tsx", "Página Settings", "CRUD de usuários: criar, editar, excluir, redefinir senha, listagem"],
        ["utils/dashboardAdapter.test.ts", "dashboardAdapter", "Conversão modern→legacy, valores nulos, meses sem dados"],
        ["utils/dataMap.test.ts", "Mapeamento KPIs", "Mapeamento correto de todos os campos, edge cases numéricos"],
        ["utils/InvestmentTable.test.tsx", "InvestmentTable", "Filtros de categoria, totalizações, renderização condicional"],
        ["utils/routes.test.tsx", "Routing", "Navegação entre páginas, redirecionamento sem auth"],
        ["utils/sync.test.tsx", "Sincronismo", "Pipeline de APIs, logs de progresso, dados retornados"],
    ]
    story.append(table_base(testdata, [5*cm, 3*cm, 9*cm]))
    story.append(sp(8))

    story.append(sub_header("Scripts de Teste"))
    story.append(Paragraph("npm test", S["code"]))
    story.append(body("Executa todos os testes uma vez e exibe resultado."))
    story.append(sp(4))
    story.append(Paragraph("npm run test:watch", S["code"]))
    story.append(body("Modo watch — re-executa ao salvar arquivos (dev)."))
    story.append(PageBreak())
    return story


# ─────────────────────────────────────────────
# 9. DEPLOY
# ─────────────────────────────────────────────
def sec_deploy():
    story = []
    story.append(section_header("Deploy e Infraestrutura", 9))
    story.append(hr())

    story.append(sub_header("Firebase Hosting"))
    story.append(body(
        "O projeto é hospedado no <b>Firebase Hosting</b> com CDN global automático. "
        "Project ID: <b>uni0dontopassos</b>."
    ))
    story.append(sp(4))
    fcfg = [
        ["Configuração", "Valor"],
        ["Public directory", "dist/ (saída do Vite)"],
        ["SPA Rewrite", "/** → /index.html (sem SSR)"],
        ["Cache JS/CSS/TS", "max-age=31536000 (1 ano, imutável)"],
        ["Cache HTML", "no-cache (sempre valida no servidor)"],
        ["URL pública", "https://uni0dontopassos.web.app"],
    ]
    story.append(table_base(fcfg, [5*cm, 12*cm]))
    story.append(sp(8))

    story.append(sub_header("Processo de Build e Deploy"))
    steps = [
        "npm run build  — compila TypeScript + empacota com Vite → dist/",
        "firebase deploy  — faz upload de dist/ para Firebase CDN",
        "Assets com hash no nome recebem cache de 1 ano (imutável)",
        "index.html sem cache garante sempre a versão mais recente do app",
    ]
    for s in steps:
        story.append(bullet(s))
    story.append(sp(8))

    story.append(sub_header("Android / Capacitor"))
    cdata = [
        ["Configuração", "Valor"],
        ["App ID", "com.dashboard.app"],
        ["App Name", "App Dashboard"],
        ["Web Dir", "dist/ (mesmo build do Vite)"],
        ["Versão Capacitor", "8.3.4"],
        ["Plataforma", "Android (pasta android/)"],
    ]
    story.append(table_base(cdata, [5*cm, 12*cm]))
    story.append(sp(4))
    for b in [
        "npx cap sync  — copia dist/ para android/app/src/main/assets/public/",
        "npx cap open android  — abre Android Studio para build nativo",
        "npx cap run android  — executa diretamente em dispositivo/emulador",
    ]:
        story.append(bullet(b))
    story.append(PageBreak())
    return story


# ─────────────────────────────────────────────
# 10. DESIGN SYSTEM
# ─────────────────────────────────────────────
def sec_design():
    story = []
    story.append(section_header("Design System", 10))
    story.append(hr())

    story.append(sub_header("Paleta de Cores"))
    cdata = [
        ["Token", "Hex", "Uso Principal"],
        ["brand-primary", "#D81B60", "Cor principal — botões, destaques, ícones ativos"],
        ["brand-secondary", "#E91E63", "Variação de destaque e hover states"],
        ["brand-dark", "#2D0A1B", "Fundo de componentes dark (charts, sidebar night)"],
        ["brand-bg", "#F8F9FA", "Background geral em light mode"],
        ["TABLE_HEADER", "#880E4F", "Cabeçalho de tabelas"],
        ["GRAY_DARK", "#374151", "Textos principais"],
        ["GRAY_MID", "#6B7280", "Textos secundários / rótulos"],
        ["GRAY_LIGHT", "#F3F4F6", "Fundos alternados de tabela"],
    ]
    story.append(table_base(cdata, [3.5*cm, 2.5*cm, 11*cm]))
    story.append(sp(8))

    story.append(sub_header("Tipografia"))
    story.append(body("Fonte principal: <b>Inter</b> (sans-serif). Escalas principais:"))
    tdata = [
        ["Uso", "Tamanho", "Peso"],
        ["Títulos de seção (KPI)", "30px", "Bold"],
        ["Métricas principais", "28–30px", "Bold"],
        ["Rótulos de KPI", "10–11px", "Regular"],
        ["Corpo de texto", "14–16px", "Regular"],
        ["Labels de tabela", "12px", "Medium"],
    ]
    story.append(table_base(tdata, [5.5*cm, 3.5*cm, 8*cm]))
    story.append(sp(8))

    story.append(sub_header("Breakpoints Responsivos"))
    bdata = [
        ["Breakpoint", "Largura", "Comportamento"],
        ["xs (custom)", "375px", "Dispositivos pequenos (iPhone SE)"],
        ["sm", "640px", "Smartphones maiores"],
        ["md", "768px", "Tablets — troca mobile→desktop layout"],
        ["lg", "1024px", "Notebooks"],
        ["xl / 2xl", "1280px / 1536px", "Desktops grandes"],
    ]
    story.append(table_base(bdata, [3.5*cm, 3*cm, 10.5*cm]))
    story.append(sp(8))

    story.append(sub_header("Acessibilidade"))
    for b in [
        "Focus trap em modais (Sidebar help/logout) — TAB capturado dentro do modal.",
        "Tecla Escape fecha todos os modais abertos.",
        "ARIA labels em botões e elementos de navegação.",
        "Touch targets mínimos de 44px (Tailwind min-h-touch).",
        "Contraste de cores validado contra WCAG AA.",
        "Texto responsivo escalável em todos os breakpoints.",
    ]:
        story.append(bullet(b))
    story.append(PageBreak())
    return story


# ─────────────────────────────────────────────
# 11. SEGURANÇA
# ─────────────────────────────────────────────
def sec_security():
    story = []
    story.append(section_header("Usuários e Segurança", 11))
    story.append(hr())

    story.append(body(
        "A versão atual utiliza <b>autenticação local via localStorage</b>, adequada para "
        "uso interno controlado. Não há backend, banco de dados externo ou transmissão de "
        "credenciais por rede."
    ))
    story.append(sp(6))

    story.append(sub_header("Limitações Atuais"))
    for b in [
        "Senhas armazenadas em texto plano no localStorage (sem hash).",
        "Sem expiração de sessão automática.",
        "Sem autenticação multifator (MFA).",
        "Dados de todos os usuários acessíveis por qualquer usuário logado via devtools.",
        "Sem controle de permissões granular por role (todos acessam todas as páginas).",
    ]:
        story.append(bullet(b))
    story.append(sp(8))

    story.append(sub_header("Recomendações para Produção"))
    for b in [
        "Migrar autenticação para Firebase Authentication (Google/Email+Senha com hash bcrypt).",
        "Implementar controle de acesso baseado em role (RBAC) por página/funcionalidade.",
        "Adicionar expiração de sessão (ex.: 8h de inatividade).",
        "Mover dados sensíveis para Firestore (com regras de segurança).",
        "Habilitar HTTPS obrigatório (Firebase já força em produção).",
        "Auditoria de acesso — log de ações críticas (exportar PDF, upload, excluir usuário).",
    ]:
        story.append(bullet(b))
    story.append(PageBreak())
    return story


# ─────────────────────────────────────────────
# 12. ROADMAP
# ─────────────────────────────────────────────
def sec_roadmap():
    story = []
    story.append(section_header("Roadmap e Pendências", 12))
    story.append(hr())

    story.append(sub_header("Próximas Implementações (v1.3+)"))
    rdata = [
        ["Prioridade", "Feature", "Justificativa"],
        ["Alta", "Firebase Authentication", "Substituir localStorage auth por auth real com hash de senhas"],
        ["Alta", "Firestore Integration", "Persistência de dados em nuvem multi-usuário em tempo real"],
        ["Alta", "RBAC por Role", "Diretores: leitura; Gerência: + upload; Admin: + configurações"],
        ["Média", "API Real Google Ads", "Substituir pipeline simulado por integração com Google Ads API v18"],
        ["Média", "API Real Meta ADS", "Integração com Meta Marketing API para métricas de campanhas reais"],
        ["Média", "Notificações Push", "Alertas de KPIs críticos (churn alto, ROI abaixo da meta)"],
        ["Baixa", "Exportação Excel", "Relatórios em .xlsx além de PDF"],
        ["Baixa", "Dashboard iOS", "Compilação Capacitor para iOS além de Android"],
        ["Baixa", "Internacionalização", "Suporte a inglês para eventuais auditores externos"],
    ]
    story.append(table_base(rdata, [2.5*cm, 4.5*cm, 10*cm]))
    story.append(sp(8))

    story.append(sub_header("Dívidas Técnicas Conhecidas"))
    debts = [
        "Arquivo mockData.ts deletado (D src/data/mockData.ts) — verificar ausência de imports órfãos.",
        "Arquivo reportsData.ts deletado — garantir que Reports.tsx usa apenas mockReports.ts.",
        "docs/technical-documentation.md não commitado — integrar ao versionamento.",
        "src/utils/dashboardCalculations.ts, formatters.ts, subMappers.ts — arquivos novos não commitados.",
        "tsconfig.json e vite.config.ts com modificações pendentes — revisar antes do próximo deploy.",
        "Autenticação local sem hash — risco de segurança para qualquer ambiente com acesso externo.",
    ]
    for d in debts:
        story.append(bullet(d))
    story.append(sp(8))

    story.append(sub_header("Status Git Atual (Jun/2026)"))
    gitdata = [
        ["Arquivo", "Status"],
        ["src/App.tsx", "Modificado (M)"],
        ["src/components/layout/Sidebar.tsx", "Modificado (M)"],
        ["src/context/DashboardContext.tsx", "Modificado (M)"],
        ["src/data/mockDashboardData.ts", "Modificado (M)"],
        ["src/data/mockData.ts", "Deletado (D)"],
        ["src/data/reportsData.ts", "Deletado (D)"],
        ["src/pages/DataUpload.tsx", "Modificado (M)"],
        ["src/pages/Login.tsx", "Modificado (M)"],
        ["src/pages/Reports.tsx", "Modificado (M)"],
        ["src/pages/Settings.tsx", "Modificado (M)"],
        ["src/utils/dashboardCalculations.ts", "Novo (não rastreado)"],
        ["src/utils/formatters.ts", "Novo (não rastreado)"],
        ["src/utils/subMappers.ts", "Novo (não rastreado)"],
        ["docs/technical-documentation.md", "Novo (não rastreado)"],
    ]
    story.append(table_base(gitdata, [9*cm, 8*cm]))

    story.append(sp(16))
    story.append(hr())
    story.append(sp(4))
    story.append(Paragraph(
        f"Documento gerado automaticamente em {datetime.now().strftime('%d/%m/%Y às %H:%M')} · "
        "FerTaise Tech · Dashboard Uniodonto Passos v1.2",
        ParagraphStyle("footer_doc", fontName="Helvetica-Oblique", fontSize=8,
                       textColor=GRAY_MID, alignment=TA_CENTER)
    ))
    return story


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
def main():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=2*cm,
        rightMargin=2*cm,
        topMargin=2.4*cm,
        bottomMargin=2.4*cm,
        title="Documentação Oficial — Dashboard Uniodonto Passos",
        author="FerTaise Tech",
        subject="Documentação Técnica e Funcional v1.2",
        creator="Dashboard Doc Generator",
    )

    story = []
    story += build_cover()
    story += build_toc()
    story += sec_overview()
    story += sec_architecture()
    story += sec_pages()
    story += sec_components()
    story += sec_state()
    story += sec_utils()
    story += sec_data()
    story += sec_tests()
    story += sec_deploy()
    story += sec_design()
    story += sec_security()
    story += sec_roadmap()

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF gerado com sucesso: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
