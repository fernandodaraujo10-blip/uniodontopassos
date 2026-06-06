import React from 'react';
import { X, ShieldCheck, FileText, Calendar } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  acceptLabel?: string;
  title?: string;
  subtitle?: string;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  acceptLabel = 'Entendi e Declaro Ciente',
  title = 'Política de Privacidade',
  subtitle = 'Atualização: Junho/2026',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-fadeIn">
      {/* Container Principal do Modal */}
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-7 max-w-2xl w-full max-h-[85vh] border border-gray-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(136,14,79,0.08)] text-slate-800 dark:text-slate-100 animate-modal flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 shrink-0 select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/40 flex items-center justify-center text-pink-700 dark:text-pink-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-md sm:text-lg font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-1.5">
                {title}
              </h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3" /> {subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center justify-center cursor-pointer focus:outline-none"
            aria-label="Fechar Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo de Texto com Scroll Premium */}
        <div className="flex-grow overflow-y-auto pr-2 space-y-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold scrollbar-thin scrollbar-thumb-pink-100 scrollbar-track-transparent">
          
          <div className="p-3 bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100/30 dark:border-pink-900/20 rounded-2xl flex items-start gap-3">
            <FileText className="w-4 h-4 text-pink-700 dark:text-pink-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-pink-900 dark:text-pink-300">
              Esta política regulamenta como a aplicação processa suas credenciais e planilhas, em estrita conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018</strong>.
            </p>
          </div>

          <section className="space-y-2">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">1. Finalidade do Tratamento</h4>
            <p>
              O Dashboard coleta e processa uma quantidade mínima de informações pessoais, exclusivamente para fins de segurança e controle de acessos:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Dados Cadastrados:</strong> Nome Completo, Cargo, E-mail Corporativo, Nome de Usuário e Hash Criptográfico de Senhas.</li>
              <li><strong>Finalidade Exclusiva:</strong> Autenticar operadores autorizados e auditar logs de acessos administrativos.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">2. Criptografia & Anonimização (Art. 12 LGPD)</h4>
            <p>
              Adotamos medidas rígidas de segurança técnica:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Hashes Criptográficos:</strong> Senhas são criptografadas localmente via hash irreversível <strong>SHA-256</strong>. Nenhuma senha trafega ou é salva em texto limpo.</li>
              <li><strong>Mascaramento de Contatos:</strong> E-mails são mascarados na listagem pública (ex: <code>el***@uniodonto.com</code>) para prevenir extração indevida de dados.</li>
              <li><strong>Higienização Automática de Planilhas:</strong> O processador local elimina instantaneamente colunas com dados pessoais (PII) de pacientes (Nomes, CPFs, E-mails), retendo apenas dados numéricos e agregadores demográficos estatísticos.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">3. Compartilhamento de Dados</h4>
            <p>
              Não compartilhamos, vendemos, licenciamos ou transmitimos credenciais ou dados estatísticos corporativos para nenhum parceiro externo ou banco de dados terceirizado. As informações permanecem isoladas no <code>localStorage</code> seguro do seu próprio navegador e na infraestrutura reativa privada da cooperativa.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">4. Retenção & Exclusão</h4>
            <p>
              As credenciais administrativas são mantidas apenas durante o período de prestação de serviço ou vínculo laboral ativo com a cooperativa. A exclusão de um operador no painel pelo administrador de TI apaga os dados locais e reativos de forma instantânea e definitiva, sem retenção residual.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">5. Direitos do Titular (Art. 18 LGPD)</h4>
            <p>
              Como titular, você tem direito ao acesso facilitado, correção imediata (via aba "Meu Perfil" em Configurações) ou exclusão permanente de seus dados a qualquer momento solicitando ao administrador do sistema ou ao Encarregado de Dados (DPO) da Uniodonto Passos.
            </p>
          </section>
        </div>

        {/* Rodapé do Modal com Botão de Ação */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 flex justify-end shrink-0 select-none">
          <button
            onClick={() => {
              onAccept?.();
              onClose();
            }}
            className="py-2.5 px-6 bg-gradient-to-r from-pink-700 to-pink-500 hover:scale-[1.02] active:scale-[0.98] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-pink-100 dark:shadow-none transition-all cursor-pointer"
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
