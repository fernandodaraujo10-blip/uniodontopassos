import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Settings from '../pages/Settings';

describe('Painel de Configurações - Testes de Gestão de Usuários e Senhas', () => {
  beforeEach(() => {
    // Limpa o localStorage antes de cada teste para garantir isolamento
    localStorage.clear();
  });

  it('1. Deve renderizar a listagem inicial dos novos usuários e seus cargos corretamente', () => {
    render(<Settings />);

    // Verifica se os novos usuários solicitados estão presentes na tabela
    expect(screen.getByText('FerTaise Tech Admin')).toBeInTheDocument();
    expect(screen.getByText('Dr. Elcio Beraldo')).toBeInTheDocument();
    expect(screen.getByText('Dr. Luiz Fernando')).toBeInTheDocument();
    expect(screen.getByText('Dr. Mateus José')).toBeInTheDocument();
    expect(screen.getByText('Janaína Pádua')).toBeInTheDocument();

    // Verifica se os emails estão corretos
    expect(screen.getByText('fertaisetech@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('elcio@uniodonto.com')).toBeInTheDocument();
    expect(screen.getByText('luiz@uniodonto.com')).toBeInTheDocument();
    expect(screen.getByText('mateus@uniodonto.com')).toBeInTheDocument();
    expect(screen.getByText('gerente@uniodonto.com')).toBeInTheDocument();

    // Verifica os novos cargos atribuídos
    const techRoles = screen.getAllByText('Tech FerTaise');
    const directorRoles = screen.getAllByText('Diretor');
    const managerRoles = screen.getAllByText('Gerente');

    expect(techRoles.length).toBeGreaterThan(0);
    expect(directorRoles.length).toBeGreaterThan(0);
    expect(managerRoles.length).toBeGreaterThan(0);
  });

  it('2. Deve abrir o modal de Novo Usuário, permitir digitar uma senha customizada, selecionar e-mail como usuário e criar o usuário', () => {
    render(<Settings />);

    // Clica no botão de criar novo usuário
    const btnNovo = screen.getByRole('button', { name: /Novo Usuário/i });
    fireEvent.click(btnNovo);

    // Verifica se o modal abriu
    expect(screen.getByRole('heading', { name: /Criar Novo Usuário/i })).toBeInTheDocument();

    // Preenche os campos do formulário usando placeholders
    const inputNome = screen.getByPlaceholderText('Ex: Mariana Costa');
    const inputEmail = screen.getByPlaceholderText('mariana.costa@uniodontopassos.com.br');
    const inputSenha = screen.getByPlaceholderText('Senha do usuário');
    const inputUsuario = screen.getByPlaceholderText('Nome de usuário ou e-mail');

    fireEvent.change(inputNome, { target: { value: 'Mariana Costa' } });
    fireEvent.change(inputEmail, { target: { value: 'mariana.costa@uniodonto.com' } });
    fireEvent.change(inputSenha, { target: { value: '5678' } }); // Senha customizada

    // Clica no botão "Usar E-mail" para preencher o campo usuário automaticamente
    const btnUsarEmail = screen.getByRole('button', { name: /Usar E-mail/i });
    fireEvent.click(btnUsarEmail);

    // Verifica se o campo usuário foi preenchido com o e-mail
    expect(inputUsuario).toHaveValue('mariana.costa@uniodonto.com');

    // Submete o formulário
    const btnCriar = screen.getByRole('button', { name: /Criar Conta/i });
    fireEvent.click(btnCriar);

    // Verifica se o modal fechou e o usuário foi criado na listagem
    expect(screen.getByText('Mariana Costa')).toBeInTheDocument();
    expect(screen.getByText('mariana.costa@uniodonto.com')).toBeInTheDocument();
    expect(screen.getAllByText('Tech FerTaise').length).toBeGreaterThan(1); // Múltiplos usuários com cargo Tech FerTaise
  });

  it('3. Deve abrir o modal de edição de um usuário, carregar a senha atual 1234, permitir alterá-la e salvar', () => {
    render(<Settings />);

    // Clica no ícone de editar (lápis) do primeiro usuário (FerTaise Tech Admin)
    const botoesEditar = screen.getAllByTitle('Editar Usuário');
    fireEvent.click(botoesEditar[0]);

    // Verifica se o modal de edição abriu
    expect(screen.getByRole('heading', { name: /Editar Usuário/i })).toBeInTheDocument();

    // Verifica se a senha inicial "1234" é mostrada no campo de senha
    const inputSenha = screen.getByPlaceholderText('Senha do usuário');
    expect(inputSenha).toHaveValue('1234');

    // Altera a senha para "9999"
    fireEvent.change(inputSenha, { target: { value: '9999' } });

    // Salva a edição
    const btnSalvar = screen.getByRole('button', { name: /Salvar/i });
    fireEvent.click(btnSalvar);

    // Reabre o modal de edição do mesmo usuário para verificar se a nova senha foi salva
    const botoesEditarReabrir = screen.getAllByTitle('Editar Usuário');
    fireEvent.click(botoesEditarReabrir[0]);

    const inputSenhaAtualizada = screen.getByPlaceholderText('Senha do usuário');
    expect(inputSenhaAtualizada).toHaveValue('9999');
  });

  it('4. Deve alternar a visibilidade da senha entre texto e oculto ao clicar no botão de olho', () => {
    render(<Settings />);

    // Abre o modal de Novo Usuário
    const btnNovo = screen.getByRole('button', { name: /Novo Usuário/i });
    fireEvent.click(btnNovo);

    const inputSenha = screen.getByPlaceholderText('Senha do usuário');
    // Por padrão o tipo deve ser password
    expect(inputSenha).toHaveAttribute('type', 'password');

    // Clica no botão de alternar visibilidade (olho)
    const btnOlho = inputSenha.nextElementSibling as HTMLButtonElement;
    expect(btnOlho).toBeInTheDocument();
    fireEvent.click(btnOlho);

    // O tipo deve mudar para text
    expect(inputSenha).toHaveAttribute('type', 'text');

    // Clica novamente para ocultar
    fireEvent.click(btnOlho);
    expect(inputSenha).toHaveAttribute('type', 'password');
  });

  it('5. Deve renderizar os botões de alternância de aparência e acionar a callback setTheme', () => {
    const handleSetTheme = vi.fn();
    render(<Settings theme="light" setTheme={handleSetTheme} />);

    // Navega até a aba "Segurança & API" (rebatizada para "Aparência & Segurança do Painel")
    const btnSeguranca = screen.getByRole('button', { name: /Segurança/i });
    fireEvent.click(btnSeguranca);

    // Verifica se os botões de Modo Claro e Modo Escuro estão presentes
    expect(screen.getByRole('button', { name: /Modo Claro/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Modo Escuro/i })).toBeInTheDocument();

    // Clica em "Modo Escuro" e verifica se a callback é chamada com 'dark'
    const btnEscuro = screen.getByRole('button', { name: /Modo Escuro/i });
    fireEvent.click(btnEscuro);

    expect(handleSetTheme).toHaveBeenCalledTimes(1);
    expect(handleSetTheme).toHaveBeenCalledWith('dark');
  });
});
