import React, { useState, useEffect } from 'react';
import { hashPassword, maskEmail } from '../utils/security';
import { PrivacyModal } from '../components/modals/PrivacyModal';
import { usePWAInstall } from '../hooks/usePWAInstall';
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
  Key,
  User as UserIcon,
  Camera,
  Smartphone
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
  photo?: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'FerTaise Tech Admin', email: 'fertaisetech@gmail.com', username: 'fertaisetech@gmail.com', role: 'Tech FerTaise', status: 'ativo', avatarColor: 'from-pink-600 to-rose-400', password: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4' },
  { id: '2', name: 'Dr. Elcio Beraldo', email: 'elcio@uniodonto.com', username: 'elcio@uniodonto.com', role: 'Diretor', status: 'ativo', avatarColor: 'from-blue-600 to-teal-400', password: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', photo: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0420780722.firebasestorage.app/o/1.1-Uniodonto%2F1.1-Imagens%2FDr.Elcio.png?alt=media&token=1ade4c11-ba33-4ff9-865e-7e19fe095943' },
  { id: '3', name: 'Dr. Luiz Fernando', email: 'luiz@uniodonto.com', username: 'luiz@uniodonto.com', role: 'Diretor', status: 'ativo', avatarColor: 'from-purple-600 to-indigo-400', password: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', photo: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0420780722.firebasestorage.app/o/1.1-Uniodonto%2F1.1-Imagens%2FDr.LuizFernando.png?alt=media&token=942f6b36-9a6a-4add-8470-13160ce7b4af' },
  { id: '4', name: 'Dr. Mateus José', email: 'mateus@uniodonto.com', username: 'mateus@uniodonto.com', role: 'Diretor', status: 'ativo', avatarColor: 'from-amber-600 to-orange-400', password: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', photo: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0420780722.firebasestorage.app/o/1.1-Uniodonto%2F1.1-Imagens%2FDr.Matheus.png?alt=media&token=924d0fcb-129a-4c06-8ffc-19f244545f07' },
  { id: '5', name: 'Janaína Pádua', email: 'gerente@uniodonto.com', username: 'gerente@uniodonto.com', role: 'Gerente', status: 'ativo', avatarColor: 'from-emerald-600 to-green-400', password: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', photo: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0420780722.firebasestorage.app/o/1.1-Uniodonto%2F1.1-Imagens%2FJanaina.png?alt=media&token=82b39f8c-d63d-4f8a-96e9-681337df67c7' }
];

interface SettingsProps {
  theme?: 'light' | 'dark';
  setTheme?: (theme: 'light' | 'dark') => void;
  loggedUser?: User | null;
  onUpdateLoggedUser?: (user: User) => void;
}

