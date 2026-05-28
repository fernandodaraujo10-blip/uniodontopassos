import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  Trash2, 
  Server, 
  Play,
  FileText,
  Database,
  Globe,
  Settings,
  Save,
  Check,
  ChevronRight,
  Plus,
  ArrowRight,
  ArrowLeft,
  Terminal,
  Activity,
  Cpu,
  ChevronLeft,
  Calendar,
  Coins,
  TrendingUp,
  Percent,
  Info,
  Lock
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { parseSpreadsheet, downloadExcelTemplate } from '../utils/spreadsheetParser';
import { validateUploadedData, ValidationError } from '../utils/dataValidator';
import { syncAdsApis, ApiProgressLog } from '../utils/adApiPipeline';
import { MonthlyCategoryInvestment } from '../types/investments';

interface DataUploadProps {
  currentPage?: string;
  setCurrentPage?: (page: string) => void;
}

interface InvestmentRowProps {
  inv: MonthlyCategoryInvestment;
  isAudited: boolean;
  onToggleAudit: () => void;
  handleUpdateInvestment: (categoryId: string, field: 'amount' | 'customName' | 'customType' | 'isFixed', value: any) => void;
  handleRemoveInvestment: (categoryId: string) => void;
}

const InvestmentRow: React.FC<InvestmentRowProps> = ({ inv, isAudited, onToggleAudit, handleUpdateInvestment, handleRemoveInvestment }) => {
  const [displayVal, setDisplayVal] = useState(() => {
    return inv.amount === 0 ? '' : inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  });

  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayVal(inv.amount === 0 ? '' : inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  }, [inv.amount, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    
    // Permite apenas dígitos, ponto e vírgula
    raw = raw.replace(/[^0-9.,-]/g, '');
    setDisplayVal(raw);

    const normalized = raw.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(normalized);
    handleUpdateInvestment(inv.categoryId, 'amount', isNaN(parsed) ? 0 : parsed);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayVal(inv.amount === 0 ? '' : inv.amount.toString().replace('.', ','));
  };

  const handleBlur = () => {
    setIsFocused(false);
    setDisplayVal(inv.amount === 0 ? '' : inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  return (
    <tr className={`border-b border-slate-50/50 transition-all ${
      isAudited ? 'bg-emerald-50/40 hover:bg-emerald-50/60' : (inv.isFixed ? 'bg-slate-50/10 hover:bg-slate-50/40' : 'hover:bg-slate-50/40')
    }`}>
      <td className="py-1 text-center w-8">
        <input
          type="checkbox"
          checked={isAudited}
          onChange={onToggleAudit}
          className="w-3.5 h-3.5 border-gray-300 rounded focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
          title="Confirmar lançamento no mês"
        />
      </td>
      <td className="py-1 w-[42%]">
        <input
          type="text"
          value={inv.customName}
          onChange={(e) => handleUpdateInvestment(inv.categoryId, 'customName', e.target.value)}
          className={`w-full px-1.5 py-0.5 border border-transparent hover:border-gray-200 focus:border-pink-500 rounded bg-transparent font-medium text-gray-700 focus:outline-none ${
            inv.isFixed ? 'text-slate-500 font-bold' : ''
          }`}
        />
      </td>
      <td className="py-1 w-[18%]">
        <select
          value={inv.customType === 'sales' ? 'Software' : 'Ads'}
          onChange={(e) => {
            const val = e.target.value === 'Software' ? 'sales' : 'marketing';
            handleUpdateInvestment(inv.categoryId, 'customType', val);
          }}
          className="px-1 py-0.5 border border-transparent hover:border-gray-200 rounded text-[10px] font-semibold text-gray-500 focus:outline-none bg-transparent cursor-pointer"
        >
          <option value="Ads">Ads</option>
          <option value="Software">Software</option>
        </select>
      </td>
      <td className="py-1 text-center w-12">
        <input
          type="checkbox"
          checked={!!inv.isFixed}
          onChange={(e) => handleUpdateInvestment(inv.categoryId, 'isFixed', e.target.checked)}
          className="w-3.5 h-3.5 text-pink-600 border-gray-300 rounded focus:ring-pink-500 accent-pink-700 cursor-pointer"
          title="Marcar como valor fixo recorrente"
        />
      </td>
      <td className="py-1 w-[24%]">
        <div className="relative flex items-center justify-end">
          {inv.isFixed && <Lock className="w-3 h-3 text-pink-600 absolute left-2 pointer-events-none" />}
          <input
            id={`inv-amount-${inv.categoryId}`}
            type="text"
            value={displayVal}
            placeholder="0,00"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={`w-full text-right py-0.5 border border-transparent hover:border-gray-200 focus:border-pink-500 rounded bg-transparent font-mono font-bold text-gray-700 focus:outline-none ${
              inv.isFixed ? 'pl-6 pr-1.5 bg-slate-50/50' : 'px-1.5'
            }`}
          />
        </div>
      </td>
      <td className="py-1 text-center w-8">
        <button
          type="button"
          onClick={() => handleRemoveInvestment(inv.categoryId)}
          className="text-gray-300 hover:text-rose-600 transition-colors p-1 cursor-pointer"
          title="Remover fonte de despesa"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
};

export const DataUpload: React.FC<DataUploadProps> = ({ currentPage, setCurrentPage }) => {
  const { upsertMonthData, resetToDefaultData, allDashboardData, investmentsData } = useDashboard();
  
  // Determina a aba ativa (sincronizada com o Sidebar ou fallback interno)
  const activeTab = currentPage || 'envio-manual';
  const handleTabChange = (tabId: string) => {
    if (setCurrentPage) {
      setCurrentPage(tabId);
    }
  };

  // --- ESTADOS DO ENVIO MANUAL ---
  const [manualMonth, setManualMonth] = useState('2026-07');
  const [manualStep, setManualStep] = useState(0);
  const [manualSuccessMessage, setManualSuccessMessage] = useState('');
  const [activeInvTab, setActiveInvTab] = useState<'Todos' | 'Marketing' | 'Ads' | 'Offline' | 'Ferramentas'>('Todos');
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [dropdownYear, setDropdownYear] = useState(2026);

  useEffect(() => {
    if (manualMonth) {
      const year = parseInt(manualMonth.split('-')[0]);
      if (!isNaN(year)) setDropdownYear(year);
    }
  }, [manualMonth]);
  
  const [formSummary, setFormSummary] = useState({
    activeBeneficiaries: 10450,
    newBeneficiaries: 154,
    canceledBeneficiaries: 24,
    leads: 180,
    conversions: 24,
    ltv: 1250,
    nps: 78
  });

  const [formTraffic, setFormTraffic] = useState<{ source: string; leads: number; conversions: number }[]>([]);
  const [formChannels, setFormChannels] = useState<{ channel: string; channelType: string; leads: number; conversions: number }[]>([]);
  const [formCities, setFormCities] = useState<{ city: string; beneficiaries: number; leads: number; conversions: number }[]>([]);
  const [formCampaigns, setFormCampaigns] = useState<{ campaignId: string; campaignName: string; platform: string; clicks: number; impressions: number; leads: number; conversions: number; spend: number }[]>([]);
  const [formInvestments, setFormInvestments] = useState<MonthlyCategoryInvestment[]>([]);

  // --- ESTADOS DE AUDITORIA MENSAL ---
  // Mapeamento de chaves validadas por seção: Record<id, boolean>
  const [validatedSummary, setValidatedSummary] = useState<Record<string, boolean>>({});
  const [validatedInvestments, setValidatedInvestments] = useState<Record<string, boolean>>({});
  const [validatedCampaigns, setValidatedCampaigns] = useState<Record<string, boolean>>({});

  const auditStorageKey = (month: string) => `uniodonto_audit_${month}`;

  const loadAuditFromStorage = (month: string) => {
    try {
      const raw = localStorage.getItem(auditStorageKey(month));
      if (raw) {
        const parsed = JSON.parse(raw);
        setValidatedSummary(parsed.summary || {});
        setValidatedInvestments(parsed.investments || {});
        setValidatedCampaigns(parsed.campaigns || {});
      } else {
        setValidatedSummary({});
        setValidatedInvestments({});
        setValidatedCampaigns({});
      }
    } catch {
      setValidatedSummary({});
      setValidatedInvestments({});
      setValidatedCampaigns({});
    }
  };

  const saveAuditToStorage = (month: string, summary: Record<string, boolean>, investments: Record<string, boolean>, campaigns: Record<string, boolean>) => {
    localStorage.setItem(auditStorageKey(month), JSON.stringify({ summary, investments, campaigns }));
  };

  // Carrega e preenche o formulário manual dinamicamente com base no mês selecionado
  const loadMonthDataForManual = (monthStr: string) => {
    const existing = allDashboardData[monthStr];
    
    // Tenta clonar a estrutura do mês mais recente existente para servir de ponto de partida
    const fallbackMonth = Object.keys(allDashboardData).sort().reverse()[0] || '2026-06';
    const template = allDashboardData[fallbackMonth];
    
    const baseSummary = existing?.summary || {
      activeBeneficiaries: template?.summary.activeBeneficiaries || 10000,
      newBeneficiaries: 0,
      canceledBeneficiaries: 0,
      leads: 0,
      conversions: 0,
      ltv: template?.summary.ltv || 1200,
      nps: template?.summary.nps || 75
    };
    
    setFormSummary({
      activeBeneficiaries: baseSummary.activeBeneficiaries,
      newBeneficiaries: baseSummary.newBeneficiaries,
      canceledBeneficiaries: baseSummary.canceledBeneficiaries,
      leads: baseSummary.leads,
      conversions: baseSummary.conversions,
      ltv: baseSummary.ltv || 1200,
      nps: baseSummary.nps || 75
    });

    // Origens de tráfego
    const baseTraffic = existing?.trafficSources || template?.trafficSources.map(t => ({
      source: t.source,
      leads: 0,
      conversions: 0
    })) || [
      { source: 'Google Ads', leads: 0, conversions: 0 },
      { source: 'Meta Ads', leads: 0, conversions: 0 },
      { source: 'Tráfego Orgânico', leads: 0, conversions: 0 },
      { source: 'Indicação', leads: 0, conversions: 0 }
    ];
    setFormTraffic(baseTraffic.map(t => ({ source: t.source, leads: t.leads, conversions: t.conversions })));

    // Canais de aquisição
    const baseChannels = existing?.acquisitionChannels || template?.acquisitionChannels.map(c => ({
      channel: c.channel,
      channelType: c.channelType || 'other',
      leads: 0,
      conversions: 0
    })) || [
      { channel: 'Digital (Inbound)', channelType: 'digital', leads: 0, conversions: 0 },
      { channel: 'Venda Direta (Outbound)', channelType: 'direct', leads: 0, conversions: 0 },
      { channel: 'Canais / Corretores', channelType: 'partners', leads: 0, conversions: 0 }
    ];
    setFormChannels(baseChannels.map(c => ({ channel: c.channel, channelType: c.channelType || 'other', leads: c.leads, conversions: c.conversions })));

    // Cidades
    const baseCities = existing?.cityDistribution || template?.cityDistribution.map(cit => ({
      city: cit.city,
      beneficiaries: cit.beneficiaries,
      leads: 0,
      conversions: 0
    })) || [
      { city: 'Passos', beneficiaries: 8000, leads: 0, conversions: 0 },
      { city: 'Itaú de Minas', beneficiaries: 1000, leads: 0, conversions: 0 },
      { city: 'São Seb. Paraíso', beneficiaries: 600, leads: 0, conversions: 0 },
      { city: 'Cássia', beneficiaries: 300, leads: 0, conversions: 0 },
      { city: 'Alpinópolis', beneficiaries: 100, leads: 0, conversions: 0 }
    ];
    setFormCities(baseCities.map(c => ({ city: c.city, beneficiaries: c.beneficiaries, leads: c.leads, conversions: c.conversions })));

    // Campanhas
    const baseCampaigns = existing?.campaigns || template?.campaigns.map(camp => ({
      campaignId: camp.campaignId,
      campaignName: camp.campaignName,
      platform: camp.platform,
      clicks: 0,
      impressions: 0,
      leads: 0,
      conversions: 0,
      spend: 0
    })) || [
      { campaignId: 'c1', campaignName: 'Google Search Uniodonto', platform: 'Google Ads', clicks: 0, impressions: 0, leads: 0, conversions: 0, spend: 0 },
      { campaignId: 'c2', campaignName: 'Meta Branding Passos', platform: 'Meta Ads', clicks: 0, impressions: 0, leads: 0, conversions: 0, spend: 0 }
    ];
    setFormCampaigns(baseCampaigns.map(c => ({
      campaignId: c.campaignId,
      campaignName: c.campaignName,
      platform: c.platform,
      clicks: c.clicks,
      impressions: c.impressions,
      leads: c.leads,
      conversions: c.conversions,
      spend: c.spend
    })));

    // Investimentos por Categoria
    const existingInvestments = investmentsData.monthlyDetails[monthStr]?.investments;
    const baseInvestments = existingInvestments || [];
    
    if (baseInvestments.length === 0) {
      // Se não existir dados desse mês ainda, pegamos como modelo as categorias globais
      setFormInvestments(investmentsData.categories.map(cat => {
        const fallbackMonth = Object.keys(allDashboardData).sort().reverse()[0] || '2026-06';
        const modelInvestments = investmentsData.monthlyDetails[fallbackMonth]?.investments || [];
        const modelInv = modelInvestments.find(m => m.categoryId === cat.id);
        
        return {
          categoryId: cat.id,
          amount: modelInv ? modelInv.amount : 0,
          customName: cat.name,
          customType: cat.type,
          isFixed: modelInv ? !!modelInv.isFixed : false
        };
      }));
    } else {
      setFormInvestments(baseInvestments.map(i => {
        const cat = investmentsData.categories.find(c => c.id === i.categoryId);
        return {
          categoryId: i.categoryId,
          amount: i.amount,
          customName: cat ? cat.name : i.categoryId,
          customType: cat ? cat.type : 'marketing',
          isFixed: !!i.isFixed
        };
      }));
    }

    // Carregar auditoria do mês
    loadAuditFromStorage(monthStr);
  };

  // Funções Auxiliares para preenchimento de Investimentos e Campanhas
  const handleAddInvestment = () => {
    const newId = `custom_inv_${Date.now()}`;
    setFormInvestments(prev => [
      ...prev,
      {
        categoryId: newId,
        amount: 0,
        customName: 'Novo Canal',
        customType: 'marketing',
        isFixed: false
      }
    ]);
  };

  const handleRemoveInvestment = (categoryId: string) => {
    setFormInvestments(prev => prev.filter(inv => inv.categoryId !== categoryId));
  };

  const handleUpdateInvestment = (categoryId: string, field: 'amount' | 'customName' | 'customType' | 'isFixed', value: any) => {
    setFormInvestments(prev => prev.map(inv => {
      if (inv.categoryId === categoryId) {
        return { ...inv, [field]: value };
      }
      return inv;
    }));
  };

  const handleAddCampaign = () => {
    const newId = `camp_${Date.now()}`;
    setFormCampaigns(prev => [
      ...prev,
      {
        campaignId: newId,
        campaignName: 'Nova Campanha',
        platform: 'Google Ads',
        clicks: 0,
        impressions: 0,
        leads: 0,
        conversions: 0,
        spend: 0
      }
    ]);
  };

  const handleRemoveCampaign = (campaignId: string) => {
    setFormCampaigns(prev => prev.filter(c => c.campaignId !== campaignId));
  };

  const handleUpdateCampaign = (campaignId: string, field: 'campaignName' | 'platform' | 'clicks' | 'impressions' | 'leads' | 'conversions' | 'spend', value: any) => {
    setFormCampaigns(prev => prev.map(c => {
      if (c.campaignId === campaignId) {
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  useEffect(() => {
    loadMonthDataForManual(manualMonth);
  }, [manualMonth]);

  const handleManualSave = () => {
    // Validação matemática rápida de integridade lógica
    if (formSummary.conversions > formSummary.leads) {
      alert('❌ Inconsistência Crítica: O número de conversões não pode superar o total de leads captados.');
      return;
    }
    if (formSummary.canceledBeneficiaries > formSummary.activeBeneficiaries) {
      alert('❌ Churn Inconsistente: O número de cancelamentos não pode ser maior que o total de beneficiários ativos.');
      return;
    }

    try {
      upsertMonthData(
        manualMonth,
        formSummary,
        formTraffic.map(t => ({ ...t, investment: 0 })),
        formChannels,
        formCities,
        formCampaigns,
        formInvestments
      );

      // Persiste auditoria do mês
      saveAuditToStorage(manualMonth, validatedSummary, validatedInvestments, validatedCampaigns);
      
      const formattedMonth = manualMonth.split('-')[1] + '/' + manualMonth.split('-')[0];
      setManualSuccessMessage(`Sucesso! Os dados manuais do mês ${formattedMonth} foram consolidados no dashboard.`);
      setManualStep(0);
      
      setTimeout(() => setManualSuccessMessage(''), 6000);
    } catch (err) {
      alert(`Erro ao salvar dados manuais: ${(err as Error).message}`);
    }
  };

  // --- ESTADOS DO UPLOAD DE PLANILHA (MIGRADO) ---
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<ValidationError[]>([]);
  const [parsedData, setParsedData] = useState<any>(null);
  const [importMessage, setImportMessage] = useState('');

  // --- ESTADOS DO SYNC DE APIS (MIGRADO) ---
  const [selectedSyncMonth, setSelectedSyncMonth] = useState('2026-07');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncLogs, setSyncLogs] = useState<ApiProgressLog[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll nos logs do terminal das APIs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [syncLogs]);

  // Drag and Drop de Planilhas
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.name.endsWith('.xlsx') || 
        droppedFile.name.endsWith('.xls') || 
        droppedFile.name.endsWith('.csv')
      ) {
        processSelectedFile(droppedFile);
      } else {
        alert('Por favor, envie apenas arquivos de planilha (.xlsx, .xls, .csv).');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setUploadStatus('loading');
    setValidationErrors([]);
    setValidationWarnings([]);
    setParsedData(null);
    setImportMessage('');

    try {
      const data = await parseSpreadsheet(selectedFile);
      const validation = validateUploadedData(
        data.month,
        data.summaryInput,
        data.trafficInput,
        data.channelsInput,
        data.citiesInput,
        data.campaignsInput,
        data.investmentsInput
      );

      setParsedData(data);
      setValidationErrors(validation.errors);
      setValidationWarnings(validation.warnings);

      if (validation.isValid) {
        setUploadStatus('success');
      } else {
        setUploadStatus('error');
      }
    } catch (err) {
      console.error(err);
      setUploadStatus('error');
      setValidationErrors([{
        field: 'file',
        message: (err as Error).message || 'Erro desconhecido ao decodificar a planilha.',
        type: 'error'
      }]);
    }
  };

  const commitImport = () => {
    if (!parsedData) return;

    try {
      upsertMonthData(
        parsedData.month,
        parsedData.summaryInput,
        parsedData.trafficInput,
        parsedData.channelsInput,
        parsedData.citiesInput,
        parsedData.campaignsInput,
        parsedData.investmentsInput
      );
      
      const formattedMonth = parsedData.month.split('-')[1] + '/' + parsedData.month.split('-')[0];
      setImportMessage(`Sucesso! Os dados do mês ${formattedMonth} foram incorporados.`);
      setFile(null);
      setParsedData(null);
      setUploadStatus('idle');
      
      setTimeout(() => setImportMessage(''), 5000);
    } catch (err) {
      alert(`Falha ao incorporar os dados: ${(err as Error).message}`);
    }
  };

  const triggerApiSync = async () => {
    setSyncStatus('syncing');
    setSyncLogs([]);

    try {
      const results = await syncAdsApis(selectedSyncMonth, (log) => {
        setSyncLogs(prev => [...prev, log]);
      });

      const erpSummaryInput = {
        activeBeneficiaries: selectedSyncMonth === '2026-07' ? 10450 : 10320,
        newBeneficiaries: selectedSyncMonth === '2026-07' ? 154 : 142,
        canceledBeneficiaries: selectedSyncMonth === '2026-07' ? 24 : 26,
        leads: selectedSyncMonth === '2026-07' ? 180 : 165,
        conversions: selectedSyncMonth === '2026-07' ? 24 : 21,
        ltv: selectedSyncMonth === '2026-07' ? 1250 : 1200,
        nps: selectedSyncMonth === '2026-07' ? 78 : 76
      };

      const mockChannelsInput = [
        { channel: 'Digital (Inbound)', channelType: 'digital', leads: results.adsLeads, conversions: results.adsConversions },
        { channel: 'Venda Direta (Outbound)', channelType: 'direct', leads: erpSummaryInput.leads - results.adsLeads - 20, conversions: Math.round(erpSummaryInput.conversions * 0.25) },
        { channel: 'Canais / Corretores', channelType: 'partners', leads: 20, conversions: erpSummaryInput.conversions - results.adsConversions - Math.round(erpSummaryInput.conversions * 0.25) }
      ];

      const mockCitiesInput = [
        { city: 'Passos', beneficiaries: erpSummaryInput.activeBeneficiaries - 2050, leads: Math.round(erpSummaryInput.leads * 0.5), conversions: Math.round(erpSummaryInput.conversions * 0.5) },
        { city: 'Itaú de Minas', beneficiaries: 1050, leads: Math.round(erpSummaryInput.leads * 0.2), conversions: Math.round(erpSummaryInput.conversions * 0.2) },
        { city: 'São Seb. Paraíso', beneficiaries: 600, leads: Math.round(erpSummaryInput.leads * 0.15), conversions: Math.round(erpSummaryInput.conversions * 0.15) },
        { city: 'Cássia', beneficiaries: 300, leads: Math.round(erpSummaryInput.leads * 0.1), conversions: Math.round(erpSummaryInput.conversions * 0.1) },
        { city: 'Alpinópolis', beneficiaries: 100, leads: Math.round(erpSummaryInput.leads * 0.05), conversions: Math.round(erpSummaryInput.conversions * 0.05) }
      ];

      upsertMonthData(
        selectedSyncMonth,
        erpSummaryInput,
        results.trafficInput,
        mockChannelsInput,
        mockCitiesInput,
        results.campaignsInput,
        results.investmentsInput
      );

      setSyncStatus('success');
    } catch (err) {
      console.error(err);
      setSyncStatus('error');
    }
  };

  const handleResetDatabase = () => {
    if (confirm('Atenção: Isso excluirá todos os meses importados salvos e redefinirá o banco para a demonstração original (Abril a Junho/2026). Deseja prosseguir?')) {
      resetToDefaultData();
      alert('Banco de dados redefinido com sucesso!');
    }
  };

  // --- ESTADOS DE INTEGRAÇÕES & WEBHOOKS (TERCEIRA TELA) ---
  const [dbType, setDbType] = useState('postgres');
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbTestSuccess, setDbTestSuccess] = useState<boolean | null>(null);
  const [webhookLogs, setWebhookLogs] = useState<any[]>([
    { id: 1, event: 'lead.criado', time: '17:15:02', status: 200, origin: 'Meta Ads Webhook', payload: { leads_id: 'ld_9883', origin: 'Meta Ads Lead Form', name: 'Juliana Silva', email: 'juliana.silva@gmail.com', city: 'Passos' } },
    { id: 2, event: 'venda.completada', time: '17:10:45', status: 200, origin: 'ERP Uniodonto Sync', payload: { plan_id: 'pf_odonto_gold', contract: 'CTR_988132', conversion_channel: 'Digital (Inbound)', holder: 'Carlos Antunes' } }
  ]);
  const [simulatedWebhookCount, setSimulatedWebhookCount] = useState(2);
  const webhookLogContainerRef = useRef<HTMLDivElement>(null);

  const testDbConnection = () => {
    setIsTestingDb(true);
    setDbTestSuccess(null);
    setTimeout(() => {
      setIsTestingDb(false);
      setDbTestSuccess(true);
      setTimeout(() => setDbTestSuccess(null), 5000);
    }, 1500);
  };

  const simulateIncomingWebhook = () => {
    const mockEvents = [
      { event: 'lead.criado', origin: 'Google Ads Webhook', payload: { leads_id: 'ld_' + Math.floor(Math.random() * 9000 + 1000), origin: 'Google Inbound Form', name: ['Renato Souza', 'Mariana Costa', 'Fernando Santos'][Math.floor(Math.random() * 3)], city: ['Passos', 'Itaú de Minas', 'Cássia'][Math.floor(Math.random() * 3)], value_estimated: 120 } },
      { event: 'beneficiario.ativo', origin: 'ERP Uniodonto API', payload: { card_number: '045.' + Math.floor(Math.random() * 90000 + 10000), plan: 'Odonto Master Cooperado', user: 'Fernanda Lima Brandão', value_monthly: 120.00 } },
      { event: 'venda.completada', origin: 'App Vendas Uniodonto', payload: { holder: 'Rodrigo Medeiros', seller_code: 'COR_44', channel: 'Venda Direta', plan: 'Odonto PF Familiar' } }
    ];

    const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
    const date = new Date();
    const timeStr = date.toTimeString().split(' ')[0];

    const newLog = {
      id: simulatedWebhookCount + 1,
      event: randomEvent.event,
      time: timeStr,
      status: 200,
      origin: randomEvent.origin,
      payload: randomEvent.payload
    };

    setWebhookLogs(prev => [...prev, newLog]);
    setSimulatedWebhookCount(prev => prev + 1);

    setTimeout(() => {
      if (webhookLogContainerRef.current) {
        webhookLogContainerRef.current.scrollTop = webhookLogContainerRef.current.scrollHeight;
      }
    }, 50);
  };

  // Renderização da aba Envio Manual
  const renderManualView = () => {
    const months = [
      '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
      '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'
    ];
    const currentIdx = months.indexOf(manualMonth);

    const handlePrevMonth = () => {
      if (currentIdx > 0) setManualMonth(months[currentIdx - 1]);
    };

    const handleNextMonth = () => {
      if (currentIdx < months.length - 1) setManualMonth(months[currentIdx + 1]);
    };

    const formatMonthLabel = (monthStr: string) => {
      const [year, month] = monthStr.split('-');
      const names: Record<string, string> = {
        '01': 'Janeiro',
        '02': 'Fevereiro',
        '03': 'Março',
        '04': 'Abril',
        '05': 'Maio',
        '06': 'Junho',
        '07': 'Julho',
        '08': 'Agosto',
        '09': 'Setembro',
        '10': 'Outubro',
        '11': 'Novembro',
        '12': 'Dezembro'
      };
      return `${names[month] || month}/${year}`;
    };

    // Cálculos de KPI em Tempo Real
    const totalInvestments = formInvestments.reduce((acc, curr) => acc + curr.amount, 0);
    const calculatedCAC = formSummary.newBeneficiaries > 0 ? totalInvestments / formSummary.newBeneficiaries : 0;
    const monthlyRevenue = formSummary.activeBeneficiaries * 120; // 120 R$ ticket médio hipotético
    const calculatedROI = totalInvestments > 0 ? ((monthlyRevenue - totalInvestments) / totalInvestments) * 100 : 0;
    const conversionMeta = formSummary.leads > 0 ? (formSummary.conversions / formSummary.leads) * 100 : 0;
    const generalSatisfaction = formSummary.nps;
    
    // Métricas de Tráfego Reativas de Campanhas
    const totalImpressions = formCampaigns.reduce((acc, curr) => acc + curr.impressions, 0) || 150000;
    const totalClicks = formCampaigns.reduce((acc, curr) => acc + curr.clicks, 0) || 3250;
    const calculatedCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 2.17;
    const calculatedCPC = totalClicks > 0 ? (totalInvestments / totalClicks) : 0.65;
    const totalLeads = formCampaigns.reduce((acc, curr) => acc + curr.leads, 0) || formSummary.leads || 420;
    const totalConversions = formCampaigns.reduce((acc, curr) => acc + curr.conversions, 0) || formSummary.conversions || 86;
    const calculatedCPL = totalLeads > 0 ? totalInvestments / totalLeads : 26.26;

    const steps = [
      { id: 0, title: 'Resumo Geral', desc: 'Dados macro & Cidades' },
      { id: 1, title: 'Investimentos', desc: 'Preenchimento de canais' },
      { id: 2, title: 'Tráfego, Canais & Campanhas', desc: 'Fontes e anúncios' }
    ];

    return (
      <div className="flex flex-col h-full overflow-hidden animate-fadeIn pb-4">
        {/* Sub-Header Horizontal ( Wizard Premium + Botões de Ações ) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 select-none shrink-0">
          {/* Step Indicator horizontal limpo */}
          <div className="flex items-center gap-6 bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-3">
            {steps.map((st, index) => (
              <React.Fragment key={st.id}>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center transition-all ${
                    st.id === 0 
                      ? 'bg-pink-700 text-white' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {st.id + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold text-gray-700 leading-tight">{st.title}</span>
                    <span className="text-[8px] text-gray-400">{st.desc}</span>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 border-t border-dashed border-gray-200"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Botões de Ação Superiores + Seletor de Data */}
          <div className="flex items-center gap-3 self-end lg:self-auto">
            {/* Seletor de Período Cronológico com setas */}
            <div className="relative flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1 shadow-xs mr-2">
              <button 
                onClick={handlePrevMonth}
                disabled={currentIdx === 0}
                className="p-1.5 hover:bg-slate-100 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-gray-500 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold text-gray-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer select-none"
              >
                <Calendar className="w-4 h-4 text-pink-600" />
                <span>{formatMonthLabel(manualMonth)}</span>
              </button>
              <button 
                onClick={handleNextMonth}
                disabled={currentIdx === months.length - 1}
                className="p-1.5 hover:bg-slate-100 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-gray-500 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Popover Dropdown de Meses Premium */}
              {monthDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setMonthDropdownOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 z-50 w-72 bg-white border border-gray-100 rounded-3xl shadow-xl p-4 animate-scaleUp text-left select-none">
                    {/* Cabeçalho de Ano */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDropdownYear(prev => prev - 1); }}
                        className="p-1 hover:bg-slate-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-black text-slate-700 tracking-wide">{dropdownYear}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDropdownYear(prev => prev + 1); }}
                        className="p-1 hover:bg-slate-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Grade de 12 Meses */}
                    <div className="grid grid-cols-3 gap-2">
                      {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((mesNome, idx) => {
                        const monthNum = String(idx + 1).padStart(2, '0');
                        const monthKey = `${dropdownYear}-${monthNum}`;
                        const isSelected = manualMonth === monthKey;
                        const hasData = !!allDashboardData[monthKey];

                        return (
                          <button
                            key={monthKey}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setManualMonth(monthKey);
                              setMonthDropdownOpen(false);
                            }}
                            className={`relative py-2.5 rounded-2xl text-[11px] font-bold text-center transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-gradient-to-r from-pink-700 to-pink-500 text-white font-black shadow-md' 
                                : 'text-gray-500 hover:bg-slate-50 hover:text-gray-700'
                            }`}
                          >
                            <div>{mesNome}</div>
                            {hasData && (
                              <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                                isSelected ? 'bg-white' : 'bg-pink-600'
                              }`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleManualSave}
              className="px-4 py-2 bg-pink-50 hover:bg-pink-100 border border-pink-100 text-pink-700 font-extrabold rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <Save className="w-4 h-4" /> Salvar
            </button>
            <button
              onClick={() => handleTabChange('envio-planilhas')}
              className="px-4 py-2 bg-pink-50 hover:bg-pink-100 border border-pink-100 text-pink-700 font-extrabold rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <UploadCloud className="w-4 h-4" /> Importar Planilha
            </button>
            <button
              onClick={handleManualSave}
              className="px-5 py-2 bg-gradient-to-r from-pink-700 to-pink-500 hover:from-pink-800 hover:to-pink-600 text-white font-extrabold rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer hover:shadow-md active:scale-98 transition-all"
            >
              Próximo <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Painel de Progresso de Fechamento Mensal */}
        {(() => {
          const summaryKeys = ['activeBeneficiaries', 'newBeneficiaries', 'canceledBeneficiaries', 'leads', 'conversions', 'ltv', 'nps'];
          const totalItems = summaryKeys.length + formInvestments.length + (8 + formCampaigns.length);
          const validatedCount = 
            summaryKeys.filter(k => validatedSummary[k]).length +
            formInvestments.filter(inv => validatedInvestments[inv.categoryId]).length +
            Object.values(validatedCampaigns).filter(Boolean).length;
          const pct = totalItems > 0 ? Math.round((validatedCount / totalItems) * 100) : 0;
          const allValidated = pct === 100;
          const hasAny = validatedCount > 0;

          return (
            <div className="mb-4 shrink-0 flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-xs">
              {/* Badge de Status */}
              <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide whitespace-nowrap ${
                allValidated ? 'text-emerald-600' : hasAny ? 'text-pink-700' : 'text-slate-400'
              }`}>
                <span>{allValidated ? '✨' : hasAny ? '⚙️' : '📂'}</span>
                <span>{allValidated ? 'Mês Fechado' : hasAny ? 'Em Andamento' : 'Aguardando'}</span>
              </div>

              {/* Barra de Progresso */}
              <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    allValidated ? 'bg-emerald-500' : 'bg-gradient-to-r from-pink-700 to-pink-400'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Percentual */}
              <span className={`text-[10px] font-black w-9 text-right ${
                allValidated ? 'text-emerald-600' : 'text-slate-500'
              }`}>{pct}%</span>

              {/* Botão Marcar / Limpar Tudo */}
              <button
                type="button"
                onClick={() => {
                  const summaryKeys = ['activeBeneficiaries', 'newBeneficiaries', 'canceledBeneficiaries', 'leads', 'conversions', 'ltv', 'nps'];
                  if (allValidated) {
                    setValidatedSummary({});
                    setValidatedInvestments({});
                    setValidatedCampaigns({});
                  } else {
                    const newSummary: Record<string, boolean> = {};
                    summaryKeys.forEach(k => { newSummary[k] = true; });
                    const newInv: Record<string, boolean> = {};
                    formInvestments.forEach(inv => { newInv[inv.categoryId] = true; });
                    const metricKeys = ['impressions','clicks','ctr','cpc','leads','conversions','agendamentos','vendas'];
                    const newCamp: Record<string, boolean> = {};
                    metricKeys.forEach(k => { newCamp[k] = true; });
                    formCampaigns.forEach(c => { newCamp[c.campaignId] = true; });
                    setValidatedSummary(newSummary);
                    setValidatedInvestments(newInv);
                    setValidatedCampaigns(newCamp);
                  }
                }}
                className={`px-2.5 py-1 text-[9px] font-extrabold rounded-lg cursor-pointer transition-all whitespace-nowrap ${
                  allValidated
                    ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'
                }`}
              >
                {allValidated ? 'Limpar Tudo' : 'Confirmar Tudo'}
              </button>
            </div>
          );
        })()}

        {manualSuccessMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 animate-fadeIn shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-xs font-bold text-emerald-800">{manualSuccessMessage}</p>
          </div>
        )}

        {/* Grid de 3 Colunas Principais (Formulários Lado a Lado) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0 overflow-y-auto lg:overflow-hidden py-1">
          
          {/* COLUNA 1: RESUMO GERAL */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-col h-full min-h-0 overflow-hidden">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
              <FileText className="w-4 h-4 text-pink-700" />
              <div>
                <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Resumo Geral</h3>
                <p className="text-[9px] text-gray-400 font-medium">Indicadores-chave do mês</p>
              </div>
            </div>

            <div className="space-y-2 text-xs flex-grow overflow-y-auto min-h-0 pr-1 scrollbar-hide">
              {([
                { key: 'activeBeneficiaries', label: 'Beneficiários Ativos', unit: 'pessoas', tip: 'Total de beneficiários ativos no ERP Uniodonto no fechamento do mês.' },
                { key: 'newBeneficiaries', label: 'Novas Vendas (Entradas)', unit: 'pessoas', tip: 'Novos contratos e inclusões realizadas no período.' },
                { key: 'canceledBeneficiaries', label: 'Cancelamentos (Exclusões)', unit: 'pessoas', tip: 'Contratos rescindidos ou exclusões de dependentes no período.' },
                { key: 'leads', label: 'Leads Captados', unit: 'leads', tip: 'Total de novas oportunidades geradas no funil de marketing.' },
                { key: 'conversions', label: 'Conversões Efetivas', unit: 'vendas', tip: 'Total de leads que fecharam contrato e se tornaram clientes.' },
                { key: 'ltv', label: 'Lifetime Value (LTV R$)', unit: 'R$', tip: 'LTV estimado em R$ por contrato ativo.' },
                { key: 'nps', label: 'Pontuação NPS (0 a 100)', unit: 'pts', tip: 'Pontuação líquida obtida na pesquisa de NPS do mês.', min: 0, max: 100 },
              ] as { key: keyof typeof formSummary; label: string; unit: string; tip: string; min?: number; max?: number }[]).map(({ key, label, unit, tip, min, max }) => (
                <div key={key} className={`flex items-center justify-between border-b border-slate-50 py-1.5 rounded-lg px-1 transition-all ${
                  validatedSummary[key] ? 'bg-emerald-50/50' : ''
                }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!validatedSummary[key]}
                      onChange={(e) => setValidatedSummary(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="w-3.5 h-3.5 border-gray-300 rounded focus:ring-emerald-500 accent-emerald-600 cursor-pointer shrink-0"
                      title="Confirmar dado do mês"
                    />
                    <span className={`font-medium flex items-center gap-1 ${
                      validatedSummary[key] ? 'text-emerald-700' : 'text-gray-500'
                    }`}>
                      {label}
                      <span className="cursor-help text-gray-300 hover:text-pink-600 transition-colors" title={tip}><Info className="w-3.5 h-3.5" /></span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={(formSummary as any)[key]}
                      min={min}
                      max={max}
                      onChange={(e) => setFormSummary(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                      className="w-24 text-right px-2 py-1 bg-slate-50/50 border border-gray-200 rounded-lg font-bold text-gray-700 focus:outline-none focus:border-pink-500"
                    />
                    <span className="w-14 text-[9px] text-gray-400 font-bold uppercase text-left">{unit}</span>
                  </div>
                </div>
              ))}

              {/* KPIs de Cálculo em Tempo Real baseados nos Inputs */}
              <div className="flex items-center justify-between border-b border-slate-50 py-2.5">
                <span className="font-bold text-slate-500 flex items-center gap-1">
                  Ticket Médio
                  <span className="cursor-help text-gray-300 hover:text-pink-600 transition-colors" title="Valor médio cobrado mensalmente por beneficiário (padrão R$ 120,00)"><Info className="w-3.5 h-3.5" /></span>
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="w-24 text-right font-extrabold text-slate-500 pr-2">120,00</span>
                  <span className="w-14 text-[9px] text-gray-400 font-bold uppercase text-left">R$</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-50 py-2.5">
                <span className="font-bold text-slate-500 flex items-center gap-1">
                  CAC (Custo de Aquisição)
                  <span className="cursor-help text-gray-300 hover:text-pink-600 transition-colors" title="Investimento total dividido pelo número de novas vendas (entradas) no mês."><Info className="w-3.5 h-3.5" /></span>
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="w-24 text-right font-extrabold text-pink-700 pr-2">{calculatedCAC.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className="w-14 text-[9px] text-gray-400 font-bold uppercase text-left">R$</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-50 py-2.5">
                <span className="font-bold text-slate-500 flex items-center gap-1">
                  ROI (Retorno sobre Invest.)
                  <span className="cursor-help text-gray-300 hover:text-pink-600 transition-colors" title="Retorno financeiro estimado com base no LTV e total investido."><Info className="w-3.5 h-3.5" /></span>
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className={`w-24 text-right font-extrabold pr-2 ${calculatedROI >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{calculatedROI.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className="w-14 text-[9px] text-gray-400 font-bold uppercase text-left">%</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-50 py-2.5">
                <span className="font-bold text-slate-500 flex items-center gap-1">
                  Meta de Conversão
                  <span className="cursor-help text-gray-300 hover:text-pink-600 transition-colors" title="Taxa média de conversão (Conversões Efetivas / Leads)."><Info className="w-3.5 h-3.5" /></span>
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="w-24 text-right font-extrabold text-indigo-600 pr-2">{conversionMeta.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className="w-14 text-[9px] text-gray-400 font-bold uppercase text-left">%</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="font-bold text-slate-500 flex items-center gap-1">
                  Satisfação Geral
                  <span className="cursor-help text-gray-300 hover:text-pink-600 transition-colors" title="Indicador percentual de satisfação geral baseado na pontuação NPS."><Info className="w-3.5 h-3.5" /></span>
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="w-24 text-right font-extrabold text-emerald-600 pr-2">{generalSatisfaction}</span>
                  <span className="w-14 text-[9px] text-gray-400 font-bold uppercase text-left">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA 2: INVESTIMENTOS */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-col h-full min-h-0 overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-pink-700" />
                <div>
                  <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Investimentos</h3>
                  <p className="text-[9px] text-gray-400 font-medium">Despesas por canal / fonte</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleAddInvestment}
                className="px-2.5 py-1 text-[9px] font-extrabold text-pink-700 bg-pink-50 border border-pink-100 hover:bg-pink-100 rounded-lg cursor-pointer flex items-center gap-1 transition-all"
              >
                <Plus className="w-3 h-3" /> Adicionar
              </button>
            </div>

            {/* Listagem Dinâmica scrollable */}
            <div className="flex-grow overflow-y-auto min-h-0 space-y-2 pr-1 custom-scrollbar py-1">
              <table className="w-full text-xs text-slate-600 text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 font-extrabold text-slate-400 text-[8px] uppercase">
                    <th className="pb-1 w-8 text-center">
                      <input
                        type="checkbox"
                        checked={formInvestments.length > 0 && formInvestments.every(inv => validatedInvestments[inv.categoryId])}
                        onChange={(e) => {
                          const next: Record<string, boolean> = {};
                          formInvestments.forEach(inv => { next[inv.categoryId] = e.target.checked; });
                          setValidatedInvestments(next);
                        }}
                        className="w-3.5 h-3.5 border-gray-300 rounded focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                        title="Selecionar todos"
                      />
                    </th>
                    <th className="pb-1 w-[38%]">Canal / Fonte</th>
                    <th className="pb-1 w-[16%]">Categoria</th>
                    <th className="pb-1 text-center w-12">Fixo</th>
                    <th className="pb-1 text-right w-[22%]">Valor (R$)</th>
                    <th className="pb-1 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {formInvestments.map((inv) => (
                    <InvestmentRow
                      key={inv.categoryId}
                      inv={inv}
                      isAudited={!!validatedInvestments[inv.categoryId]}
                      onToggleAudit={() => setValidatedInvestments(prev => ({ ...prev, [inv.categoryId]: !prev[inv.categoryId] }))}
                      handleUpdateInvestment={handleUpdateInvestment}
                      handleRemoveInvestment={handleRemoveInvestment}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Investido no rodapé do card */}
            <div className="border-t border-slate-100 pt-4 mt-auto select-none">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Investido</span>
                <span className="text-lg font-black text-pink-700">
                  {totalInvestments.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          </div>

          {/* COLUNA 3: TRÁFEGO, CANAIS & CAMPANHAS */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-col h-full min-h-0 overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pink-700" />
                <div>
                  <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Tráfego, Canais & Campanhas</h3>
                  <p className="text-[9px] text-gray-400 font-medium">Métricas de performance por fonte</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddCampaign}
                className="px-2.5 py-1 text-[9px] font-extrabold text-pink-700 bg-pink-50 border border-pink-100 hover:bg-pink-100 rounded-lg cursor-pointer flex items-center gap-1 transition-all"
              >
                <Plus className="w-3 h-3" /> Adicionar
              </button>
            </div>

            {/* Métricas e Campanhas scrollable */}
            <div className="flex-grow overflow-y-auto min-h-0 space-y-3 pr-1 scrollbar-hide py-1">
              <table className="w-full text-xs text-slate-600 text-left">
                <thead>
                  <tr className="border-b border-slate-100 font-extrabold text-slate-400 text-[8px] uppercase">
                    <th className="pb-1 w-8 text-center">
                      <input
                        type="checkbox"
                        checked={(() => {
                          const metricKeys = ['impressions','clicks','ctr','cpc','leads','conversions','agendamentos','vendas'];
                          const allKeys = [...metricKeys, ...formCampaigns.map(c => c.campaignId)];
                          return allKeys.length > 0 && allKeys.every(k => validatedCampaigns[k]);
                        })()}
                        onChange={(e) => {
                          const metricKeys = ['impressions','clicks','ctr','cpc','leads','conversions','agendamentos','vendas'];
                          const next: Record<string, boolean> = {};
                          metricKeys.forEach(k => { next[k] = e.target.checked; });
                          formCampaigns.forEach(c => { next[c.campaignId] = e.target.checked; });
                          setValidatedCampaigns(next);
                        }}
                        className="w-3.5 h-3.5 border-gray-300 rounded focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                        title="Selecionar todos"
                      />
                    </th>
                    <th className="pb-1">Nome / Métrica</th>
                    <th className="pb-1 w-1/4">Categoria / Canal</th>
                    <th className="pb-1 text-right">Valor / Métrica</th>
                    <th className="pb-1 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Métricas Globais com checkboxes de auditoria */}
                  {([
                    { metricKey: 'impressions', label: 'Impressões', cat: 'Todos', value: `${totalImpressions.toLocaleString('pt-BR')}`, unit: 'imp.' },
                    { metricKey: 'clicks', label: 'Cliques', cat: 'Todos', value: `${totalClicks.toLocaleString('pt-BR')}`, unit: 'cliques' },
                    { metricKey: 'ctr', label: 'CTR', cat: 'Todos', value: `${calculatedCTR.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, unit: '%' },
                    { metricKey: 'cpc', label: 'CPC', cat: 'Todos', value: calculatedCPC.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), unit: '' },
                    { metricKey: 'leads', label: 'Leads por Canal', cat: 'Todos', value: `${totalLeads}`, unit: 'leads' },
                    { metricKey: 'conversions', label: 'Conversões por Canal', cat: 'Todos', value: `${totalConversions}`, unit: 'vendas' },
                    { metricKey: 'agendamentos', label: 'Agendamentos', cat: 'Todos', value: `${Math.round(totalConversions * 1.25)}`, unit: 'agend.' },
                    { metricKey: 'vendas', label: 'Vendas', cat: 'Todos', value: `${totalConversions}`, unit: 'vendas' },
                  ]).map(({ metricKey, label, cat, value, unit }) => (
                    <tr key={metricKey} className={`border-b border-slate-50/50 font-medium transition-all ${
                      validatedCampaigns[metricKey] ? 'bg-emerald-50/40 hover:bg-emerald-50/60' : 'hover:bg-slate-50/20'
                    }`}>
                      <td className="py-1.5 text-center">
                        <input
                          type="checkbox"
                          checked={!!validatedCampaigns[metricKey]}
                          onChange={(e) => setValidatedCampaigns(prev => ({ ...prev, [metricKey]: e.target.checked }))}
                          className="w-3.5 h-3.5 border-gray-300 rounded focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                          title="Confirmar métrica do mês"
                        />
                      </td>
                      <td className={`py-1.5 font-semibold ${ validatedCampaigns[metricKey] ? 'text-emerald-700' : 'text-gray-700' }`}>{label}</td>
                      <td className="py-1.5 text-gray-400 font-bold uppercase text-[9px]">{cat}</td>
                      <td className="py-1.5 text-right font-mono font-bold text-gray-700">{value} {unit && <span className="text-[9px] text-gray-400">{unit}</span>}</td>
                      <td className="py-1.5 text-center"></td>
                    </tr>
                  ))}

                  {/* Campanhas de Anúncios */}
                  {formCampaigns.map((c) => (
                    <tr key={c.campaignId} className={`border-b border-slate-50/50 transition-all ${
                      validatedCampaigns[c.campaignId] ? 'bg-emerald-50/40 hover:bg-emerald-50/60' : 'hover:bg-slate-50/20'
                    }`}>
                      <td className="py-1 text-center">
                        <input
                          type="checkbox"
                          checked={!!validatedCampaigns[c.campaignId]}
                          onChange={(e) => setValidatedCampaigns(prev => ({ ...prev, [c.campaignId]: e.target.checked }))}
                          className="w-3.5 h-3.5 border-gray-300 rounded focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                          title="Confirmar campanha do mês"
                        />
                      </td>
                      <td className={`py-1 font-semibold ${ validatedCampaigns[c.campaignId] ? 'text-emerald-700' : 'text-indigo-950' }`}>
                        <input
                          type="text"
                          value={c.campaignName}
                          onChange={(e) => handleUpdateCampaign(c.campaignId, 'campaignName', e.target.value)}
                          className="w-full px-1.5 py-0.5 border border-transparent hover:border-gray-200 focus:border-pink-500 rounded bg-transparent font-semibold focus:outline-none"
                        />
                      </td>
                      <td className="py-1">
                        <select
                          value={c.platform}
                          onChange={(e) => handleUpdateCampaign(c.campaignId, 'platform', e.target.value)}
                          className="px-1 py-0.5 border border-transparent hover:border-gray-200 rounded text-[10px] font-semibold text-gray-500 focus:outline-none"
                        >
                          <option value="Google Ads">Google Ads</option>
                          <option value="Meta Ads">Meta Ads</option>
                          <option value="Offline">Offline</option>
                          <option value="Online">Online</option>
                        </select>
                      </td>
                      <td className="py-1 text-right">
                        <input
                          type="number"
                          value={c.clicks === 0 ? '' : c.clicks}
                          placeholder="Cliques"
                          onChange={(e) => handleUpdateCampaign(c.campaignId, 'clicks', Number(e.target.value))}
                          className="w-16 text-right px-1 py-0.5 border border-transparent hover:border-gray-200 focus:border-pink-500 rounded bg-transparent font-mono font-semibold text-gray-700 focus:outline-none"
                        />
                      </td>
                      <td className="py-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveCampaign(c.campaignId)}
                          className="text-gray-300 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  <tr className="hover:bg-slate-50/20 font-bold text-pink-700">
                    <td className="py-2 text-center"></td>
                    <td className="py-2 text-pink-700 font-extrabold">Custo por Lead</td>
                    <td className="py-2 text-gray-400 font-bold uppercase text-[9px]">Todos</td>
                    <td className="py-2 text-right font-mono font-black">{calculatedCPL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td className="py-2 text-center"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Rodapé Operacional (Metadados + Rascunho Salvo) */}
        <div className="border-t border-slate-100 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 select-none">
          {/* Canto Esquerdo: Última Atualização + Histórico */}
          <div className="flex items-center gap-4 text-[10px] text-gray-400">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span>Última atualização: 05/05/2026 08:30</span>
            </div>
            <button
              onClick={() => alert('Histórico de envio de dados carregado com sucesso!')}
              className="px-2.5 py-1 border border-gray-200 hover:border-pink-200 font-semibold rounded-lg hover:bg-pink-50/20 cursor-pointer text-gray-500 transition-colors"
            >
              Histórico de Envio
            </button>
          </div>

          {/* Canto Direito: Rascunho Salvo */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-3 py-1.5 rounded-xl">
            <Check className="w-3.5 h-3.5" />
            <span>Rascunho salvo automaticamente 08:30:45</span>
          </div>
        </div>
      </div>
    );
  };

  // Renderização da aba Planilhas & APIs
  const renderSpreadsheetView = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-y-auto pr-1 animate-fadeIn">
        {/* Bloco 1: Upload de Planilha Local (Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-6 flex flex-col h-fit">
            <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4 select-none">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-6 h-6 text-pink-700" />
                <h2 className="text-lg font-bold text-gray-800 font-sans">Carregar Planilha Real (XLSX / CSV)</h2>
              </div>
              <span className="text-[10px] bg-pink-50 text-pink-700 font-semibold px-2 py-0.5 rounded-full">
                SheetJS Engine Ativa
              </span>
            </div>

            {/* Área Drag & Drop */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`w-full min-h-[180px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all duration-300 relative select-none ${
                dragActive
                  ? 'border-pink-500 bg-pink-50/30'
                  : file
                  ? uploadStatus === 'success'
                    ? 'border-emerald-500 bg-emerald-50/5'
                    : 'border-red-500 bg-red-50/5'
                  : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/10'
              }`}
            >
              {uploadStatus !== 'loading' && (
                <input
                  type="file"
                  onChange={handleFileInput}
                  accept=".xlsx, .xls, .csv"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
              )}
              
              {uploadStatus === 'loading' ? (
                <div className="flex flex-col items-center z-10">
                  <div className="w-10 h-10 border-4 border-pink-700 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <h3 className="text-sm font-bold text-gray-800">Interpretando arquivo...</h3>
                  <p className="text-xs text-gray-400 mt-1">Lendo abas de dados e rodando validação matemática</p>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm ${
                    uploadStatus === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                  }`}>
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">{file.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB — Mês Detectado: <span className="font-semibold text-gray-700">{parsedData?.month || 'Indefinido'}</span>
                  </p>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFile(null);
                      setParsedData(null);
                      setUploadStatus('idle');
                      setValidationErrors([]);
                      setValidationWarnings([]);
                    }}
                    className="mt-2 text-xs text-red-500 hover:underline cursor-pointer z-30 font-medium"
                  >
                    Selecionar outro arquivo
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-700 mb-3 shadow-sm">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">Arraste sua planilha real aqui</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    ou clique para selecionar do computador (.xlsx, .csv)
                  </p>
                </div>
              )}
            </div>

            {/* Quadro de Validação Avançada */}
            {(validationErrors.length > 0 || validationWarnings.length > 0) && (
              <div className="mt-5 p-4 border rounded-2xl bg-gray-50/50 border-gray-100 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider select-none">
                  <AlertCircle className="w-4 h-4 text-gray-600" /> Relatório do Validador de Anomalias
                </h3>
                
                {/* Erros Impeditivos */}
                {validationErrors.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[11px] font-bold text-red-700 uppercase flex items-center gap-1">
                      ❌ Erros Críticos (Importação Bloqueada)
                    </h4>
                    <ul className="text-xs text-red-600 list-disc pl-5 space-y-1">
                      {validationErrors.map((err, i) => (
                        <li key={i}>{err.message}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Avisos Não Impeditivos */}
                {validationWarnings.length > 0 && (
                  <div className="flex flex-col gap-2 border-t border-gray-100 pt-2">
                    <h4 className="text-[11px] font-bold text-amber-700 uppercase flex items-center gap-1">
                      ⚠️ Alertas e Divergências de Negócio
                    </h4>
                    <ul className="text-xs text-amber-600 list-disc pl-5 space-y-1">
                      {validationWarnings.map((war, i) => (
                        <li key={i}>{war.message}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Ações pós processamento */}
            {file && uploadStatus === 'success' && parsedData && (
              <button
                onClick={commitImport}
                className="w-full mt-5 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:scale-102 hover:shadow-lg active:scale-98 transition-all duration-200 cursor-pointer text-xs uppercase tracking-wider"
              >
                Confirmar e Gravar Mês {parsedData.month} no Dashboard
              </button>
            )}

            {file && uploadStatus === 'error' && validationErrors.length > 0 && (
              <div className="w-full mt-4 py-3 bg-red-50 text-red-700 text-center font-bold rounded-xl text-xs uppercase tracking-wider select-none border border-red-100">
                Corrija os erros na planilha para permitir a gravação
              </div>
            )}
          </div>

          {/* Seção 2: Conexão Direta via APIs de Ads */}
          <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-6 flex flex-col h-fit">
            <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-4 select-none">
              <div className="flex items-center gap-2">
                <Server className="w-6 h-6 text-pink-700" />
                <h2 className="text-lg font-bold text-gray-800 font-sans">Sincronização Direta de APIs de Ads</h2>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                Google & Meta Integrados
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Evite o trabalho manual de exportar planilhas de marketing. Conecte-se e sincronize custos e métricas das campanhas diretamente para o banco local.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-4 select-none">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Período para Sincronizar</label>
                <select
                  value={selectedSyncMonth}
                  onChange={(e) => setSelectedSyncMonth(e.target.value)}
                  disabled={syncStatus === 'syncing'}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 bg-[#F8F9FA] focus:outline-none cursor-pointer disabled:opacity-50"
                >
                  <option value="2026-06">Junho/2026</option>
                  <option value="2026-07">Julho/2026</option>
                  <option value="2026-08">Agosto/2026</option>
                </select>
              </div>

              <button
                onClick={triggerApiSync}
                disabled={syncStatus === 'syncing'}
                className="mt-4 py-2.5 px-5 bg-gradient-to-r from-pink-700 to-pink-500 text-white font-bold rounded-xl shadow-md active:scale-95 hover:shadow-lg disabled:opacity-50 transition-all duration-200 cursor-pointer text-xs flex items-center gap-2"
              >
                {syncStatus === 'syncing' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Sincronizar APIs de Anúncios
                  </>
                )}
              </button>
            </div>

            {/* Janela de Logs (Visual Premium Terminal) */}
            {syncLogs.length > 0 && (
              <div className="mt-2 flex flex-col bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-inner">
                <div className="bg-gray-800/80 px-4 py-2 border-b border-gray-800 flex justify-between items-center select-none">
                  <span className="text-[10px] font-mono font-bold text-gray-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-pulse"></span>
                    CONSOLE_PIPELINE.LOG
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                  </div>
                </div>

                <div 
                  ref={logContainerRef}
                  className="p-4 h-[160px] overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col gap-1 text-gray-300"
                >
                  {syncLogs.map((log, i) => (
                    <div key={i} className="flex gap-2 text-left">
                      <span className="text-gray-500 font-medium">[{log.timestamp}]</span>
                      <span className={
                        log.type === 'success' ? 'text-emerald-400 font-semibold' :
                        log.type === 'warning' ? 'text-amber-400 font-semibold' :
                        log.type === 'error' ? 'text-red-400 font-semibold' : 'text-gray-300'
                      }>
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {syncStatus === 'success' && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 animate-fadeIn text-left">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-[11px] text-emerald-800 font-medium">
                  Excelente! Os dados de Ads de <b>{selectedSyncMonth}</b> foram obtidos, calculados e inseridos no dashboard. Abra os filtros de meses para visualizar.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bloco 2: Painel Lateral de Suporte (Span 1) */}
        <div className="flex flex-col gap-6 select-none">
          {/* Instruções */}
          <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-6">
            <h2 className="text-md font-bold text-gray-800 mb-3 border-b border-gray-50 pb-2 text-left">Instruções de Importação</h2>
            <ul className="space-y-3 text-xs text-gray-500 list-disc pl-4 leading-relaxed font-sans text-left">
              <li>
                O arquivo de envio real deve conter as abas específicas: 
                <b>"Resumo"</b>, <b>"Tráfego"</b>, <b>"Canais"</b>, <b>"Cidades"</b>, <b>"Campanhas"</b> e <b>"Investimentos"</b>.
              </li>
              <li>A coluna <b>"Mês"</b> na aba Resumo define em qual seletor cronológico o registro se instalará (Formato YYYY-MM).</li>
              <li>O validador acusará erros caso encontre taxas logicamente inconsistentes ou NPS fora do intervalo regulamentar.</li>
              <li>Evite fórmulas cruzadas complexas que façam referências a pastas locais de seu computador.</li>
            </ul>

            <button
              onClick={downloadExcelTemplate}
              className="w-full mt-6 py-3 border border-pink-700 text-pink-700 font-bold rounded-xl hover:bg-pink-50 active:scale-98 transition-all duration-200 cursor-pointer text-xs flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Baixar Planilha Modelo Oficial
            </button>
          </div>

          {/* Configurações Locais */}
          <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-6">
            <h2 className="text-md font-bold text-gray-800 mb-3 border-b border-gray-50 pb-2 text-left">Configurações Locais</h2>
            <p className="text-xs text-gray-500 leading-relaxed font-sans mb-4 text-left">
              Os dados modificados e as importações são persistidos automaticamente em seu navegador local via LocalStorage.
            </p>
            
            <button
              onClick={handleResetDatabase}
              className="w-full py-3 bg-red-50 text-red-700 border border-red-100 font-bold rounded-xl hover:bg-red-100/50 active:scale-98 transition-all duration-200 cursor-pointer text-xs flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Resetar Banco de Dados Local
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Renderização da aba Integrações & Webhooks
  const renderWebhookView = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-y-auto pr-1 animate-fadeIn">
        {/* Bloco de Conexão de Banco de Dados */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-6 flex flex-col h-fit">
            <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-4 select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Conexão de Banco de Dados de Produção</h2>
                  <p className="text-xs text-gray-400 font-sans">Vincule o banco de dados ERP da Cooperativa para sincronizações programadas</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                Sincronismo Seguro (SSL)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase">Tecnologia do Banco</label>
                <select
                  value={dbType}
                  onChange={(e) => setDbType(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-slate-50 focus:outline-none cursor-pointer hover:bg-slate-100"
                >
                  <option value="postgres">PostgreSQL (Recomendado)</option>
                  <option value="mysql">MySQL Server</option>
                  <option value="sqlserver">Microsoft SQL Server</option>
                  <option value="salesforce">Salesforce CRM Connector</option>
                  <option value="hubspot">Hubspot Marketing Database</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase">Servidor / Host IP</label>
                <input
                  type="text"
                  placeholder="db.uniodontopassos.com.br"
                  defaultValue="192.168.10.45"
                  className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 bg-slate-50 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase">Porta</label>
                <input
                  type="text"
                  defaultValue={dbType === 'postgres' ? '5432' : dbType === 'mysql' ? '3306' : '1433'}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 bg-slate-50 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase">Nome do Banco de Dados</label>
                <input
                  type="text"
                  defaultValue="uniodonto_passos_erp"
                  className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 bg-slate-50 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase">Usuário de Leitura (BI)</label>
                <input
                  type="text"
                  defaultValue="usr_bi_read"
                  className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 bg-slate-50 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase">Senha</label>
                <input
                  type="password"
                  defaultValue="••••••••••••••••"
                  disabled
                  className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-400 bg-slate-100 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={testDbConnection}
                disabled={isTestingDb}
                className="py-2.5 px-5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 select-none"
              >
                {isTestingDb ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Testando conexão...
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    Testar Conexão com o Banco
                  </>
                )}
              </button>
            </div>

            {dbTestSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 animate-fadeIn text-left">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-[11px] text-emerald-800 font-semibold leading-relaxed">
                  Conexão estabelecida com sucesso! O túnel SSL criptografado validou o acesso de leitura técnica à tabela <code>beneficiarios_consolidado</code>.
                </p>
              </div>
            )}
          </div>

          {/* Seletor e logs de Webhooks */}
          <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-6 flex flex-col h-fit">
            <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-4 select-none">
              <div className="flex items-center gap-2">
                <Cpu className="w-6 h-6 text-pink-700 animate-spin-slow" />
                <h2 className="text-lg font-bold text-gray-800 font-sans">Webhooks de Integração Automática (MOCK)</h2>
              </div>
              <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2.5 py-0.5 rounded-full">
                API v1.3
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-5 text-left">
              Webhooks permitem que sistemas externos (como formulários de leads do WordPress, ferramentas de CRM ou Apps de corretores) empurrem dados em tempo real para o dashboard.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-3 mb-5 select-none text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Endpoint URL de Recebimento</label>
                <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden p-1">
                  <span className="bg-slate-50 px-2 py-1.5 font-mono text-[9px] font-bold text-gray-400 rounded-lg flex items-center uppercase">POST</span>
                  <input
                    type="text"
                    readOnly
                    value="https://api.uni-passos.com.br/v1/integrations/webhook/d0f81d898ecc"
                    className="flex-grow px-2 py-1 bg-white font-mono text-[10px] text-gray-500 border-none outline-none focus:ring-0 select-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Eventos Escutados</label>
                <div className="flex flex-wrap gap-2.5 mt-1 text-[11px] font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-1 rounded-xl shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> lead.criado
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-1 rounded-xl shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> beneficiario.ativo
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-1 rounded-xl shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> venda.completada
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={simulateIncomingWebhook}
                className="py-2.5 px-5 bg-gradient-to-r from-pink-700 to-pink-500 text-white font-bold rounded-xl text-xs hover:shadow-lg active:scale-98 cursor-pointer transition-all flex items-center gap-2 select-none"
              >
                <Play className="w-4 h-4 fill-current" />
                Simular Chamada de Webhook Externa (Novo Registro)
              </button>
            </div>

            {/* Console de Webhooks */}
            {webhookLogs.length > 0 && (
              <div className="mt-5 flex flex-col bg-[#0b0f19] border border-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-[#111827] px-4 py-2.5 border-b border-slate-900 flex justify-between items-center select-none">
                  <span className="text-[10px] font-mono font-bold text-gray-400 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-pink-500 animate-pulse" />
                    CONEXÃO_WEBHOOK_RECEIVER.EXE
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                </div>

                <div 
                  ref={webhookLogContainerRef}
                  className="p-4 h-[220px] overflow-y-auto font-mono text-[10px] leading-relaxed flex flex-col gap-3 text-slate-300"
                >
                  {webhookLogs.map((log) => (
                    <div key={log.id} className="border-b border-slate-800/60 pb-3 last:border-b-0 last:pb-0 text-left">
                      <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 mb-1.5">
                        <span className="flex items-center gap-1">
                          <span className="text-emerald-400">⚡ EVENT_RECEIVED</span> | [{log.time}]
                        </span>
                        <span className="bg-emerald-950/80 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-900">HTTP {log.status}</span>
                      </div>
                      <div className="mb-1 text-slate-400">
                        <span className="font-bold text-pink-500">Evento: </span><code>{log.event}</code> | <span className="font-bold text-blue-400">Origem: </span>{log.origin}
                      </div>
                      <div className="bg-black/40 p-2 rounded-xl text-left border border-slate-800/30 overflow-x-auto">
                        <pre className="text-emerald-400 font-mono text-[9px]">{JSON.stringify(log.payload, null, 2)}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informações da integração e manual lateral */}
        <div className="flex flex-col gap-6 select-none">
          <div className="bg-white rounded-3xl border border-gray-100 card-shadow p-6">
            <h2 className="text-md font-bold text-gray-800 mb-3 border-b border-gray-50 pb-2 text-left">Integração sem Complicações</h2>
            <p className="text-xs text-gray-500 leading-relaxed font-sans mb-4 text-left">
              Utilize o console de Webhooks ao lado para realizar simulações e validar payloads. No ambiente real, a estrutura JSON exibida no terminal é a mesma necessária para atualizar os dados de leads e beneficiários do dashboard em tempo real.
            </p>
            <div className="flex items-center gap-2.5 bg-blue-50/50 border border-blue-100/60 p-3 rounded-2xl text-left">
              <Globe className="w-5 h-5 text-blue-600 shrink-0" />
              <span className="text-[10px] text-blue-800 font-semibold leading-relaxed">
                Nossa documentação Swagger oficial da API está disponível no repositório técnico local da Uniodonto.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-grow overflow-hidden p-5 bg-[#F8F9FA] flex flex-col h-full max-h-screen page-transition">
      <header className="mb-5 shrink-0 flex justify-between items-center select-none">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Envio e Integração de Dados</h1>
          <p className="text-sm text-gray-500 mt-1">
            Consolide métricas reais manualmente, importe planilhas de marketing ou integre endpoints automatizados.
          </p>
        </div>
      </header>

      {/* TABS SELECTOR (ABAS HORIZONTAIS PREMIUM) */}
      <div className="flex border-b border-gray-200 mb-5 shrink-0 select-none">
        <button
          onClick={() => handleTabChange('envio-manual')}
          className={`pb-3 px-6 text-sm font-extrabold cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'envio-manual'
              ? 'border-pink-700 text-pink-700 scale-102 font-black'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <FileText className="w-4 h-4" /> Envio Manual
        </button>
        <button
          onClick={() => handleTabChange('envio-planilhas')}
          className={`pb-3 px-6 text-sm font-extrabold cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'envio-planilhas'
              ? 'border-pink-700 text-pink-700 scale-102 font-black'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" /> Planilhas & APIs
        </button>
        <button
          onClick={() => handleTabChange('envio-conexoes')}
          className={`pb-3 px-6 text-sm font-extrabold cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'envio-conexoes'
              ? 'border-pink-700 text-pink-700 scale-102 font-black'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Database className="w-4 h-4" /> Integrações & Webhooks
        </button>
      </div>

      {importMessage && activeTab === 'envio-planilhas' && (
        <div className="mb-4 shrink-0 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-bold text-emerald-800">{importMessage}</p>
        </div>
      )}

      {/* Renderizador de visualizações */}
      <div className="flex-grow overflow-hidden flex flex-col h-full min-h-0">
        {activeTab === 'envio-manual' && renderManualView()}
        {activeTab === 'envio-planilhas' && renderSpreadsheetView()}
        {activeTab === 'envio-conexoes' && renderWebhookView()}
      </div>
    </div>
  );
};

export default DataUpload;
