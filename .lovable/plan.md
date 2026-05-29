## Objetivo
Criar a tabela `imported_prints` no backend para armazenar os prints enviados pelos usuários do DriveFlow, com proteção de dados via RLS.

## O que será feito

### 1. Criar a tabela `imported_prints`
A tabela armazenará os dados extraídos dos prints dos aplicativos de corrida/entrega. Campos:
- `id` (uuid, PK, auto)
- `user_id` (uuid, FK para auth.users, cascade delete)
- `platform_name` (text, obrigatório)
- `image_url` (text, nullable)
- `entry_date` (date, nullable)
- `gross_earnings` (numeric 10,2, nullable)
- `worked_hours` (numeric 5,2, nullable)
- `trips_count` (integer, nullable)
- `kilometers` (numeric 8,2, nullable)
- `tips` (numeric 10,2, nullable)
- `fees` (numeric 10,2, nullable)
- `confidence` (numeric 3,2, nullable)
- `status` (text, default 'pending_review')
- `notes` (text, nullable)
- `created_at` (timestamp with time zone, default now())

### 2. Configurar acesso via Data API
- Conceder permissões para o papel `authenticated` (usuários logados)
- Conceder todas as permissões para o papel `service_role` (operações administrativas do sistema)

### 3. Ativar Row Level Security (RLS)
Habilitar RLS na tabela para que o banco de dados filtre automaticamente as linhas visíveis a cada usuário.

### 4. Criar políticas de segurança
Quatro políticas, todas com a mesma regra — o usuário só acessa registros onde `user_id` corresponde ao ID do usuário logado:
- **Visualizar** — usuários só veem seus próprios prints
- **Inserir** — usuários só criam registros vinculados a si mesmos
- **Atualizar** — usuários só editam seus próprios registros
- **Deletar** — usuários só excluem seus próprios registros

## Fora do escopo
- Nenhuma tabela existente será alterada.
- Nenhuma mudança no código do aplicativo será feita nesta etapa (apenas estrutura de dados no backend).