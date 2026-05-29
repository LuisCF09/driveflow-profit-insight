# Reorganizar menu principal

Atualizar `src/components/AppShell.tsx` para um menu enxuto de 8 itens, mantendo todas as rotas existentes funcionais.

## Novo menu (na ordem)

| Label | Destino | Observação |
|---|---|---|
| Dashboard | `/dashboard` | — |
| Adicionar Registro | abre `AddRideDialog` | botão (não Link), reaproveita o diálogo já usado no header |
| Importar Print | `/importar-print` | badge **Premium** ao lado do label |
| Histórico Financeiro | `/historico` | — |
| Relatórios | `/reports` | — |
| Como funciona | `/como-funciona` | posicionado acima de Planos para fácil descoberta |
| Planos | `/planos` | — |
| Configurações | `/profile` | mesmo destino, label renomeado |

## Mudanças em `AppShell.tsx`

1. **Reescrever array `NAV`** com os 8 itens acima. Suportar dois tipos de entrada:
   - `{ type: "link", to, label, icon, badge? }`
   - `{ type: "action", action: "add-record", label, icon }`
2. **Renderização (desktop + mobile drawer)**: mapear o array; itens `link` renderizam `<Link>`, itens `action` renderizam `<button>` que faz `setAddOpen(true)` (e fecha o drawer no mobile).
3. **Badge Premium**: pequena pill `text-[10px] uppercase tracking-wide` com `bg-gradient-primary text-primary-foreground` (ou tokens equivalentes do design system) renderizada à direita do label no item Importar Print, nos dois layouts.
4. **Botão "+ Corrida" no header**: manter como está (atalho rápido).
5. **Botão "Sair"**: permanece no rodapé da sidebar e final do drawer mobile.

## Rotas não listadas (continuam funcionando por URL)

`/daily-report`, `/rides`, `/expenses`, `/goals`, `/premium` permanecem como arquivos de rota válidos — apenas saem do menu principal. Links internos existentes nessas páginas não são alterados.

## Verificação final

- Cada item do menu tem ação (Link válido ou onClick que abre o diálogo); nenhum botão fica inerte.
- `pathname === n.to` continua marcando o item ativo nos itens do tipo `link`.
- Importar Print exibe visualmente o selo Premium, mas continua clicável (a restrição funcional de Premium é tratada na própria página, fora do escopo desta tarefa).

Nenhuma outra alteração de arquivo é necessária.
