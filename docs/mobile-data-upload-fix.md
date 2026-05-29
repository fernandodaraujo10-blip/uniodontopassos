# Correção de Responsividade Mobile — Envio e Integração de Dados

Este documento descreve as otimizações de UX e responsividade aplicadas na tela de **Envio e Integração de Dados** (`DataUpload.tsx`) para adequar perfeitamente a interface ao mobile Android (360px a 430px) sem impactar a exibição no desktop.

---

## 🛠️ Problemas Corrigidos

1. **Header Mobile Reduzido:**
   - O título foi alterado para **"Envio de Dados"** no mobile, com tamanho `text-[30px]` e margens compactadas.
   - O subtítulo longo foi substituído no celular por: *"Atualize métricas, investimentos e integrações."*, com tamanho de `15px`.

2. **Abas Superiores Deslizantes:**
   - As abas de navegação de topo receberam rótulos mais curtos no mobile: **"Manual"**, **"Planilhas"** e **"Integrações"** (substituindo Envio Manual, Planilhas & APIs, Integrações & Webhooks).
   - Aplicada a classe `overflow-x-auto whitespace-nowrap scrollbar-hide -mx-4 px-4 h-[52px]` para permitir deslizar horizontalmente sem quebras.

3. **Stepper do Envio Manual Otimizado:**
   - Substituído o indicador longo por chips horizontais deslizantes e interativos: `[1 Resumo]`, `[2 Investimentos]` e `[3 Tráfego]`.
   - As descrições adicionais e longas das etapas foram ocultadas no celular (`hidden sm:block`).
   - Corrigido o bug de destaque visual do passo ativo (utilizando agora `st.id === manualStep` dinamicamente).

4. **Reorganização de Botões do Wizard (Duas Linhas):**
   - No celular, os botões foram alinhados verticalmente em duas linhas na parte superior/inferior para facilitar o preenchimento:
     - **Linha 1:** Botão primário "Próximo Passo / Concluir" ocupando 100% da largura (`w-full`) com altura de 48px (`h-12`).
     - **Linha 2:** Botões secundários "Salvar" e "Importar" lado a lado com altura de 48px.
   - No desktop, os botões originais horizontais permanecem intactos.

5. **Exibição Condicional de Colunas (Fim do Excesso de Dados):**
   - O maior problema visual no mobile era a exibição simultânea das 3 colunas de formulários, criando uma página infinitamente longa.
   - Implementamos uma renderização condicional baseada no passo ativo (`manualStep`). No mobile, apenas o card do passo correspondente é renderizado, enquanto no desktop os três continuam dispostos lado a lado.
   - **Passo 1 (Resumo Geral)** $\rightarrow$ exibe apenas o formulário de KPIs macro.
   - **Passo 2 (Investimentos)** $\rightarrow$ exibe a listagem de cards de investimentos.
   - **Passo 3 (Tráfego)** $\rightarrow$ exibe as métricas de performance e campanhas de anúncios.

6. **Inputs Otimizados no Resumo Geral:**
   - Os campos numéricos do Resumo Geral foram reconfigurados para que, no mobile, as labels e inputs fiquem empilhados ou justificados com inputs ocupando largura total de forma confortável (`flex-col sm:flex-row gap-2`).

7. **Painel de Progresso e Auditoria:**
   - A barra de progresso do fechamento mensal ("Confirmar Tudo") foi reestruturada para empilhar em duas linhas no mobile, mantendo o botão de auditoria em tamanho confortável para toque.

8. **Rodapé e Rascunho Salvo:**
   - O rodapé técnico e os status de rascunho automático foram reordenados em coluna no celular, evitando cortes de tela, e posicionados acima do padding inferior de segurança (`pb-28`).

---

## 🧬 Classes Responsivas e Tailwind Empregadas

- **Navegação Dinâmica:** As abas e chips utilizam scroll horizontal através de `-mx-4 px-4 overflow-x-auto scrollbar-hide` para garantir que deslizar o dedo na tela do celular revele o conteúdo sem quebras.
- **Grids e Alturas:** Botões principais com classe `h-12` (48px) de altura para evitar cliques errados.
- **Exibição Condicional de Grid:** `manualStep === X ? 'flex' : 'hidden lg:flex'` nas divs dos formulários principais garante o empacotamento ideal de dados no celular e restauração perfeita da grade de 3 colunas no desktop.
