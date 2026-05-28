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

  it('3. Deve mostrar erro ao tentar logar com email ou usuário que não está cadastrado', () => {
    render(<Login onLoginSuccess={() => {}} />);

    const inputEmail = screen.getByLabelText(/Usuário ou E-mail/i);
    const inputSenha = screen.getByLabelText(/Senha de Acesso/i);
    const btnEntrar = screen.getByRole('button', { name: /Entrar no Painel/i });

    fireEvent.change(inputEmail, { target: { value: 'invalido@uniodonto.com' } });
    fireEvent.change(inputSenha, { target: { value: '1234' } });

    fireEvent.click(btnEntrar);

    // Avança os cronômetros simulados para o login rodar (400ms)
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByText('Usuário ou E-mail não cadastrado no painel.')).toBeInTheDocument();
  });

  it('4. Deve mostrar erro ao tentar logar com senha incorreta', () => {
    render(<Login onLoginSuccess={() => {}} />);

    const inputEmail = screen.getByLabelText(/Usuário ou E-mail/i);
    const inputSenha = screen.getByLabelText(/Senha de Acesso/i);
    const btnEntrar = screen.getByRole('button', { name: /Entrar no Painel/i });

    // fertaisetech@gmail.com é um usuário mockado com senha "1234"
    fireEvent.change(inputEmail, { target: { value: 'fertaisetech@gmail.com' } });
    fireEvent.change(inputSenha, { target: { value: '9999' } });

    fireEvent.click(btnEntrar);

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByText('Senha de acesso incorreta.')).toBeInTheDocument();
  });

  it('5. Deve mostrar erro de conta inativa ao tentar logar com usuário inativo', () => {
    render(<Login onLoginSuccess={() => {}} />);

    const inputEmail = screen.getByLabelText(/Usuário ou E-mail/i);
    const inputSenha = screen.getByLabelText(/Senha de Acesso/i);
    const btnEntrar = screen.getByRole('button', { name: /Entrar no Painel/i });

    // Dr. Elcio Beraldo (elcio@uniodonto.com) está marcado como "inativo"
    fireEvent.change(inputEmail, { target: { value: 'elcio@uniodonto.com' } });
    fireEvent.change(inputSenha, { target: { value: '1234' } });

    fireEvent.click(btnEntrar);

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByText('Esta conta está inativa. Entre em contato com o administrador.')).toBeInTheDocument();
  });

  it('6. Deve efetuar login com sucesso usando E-mail e chamar onLoginSuccess', () => {
    const handleLoginSuccess = vi.fn();
    render(<Login onLoginSuccess={handleLoginSuccess} />);

    const inputEmail = screen.getByLabelText(/Usuário ou E-mail/i);
    const inputSenha = screen.getByLabelText(/Senha de Acesso/i);
    const btnEntrar = screen.getByRole('button', { name: /Entrar no Painel/i });

    fireEvent.change(inputEmail, { target: { value: 'fertaisetech@gmail.com' } });
    fireEvent.change(inputSenha, { target: { value: '1234' } });

    fireEvent.click(btnEntrar);

    act(() => {
      vi.advanceTimersByTime(400);
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

  it('7. Deve efetuar login com sucesso usando o campo de Usuário (username) customizado', () => {
    const handleLoginSuccess = vi.fn();
    
    // Configura um usuário com username diferente do e-mail no localStorage
    const testUsers = [
      { id: '1', name: 'FerTaise Tech Admin', email: 'fertaisetech@gmail.com', username: 'fertaise_admin', role: 'Tech FerTaise', status: 'ativo', avatarColor: 'from-pink-600 to-rose-400', password: '1234' }
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

    act(() => {
      vi.advanceTimersByTime(400);
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
