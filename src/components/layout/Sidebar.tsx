import React, { useEffect, useState } from 'react';
import { LayoutGrid, BarChart3, Send, HelpCircle, LogOut, ChevronLeft } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);

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
    { id: 'envio', label: 'Envio de Dados', icon: Send },
  ];

  return (
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
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 text-left cursor-pointer ${
                isActive
                  ? 'bg-white/20 font-semibold'
                  : 'hover:bg-white/10 opacity-80 hover:opacity-100'
              } ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer da Sidebar */}
      <div className={`p-6 space-y-4 border-t border-white/10 ${isCollapsed ? 'px-2' : ''}`}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert('Ajuda Uniodonto Passos - Central de Suporte');
          }}
          className={`flex items-center text-sm opacity-80 hover:opacity-100 transition-opacity duration-200 ${
            isCollapsed ? 'justify-center' : 'space-x-3'
          }`}
        >
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Ajuda</span>}
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (confirm('Deseja realmente sair?')) {
              alert('Sessão encerrada!');
            }
          }}
          className={`flex items-center text-sm opacity-80 hover:opacity-100 transition-opacity duration-200 ${
            isCollapsed ? 'justify-center' : 'space-x-3'
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Sair</span>}
        </a>
      </div>
    </aside>
  );
};
export default Sidebar;
