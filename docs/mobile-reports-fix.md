# Correção de Responsividade Mobile — Relatórios Analíticos

Este documento descreve as correções de UX e responsividade aplicadas na tela de **Relatórios Analíticos** (`Reports.tsx`) para garantir uma experiência de visualização excelente no mobile Android (360px a 430px) sem quebrar o layout desktop.

---

## 🛠️ Problemas Corrigidos

1. **Header Mobile Otimizado:**
   - O título foi reduzido de "Relatórios Analíticos" para **"Relatórios"** no celular, com tamanho de fonte de `text-[30px]` e margens reduzidas.
   - O subtítulo longo foi substituído no mobile por um texto mais conciso: *"Exporte análises comerciais e de marketing."*, com tamanho de `15px`.
   
2. **Card de Filtros Compactado:**
   - O seletor de "Canal Comercial" que anteriormente ficava isolado agora está integrado em um card compacto junto aos seletores de meses e período.
   - Os filtros de início/fim e checkboxes estão dispostos em grid de 2 colunas e padding de 16px no mobile, de fácil interação.

3. **Card de Ações de Exportação Limpo:**
   - Foram removidos quaisquer eixos, legendas, gráficos de linha ou SVGs soltos que sobrepunham o botão "Exportar em CSV" ou outros elementos de ação.
   - Inserido o botão primário **"Gerar Relatório"** com largura total (`w-full`).
   - Os botões "CSV" e "PDF" foram estruturados lado a lado com largura confortável e altura mínima de 48px (`h-12`).
   - O botão "Imprimir Relatório (A4)" foi estilizado como outline ocupando a largura total.

4. **Card de Prévia do Relatório Separado:**
   - Criado um card exclusivo para exibir a **Prévia do Relatório** contendo apenas as estatísticas executivas necessárias (Período, Canal, Investimento, Leads, Conversões, CAC e o status "Pronto para exportar").
   - O painel timbrado do relatório A4 e os gráficos de linha que causavam colisão de toque foram ocultados no mobile (`hidden lg:flex print:flex`), aparecendo apenas no desktop e na impressão física/PDF.

5. **Alerta de PDF Reduzido:**
   - O texto descritivo e longo sobre a exportação de PDF foi substituído por um alerta compacto com ícone informativo: *"Para salvar em PDF, toque em 'PDF'. A janela do navegador será aberta para concluir o download."*, mantendo a fonte em `text-[13px]`.

6. **Margem de Segurança da Bottom Navigation:**
   - O container da página recebeu a classe `pb-28` no mobile, garantindo que o último card ou rodapé da tela nunca fique encoberto pelo menu de navegação inferior.

---

## 🧬 Classes Responsivas e Tailwind Empregadas

- **Separação de layouts:** A prévia timbrada de desktop e a sidebar original de filtros receberam as classes `hidden lg:flex print:flex` e `hidden lg:flex lg:flex-col print:hidden` respectivamente.
- **Estruturas Mobile-First:** O layout específico para o celular foi envolvido na div com a classe `flex flex-col space-y-4 lg:hidden print:hidden pb-12 w-full`.
- **Botões e Toque:** Alturas padronizadas em `h-12` (48px) para acessibilidade móvel e cantos arredondados com `rounded-2xl` e `rounded-3xl` para um visual premium.
