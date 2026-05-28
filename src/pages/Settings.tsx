import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  ShieldAlert, 
  BellRing, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Mail, 
  Briefcase, 
  CheckCircle2, 
  X, 
  UserCheck, 
  UserX,
  Lock,
  Eye,
  Key
} from 'lucide-react';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: 'ativo' | 'inativo';
  avatarColor: string;
  password?: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'FerTaise Tech Admin', email: 'fertaisetech@gmail.com', username: 'fertaisetech@gmail.com', role: 'Tech FerTaise', status: 'ativo', avatarColor: 'from-pink-600 to-rose-400', password: '1234' },
  { id: '2', name: 'Dr. Elcio Beraldo', email: 'elcio@uniodonto.com', username: 'elcio@uniodonto.com', role: 'Diretor', status: 'inativo', avatarColor: 'from-blue-600 to-teal-400', password: '1234' },
  { id: '3', name: 'Dr. Luiz Fernando', email: 'luiz@uniodonto.com', username: 'luiz@uniodonto.com', role: 'Diretor', status: 'inativo', avatarColor: 'from-purple-600 to-indigo-400', password: '1234' },
  { id: '4', name: 'Dr. Mateus José', email: 'mateus@uniodonto.com', username: 'mateus@uniodonto.com', role: 'Diretor', status: 'inativo', avatarColor: 'from-amber-600 to-orange-400', password: '1234' },
  { id: '5', name: 'Janaína Pádua', email: 'gerente@uniodonto.com', username: 'gerente@uniodonto.com', role: 'Gerente', status: 'inativo', avatarColor: 'from-emerald-600 to-green-400', password: '1234' }
];

interface SettingsProps {
  theme?: 'light' | 'dark';
  setTheme?: (theme: 'light' | 'dark') => void;
}

