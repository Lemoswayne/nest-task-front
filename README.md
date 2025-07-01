# Kanban Board - Frontend

Um sistema de gerenciamento de tarefas estilo Kanban desenvolvido em React com TypeScript.

## 🚀 Funcionalidades

- **Autenticação**: Login e registro de usuários
- **Boards**: Criação, edição e exclusão de quadros
- **Tasks**: Criação, edição, exclusão e movimentação de tarefas
- **Drag & Drop**: Arrastar e soltar tarefas entre colunas
- **Status Management**: Tarefas organizadas por status (TODO, IN_PROGRESS, DONE)
- **Responsive Design**: Interface adaptável para diferentes dispositivos

## 🛠️ Tecnologias Utilizadas

- **React 19** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **Bootstrap 5** - Framework CSS
- **@hello-pangea/dnd** - Drag and Drop
- **React Scripts** - Scripts de desenvolvimento

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Backend NestJS rodando na porta 3000

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd nest-task-front
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Acesse a aplicação em `http://localhost:3001`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── CreateBoardModal.tsx
│   ├── CreateTaskModal.tsx
│   ├── EditBoardModal.tsx
│   ├── EditTaskModal.tsx
│   └── Task.tsx
├── pages/              # Páginas da aplicação
│   ├── Board.tsx       # Página principal do Kanban
│   ├── Login.tsx       # Página de login
│   └── Register.tsx    # Página de registro
├── services/           # Serviços de API
│   ├── AuthService.ts
│   ├── BoardService.ts
│   └── TaskService.ts
├── types/              # Definições de tipos TypeScript
│   ├── Board.ts
│   └── Task.ts
├── App.tsx             # Componente principal
└── index.tsx           # Ponto de entrada
```

## 🔌 Integração com Backend

O frontend se conecta com o backend NestJS através das seguintes APIs:

### Autenticação
- `POST /auth` - Login
- `POST /users` - Registro

### Boards
- `GET /boards` - Listar boards
- `POST /boards` - Criar board
- `GET /boards/:id` - Buscar board
- `PATCH /boards/:id` - Atualizar board
- `DELETE /boards/:id` - Excluir board

### Tasks
- `GET /tasks` - Listar tasks
- `POST /tasks` - Criar task
- `GET /tasks/:id` - Buscar task
- `PATCH /tasks/:id` - Atualizar task
- `DELETE /tasks/:id` - Excluir task

## 🎯 Como Usar

### 1. Registro e Login
- Acesse a aplicação
- Clique em "Registre-se aqui" para criar uma conta
- Faça login com suas credenciais

### 2. Criando Boards
- Clique em "Criar Board" no cabeçalho
- Preencha o título e descrição (opcional)
- Clique em "Criar"

### 3. Criando Tasks
- Em um board, clique no botão "+" no cabeçalho
- Preencha o título, descrição e data de vencimento
- Clique em "Criar"

### 4. Gerenciando Tasks
- **Mover**: Arraste e solte as tarefas entre as colunas
- **Editar**: Clique no ícone de lápis
- **Excluir**: Clique no ícone de lixeira
- **Marcar como concluída**: Use o checkbox

### 5. Status das Tarefas
- **TODO**: Tarefas pendentes
- **IN_PROGRESS**: Tarefas em andamento
- **DONE**: Tarefas concluídas

## 🎨 Design

- Interface moderna e intuitiva
- Gradiente de fundo nas páginas de autenticação
- Cards com sombras e animações
- Design responsivo para mobile e desktop
- Ícones intuitivos para ações

## 🔒 Segurança

- Autenticação JWT
- Tokens armazenados no localStorage
- Redirecionamento automático para login quando não autenticado
- Validação de formulários no frontend

## 🚀 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a versão de produção
- `npm test` - Executa os testes
- `npm run eject` - Ejecta do Create React App

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona bem em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔧 Configuração de Desenvolvimento

Para configurar o ambiente de desenvolvimento:

1. Certifique-se de que o backend está rodando na porta 3000
2. O frontend rodará na porta 3001
3. Configure o CORS no backend se necessário

## 🐛 Solução de Problemas

### Erro de CORS
Se encontrar erros de CORS, verifique se o backend está configurado corretamente.

### Token Expirado
Se o token expirar, você será redirecionado automaticamente para a página de login.

### Problemas de Drag & Drop
Certifique-se de que está usando um navegador moderno que suporte HTML5 Drag & Drop.

## 📄 Licença

Este projeto está sob a licença MIT.
