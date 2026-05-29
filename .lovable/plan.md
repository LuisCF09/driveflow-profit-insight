Criar a página /planos comparando plano Grátis e Premium do DriveFlow.

1. Criar src/routes/planos.tsx
   - Layout com AppShell, título "Planos"
   - Texto introdutório: "Comece organizando seus ganhos manualmente e desbloqueie recursos inteligentes quando quiser automatizar sua rotina."
   - Dois cards lado a lado (Grátis vs Premium):
     - Grátis: Registro manual de ganhos, Registro de custos, Dashboard básico, 2 relatórios a cada 15 dias, Upload de print como comprovante. CTA "Continuar no grátis" (leva ao dashboard).
     - Premium: Leitura inteligente de prints, Preenchimento automático dos dados, Relatórios ilimitados, Histórico financeiro completo, Comparativo entre plataformas, Análise de ganho por hora e por km, Acompanhamento mensal completo. Preço R$ 15,90/mês. CTA "Assinar Premium" (abre modal "Pagamento será implementado em breve.").
   - Usar estilos visuais existentes: glass, shadow-card, bg-gradient-primary, shadow-glow, ícones Check/X do lucide-react, font-display.
   - Badge "Plano atual" condicional via useSubscription.

2. Adicionar navegação no AppShell
   - Incluir { to: "/planos", label: "Planos", icon: Crown } no array NAV antes de "Premium".

3. Não modificar /premium — manter como está para não quebrar links existentes.

4. Nenhuma alteração de banco de dados ou schema necessária.