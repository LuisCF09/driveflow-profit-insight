# Plano: Área de Revisão com Confirmar/Editar/Cancelar

## Resumo
Reformular a seção "Dados detectados" da tela `src/routes/importar-print.tsx` para ter dois modos (visualização e edição), validação simples antes de confirmar, e ação explícita de salvar.

## Alterações em `src/routes/importar-print.tsx`

### 1. Novo estado
- `mode: "view" | "edit"` — controla se os campos são apenas leitura ou editáveis. Inicia em `"view"` quando a análise termina.
- `saving: boolean` — estado do botão "Confirmar e salvar".
- Snapshot dos dados antes de editar (para suportar "Cancelar" voltando aos valores anteriores).

### 2. Modo visualização
- Lista os campos em grid (label + valor).
- Campos vazios renderizam o texto `Não identificado` em estilo `text-muted-foreground italic`.
- Mantém o badge de confiança (Alta/Média/Baixa) já existente.
- Botões: **Editar dados**, **Confirmar e salvar**, **Cancelar**.

### 3. Modo edição
- Mesmo grid de inputs já presente (Plataforma, Data, Ganho bruto, Horas, Corridas/entregas, Km, Gorjetas, Taxas, Observações).
- Botões: **Salvar alterações** (volta para `view`), **Cancelar edição** (restaura snapshot e volta para `view`).

### 4. Validação ao confirmar
- Função `validate()` exige: `platform_name`, `entry_date`, `gross_earnings > 0` (numérico válido).
- Se faltar, exibir mensagem inline por campo e `toast.error("Preencha plataforma, data e ganho bruto antes de salvar.")`.
- Botão "Confirmar e salvar" fica `disabled` enquanto validação falha; explica o motivo via `title`.

### 5. Ação "Confirmar e salvar"
- Atualiza o registro `imported_prints` com os valores revisados e `status = "confirmed"`.
- Insere uma linha em `platform_entries` (source = `"imported_print"`, `imported_print_id` = id atual) com os campos editados.
- Toast de sucesso, limpa o formulário (`clearFile` + reset de estados).

### 6. Ação "Cancelar" (no modo view)
- Atualiza `imported_prints.status = "discarded"`.
- Limpa formulário e dados detectados; mantém o usuário na tela.
- Toast informativo "Importação cancelada".

### 7. Mensagens e UX
- Badge de "Modo de simulação" permanece.
- Pequeno texto: "Revise as informações abaixo. Nada é salvo até você clicar em Confirmar e salvar."
- Validação inline simples (borda vermelha + texto curto).

## Out of scope
- Sem alterações em outras telas, schema ou políticas RLS.

## Arquivos alterados
- `src/routes/importar-print.tsx` (único arquivo)