export const Settings: React.FC<SettingsProps> = ({ theme = 'light', setTheme, loggedUser, onUpdateLoggedUser }) => {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'meu-perfil' | 'perfil' | 'seguranca' | 'notificacoes'>('usuarios');
  
  // --- ESTADOS DO CRUD DE USUÁRIOS ---
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('uniodonto_settings_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as User[];
        // Verifica se os dados salvos são antigos (não contém o usuário 'FerTaise Tech Admin' ou falta o campo password ou username ou as fotos dos médicos/gerente)
        const isOldData = parsed.length === 0 || 
                          !parsed.some(u => u.name === 'FerTaise Tech Admin') || 
                          parsed.some(u => !u.hasOwnProperty('password')) ||
                          parsed.some(u => !u.hasOwnProperty('username')) ||
                          parsed.some(u => (u.id === '2' || u.id === '3' || u.id === '4' || u.id === '5') && !u.photo) ||
                          parsed.some(u => u.id !== '1' && u.status === 'inativo');
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
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Estados do formulário (compartilhado entre adicionar e editar)
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formRole, setFormRole] = useState('Tech FerTaise');
  const [formStatus, setFormStatus] = useState<'ativo' | 'inativo'>('ativo');
  const [formPassword, setFormPassword] = useState('');
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [formPhoto, setFormPhoto] = useState<string | undefined>(undefined);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho (opcional, ex: limite 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem é muito grande. O limite máximo é 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Estados do formulário do próprio perfil
  const [profileMyName, setProfileMyName] = useState(loggedUser?.name || '');
  const [profileMyEmail, setProfileMyEmail] = useState(loggedUser?.email || '');
  const [profileMyUsername, setProfileMyUsername] = useState(loggedUser?.username || '');
  const [profileMyPassword, setProfileMyPassword] = useState('');
  const [profileMyPhoto, setProfileMyPhoto] = useState<string | undefined>(loggedUser?.photo);
  const [showMyPassword, setShowMyPassword] = useState(false);

  // Sincronizar dados do usuário logado
  useEffect(() => {
    if (loggedUser) {
      setProfileMyName(loggedUser.name);
      setProfileMyEmail(loggedUser.email);
      setProfileMyUsername(loggedUser.username || loggedUser.email);
      setProfileMyPassword('');
      setProfileMyPhoto(loggedUser.photo);
    }
  }, [loggedUser]);

  const handleMyPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem é muito grande. O limite máximo é 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileMyPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
    setFormPassword('');
    setShowFormPassword(false);
    setFormPhoto(undefined);
    setIsAddModalOpen(true);
  };

  // Executar criação de usuário
  const handleCreateUser = async (e: React.FormEvent) => {
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

    const hashedPassword = formPassword 
      ? await hashPassword(formPassword) 
      : '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'; // hash de '1234'

    const newUser: User = {
      id: String(Date.now()),
      name: formName,
      email: formEmail,
      username: formUsername.trim() || formEmail.trim(),
      role: formRole,
      status: formStatus,
      avatarColor: randomColor,
      password: hashedPassword,
      photo: formPhoto
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
    setFormPassword('');
    setShowFormPassword(false);
    setFormPhoto(user.photo);
    setIsEditModalOpen(true);
  };

  // Executar salvamento de edição
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const hashedPassword = formPassword 
      ? await hashPassword(formPassword) 
      : selectedUser.password;

    const updatedUser: User = {
      ...selectedUser,
      name: formName,
      email: formEmail,
      username: formUsername.trim() || formEmail.trim(),
      role: formRole,
      status: formStatus,
      password: hashedPassword,
      photo: formPhoto
    };

    setUsers(prev => prev.map(u => u.id === selectedUser.id ? updatedUser : u));

    if (loggedUser && selectedUser.id === loggedUser.id) {
      if (onUpdateLoggedUser) {
        onUpdateLoggedUser(updatedUser);
      }
    }

    setIsEditModalOpen(false);
    setSelectedUser(null);
    showToast(`Dados de "${formName}" atualizados com sucesso!`);
  };

  // Executar atualização do próprio perfil
  const handleUpdateMyProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedUser) return;
    
    if (!profileMyName.trim() || !profileMyEmail.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const hashedPassword = profileMyPassword 
      ? await hashPassword(profileMyPassword) 
      : loggedUser.password;

    const updatedUser: User = {
      ...loggedUser,
      name: profileMyName,
      email: profileMyEmail,
      username: profileMyUsername.trim() || profileMyEmail.trim(),
      password: hashedPassword,
      photo: profileMyPhoto
    };

    // Atualizar na lista global de usuários
    setUsers(prev => prev.map(u => u.id === loggedUser.id ? updatedUser : u));

    // Atualizar no contexto do usuário logado
    if (onUpdateLoggedUser) {
      onUpdateLoggedUser(updatedUser);
    }

    showToast('Seu perfil pessoal foi atualizado com sucesso!');
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

  const { isInstallable, installApp, isInstalled } = usePWAInstall();

  return (
    <div className="mobile-page h-[100dvh] overflow-hidden md:overflow-y-auto p-3 md:p-5 pb-0 md:pb-5 bg-[#F8F9FA] flex flex-col md:max-h-screen page-transition text-slate-800">
      <header className="mb-2 md:mb-5 shrink-0 flex justify-between items-start md:items-center select-none">
        <div>
          <h1 className="text-[18px] md:text-3xl font-black text-gray-800 leading-none">Configurações</h1>
          <p className="hidden md:block text-sm text-gray-500 mt-1 leading-relaxed">
            Gerencie os usuários do dashboard, parametrize dados da cooperativa e configure segurança e alertas.
          </p>
        </div>
      </header>

      {successToast && (
        <div className="mb-2 shrink-0 p-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 animate-fadeIn shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 animate-bounce" />
          <p className="text-[10px] font-bold text-emerald-800">{successToast}</p>
        </div>
      )}



      {/* Grid Principal Layout Settings */}
      <div className="flex-grow flex flex-col md:flex-row gap-3 overflow-hidden min-h-0 pb-0 md:pb-0">
        
        {/* Menu de Abas Mobile (Scroll Horizontal) */}
        <div className="relative md:hidden shrink-0">
          <div className="grid grid-cols-3 gap-1.5 mb-2 select-none">
            <button
              onClick={() => setActiveTab('meu-perfil')}
              className={`min-h-9 flex items-center justify-center px-2 py-2 rounded-2xl text-[9px] font-bold transition-all cursor-pointer gap-1 shrink-0 ${
                activeTab === 'meu-perfil'
                  ? 'bg-gradient-to-r from-pink-700 to-pink-500 text-white shadow-md shadow-pink-100'
                  : 'bg-white border border-gray-100 text-gray-500 hover:bg-slate-50'
              }`}
            >
              <UserIcon className="w-3 h-3 shrink-0" />
              <span className="truncate">Perfil</span>
            </button>
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`min-h-9 flex items-center justify-center px-2 py-2 rounded-2xl text-[9px] font-bold transition-all cursor-pointer gap-1 shrink-0 ${
                activeTab === 'usuarios'
                  ? 'bg-gradient-to-r from-pink-700 to-pink-500 text-white shadow-md shadow-pink-100'
                  : 'bg-white border border-gray-100 text-gray-500 hover:bg-slate-50'
              }`}
            >
              <Users className="w-3 h-3 shrink-0" />
              <span className="truncate">Usuários</span>
            </button>
            <button
              onClick={() => setActiveTab('perfil')}
              className={`min-h-9 flex items-center justify-center px-2 py-2 rounded-2xl text-[9px] font-bold transition-all cursor-pointer gap-1 shrink-0 ${
                activeTab === 'perfil'
                  ? 'bg-gradient-to-r from-pink-700 to-pink-500 text-white shadow-md shadow-pink-100'
                  : 'bg-white border border-gray-100 text-gray-500 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate">Coop.</span>
            </button>
            <button
              onClick={() => setActiveTab('seguranca')}
              className={`min-h-9 flex items-center justify-center px-2 py-2 rounded-2xl text-[9px] font-bold transition-all cursor-pointer gap-1 shrink-0 ${
                activeTab === 'seguranca'
                  ? 'bg-gradient-to-r from-pink-700 to-pink-500 text-white shadow-md shadow-pink-100'
                  : 'bg-white border border-gray-100 text-gray-500 hover:bg-slate-50'
              }`}
            >
              <ShieldAlert className="w-3 h-3 shrink-0" />
              <span className="truncate">Segurança</span>
            </button>
            <button
              onClick={() => setActiveTab('notificacoes')}
              className={`min-h-9 flex items-center justify-center px-2 py-2 rounded-2xl text-[9px] font-bold transition-all cursor-pointer gap-1 shrink-0 ${
                activeTab === 'notificacoes'
                  ? 'bg-gradient-to-r from-pink-700 to-pink-500 text-white shadow-md shadow-pink-100'
                  : 'bg-white border border-gray-100 text-gray-500 hover:bg-slate-50'
              }`}
            >
              <BellRing className="w-3 h-3 shrink-0" />
              <span className="truncate">Alertas</span>
            </button>
          </div>
        </div>

        {/* Menu Lateral de Abas de Configurações - Desktop */}
        <aside className="w-64 bg-white border border-gray-100 rounded-3xl p-5 card-shadow flex-col gap-2 shrink-0 select-none hidden md:flex">
          <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-3">Opções do Painel</h3>
          <button
            onClick={() => setActiveTab('meu-perfil')}
            className={`w-full flex items-center p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer space-x-3 text-left ${
              activeTab === 'meu-perfil'
                ? 'bg-gradient-to-r from-pink-700 to-pink-500 text-white shadow-md shadow-pink-100'
                : 'text-gray-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <UserIcon className="w-4 h-4 shrink-0" />
            <span>Meu Perfil Pessoal</span>
          </button>
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
        <main className="flex-grow bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-4 md:p-6 card-shadow flex flex-col overflow-hidden min-h-0">
          
          {/* TAB 0: MEU PERFIL PESSOAL */}
          {activeTab === 'meu-perfil' && loggedUser && (
            <div className="flex flex-col h-full overflow-y-auto pr-1 animate-fadeIn text-left select-none max-w-xl">
              <h2 className="text-md font-extrabold text-slate-800 mb-1">Meu Perfil Pessoal</h2>
              <p className="text-xs text-gray-400 mb-6">Atualize sua foto de perfil e dados cadastrais de acesso ao painel</p>

              <form onSubmit={handleUpdateMyProfile} className="space-y-5">
                {/* Upload de Imagem de Perfil */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="relative">
                    {profileMyPhoto ? (
                      <img
                        src={profileMyPhoto}
                        alt="Foto de Perfil"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${loggedUser.avatarColor || 'from-pink-600 to-rose-400'} flex items-center justify-center font-extrabold text-lg text-white shadow-md border-2 border-white select-none`}>
                        {getInitials(loggedUser.name)}
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 w-6 h-6 bg-pink-700 hover:bg-pink-800 text-white rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all hover:scale-110">
                      <Camera className="w-3 h-3" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMyPhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-gray-700">Foto de Perfil</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">Formatos suportados: JPG, PNG. Máx 2MB.</span>
                    {profileMyPhoto && (
                      <button
                        type="button"
                        onClick={() => setProfileMyPhoto(undefined)}
                        className="text-[10px] text-rose-600 hover:text-rose-800 font-bold uppercase tracking-wider transition-colors cursor-pointer w-fit mt-1.5"
                      >
                        Remover Foto
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={profileMyName}
                    onChange={(e) => setProfileMyName(e.target.value)}
                    className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-pink-500 bg-white"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase">E-mail Corporativo</label>
                    <input
                      type="email"
                      required
                      value={profileMyEmail}
                      onChange={(e) => setProfileMyEmail(e.target.value)}
                      className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-pink-500 bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase">Usuário de Acesso</label>
                    <input
                      type="text"
                      required
                      value={profileMyUsername}
                      onChange={(e) => setProfileMyUsername(e.target.value)}
                      className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-pink-500 bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase">Cargo / Função</label>
                    <input
                      type="text"
                      readOnly
                      value={loggedUser.role}
                      className="px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 bg-slate-50 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase">Senha de Acesso</label>
                    <div className="relative">
                      <input
                        type={showMyPassword ? 'text' : 'password'}
                        placeholder="Deixe em branco para manter a senha atual"
                        value={profileMyPassword}
                        onChange={(e) => setProfileMyPassword(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-pink-500 pr-10 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowMyPassword(!showMyPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 bg-gradient-to-r from-pink-700 to-pink-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:scale-102 transition-transform cursor-pointer w-fit"
                >
                  Salvar Alterações
                </button>
              </form>
            </div>
          )}

          {/* TAB 1: GERENCIAMENTO DE USUÁRIOS */}
          {activeTab === 'usuarios' && (
            <div className="flex flex-col h-full overflow-hidden animate-fadeIn min-h-0">
              {/* Header do CRUD */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 shrink-0 select-none">
                <div>
                  <h2 className="text-[13px] sm:text-md font-extrabold text-slate-800 leading-none">Contas e Membros Ativos</h2>
                  <p className="hidden sm:block text-[11px] sm:text-xs text-gray-400">Configure quem possui acesso de visualização ou administração técnica</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {/* Barra de Pesquisa */}
                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Pesquisar usuários..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 sm:py-2 border border-slate-200 rounded-2xl text-[11px] font-semibold text-gray-700 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  {/* Adicionar Usuário */}
                  <button
                    onClick={handleOpenAddModal}
                    className="py-2 sm:py-2 px-3 bg-gradient-to-r from-pink-700 to-pink-500 text-white font-bold rounded-2xl text-[10px] flex items-center justify-center gap-1 cursor-pointer shadow-md hover:scale-102 active:scale-98 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 animate-pulse" /> Novo Usuário
                  </button>
                </div>
              </div>

              {/* Grid / Tabela de Usuários */}
              <div className="mobile-scroll flex-grow min-h-0 overflow-hidden border border-slate-100 rounded-2xl bg-slate-50/50">
                {/* Versão Desktop (Tabela) */}
                <table className="w-full text-xs text-slate-600 min-w-[600px] border-collapse hidden md:table">
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
                            {/* Avatar Dinâmico com Iniciais e Degradê Premium ou Imagem de Perfil */}
                            {user.photo ? (
                              <img
                                src={user.photo}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover shadow-sm flex-shrink-0 border border-slate-100"
                              />
                            ) : (
                              <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${user.avatarColor} flex items-center justify-center font-extrabold text-sm text-white shadow-sm flex-shrink-0 select-none`}>
                                {getInitials(user.name)}
                              </div>
                            )}
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-gray-800 text-[13px]">{user.name}</span>
                              <span className="text-gray-400 font-medium text-[11px] flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {maskEmail(user.email)}
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

                {/* Versão Mobile (Cards) */}
                <div className="grid grid-cols-1 gap-2 p-2 md:hidden">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="mobile-card min-h-[132px] bg-white border border-slate-100 rounded-2xl p-2.5 shadow-sm flex flex-col gap-2 overflow-hidden">
                      <div className="flex items-center gap-2 min-w-0">
                        {user.photo ? (
                          <img
                            src={user.photo}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0 border border-slate-100"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${user.avatarColor} flex items-center justify-center font-extrabold text-[11px] text-white shadow-sm shrink-0`}>
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0 text-left flex-1">
                          <span className="font-bold text-gray-800 text-[11px] leading-tight truncate">{user.name}</span>
                          <span className="mobile-small text-gray-400 font-medium truncate mt-0.5">{maskEmail(user.email)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 border-t border-slate-100/60 pt-2">
                        <div className="flex flex-wrap gap-1.5 min-w-0">
                          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full text-[9px] flex items-center gap-1">
                            <Briefcase className="w-2.5 h-2.5 text-slate-400" />
                            {user.role}
                          </span>
                          {user.status === 'ativo' ? (
                            <span className="bg-emerald-50 text-emerald-600 font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                              <UserCheck className="w-2.5 h-2.5" /> Ativo
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-400 font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                              <UserX className="w-2.5 h-2.5" /> Inativo
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                            title="Editar Usuário"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center cursor-pointer"
                            title="Excluir Usuário"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="col-span-2 p-6 text-center text-slate-400 font-medium text-xs">
                      Nenhum usuário encontrado correspondente à pesquisa.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERFIL DA COOPERATIVA */}
          {activeTab === 'perfil' && (
            <div className="flex flex-col h-full overflow-y-auto pr-1 animate-fadeIn text-left select-none">
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
            <div className="flex flex-col h-full overflow-y-auto pr-1 animate-fadeIn text-left select-none">
              <h2 className="text-md font-extrabold text-slate-800 mb-1">Aparência & Segurança do Painel</h2>
              <p className="text-xs text-gray-400 mb-6">Personalize a exibição do dashboard e configure tokens de segurança das APIs corporativas</p>

              <div className="max-w-2xl space-y-6">
                {/* Botão de Instalação PWA */}
                {!isInstalled && (
                  <div className="p-5 border border-pink-200 bg-gradient-to-r from-pink-50 to-pink-100/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 text-pink-600 border border-pink-100">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div>
                      <h3 className="font-extrabold text-slate-800 text-sm">Instalar aplicativo</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Instale o Dashboard no seu dispositivo para uso rápido, sem barras do navegador.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (isInstallable) {
                          installApp();
                        } else {
                          alert("A instalação pelo botão não está disponível agora (seu navegador pode já ter instalado, ou não suporta o atalho direto). Tente a opção 'Adicionar à Tela Inicial' no menu do seu navegador.");
                        }
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-pink-700 to-pink-500 text-white rounded-xl font-bold text-[11px] shadow-md shadow-pink-200 hover:scale-105 active:scale-95 transition-all shrink-0 uppercase tracking-wider"
                    >
                      Instalar aplicativo
                    </button>
                  </div>
                )}

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
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                    Sua conta está integrada com o provedor de identidade Microsoft Active Directory (AD) corporativo. Para alterar sua senha mestra, solicite a alteração junto ao suporte de TI da Uniodonto.
                  </p>
                </div>

                {/* Proteção de Dados & Privacidade (LGPD) */}
                <div className="p-5 border border-slate-200 bg-white rounded-2xl flex flex-col gap-4 shadow-sm">
                  <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                    Proteção de Dados & Privacidade (LGPD)
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                    Cooperativa Odontológica Uniodonto Passos está em plena conformidade com a Lei Geral de Proteção de Dados (LGPD). Todos os acessos e logs de credenciais são estritamente protegidos localmente e os dados de beneficiários em planilhas são 100% anonimizados.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsPrivacyOpen(true)}
                    className="py-2.5 px-5 border border-slate-200 hover:border-pink-500 hover:bg-pink-50/20 text-slate-700 hover:text-pink-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors w-fit select-none"
                  >
                    <ShieldAlert className="w-4 h-4 text-pink-700 shrink-0" /> Visualizar Política de Privacidade
                  </button>
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
            <div className="flex flex-col h-full overflow-y-auto pr-1 animate-fadeIn text-left select-none">
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
              {/* Upload de Imagem de Perfil */}
              <div className="flex flex-col items-center gap-2 mb-2 select-none">
                <div className="relative group/avatar">
                  {formPhoto ? (
                    <img
                      src={formPhoto}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-pink-100 shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border border-dashed border-slate-300 text-slate-400">
                      <UserIcon className="w-8 h-8 opacity-60" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 w-7 h-7 bg-pink-700 hover:bg-pink-800 text-white rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all hover:scale-110">
                    <Camera className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <span className="text-[9px] font-bold text-gray-400 uppercase">Foto de Perfil</span>
                {formPhoto && (
                  <button
                    type="button"
                    onClick={() => setFormPhoto(undefined)}
                    className="text-[9px] text-rose-600 hover:text-rose-800 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Remover Foto
                  </button>
                )}
              </div>

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
                    placeholder="Deixe em branco para usar o padrão 1234"
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
              {/* Upload de Imagem de Perfil */}
              <div className="flex flex-col items-center gap-2 mb-2 select-none">
                <div className="relative group/avatar">
                  {formPhoto ? (
                    <img
                      src={formPhoto}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-pink-100 shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border border-dashed border-slate-300 text-slate-400">
                      <UserIcon className="w-8 h-8 opacity-60" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 w-7 h-7 bg-pink-700 hover:bg-pink-800 text-white rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all hover:scale-110">
                    <Camera className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <span className="text-[9px] font-bold text-gray-400 uppercase">Foto de Perfil</span>
                {formPhoto && (
                  <button
                    type="button"
                    onClick={() => setFormPhoto(undefined)}
                    className="text-[9px] text-rose-600 hover:text-rose-800 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Remover Foto
                  </button>
                )}
              </div>

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
                    placeholder="Deixe em branco para manter a senha atual"
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

      {/* Modal de Politica de Privacidade LGPD */}
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  );
};

export default Settings;
