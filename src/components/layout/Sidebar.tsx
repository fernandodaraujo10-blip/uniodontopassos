import React, { useEffect, useState } from 'react';
import { 
  LayoutGrid, 
  BarChart3, 
  Send, 
  HelpCircle, 
  LogOut, 
  ChevronLeft, 
  ChevronDown, 
  ChevronRight, 
  Edit3, 
  UploadCloud, 
  Server,
  Settings
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });

  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);
  
  // Estado para controlar a abertura das opções de envio
  const [isEnvioOpen, setIsEnvioOpen] = useState<boolean>(() => {
    return currentPage.startsWith('envio');
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);

  // Se a página atual mudar externamente para envio, garante que o acordeão se abra
  useEffect(() => {
    if (currentPage.startsWith('envio')) {
      setIsEnvioOpen(true);
    }
  }, [currentPage]);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
    // Dispara evento resize após a transição da barra lateral (300ms) para que os gráficos se recalculem
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 305);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'envio', label: 'Envio e Integração', icon: Send },
  ];

  return (
    <>
      <aside
        className={`sidebar-gradient flex-shrink-0 flex flex-col text-white transition-all duration-300 ease-in-out relative ${
          isCollapsed ? 'w-[76px]' : 'w-64'
        }`}
      >
        {/* Botão de recolher/expandir barra lateral */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-8 z-50 w-6 h-6 bg-white text-pink-700 border border-pink-100 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 focus:outline-none hover:bg-pink-50 cursor-pointer"
          aria-label={isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Header da Sidebar */}
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center px-0' : 'space-x-3'}`}>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-700 font-bold text-xl shadow-md transition-transform duration-300 hover:scale-105 flex-shrink-0">
            U
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-lg tracking-wide transition-all duration-300 whitespace-nowrap">
              Uniodonto Passos
            </span>
          )}
        </div>

        {/* Menu de Navegação */}
        <nav className={`mt-8 flex-grow space-y-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isEnvio = item.id === 'envio';
            const isActive = currentPage === item.id || (isEnvio && currentPage.startsWith('envio'));
            
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => {
                    if (isEnvio) {
                      if (isCollapsed) {
                        setCurrentPage('envio-manual');
                      } else {
                        setIsEnvioOpen(prev => !prev);
                        if (!currentPage.startsWith('envio')) {
                          setCurrentPage('envio-manual');
                        }
                      }
                    } else {
                      setCurrentPage(item.id);
                    }
                  }}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 text-left cursor-pointer ${
                    isActive
                      ? 'bg-white/20 font-semibold'
                      : 'hover:bg-white/10 opacity-80 hover:opacity-100'
                  } ${isCollapsed ? 'justify-center' : 'justify-between space-x-3'}`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium whitespace-nowrap text-sm">{item.label}</span>
                    )}
                  </div>
                  {!isCollapsed && isEnvio && (
                    <div className="transition-transform duration-200">
                      {isEnvioOpen ? (
                        <ChevronDown className="w-4 h-4 opacity-75" />
                      ) : (
                        <ChevronRight className="w-4 h-4 opacity-75" />
                      )}
                    </div>
                  )}
                </button>

                {/* Submenu do Envio de Dados */}
                {!isCollapsed && isEnvio && isEnvioOpen && (
                  <div className="mt-1.5 ml-4 pl-3.5 border-l border-white/15 space-y-1 animate-fadeIn">
                    <button
                      onClick={() => setCurrentPage('envio-manual')}
                      className={`w-full flex items-center p-2 rounded-lg text-xs transition-all duration-200 text-left cursor-pointer space-x-2.5 ${
                        currentPage === 'envio-manual'
                          ? 'bg-white/15 font-bold text-white shadow-sm'
                          : 'opacity-70 hover:opacity-100 hover:bg-white/5 text-slate-100'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="whitespace-nowrap">Envio Manual</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage('envio-planilhas')}
                      className={`w-full flex items-center p-2 rounded-lg text-xs transition-all duration-200 text-left cursor-pointer space-x-2.5 ${
                        currentPage === 'envio-planilhas'
                          ? 'bg-white/15 font-bold text-white shadow-sm'
                          : 'opacity-70 hover:opacity-100 hover:bg-white/5 text-slate-100'
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span className="whitespace-nowrap">Planilhas & APIs</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage('envio-conexoes')}
                      className={`w-full flex items-center p-2 rounded-lg text-xs transition-all duration-200 text-left cursor-pointer space-x-2.5 ${
                        currentPage === 'envio-conexoes'
                          ? 'bg-white/15 font-bold text-white shadow-sm'
                          : 'opacity-70 hover:opacity-100 hover:bg-white/5 text-slate-100'
                      }`}
                    >
                      <Server className="w-3.5 h-3.5" />
                      <span className="whitespace-nowrap">Conexões & Webhooks</span>
                    </button>
                  </div>
                )}

                {/* Tooltip Flutuante Lateral */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-900/95 text-white text-[10px] font-bold rounded-lg shadow-lg border border-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none translate-x-[-8px] group-hover:translate-x-0 z-50 select-none">
                    {/* Setinha do Tooltip */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900/95" />
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer da Sidebar */}
        <div className={`p-6 space-y-4 border-t border-white/10 ${isCollapsed ? 'px-2' : ''}`}>
          {/* Configurações */}
          <div className="relative group">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('configuracoes');
              }}
              className={`flex items-center text-sm transition-all duration-200 ${
                currentPage === 'configuracoes'
                  ? 'text-white font-bold opacity-100'
                  : 'opacity-85 hover:opacity-100 text-slate-100'
              } ${
                isCollapsed ? 'justify-center' : 'space-x-3'
              }`}
            >
              <Settings className={`w-5 h-5 flex-shrink-0 ${currentPage === 'configuracoes' ? 'animate-spin-slow' : ''}`} />
              {!isCollapsed && <span className="whitespace-nowrap">Configurações</span>}
            </a>
            
            {/* Tooltip Flutuante Configurações */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-900/95 text-white text-[10px] font-bold rounded-lg shadow-lg border border-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none translate-x-[-8px] group-hover:translate-x-0 z-50 select-none">
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900/95" />
                Configurações
              </div>
            )}
          </div>

          {/* Ajuda */}
          <div className="relative group">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsHelpOpen(true);
              }}
              className={`flex items-center text-sm opacity-80 hover:opacity-100 transition-opacity duration-200 ${
                isCollapsed ? 'justify-center' : 'space-x-3'
              }`}
            >
              <HelpCircle className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Ajuda</span>}
            </a>
            
            {/* Tooltip Flutuante Ajuda */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-900/95 text-white text-[10px] font-bold rounded-lg shadow-lg border border-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none translate-x-[-8px] group-hover:translate-x-0 z-50 select-none">
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900/95" />
                Ajuda
              </div>
            )}
          </div>

          {/* Sair */}
          <div className="relative group">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsLogoutOpen(true);
              }}
              className={`flex items-center text-sm opacity-80 hover:opacity-100 transition-opacity duration-200 ${
                isCollapsed ? 'justify-center' : 'space-x-3'
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Sair</span>}
            </a>

            {/* Tooltip Flutuante Sair */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-900/95 text-white text-[10px] font-bold rounded-lg shadow-lg border border-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none translate-x-[-8px] group-hover:translate-x-0 z-50 select-none">
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900/95" />
                Sair
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MODAL DE AJUDA PREMIUM */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-100 shadow-[0_20px_50px_rgba(136,14,79,0.08)] text-slate-800 animate-modal flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-700 mb-4 shadow-sm">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight mb-2">Central de Suporte</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Precisa de auxílio com o dashboard ou com a integração de dados? Utilize nossos canais de atendimento:
            </p>
            <div className="w-full space-y-2.5 bg-slate-50 p-4 rounded-2xl text-left text-[11px] font-semibold mb-5 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Suporte Técnico</span>
                <span className="text-slate-800 font-bold">FerTaise Tech</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Celular / WhatsApp</span>
                <span className="text-slate-800 font-bold">(12) 99756-9426</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">E-mail</span>
                <span className="text-slate-800 font-bold break-all">fertaisetech@gmail.com</span>
              </div>
            </div>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="w-full py-3 bg-gradient-to-r from-[#D81B60] to-[#E91E63] text-white font-extrabold rounded-xl shadow-[0_4px_12px_rgba(216,27,96,0.25)] hover:scale-102 transition-transform duration-200 cursor-pointer text-xs uppercase tracking-wider"
            >
              Fechar Suporte
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE SAÍDA PREMIUM */}
      {isLogoutOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-100 shadow-[0_20px_50px_rgba(136,14,79,0.08)] text-slate-800 animate-modal flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-4 shadow-sm">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight mb-2">Deseja realmente sair?</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Sua sessão atual será encerrada. Você precisará se autenticar novamente para visualizar o painel.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setIsLogoutOpen(false)}
                className="flex-1 py-3 bg-slate-50 border border-slate-100 text-slate-600 font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setIsLogoutOpen(false);
                  localStorage.removeItem('uniodonto_logged_user');
                  if (onLogout) {
                    onLogout();
                  }
                }}
                className="flex-1 py-3 bg-gradient-to-r from-[#D81B60] to-[#E91E63] text-white font-extrabold rounded-xl shadow-[0_4px_12px_rgba(216,27,96,0.25)] hover:scale-102 transition-transform duration-200 cursor-pointer text-xs uppercase tracking-wider"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
