# POLÍTICA DE PRIVACIDADE E PROTEÇÃO DE DADOS
### Dashboard Uniodonto Passos

**Última Atualização:** 1 de Junho de 2026

Esta Política de Privacidade regulamenta a forma como o **Dashboard Uniodonto Passos** ("Painel" ou "Aplicação") coleta, processa, armazena, protege e descarta as credenciais administrativas e dados correlacionados dos operadores autorizados ("Titulares"), em estrita conformidade com a **Lei Geral de Proteção de Dados Pessoais (LGPD) - Lei nº 13.709/2018**.

---

### 1. Finalidade do Tratamento de Dados
O Dashboard processa uma quantidade estritamente mínima de informações pessoais, exclusivamente para fins de segurança e autenticação administrativa:
*   **Dados dos Operadores (Membros do Painel):** Nome Completo, Cargo, E-mail Corporativo, Nome de Usuário e Hash Criptográfico da Senha de Acesso.
*   **Finalidade Exclusiva:** Autenticar operadores autorizados da cooperativa Uniodonto Passos, gerenciar níveis de acesso hierárquico (Diretores, Gerentes, Operadores de TI) e manter logs de auditoria de segurança de acessos.

---

### 2. Anonimização e Higienização de Dados (LGPD Art. 12)
Em conformidade com o princípio da minimização de dados e segurança:
*   **Armazenamento de Senhas:** Nenhuma senha de acesso é salva em texto plano. O Dashboard aplica hashing criptográfico irreversível **SHA-256** localmente antes do tráfego ou persistência de dados.
*   **Mascaramento de Contatos:** E-mails corporativos são exibidos de forma mascarada na listagem pública de membros do painel para mitigar riscos de coleta indevida de dados por engenharia social (ex: `el***@uniodonto.com`).
*   **Tratamento de Planilhas Importadas:** Ao realizar o upload de planilhas de faturamento, beneficiários, leads ou campanhas de marketing, o parser do painel **anonimiza e elimina automaticamente** quaisquer colunas contendo dados pessoais identificáveis (PII) de pacientes ou clientes (tais como Nomes Completos, CPFs, RGs, Telefone, Celular ou E-mails de pacientes), retendo apenas agregadores estatísticos demográficos e numéricos desprovidos de identificação direta (Idade média, Cidade, Procedimento e Valor do Faturamento).

---

### 3. Compartilhamento e Destinatários dos Dados
*   Os dados de credenciais administrativas de operadores são armazenados localmente e de forma reativa segura no navegador (`localStorage` isolado) e nas APIs de autenticação autorizadas da Uniodonto Passos.
*   Não há qualquer compartilhamento, cessão, licenciamento ou venda de dados de operadores ou beneficiários para terceiros, parceiros de marketing ou brokers de dados sob nenhuma hipótese.

---

### 4. Período de Retenção e Descarte (LGPD Art. 16)
*   **Retenção:** Os dados de credenciais permanecem ativos enquanto o operador administrativo mantiver vínculo empregatício ou de prestação de serviços ativo com a Uniodonto Passos, ou até que a exclusão da conta seja solicitada pelo administrador de TI da cooperativa.
*   **Descarte Seguro:** A remoção de um usuário por exclusão no menu de Configurações apaga imediatamente e de forma definitiva todos os registros de credenciais, logs e chaves associadas daquele operador do banco local reativo (`localStorage`), sem possibilidade de recuperação posterior.

---

### 5. Direitos do Titular (LGPD Art. 18)
O operador administrativo, na qualidade de titular dos dados pessoais, pode exercer seus direitos de privacidade a qualquer momento diretamente no painel de configurações ou acionando o DPO (Encarregado de Proteção de Dados) da cooperativa:
1.  **Acesso e Confirmação:** Visualizar seus dados cadastrais a qualquer momento na aba "Meu Perfil".
2.  **Correção:** Alterar Nome, E-mail, Usuário e Senha na aba "Meu Perfil" nas Configurações Gerais.
3.  **Exclusão:** Solicitar a remoção completa de suas credenciais de acesso administrativas do painel ao administrador de TI corporativo.

---

### 6. Contato com o DPO / Encarregado de Proteção de Dados
Para dúvidas sobre esta política, incidentes de segurança ou solicitações de direitos de titulares, entre em contato com o encarregado da proteção de dados (DPO) através dos canais de TI internos da Uniodonto Passos ou pelo e-mail oficial de conformidade.
