## Nova tela: Importar Print

### Objetivo
Criar uma tela para motoristas e entregadores enviarem prints dos aplicativos de trabalho, facilitando o registro dos ganhos no DriveFlow.

### Estrutura

1. **Nova rota:** `src/routes/importar-print.tsx`
   - Usa `AppShell` como wrapper
   - `head()` com title e description
   - Componente com os seguintes elementos:
     - Título principal: "Importar print dos seus ganhos"
     - Texto explicativo sobre envio de prints
     - Seletor de plataforma (dropdown/select) com opções: Uber, 99, iFood, Mercado Livre, Rappi, Outros
     - Campo de upload de imagem (PNG, JPG, JPEG) com drag-and-drop visual e preview do arquivo selecionado
     - Botão "Analisar print" (estilo gradiente primário, desabilitado quando nenhuma imagem for selecionada)
     - Área de resultado: estado vazio com texto "Após enviar e analisar um print, os dados detectados aparecerão aqui para revisão."
     - Aviso importante em card com ícone: "Nenhuma informação será salva automaticamente. Você poderá revisar tudo antes de confirmar."

2. **Atualização do menu:** `src/components/AppShell.tsx`
   - Adicionar item "Importar Print" no array `NAV` com ícone `ImageUp` (Lucide)
   - Posicionar entre "Como funciona" e "Perfil"

### Estilo visual
- Design tokens do DriveFlow: `bg-hero`, `glass` para cards, `font-display` para títulos
- Cards com bordas sutis e backdrop blur
- Ícones Lucide (ImageUp, Upload, AlertCircle, etc.)
- Cores: neon/azul primário, text-muted-foreground para textos secundários
- Layout responsivo: max-w-3xl centralizado, cards empilhados em mobile

### Nota sobre funcionalidade
- Por enquanto, apenas a interface visual completa. A análise real via IA será implementada futuramente.
- O botão "Analisar print" mostrará um estado de loading simulado por enquanto, sem chamada de API real.
- O upload de imagem será apenas no cliente (FileReader para preview), sem envio ao backend nesta fase.

### Roteamento
- TanStack Router auto-registra a nova rota via `src/routes/importar-print.tsx` (gera `/importar-print`)
- Não editar `routeTree.gen.ts` manualmente