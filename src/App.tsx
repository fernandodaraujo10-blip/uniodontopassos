import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import DataUpload from './pages/DataUpload';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'relatorios':
        return <Reports />;
      case 'envio':
        return <DataUpload />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FA] font-sans antialiased">
      {/* Sidebar Lateral */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Conteúdo Principal Dinâmico */}
      <main className="flex-grow flex flex-col h-full min-h-0 overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
