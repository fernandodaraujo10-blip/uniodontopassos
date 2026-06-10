import React, { useState, useEffect, Suspense, lazy } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Dashboard from '@/pages/Dashboard';
import { DashboardProvider } from '@/context/DashboardContext';
import Login from '@/pages/Login';
import { hasPageAccess } from '@/utils/userPermissions';

// Importação síncrona apenas para o tipo User (não carrega o módulo completo)
import type { User } from '@/pages/Settings';

// ── Code Splitting: carregamento lazy das páginas pesadas ──────────────────
// Cada página só é baixada quando o usuário navega até ela,
// reduzindo o bundle inicial de ~1,5 MB para ~300 kB.
const Reports  = lazy(() => import('@/pages/Reports'));
const DataUpload = lazy(() => import('@/pages/DataUpload'));
const Settings = lazy(() => import('@/pages/Settings'));

// Componente de loading inline enquanto o chunk carrega
const PageLoader: React.FC = () => (
  <div className="flex-grow flex flex-col items-center justify-center bg-[#F8F9FA] gap-3">
    <div className="w-10 h-10 rounded-full border-4 border-pink-100 border-t-pink-700 animate-spin" />
    <span className="text-xs font-semibold text-gray-400 tracking-wide">Carregando...</span>
  </div>
);

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('uniodonto_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [loggedUser, setLoggedUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('uniodonto_logged_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Efeito para sincronizar e aplicar a classe .dark
  useEffect(() => {
    localStorage.setItem('uniodonto_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (!loggedUser) return;

    if (!hasPageAccess(loggedUser.allowedPages, loggedUser.role, currentPage)) {
      setCurrentPage('dashboard');
    }
  }, [currentPage, loggedUser]);

  const handleLoginSuccess = (user: User) => {
    localStorage.setItem('uniodonto_logged_user', JSON.stringify(user));
    setLoggedUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('uniodonto_logged_user');
    setLoggedUser(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'relatorios':
        return <Reports />;
      case 'envio':
      case 'envio-manual':
      case 'envio-planilhas':
      case 'envio-conexoes':
        return <DataUpload currentPage={currentPage} setCurrentPage={setCurrentPage} />;
      case 'configuracoes':
        return (
          <Settings
            theme={theme}
            setTheme={setTheme}
            loggedUser={loggedUser}
            onUpdateLoggedUser={handleLoginSuccess}
          />
        );
      default:
        return (
          <div className="flex-grow flex items-center justify-center bg-[#F8F9FA] dark:bg-slate-950 p-6 select-none animate-fadeIn h-full w-full">
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.03)] text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight mb-2">
                404 - Página não encontrada
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-6 leading-relaxed">
                A rota ou tela que você tentou acessar não existe ou foi movida.
              </p>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="w-full py-3 bg-gradient-to-r from-[#D81B60] to-[#E91E63] text-white font-extrabold rounded-xl shadow-[0_4px_12px_rgba(216,27,96,0.25)] hover:scale-102 transition-transform duration-200 cursor-pointer text-xs uppercase tracking-wider"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  // Se não estiver autenticado, exibe a tela de login
  if (!loggedUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <DashboardProvider>
      <div className="flex h-[100dvh] md:h-screen w-full overflow-hidden bg-[#F8F9FA] antialiased">
        {/* Sidebar Lateral — visível apenas no desktop (md+), escondida no mobile */}
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
          loggedUser={loggedUser}
        />

        {/* Conteúdo Principal Dinâmico — Suspense envolve apenas o conteúdo lazy */}
        {/* pb-20 no mobile para não ficar atrás da bottom navigation (64px + margem) */}
        <main className={`mobile-page flex-grow flex flex-col h-full min-h-0 overflow-hidden ${currentPage === 'dashboard' ? 'pb-0' : 'pb-20'} md:pb-0`}>
          <Suspense fallback={<PageLoader />}>
            {renderPage()}
          </Suspense>
        </main>

        {/* Bottom Navigation — visível apenas no mobile (< md) */}
        <MobileBottomNav
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
          loggedUser={loggedUser}
        />
      </div>
    </DashboardProvider>
  );
};

export default App;