export const Settings: React.FC<SettingsProps> = ({ theme = 'light', setTheme }) => {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'perfil' | 'seguranca' | 'notificacoes'>('usuarios');
  
  // --- ESTADOS DO CRUD DE USUÁRIOS ---
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('uniodonto_settings_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as User[];
        // Verifica se os dados salvos são antigos (não contém o usuário 'FerTaise Tech Admin' ou falta o campo password ou username)
        const isOldData = parsed.length === 0 || 
                          !parsed.some(u => u.name === 'FerTaise Tech Admin') || 
                          parsed.some(u => !u.hasOwnProperty('password')) ||
                          parsed.some(u => !u.hasOwnProperty('username'));
        if (isOldData) {
          return mockUsers;
        }
        return parsed;
      } catch (e) {
        return mockUsers;
      }
    }
    return mockUsers;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [successToast, setSuccessToast] = useState('');

  // Estados do formulário (compartilhado entre adicionar e editar)
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formRole, setFormRole] = useState('Tech FerTaise');
  const [formStatus, setFormStatus] = useState<'ativo' | 'inativo'>('ativo');
  const [formPassword, setFormPassword] = useState('');
  const [showFormPassword, setShowFormPassword] = useState(false);

  // Persistir usuários no LocalStorage sempre que houver alteração
  useEffect(() => {
    localStorage.setItem('uniodonto_settings_users', JSON.stringify(users));
  }, [users]);

  // Função para exibir toast de sucesso
  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  // Abrir modal de criação
  const handleOpenAddModal = () => {
    setFormName('');
    setFormEmail('');
    setFormUsername('');
    setFormRole('Tech FerTaise');
    setFormStatus('ativo');
    setFormPassword('1234');
    setShowFormPassword(false);
    setIsAddModalOpen(true);
  };

  // Executar criação de usuário
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const colors = [
      'from-pink-600 to-rose-400',
      'from-blue-600 to-teal-400',
      'from-purple-600 to-indigo-400',
      'from-amber-600 to-orange-400',
      'from-emerald-600 to-green-400',
      'from-cyan-600 to-blue-400'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser: User = {
      id: String(Date.now()),
      name: formName,
      email: formEmail,
      username: formUsername.trim() || formEmail.trim(),
      role: formRole,
      status: formStatus,
      avatarColor: randomColor,
      password: formPassword || '1234'
    };

    setUsers(prev => [...prev, newUser]);
    setIsAddModalOpen(false);
    showToast(`Usuário "${formName}" criado com sucesso!`);
  };

  // Abrir modal de edição
  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormUsername(user.username || user.email);
    setFormRole(user.role);
    setFormStatus(user.status);
    setFormPassword(user.password || '1234');
    setShowFormPassword(false);
    setIsEditModalOpen(true);
  };

  // Executar salvamento de edição
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setUsers(prev => prev.map(u => u.id === selectedUser.id ? {
      ...u,
      name: formName,
      email: formEmail,
      username: formUsername.trim() || formEmail.trim(),
      role: formRole,
      status: formStatus,
      password: formPassword
    } : u));

    setIsEditModalOpen(false);
    setSelectedUser(null);
    showToast(`Dados de "${formName}" atualizados com sucesso!`);
  };

  // Executar exclusão de usuário
  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Deseja realmente remover o usuário "${name}" do sistema?`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
      showToast(`Usuário "${name}" removido com sucesso.`);
    }
  };

  // Filtragem dinâmica de pesquisa
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtém iniciais para o avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // --- OUTROS ESTADOS MOCK ---
  const [profileName, setProfileName] = useState('UNIODONTO PASSOS COOPERATIVA ODONTOLÓGICA');
  const [profilePhone, setProfilePhone] = useState('(35) 3521-1200');
  const [profileCnpj, setProfileCnpj] = useState('02.768.410/0001-02');
  const [profileNire, setProfileNire] = useState('3140003781-1');
  const [profileAddress, setProfileAddress] = useState('Rua Bonsucesso, 472 - São Francisco, Passos – MG');
  const [apiKey, setApiKey] = useState('uni_key_live_8f0a202d08311eb8a0de');
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="flex-grow overflow-hidden p-5 bg-[#F8F9FA] flex flex-col h-full max-h-screen page-transition text-slate-800">
      <header className="mb-5 shrink-0 flex justify-between items-center select-none">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Configurações Gerais</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie os usuários do dashboard, parametrize dados da cooperativa e configure segurança e alertas.
          </p>
        </div>
      </header>

      {successToast && (
        <div className="mb-4 shrink-0 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 animate-fadeIn shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 animate-bounce" />
          <p className="text-xs font-bold text-emerald-800">{successToast}</p>
        </div>
      )}

      {/* Grid Principal Layout Settings */}
      <div className="flex-grow flex gap-6 overflow-hidden min-h-0">
        
        {/* Menu Lateral de Abas de Configurações */}
        <aside className="w-64 bg-white border border-gray-100 rounded-3xl p-5 card-shadow flex flex-col gap-2 shrink-0 select-none">
          <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-3">Opções do Painel</h3>
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer space-x-3 text-left ${
              activeTab === 'usuarios'
                ? 'bg-gradient-to-r from-pink-700 to-pink-500 text-white shadow-md shadow-pink-100'
                : 'text-gray-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Gerenciamento de Usuários</span>
          </button>
          <button
            onClick={() => setActiveTab('perfil')}
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer space-x-3 text-left ${
              activeTab === 'perfil'
                ? 'bg-gradient-to-r from-pink-700 to-pink-500 text-white shadow-md shadow-pink-100'
                : 'text-gray-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>Perfil da Cooperativa</span>
          </button>
          <button
            onClick={() => setActiveTab('seguranca')}
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer space-x-3 text-left ${
              activeTab === 'seguranca'
                ? 'bg-gradient-to-r from-pink-700 to-pink-500 text-white shadow-md shadow-pink-100'
                : 'text-gray-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Segurança & API</span>
          </button>
          <button
            onClick={() => setActiveTab('notificacoes')}
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer space-x-3 text-left ${
              activeTab === 'notificacoes'
                ? 'bg-gradient-to-r from-pink-700 to-pink-500 text-white shadow-md shadow-pink-100'
                : 'text-gray-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <BellRing className="w-4 h-4 shrink-0" />
            <span>Notificações & Alertas</span>
          </button>
        </aside>

        {/* Conteúdo Dinâmico da Aba Selecionada */}
        <main className="flex-grow bg-white border border-gray-100 rounded-3xl p-6 card-shadow flex flex-col overflow-hidden min-h-0">
          
          {/* TAB 1: GERENCIAMENTO DE USUÁRIOS */}
          {activeTab === 'usuarios' && (
            <div className="flex flex-col h-full overflow-hidden animate-fadeIn">
              {/* Header do CRUD */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5 shrink-0 select-none">
                <div>
                  <h2 className="text-md font-extrabold text-slate-800">Contas e Membros Ativos</h2>
                  <p className="text-xs text-gray-400">Configure quem possui acesso de visualização ou administração técnica</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Barra de Pesquisa */}
                  <div className="relative w-60">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Pesquisar usuários..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-2xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  {/* Adicionar Usuário */}
                  <button
                    onClick={handleOpenAddModal}
                    className="py-2 px-4 bg-gradient-to-r from-pink-700 to-pink-500 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-102 active:scale-98 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Novo Usuário
                  </button>
                </div>
              </div>

              {/* Grid / Tabela de Usuários */}
              <div className="flex-grow overflow-y-auto border border-slate-100 rounded-2xl bg-slate-50/50">
                <table className="w-full text-xs text-slate-600 min-w-[600px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-left font-bold text-slate-400 text-[10px] uppercase select-none">
                      <th className="p-4 w-2/5">Membro</th>
                      <th className="p-4 w-1/4">Cargo / Função</th>
                      <th className="p-4 w-1/6">Status</th>
                      <th className="p-4 text-right pr-6 w-1/6">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        className="border-b border-slate-100/60 bg-white hover:bg-slate-50/40 transition-colors last:border-none"
                      >
                        {/* Membro Info */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {/* Avatar Dinâmico com Iniciais e Degradê Premium */}
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${user.avatarColor} flex items-center justify-center font-extrabold text-[13px] text-white shadow-sm flex-shrink-0 select-none`}>
                              {getInitials(user.name)}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-gray-800 text-[13px]">{user.name}</span>
                              <span className="text-gray-400 font-medium text-[11px] flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Cargo */}
                        <td className="p-4 text-left">
                          <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-[10px] flex items-center gap-1.5 w-fit">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            {user.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-4 text-left select-none">
                          {user.status === 'ativo' ? (
                            <span className="bg-emerald-50 text-emerald-600 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1 w-fit">
                              <UserCheck className="w-3 h-3" /> Ativo
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1 w-fit">
                              <UserX className="w-3 h-3" /> Inativo
                            </span>
                          )}
                        </td>

                        {/* Ações */}
                        <td className="p-4 text-right pr-6 select-none">
                          <div className="flex justify-end gap-2.5">
                            <button
                              onClick={() => handleOpenEditModal(user)}
                              className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer"
                              title="Editar Usuário"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer"
                              title="Excluir Usuário"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-slate-400 font-medium">
                          Nenhum usuário encontrado correspondente à pesquisa.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PERFIL DA COOPERATIVA */}
          {activeTab === 'perfil' && (
            <div className="flex flex-col h-full overflow-hidden animate-fadeIn text-left select-none">
              <h2 className="text-md font-extrabold text-slate-800 mb-1">Perfil Corporativo</h2>
              <p className="text-xs text-gray-400 mb-6">Parametrize as informações oficiais da cooperativa exibidas no dashboard</p>

              <div className="max-w-xl space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase">Nome Comercial</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 bg-slate-50 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase">CNPJ</label>
                    <input
                      type="text"
                      value={profileCnpj}
                      onChange={(e) => setProfileCnpj(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 bg-slate-50 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase">NIRE</label>
                    <input
                      type="text"
                      value={profileNire}
                      onChange={(e) => setProfileNire(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 bg-slate-50 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase">Sede Administrativa</label>
                  <input
                    type="text"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 bg-slate-50 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase">Registro ANS da Operadora</label>
                  <input
                    type="text"
                    readOnly
                    value="ANS nº 33624-9"
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-gray-400 bg-slate-100 cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase">Telefone Geral / Ouvidoria</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 bg-slate-50 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <button
                  onClick={() => showToast('Perfil da cooperativa atualizado com sucesso!')}
                  className="py-2.5 px-6 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors cursor-pointer w-fit"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SEGURANÇA & API */}
          {activeTab === 'seguranca' && (
            <div className="flex flex-col h-full overflow-hidden animate-fadeIn text-left select-none">
              <h2 className="text-md font-extrabold text-slate-800 mb-1">Aparência & Segurança do Painel</h2>
              <p className="text-xs text-gray-400 mb-6">Personalize a exibição do dashboard e configure tokens de segurança das APIs corporativas</p>

              <div className="max-w-2xl space-y-6">
                {/* Tema do Sistema / Aparência */}
                <div className="p-5 border border-slate-200 bg-white rounded-2xl flex flex-col gap-4 shadow-sm">
                  <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-600 inline-block"></span>
                    Tema do Sistema (Aparência)
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">
                    Escolha a preferência visual de exibição do painel. A versão clara é a padrão e a escura oferece conforto visual para ambientes de baixa luminosidade.
                  </p>
                  
                  <div className="flex gap-4 mt-2 select-none">
                    <button
                      type="button"
                      onClick={() => setTheme && setTheme('light')}
                      className={`flex-1 py-4 px-5 rounded-2xl font-bold text-xs uppercase border transition-all flex flex-col items-center gap-2 cursor-pointer ${
                        theme === 'light'
                          ? 'bg-pink-50 border-pink-200 text-pink-700 shadow-sm'
                          : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                      </svg>
                      <span>Modo Claro</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme && setTheme('dark')}
                      className={`flex-1 py-4 px-5 rounded-2xl font-bold text-xs uppercase border transition-all flex flex-col items-center gap-2 cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 text-slate-100 shadow-sm'
                          : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span>Modo Escuro</span>
                    </button>
                  </div>
                </div>

                {/* Segurança Cadastros */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-3 shadow-xs">
                  <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-pink-700" /> Política de Senhas de Acesso
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Sua conta está integrada com o provedor de identidade Microsoft Active Directory (AD) corporativo. Para alterar sua senha mestra, solicite a alteração junto ao suporte de TI da Uniodonto.
                  </p>
                </div>

                {/* API Keys */}
                <div className="p-5 border border-slate-200 bg-white rounded-2xl flex flex-col gap-4 shadow-sm">
                  <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                    <Key className="w-4 h-4 text-pink-700" /> Chaves de Acesso da API (Developer Tokens)
                  </h3>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase">Chave Privada (uni_key_live_...)</label>
                    <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-1">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        readOnly
                        value={apiKey}
                        className="flex-grow px-2 py-1.5 bg-slate-50 font-mono text-[10px] text-gray-600 border-none outline-none focus:ring-0"
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-1 px-3 bg-white border border-slate-100 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {showApiKey ? 'Ocultar' : 'Exibir'}
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-amber-600 font-semibold leading-relaxed bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shrink-0 mt-0.5 animate-pulse"></span>
                    Mantenha seu token de API privado. Qualquer aplicação integrada com este token pode enviar dados de novos beneficiários e de churn diretamente para o seu painel de relatórios consolidados.
                  </p>
                  
                  <button
                    onClick={() => {
                      const newKey = 'uni_key_live_' + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10);
                      setApiKey(newKey);
                      showToast('Chave de API regerada com sucesso!');
                    }}
                    className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs w-fit transition-colors cursor-pointer"
                  >
                    Regerar Chave de API
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICAÇÕES & ALERTAS */}
          {activeTab === 'notificacoes' && (
            <div className="flex flex-col h-full overflow-hidden animate-fadeIn text-left select-none">
              <h2 className="text-md font-extrabold text-slate-800 mb-1">Notificações & Alertas de Negócio</h2>
              <p className="text-xs text-gray-400 mb-6">Parametrize alertas automáticos de desvios matemáticos de metas em tempo real</p>

              <div className="max-w-xl space-y-5">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-xs">
                  <div className="flex flex-col gap-0.5 text-left pr-4">
                    <span className="text-xs font-bold text-slate-800">Alerta de Metas Anuais</span>
                    <span className="text-[10px] text-gray-400 leading-normal">Enviar notificação por e-mail quando a taxa de conversão mensal cair abaixo de 10%</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-700"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-xs">
                  <div className="flex flex-col gap-0.5 text-left pr-4">
                    <span className="text-xs font-bold text-slate-800">Notificação de Churn Crítico</span>
                    <span className="text-[10px] text-gray-400 leading-normal">Emitir aviso de urgência no painel principal se o cancelamento de vidas for maior que 2% do total de ativos</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-700"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-xs">
                  <div className="flex flex-col gap-0.5 text-left pr-4">
                    <span className="text-xs font-bold text-slate-800">Sincronismo de Webhooks</span>
                    <span className="text-[10px] text-gray-400 leading-normal">Enviar relatórios de logs diários de requisições de Webhook recebidas com sucesso para o suporte de TI</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-700"></div>
                  </label>
                </div>

                <button
                  onClick={() => showToast('Configurações de notificações salvas!')}
                  className="py-2.5 px-6 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Salvar Notificações
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* --- MODAL ADICIONAR NOVO USUÁRIO --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-100 shadow-[0_20px_50px_rgba(136,14,79,0.08)] text-slate-800 animate-modal flex flex-col items-center">
            <h3 className="text-lg font-black text-slate-800 tracking-tight mb-4 self-start flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-700" /> Criar Novo Usuário
            </h3>

            <form onSubmit={handleCreateUser} className="w-full space-y-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mariana Costa"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  placeholder="mariana.costa@uniodontopassos.com.br"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Cargo / Função</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-gray-700 bg-slate-50 focus:outline-none cursor-pointer"
                >
                  <option value="Diretor">Diretor</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Secretaria">Secretaria</option>
                  <option value="Tech FerTaise">Tech FerTaise</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Usuário</label>
                  <button
                    type="button"
                    onClick={() => setFormUsername(formEmail)}
                    className="text-[9px] font-extrabold text-pink-700 hover:text-pink-800 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Usar E-mail
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nome de usuário ou e-mail"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Senha</label>
                <div className="relative">
                  <input
                    type={showFormPassword ? 'text' : 'password'}
                    required
                    placeholder="Senha do usuário"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-pink-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Status Inicial</label>
                <div className="flex gap-3 mt-1 select-none">
                  <button
                    type="button"
                    onClick={() => setFormStatus('ativo')}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-[10px] uppercase border transition-all ${
                      formStatus === 'ativo'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    Ativo
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStatus('inativo')}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-[10px] uppercase border transition-all ${
                      formStatus === 'inativo'
                        ? 'bg-slate-200 border-slate-300 text-slate-600 font-extrabold'
                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    Inativo
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-50 border border-slate-100 text-slate-500 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-pink-700 to-pink-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:scale-102 transition-transform cursor-pointer"
                >
                  Criar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL EDITAR USUÁRIO --- */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-100 shadow-[0_20px_50px_rgba(136,14,79,0.08)] text-slate-800 animate-modal flex flex-col items-center">
            <h3 className="text-lg font-black text-slate-800 tracking-tight mb-4 self-start flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-700" /> Editar Usuário
            </h3>

            <form onSubmit={handleUpdateUser} className="w-full space-y-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Cargo / Função</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-gray-700 bg-slate-50 focus:outline-none cursor-pointer"
                >
                  <option value="Diretor">Diretor</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Secretaria">Secretaria</option>
                  <option value="Tech FerTaise">Tech FerTaise</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Usuário</label>
                  <button
                    type="button"
                    onClick={() => setFormUsername(formEmail)}
                    className="text-[9px] font-extrabold text-pink-700 hover:text-pink-800 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Usar E-mail
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nome de usuário ou e-mail"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Senha</label>
                <div className="relative">
                  <input
                    type={showFormPassword ? 'text' : 'password'}
                    required
                    placeholder="Senha do usuário"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-pink-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Status da Conta</label>
                <div className="flex gap-3 mt-1 select-none">
                  <button
                    type="button"
                    onClick={() => setFormStatus('ativo')}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-[10px] uppercase border transition-all ${
                      formStatus === 'ativo'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    Ativo
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStatus('inativo')}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-[10px] uppercase border transition-all ${
                      formStatus === 'inativo'
                        ? 'bg-slate-200 border-slate-300 text-slate-600 font-extrabold'
                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    Inativo
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 py-2.5 bg-slate-50 border border-slate-100 text-slate-500 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-pink-700 to-pink-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:scale-102 transition-transform cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
