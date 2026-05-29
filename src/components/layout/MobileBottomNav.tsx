import React from 'react';
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
  const items: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'envio', label: 'Envio', icon: Send },
    { id: 'configuracoes', label: 'Config.', icon: Settings },
    {
      id: 'sair',
      label: 'Sair',
      icon: LogOut,
      action: () => {
        if (onLogout) onLogout();
      },
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

  return (
    <nav
      className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex items-stretch"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Navegação principal"
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
            className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] transition-all duration-200 cursor-pointer select-none focus:outline-none
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
  );
};

export default MobileBottomNav;
