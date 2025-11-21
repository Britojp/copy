# Copy Mkt

Sistema de geração automatizada de conteúdo de marketing utilizando Inteligência Artificial através de agentes especializados.

## Sobre o Projeto

O **Copy Mkt** é uma plataforma web que automatiza a criação de conteúdo de marketing através de agentes de IA especializados. O sistema utiliza uma pipeline de agentes que trabalham em conjunto para:

- **Buscar dados**: Identificar e coletar informações relevantes sobre nichos e períodos específicos
- **Buscar informações**: Obter detalhes aprofundados sobre itens selecionados
- **Escrever descrições**: Gerar descrições de produtos/postagens em diferentes variações (curta, média, longa)
- **Gerar prompts de imagem**: Criar prompts otimizados para geração de imagens (Midjourney, Stable Diffusion, DALL-E)

O sistema mantém um histórico de execuções, permite criar perfis de marca personalizados e oferece uma interface intuitiva para gerenciar todo o fluxo de criação de conteúdo.

## Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js para aplicações escaláveis
- **TypeScript** - Linguagem de programação
- **PostgreSQL** - Banco de dados relacional
- **TypeORM** - ORM para TypeScript/JavaScript
- **LangChain** - Framework para desenvolvimento de aplicações com LLMs
- **Google Gemini** - Modelo de IA para geração de conteúdo

### Frontend
- **React** - Biblioteca JavaScript para interfaces
- **TypeScript** - Linguagem de programação
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Radix UI** - Componentes acessíveis e customizáveis
- **React Router** - Roteamento para React

### Infraestrutura
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)
- **Git**

Para verificar se estão instalados:

```bash
docker --version
docker compose version
git --version
```

### Obter Chave da API do Gemini

1. Acesse [Google AI Studio](https://aistudio.google.com/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada (você precisará dela no próximo passo)

## Instalação e Configuração

### Passo 1: Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd copy_mkt
```

### Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto copiando o exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione sua chave da API do Gemini:

```env
GEMINI_API_KEY=sua-chave-api-aqui
GEMINI_MODEL=gemini-1.5-flash-8b
```

**Importante**: Substitua `sua-chave-api-aqui` pela chave real obtida no Google AI Studio.

### Passo 3: Construir e Iniciar os Containers

Execute o Docker Compose para construir e iniciar todos os serviços:

```bash
docker compose up --build
```

Este comando irá:
- Construir as imagens Docker do backend e frontend
- Criar e iniciar o container do banco de dados PostgreSQL
- Iniciar o backend (API NestJS)
- Iniciar o frontend (React)
- Configurar a rede entre os containers

### Passo 4: Aguardar os Serviços Iniciarem

Aguarde até ver as mensagens de inicialização:
- Banco de dados pronto (healthcheck)
- Backend iniciado na porta 8081
- Frontend iniciado na porta 8888

## Acessar a Aplicação

Após os containers iniciarem, você pode acessar:

- **Frontend**: http://localhost:8888
- **Backend API**: http://localhost:8081
- **Banco de Dados**: localhost:5434

## Comandos Úteis

### Parar os containers

```bash
docker compose down
```

### Parar e remover volumes (apaga dados do banco)

```bash
docker compose down -v
```

### Ver logs dos containers

```bash
# Todos os serviços
docker compose logs -f

# Apenas backend
docker compose logs -f backend

# Apenas frontend
docker compose logs -f frontend

# Apenas banco de dados
docker compose logs -f db
```

### Reconstruir containers após mudanças no código

```bash
docker compose up --build
```

### Executar comandos dentro de um container

```bash
# Backend
docker compose exec backend sh

# Frontend
docker compose exec frontend sh

# Banco de dados
docker compose exec db psql -U postgres -d copy_mkt
```

## Banco de Dados

O banco de dados PostgreSQL é iniciado automaticamente com o Docker Compose. As migrações são executadas automaticamente pelo TypeORM.

### Credenciais padrão:
- **Host**: localhost:5434
- **Usuário**: postgres
- **Senha**: postgres
- **Database**: copy_mkt

## Variáveis de Ambiente

### Obrigatórias
- `GEMINI_API_KEY` - Chave da API do Google Gemini (obrigatória)

### Opcionais
- `GEMINI_MODEL` - Modelo do Gemini a ser usado (padrão: `gemini-1.5-flash-8b`)
- `PORT` - Porta do backend (padrão: 3000)
- `DB_HOST` - Host do banco de dados (padrão: db)
- `DB_PORT` - Porta do banco de dados (padrão: 5432)
- `DB_USERNAME` - Usuário do banco (padrão: postgres)
- `DB_PASSWORD` - Senha do banco (padrão: postgres)
- `DB_DATABASE` - Nome do banco (padrão: copy_mkt)
- `CORS_ORIGIN` - Origem permitida para CORS (padrão: http://localhost:8888)

## Desenvolvimento

### Executar o backend em modo desenvolvimento (sem Docker)

```bash
cd backend
npm install
npm run start:dev
```

### Executar o frontend em modo desenvolvimento (sem Docker)

```bash
cd frontend
npm install
npm run dev
```

### Executar migrações do banco de dados

```bash
cd backend
npm run db:migrate
```

## Scripts Disponíveis

### Backend
- `npm run build` - Compila o projeto
- `npm run start` - Inicia em modo produção
- `npm run start:dev` - Inicia em modo desenvolvimento com hot-reload
- `npm run lint` - Executa o linter
- `npm run test` - Executa os testes
- `npm run db:migrate` - Executa migrações do banco

### Frontend
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila para produção
- `npm run preview` - Visualiza build de produção
- `npm run lint` - Executa o linter

## Solução de Problemas

### Erro: "Configuration key GEMINI_API_KEY does not exist"
- Certifique-se de ter criado o arquivo `.env` na raiz do projeto
- Verifique se a variável `GEMINI_API_KEY` está definida corretamente no `.env`
- Reinicie os containers após adicionar a variável

### Erro: "Container name already in use"
- Remova os containers existentes:
```bash
docker compose down
docker rm -f copy_mkt_db copy_mkt_backend copy_mkt_frontend
```

### Erro: "Port already in use"
- Verifique se as portas 8888, 8081 ou 5434 estão em uso
- Pare os serviços que estão usando essas portas ou altere as portas no `docker-compose.yml`

### Banco de dados não conecta
- Verifique se o container do banco está rodando: `docker compose ps`
- Verifique os logs: `docker compose logs db`
- Aguarde o healthcheck completar antes do backend iniciar

## Documentação Adicional

- [Documentação NestJS](https://docs.nestjs.com)
- [Documentação React](https://react.dev)
- [Documentação TypeORM](https://typeorm.io)
- [Documentação LangChain](https://js.langchain.com)
- [Documentação Google Gemini](https://ai.google.dev/docs)

## Licença

Este projeto é privado e não possui licença pública.

## Autor

Desenvolvido para automatizar a criação de conteúdo de marketing utilizando IA.

