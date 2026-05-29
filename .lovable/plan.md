## Plano: Nova página "Como funciona"

### Objetivo
Criar uma nova rota `/como-funciona` que explique de forma simples e direta o que é o DriveFlow e por que ele é útil para motoristas e entregadores.

### Passos

1. **Criar rota `src/routes/como-funciona.tsx`**
   - Definir `head()` com título e meta descrição SEO
   - Usar `AppShell` como wrapper (igual às outras páginas internas)
   - Título na AppShell: "Como funciona"
   - Estrutura da página:
     - Título principal: "Entenda seu lucro real como motorista ou entregador"
     - Texto introdutório explicativo
     - 4 cards explicativos em grid (2 colunas desktop, 1 coluna mobile) com ícones do Lucide
       1. Registre seus ganhos (icon: `TrendingUp`)
       2. Adicione seus custos (icon: `Receipt`)
       3. Importe prints e comprovantes (icon: `ImageUp`)
       4. Veja seu lucro real (icon: `BarChart3`)
     - Seção "O que você está pagando?" com texto explicativo sobre o plano pago
     - Observação final em estilo disclaimer
   - Estilo visual:
     - Usar tokens do design system: `bg-hero`, `grid-bg`, `glass` cards
     - Ícones em tom neon/azul primário
     - Tipografia `font-display` para títulos
     - Espaçamento coerente com as outras páginas

2. **Adicionar aba ao menu principal (`src/components/AppShell.tsx`)**
   - Inserir novo item no array `NAV`:
     - `to: "/como-funciona"`
     - `label: "Como funciona"`
     - `icon: HelpCircle` (do lucide-react)
   - Posicionar após "Painel" ou antes de "Premium", conforme hierarquia lógica

3. **Registro automático de rota**
   - O TanStack Router detectará o novo arquivo e gerará `routeTree.gen.ts` automaticamente durante o build/dev. Nenhuma edição manual necessária.

### Design tokens a utilizar
- `bg-hero` + `grid-bg` para fundo
- `glass` para cards (bordas arredondadas, blur, borda sutil)
- `--neon` / `text-[var(--neon)]` para ícones e destaques
- `font-display` para títulos, `text-muted-foreground` para corpos de texto
- `border-border/60` para separadores

### Arquivos alterados
- `src/routes/como-funciona.tsx` (novo)
- `src/components/AppShell.tsx` (edição no array NAV)

### Não serão alterados
- Design principal / tokens CSS
- Sistema de autenticação
- Backend / banco de dados
- Outras páginas existentes