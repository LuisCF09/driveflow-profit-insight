No dashboard principal (src/routes/dashboard.tsx), adicionar o cálculo de lucro líquido estimado com base nos dados da tabela `platform_entries` do usuário logado.

1. Buscar registros da tabela `platform_entries` para o usuário autenticado (somente o que ele possui, via RLS).

2. Calcular métricas:
   - Ganho bruto total = soma de `gross_earnings`
   - Custo de combustível total = soma de `fuel_cost` (null como 0)
   - Custos extras total = soma de `extra_costs` (null como 0)
   - Custos totais = combustível + extras
   - Lucro líquido = ganho bruto − custos totais
   - Margem de lucro = (lucro / ganho bruto) × 100. Se bruto = 0, margem = 0 para evitar divisão.

3. Adicionar cards visuais no dashboard (junto aos cards existentes):
   - Ganho bruto
   - Custos totais
   - Lucro líquido
   - Margem de lucro (%)

4. Incluir texto explicativo abaixo dos cards: "Esse é o valor estimado que sobrou depois dos custos informados."

5. Se não houver registros em `platform_entries`, manter o empty state atual do dashboard sem alterar sua mensagem.

Nenhuma alteração de schema ou tabela é necessária. Apenas leitura e cálculo no frontend.