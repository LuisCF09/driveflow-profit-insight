## Objetivo

Ajustar copy de 5 páginas para deixar claro que o DriveFlow **não é afiliado oficialmente** a Uber, 99, iFood, Mercado Livre, Rappi ou qualquer outra plataforma, e que os dados servem apenas para organização financeira pessoal. Sem mudanças de funcionalidade, schema ou layout — só texto.

## Mudanças por página

### 1. `src/routes/como-funciona.tsx`
- **Card "Registre seus ganhos"** → texto: *"Registre seus ganhos de plataformas como Uber, 99, iFood, Mercado Livre, Rappi e outras."*
- **Card "Importe prints e comprovantes"** → texto: *"Importe prints dos seus aplicativos para facilitar o preenchimento dos dados financeiros."*
- **Card "Veja seu lucro real"** → manter, mas reescrever de forma neutra (sem sugerir integração).
- **Seção "O que você está pagando?"** → reforçar que a leitura inteligente *"tenta identificar os dados do print, mas você sempre deve revisar antes de salvar"*.
- **Nova seção/disclaimer no rodapé da página**, dentro do bloco "Observação" existente, com duas linhas:
  - *"O DriveFlow não é afiliado oficialmente às plataformas citadas."*
  - *"Os nomes Uber, 99, iFood, Mercado Livre e Rappi são marcas dos seus respectivos donos."*
  - *"Os dados são usados apenas para organizar seu controle financeiro."*

### 2. `src/routes/importar-print.tsx`
- **Título do hero**: *"Importar print dos seus ganhos"* (mantém).
- **Subtítulo**: trocar para *"Envie um print da tela de ganhos do seu aplicativo (Uber, 99, iFood, Mercado Livre, Rappi e outras). A leitura inteligente tenta identificar os dados do print, mas você sempre deve revisar antes de salvar."*
- **Banner Premium**: manter texto atual (já é claro).
- **Bloco de revisão "Modo de simulação"**: ajustar para *"A leitura inteligente tenta identificar os dados do print, mas você sempre deve revisar antes de salvar. Nada é salvo até você clicar em Confirmar e salvar."*
- **Adicionar rodapé discreto** abaixo do formulário: *"O DriveFlow não é afiliado oficialmente às plataformas citadas. Os dados são usados apenas para organizar seu controle financeiro."*

### 3. `src/routes/historico.tsx`
- **Subtítulo do header**: trocar para *"Todos os seus registros de ganhos por aplicativo, importados ou inseridos manualmente, organizados em um só lugar."*
- **Adicionar rodapé** após a seção da tabela: *"O DriveFlow não é afiliado oficialmente às plataformas citadas. Os dados servem apenas para organizar seu controle financeiro."*

### 4. `src/routes/dashboard.tsx`
- Adicionar **rodapé/disclaimer discreto** no final do conteúdo: *"O DriveFlow não é afiliado oficialmente a Uber, 99, iFood, Mercado Livre, Rappi ou outras plataformas. Os dados servem apenas para organizar seu controle financeiro."*
- Revisar quaisquer textos auxiliares que insinuem integração (substituir "sincronização" / "dados da plataforma" por "registros do app" / "ganhos por aplicativo"), se existirem.

### 5. `src/routes/planos.tsx`
- **Item Premium "Comparativo entre plataformas"** → trocar para *"Comparativo entre aplicativos (Uber, 99, iFood e outras)"*.
- **Adicionar nota** abaixo do "Você pode mudar de plano a qualquer momento": *"O DriveFlow não é afiliado oficialmente às plataformas citadas. Os dados servem apenas para organizar seu controle financeiro."*

## Padrão de linguagem aplicado em todas as páginas

Substituir, sempre que aparecer:
- "Conecte sua conta Uber" → "Adicionar ganhos da Uber"
- "Sincronização oficial" / "Importação automática oficial" → "Registrar dados da plataforma" / "Organizar ganhos por aplicativo"
- "Dados diretos da plataforma" → "Registros do seu aplicativo"

## Fora do escopo

- Sem mudanças em lógica, banco de dados, hooks, rotas ou componentes.
- Sem ajustes de layout/estilo além dos novos blocos de disclaimer (usam classes existentes `text-xs text-muted-foreground` / `border-border/60`).
