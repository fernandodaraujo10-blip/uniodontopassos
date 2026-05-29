import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import MobileBottomNav from './components/layout/MobileBottomNav';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import DataUpload from './pages/DataUpload';
import { DashboardProvider } from './context/DashboardContext';
import Settings, { User } from './pages/Settings';
import Login from './pages/Login';

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
        return <Dashboard />;
    }
  };

  // Se não estiver autenticado, exibe a tela de login
  if (!loggedUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <DashboardProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FA] font-sans antialiased">
        {/* Sidebar Lateral — visível apenas no desktop (md+), escondida no mobile */}
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
          loggedUser={loggedUser}
        />

        {/* Conteúdo Principal Dinâmico */}
        {/* pb-20 no mobile para não ficar atrás da bottom navigation (64px + margem) */}
        <main className="flex-grow flex flex-col h-full min-h-0 overflow-hidden pb-20 md:pb-0">
          {renderPage()}
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
