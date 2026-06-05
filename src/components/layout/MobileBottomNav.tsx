import React, { useState } from 'react';
import { LayoutGrid, BarChart3, Send, Settings, LogOut } from 'lucide-react';
import { User } from '../../pages/Settings';

interface MobileBottomNavProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout?: () => void;
  loggedUser?: User | null;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  action?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  setCurrentPage,
  onLogout,
  loggedUser,
}) => {
  // Estado do modal de confirma??o de logout
  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);

  const items: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'envio', label: 'Envio', icon: Send },
    { id: 'configuracoes', label: 'Config.', icon: Settings },
    {
      id: 'sair',
      label: 'Sair',
      icon: LogOut,
      // Abre o modal de confirma??o em vez de executar logout direto
      action: () => setIsLogoutOpen(true),
    },
  ];

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isActive = (id: string) => {
    if (id === 'envio') return currentPage.startsWith('envio');
    return currentPage === id;
  };

  const handleConfirmLogout = () => {
    setIsLogoutOpen(false);
    localStorage.removeItem('uniodonto_logged_user');
    if (onLogout) onLogout();
  };

  return (
    <>
      <nav
        className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-[80] bg-white border-t border-gray-100 flex items-stretch"
        style={{ height: 'calc(72px + env(safe-area-inset-bottom, 0px))', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Navega??o principal"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else if (item.id === 'envio') {
                  setCurrentPage('envio-manual');
                } else {
                  setCurrentPage(item.id);
                }
              }}
              className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[72px] transition-all duration-200 cursor-pointer select-none focus:outline-none
                ${active
                  ? 'text-pink-700'
                  : item.id === 'sair'
                    ? 'text-gray-400 hover:text-red-500'
                    : 'text-gray-400 hover:text-pink-600'
                }`}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              {/* Indicador ativo */}
              {active && (
                <span className="absolute top-0 w-8 h-0.5 bg-pink-700 rounded-b-full" />
              )}

              {item.id === 'configuracoes' && loggedUser ? (
                loggedUser.photo ? (
                  <img
                    src={loggedUser.photo}
                    alt={loggedUser.name}
                    className={`w-5 h-5 rounded-full object-cover border transition-all duration-200 ${
                      active ? 'border-pink-700 scale-110' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <div
                    className={`w-5 h-5 rounded-full bg-gradient-to-tr ${
                      loggedUser.avatarColor || 'from-pink-600 to-rose-400'
                    } flex items-center justify-center font-extrabold text-[8px] text-white shadow-xs shrink-0 select-none border transition-all duration-200 ${
                      active ? 'border-pink-700 scale-110' : 'border-transparent'
                    }`}
                  >
                    {getInitials(loggedUser.name)}
                  </div>
                )
              ) : (
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`}
                  strokeWidth={active ? 2.5 : 1.8}
                />
              )}

              <span
                className={`text-[10px] font-semibold leading-none transition-all duration-200 ${
                  active ? 'opacity-100' : 'opacity-70'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── MODAL DE CONFIRMAÇÃO DE SAÍDA (mobile) ── */}
      {isLogoutOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1100] flex items-end justify-center p-4 pb-6 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
          onClick={(e) => {
            // Fecha ao clicar fora do card
            if (e.target === e.currentTarget) setIsLogoutOpen(false);
          }}
        >
          {/* Bottom sheet card */}
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 border border-gray-100 shadow-[0_-8px_40px_rgba(0,0,0,0.15)] animate-modal flex flex-col items-center text-center">
            {/* Ícone */}
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-4 shadow-sm">
              <LogOut className="w-6 h-6" />
            </div>

            <h3
              id="logout-modal-title"
              className="text-lg font-black text-slate-800 tracking-tight mb-2"
            >
              Deseja realmente sair?
            </h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Sua sessão atual será encerrada. Você precisará se autenticar novamente para
              visualizar o painel.
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setIsLogoutOpen(false)}
                className="flex-1 py-3.5 bg-slate-50 border border-slate-100 text-slate-600 font-extrabold rounded-2xl text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#D81B60] to-[#E91E63] text-white font-extrabold rounded-2xl shadow-[0_4px_12px_rgba(216,27,96,0.3)] active:scale-98 transition-all duration-200 cursor-pointer text-xs uppercase tracking-wider"
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

export default MobileBottomNav;
