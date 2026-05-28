import React, { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff, ShieldAlert, KeyRound, User as UserIcon } from 'lucide-react';
import { User } from './Settings';

// Mock padrão igual ao Settings.tsx caso o localStorage esteja vazio
const defaultMockUsers: User[] = [
  { id: '1', name: 'FerTaise Tech Admin', email: 'fertaisetech@gmail.com', username: 'fertaisetech@gmail.com', role: 'Tech FerTaise', status: 'ativo', avatarColor: 'from-pink-600 to-rose-400', password: '1234' },
  { id: '2', name: 'Dr. Elcio Beraldo', email: 'elcio@uniodonto.com', username: 'elcio@uniodonto.com', role: 'Diretor', status: 'inativo', avatarColor: 'from-blue-600 to-teal-400', password: '1234' },
  { id: '3', name: 'Dr. Luiz Fernando', email: 'luiz@uniodonto.com', username: 'luiz@uniodonto.com', role: 'Diretor', status: 'inativo', avatarColor: 'from-purple-600 to-indigo-400', password: '1234' },
  { id: '4', name: 'Dr. Mateus José', email: 'mateus@uniodonto.com', username: 'mateus@uniodonto.com', role: 'Diretor', status: 'inativo', avatarColor: 'from-amber-600 to-orange-400', password: '1234' },
  { id: '5', name: 'Janaína Pádua', email: 'gerente@uniodonto.com', username: 'gerente@uniodonto.com', role: 'Gerente', status: 'inativo', avatarColor: 'from-emerald-600 to-green-400', password: '1234' }
];

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState(''); // O estado "email" aqui servirá tanto para email quanto username
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Limpa mensagem de erro ao digitar
  useEffect(() => {
    if (errorMsg) setErrorMsg('');
  }, [email, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    // Simula uma resposta rápida de rede (400ms) para ficar premium e realista
    setTimeout(() => {
      // 1. Carrega os usuários salvos no localStorage (ou inicializa os padrões)
      const savedUsersRaw = localStorage.getItem('uniodonto_settings_users');
      let currentUsers: User[] = defaultMockUsers;

      if (savedUsersRaw) {
        try {
          currentUsers = JSON.parse(savedUsersRaw);
        } catch (e) {
          currentUsers = defaultMockUsers;
        }
      } else {
        // Inicializa caso o localStorage esteja vazio
        localStorage.setItem('uniodonto_settings_users', JSON.stringify(defaultMockUsers));
      }

      // 2. Busca o usuário correspondente (aceita email ou username)
      const foundUser = currentUsers.find(
        u => u.email.trim().toLowerCase() === email.trim().toLowerCase() ||
             (u.username && u.username.trim().toLowerCase() === email.trim().toLowerCase())
      );

      if (!foundUser) {
        setErrorMsg('Usuário ou E-mail não cadastrado no painel.');
        setLoading(false);
        return;
      }

      // 3. Valida a senha (ou compara com a senha cadastrada, padrão '1234')
      const userPassword = foundUser.password || '1234';
      if (userPassword !== password) {
        setErrorMsg('Senha de acesso incorreta.');
        setLoading(false);
        return;
      }

      // 4. Valida se o usuário está ativo no sistema
      if (foundUser.status === 'inativo') {
        setErrorMsg('Esta conta está inativa. Entre em contato com o administrador.');
        setLoading(false);
        return;
      }

      // Sucesso no login!
      setLoading(false);
      onLoginSuccess(foundUser);
    }, 400);
  };

  return (
    <div className="min-h-screen w-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none select-none-all">
      {/* Círculos Premium de Fundo para Efeito Flutuante (Oculto em celular pequeno para performance) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-pink-300/20 to-rose-400/10 blur-3xl pointer-events-none hidden md:block"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-300/20 to-pink-400/15 blur-3xl pointer-events-none hidden md:block"></div>

      {/* Card Central */}
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(136,14,79,0.06)] overflow-hidden flex flex-col p-6 sm:p-8 animate-fadeIn relative z-10 transition-all duration-300">
        
        {/* Header do Login */}
        <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-pink-700 to-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-pink-100 mb-4 animate-scaleUp">
            U
          </div>
          <h2 className="text-gray-800 font-black text-lg sm:text-xl tracking-tight leading-tight">
            UNIODONTO PASSOS
          </h2>
          <span className="text-[10px] sm:text-xs font-bold text-pink-700 bg-pink-50 border border-pink-100 px-3 py-1 rounded-full mt-2 uppercase tracking-widest">
            Cooperativa Odontológica
          </span>
          <p className="text-xs text-gray-400 font-semibold mt-3 max-w-[280px] leading-relaxed">
            Painel Consolidado de Análise e Monitoramento de Indicadores
          </p>
        </div>

        {/* Mensagem de Erro Premium */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-fadeIn shadow-sm">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[11px] font-bold text-rose-800 leading-normal text-left">{errorMsg}</p>
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* E-mail / Usuário */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider cursor-pointer">
              Usuário ou E-mail
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <UserIcon className="w-4 h-4" />
              </span>
              <input
                id="login-email"
                type="text"
                required
                placeholder="Seu usuário ou e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/20 bg-slate-50/50 hover:bg-slate-50 transition-all placeholder-slate-400"
                style={{ fontSize: '16px' }} // Evita zoom automático no iOS Safari
              />
            </div>
          </div>

          {/* Senha */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="login-password" className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider cursor-pointer">
                Senha de Acesso
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Sua senha de 4 dígitos"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/20 bg-slate-50/50 hover:bg-slate-50 transition-all placeholder-slate-400"
                style={{ fontSize: '16px' }} // Evita zoom automático no iOS Safari
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Botão Acessar */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 bg-gradient-to-r from-pink-700 to-pink-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-widest shadow-md shadow-pink-100 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 select-none ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Entrar no Painel'
            )}
          </button>
        </form>

        {/* Rodapé do Card */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col items-center gap-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Desenvolvido por
          </span>
          <span className="text-[11px] font-black text-pink-800 bg-pink-50/60 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-pink-100/50">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-600 animate-pulse"></span>
            FerTaise Tech
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
