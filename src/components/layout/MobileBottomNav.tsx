import React from 'react';
import { LayoutGrid, BarChart3, Send, Settings, LogOut } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout?: () => void;
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
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] transition-all duration-200 cursor-pointer select-none focus:outline-none
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
            <Icon
              className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`}
              strokeWidth={active ? 2.5 : 1.8}
            />
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
