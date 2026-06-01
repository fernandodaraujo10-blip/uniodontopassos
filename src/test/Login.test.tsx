import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import Login from '../pages/Login';

describe('Tela de Login - Autenticação e Regras de Negócio', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('1. Deve renderizar os elements da tela de login corretamente', () => {
    render(<Login onLoginSuccess={() => {}} />);

    // Título e subsegmentos
    expect(screen.getByText('UNIODONTO PASSOS')).toBeInTheDocument();
    expect(screen.getByText('Cooperativa Odontológica')).toBeInTheDocument();
    expect(screen.getByText('FerTaise Tech')).toBeInTheDocument();

    // Inputs vinculados via label/htmlFor
    expect(screen.getByLabelText(/Usuário ou E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha de Acesso/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Seu usuário ou e-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Sua senha de 4 dígitos')).toBeInTheDocument();

    // Botão entrar
    expect(screen.getByRole('button', { name: /Entrar no Painel/i })).toBeInTheDocument();

    // Checkbox LGPD
    expect(screen.getAllByLabelText(/Ao entrar, você concorda que o sistema processe suas credenciais/i)[0]).toBeInTheDocument();
  });

  it('2. Deve alternar a visibilidade da senha entre texto e oculto ao clicar no botão do olho', () => {
    render(<Login onLoginSuccess={() => {}} />);

    const inputSenha = screen.getByLabelText(/Senha de Acesso/i);
    expect(inputSenha).toHaveAttribute('type', 'password');

    // Obtém o botão do olho (é o primeiro botão do formulário, que é do toggle)
    const btnOlho = screen.getAllByRole('button')[0];
    
    // Clica para exibir
    fireEvent.click(btnOlho);
    expect(inputSenha).toHaveAttribute('type', 'text');

    // Clica para ocultar novamente
    fireEvent.click(btnOlho);
    expect(inputSenha).toHaveAttribute('type', 'password');
  });

  it('2.1. Deve mostrar erro ao tentar logar sem marcar o checkbox de consentimento da LGPD', () => {
    render(<Login onLoginSuccess={() => {}} />);

    const inputEmail = screen.getByLabelText(/Usuário ou E-mail/i);
    const inputSenha = screen.getByLabelText(/Senha de Acesso/i);
    const btnEntrar = screen.getByRole('button', { name: /Entrar no Painel/i });

    fireEvent.change(inputEmail, { target: { value: 'fertaisetech@gmail.com' } });
    fireEvent.change(inputSenha, { target: { value: '1234' } });

    // Desmarca o checkbox de consentimento (que começa como true nos testes para compatibilidade retroativa)
    fireEvent.click(screen.getByRole('checkbox'));

    // Clica em Entrar sem marcar o checkbox
    fireEvent.click(btnEntrar);

    expect(screen.getByText('Você precisa aceitar os termos de consentimento e privacidade para prosseguir.')).toBeInTheDocument();
  });

  it('3. Deve mostrar erro ao tentar logar com email ou usuário que não está cadastrado', async () => {
    render(<Login onLoginSuccess={() => {}} />);

    const inputEmail = screen.getByLabelText(/Usuário ou E-mail/i);
    const inputSenha = screen.getByLabelText(/Senha de Acesso/i);
    const btnEntrar = screen.getByRole('button', { name: /Entrar no Painel/i });

    fireEvent.change(inputEmail, { target: { value: 'invalido@uniodonto.com' } });
    fireEvent.change(inputSenha, { target: { value: '1234' } });

    fireEvent.click(btnEntrar);

    // Aguarda microtasks residuais de inicialização assíncrona
    await act(async () => {
      await Promise.resolve();
    });

    // Avança cronômetros e processa microtasks pendentes de forma assíncrona
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });

    expect(screen.getByText('Usuário ou E-mail não cadastrado no painel.')).toBeInTheDocument();
  });

  it('4. Deve mostrar erro ao tentar logar com senha incorreta', async () => {
    render(<Login onLoginSuccess={() => {}} />);

    const inputEmail = screen.getByLabelText(/Usuário ou E-mail/i);
    const inputSenha = screen.getByLabelText(/Senha de Acesso/i);
    const btnEntrar = screen.getByRole('button', { name: /Entrar no Painel/i });

    // fertaisetech@gmail.com é um usuário mockado com senha "1234"
    fireEvent.change(inputEmail, { target: { value: 'fertaisetech@gmail.com' } });
    fireEvent.change(inputSenha, { target: { value: '9999' } });

    fireEvent.click(btnEntrar);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });

    expect(screen.getByText('Senha de acesso incorreta.')).toBeInTheDocument();
  });

  it('5. Deve mostrar erro de conta inativa ao tentar logar com usuário inativo', async () => {
    const mockUsersWithInactive = [
      { id: '1', name: 'FerTaise Tech Admin', email: 'fertaisetech@gmail.com', username: 'fertaisetech@gmail.com', role: 'Tech FerTaise', status: 'inativo', avatarColor: 'from-pink-600 to-rose-400', password: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4' },
      { id: '2', name: 'Dr. Elcio Beraldo', email: 'elcio@uniodonto.com', username: 'elcio@uniodonto.com', role: 'Diretor', status: 'ativo', avatarColor: 'from-blue-600 to-teal-400', password: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', photo: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0420780722.firebasestorage.app/o/1.1-Uniodonto%2F1.1-Imagens%2FDr.Elcio.png?alt=media&token=1ade4c11-ba33-4ff9-865e-7e19fe095943' }
    ];
    localStorage.setItem('uniodonto_settings_users', JSON.stringify(mockUsersWithInactive));

    render(<Login onLoginSuccess={() => {}} />);

    const inputEmail = screen.getByLabelText(/Usuário ou E-mail/i);
    const inputSenha = screen.getByLabelText(/Senha de Acesso/i);
    const btnEntrar = screen.getByRole('button', { name: /Entrar no Painel/i });

    // FerTaise Tech Admin (fertaisetech@gmail.com) está marcado como "inativo" no mock de teste
    fireEvent.change(inputEmail, { target: { value: 'fertaisetech@gmail.com' } });
    fireEvent.change(inputSenha, { target: { value: '1234' } });

    fireEvent.click(btnEntrar);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });

    expect(screen.getByText('Esta conta está inativa. Entre em contato com o administrador.')).toBeInTheDocument();
  });

  it('6. Deve efetuar login com sucesso usando E-mail e chamar onLoginSuccess', async () => {
    const handleLoginSuccess = vi.fn();
    render(<Login onLoginSuccess={handleLoginSuccess} />);

    const inputEmail = screen.getByLabelText(/Usuário ou E-mail/i);
    const inputSenha = screen.getByLabelText(/Senha de Acesso/i);
    const btnEntrar = screen.getByRole('button', { name: /Entrar no Painel/i });

    fireEvent.change(inputEmail, { target: { value: 'fertaisetech@gmail.com' } });
    fireEvent.change(inputSenha, { target: { value: '1234' } });

    fireEvent.click(btnEntrar);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });

    expect(handleLoginSuccess).toHaveBeenCalledTimes(1);
    expect(handleLoginSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'fertaisetech@gmail.com',
        name: 'FerTaise Tech Admin',
        role: 'Tech FerTaise',
        status: 'ativo'
      })
    );
  });

  it('7. Deve efetuar login com sucesso usando o campo de Usuário (username) customizado', async () => {
    const handleLoginSuccess = vi.fn();
    
    // Configura um usuário com username diferente do e-mail no localStorage
    const testUsers = [
      { id: '1', name: 'FerTaise Tech Admin', email: 'fertaisetech@gmail.com', username: 'fertaise_admin', role: 'Tech FerTaise', status: 'ativo', avatarColor: 'from-pink-600 to-rose-400', password: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4' }
    ];
    localStorage.setItem('uniodonto_settings_users', JSON.stringify(testUsers));

    render(<Login onLoginSuccess={handleLoginSuccess} />);

    const inputEmail = screen.getByLabelText(/Usuário ou E-mail/i);
    const inputSenha = screen.getByLabelText(/Senha de Acesso/i);
    const btnEntrar = screen.getByRole('button', { name: /Entrar no Painel/i });

    // Tenta logar com o username customizado 'fertaise_admin' ao invés do e-mail
    fireEvent.change(inputEmail, { target: { value: 'fertaise_admin' } });
    fireEvent.change(inputSenha, { target: { value: '1234' } });

    fireEvent.click(btnEntrar);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });

    expect(handleLoginSuccess).toHaveBeenCalledTimes(1);
    expect(handleLoginSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'fertaise_admin',
        email: 'fertaisetech@gmail.com',
        status: 'ativo'
      })
    );
  });
});
