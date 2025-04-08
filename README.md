# Sistema de Gerenciamento de Usuários - Frontend Angular

## Sumário
1. [Requisitos e Versões](#requisitos-e-versões)
2. [Instalação](#instalação)
3. [Configuração](#configuração)
4. [Integração com API Spring Boot](#integração-com-api-spring-boot)
5. [Estrutura do Projeto](#estrutura-do-projeto)
6. [Executando o Projeto](#executando-o-projeto)
7. [Autenticação e Segurança](#autenticação-e-segurança)
8. [Documentação Adicional](#documentação-adicional)

## Requisitos e Versões

### Versões Necessárias
- Node.js: 18.13.0 ou superior (LTS recomendada)
- npm: 9.8.1 ou superior
- Angular CLI: 17.1.0
- Angular Core: 17.1.0

### Verificação de Versões
```bash
# Verificar Node.js
node -v  # deve mostrar v18.13.0 ou superior

# Verificar npm
npm -v   # deve mostrar 9.8.1 ou superior

# Verificar Angular CLI
ng version  # deve mostrar Angular CLI: 17.1.0
```

## Instalação

1. Instalar Node.js e npm:
```bash
# Usando nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18.13.0
nvm use 18.13.0
```

2. Instalar Angular CLI:
```bash
npm uninstall -g @angular/cli  # remover versão anterior
npm cache clean --force
npm install -g @angular/cli@17.1.0
```

3. Clonar e instalar o projeto:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd [NOME_DO_PROJETO]
npm install
```

## Configuração

### 1. Variáveis de Ambiente

Criar `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  defaultLanguage: 'pt-BR',
  supportedLanguages: ['pt-BR', 'en-US', 'es'],
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token'
};
```

Criar `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://seu-dominio.com/api',
  // ... outras configurações
};
```

### 2. Proxy Configuration (Desenvolvimento)

Criar `proxy.conf.json` na raiz:
```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

Atualizar `angular.json`:
```json
{
  "architect": {
    "serve": {
      "options": {
        "proxyConfig": "proxy.conf.json"
      }
    }
  }
}
```

## Integração com API Spring Boot

### Endpoints da API

1. Autenticação:
```typescript
// Login
POST http://localhost:8080/api/auth/login
Body: { email: string, password: string }

// Registro
POST http://localhost:8080/api/auth/register
Body: { name: string, email: string, password: string }

// Verificação de Email
POST http://localhost:8080/api/auth/verify-email
Body: { token: string }

// Recuperação de Senha
POST http://localhost:8080/api/auth/forgot-password
Body: { email: string }
```

2. Usuários:
```typescript
// Listar Usuários (com paginação)
GET http://localhost:8080/api/users?page=0&size=10&sort=name,asc

// Obter Usuário
GET http://localhost:8080/api/users/{id}

// Atualizar Usuário
PUT http://localhost:8080/api/users/{id}
Body: { name?: string, email?: string, role?: string }

// Upload de Avatar
POST http://localhost:8080/api/users/avatar
Body: FormData (multipart/form-data)
```

### Configuração CORS no Spring Boot

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:4200")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/                 # Serviços singleton, guards, interceptors
│   ├── shared/              # Componentes, pipes e diretivas compartilhadas
│   ├── features/            # Módulos de feature
│   │   ├── auth/           # Autenticação e perfil
│   │   ├── products/       # Gestão de produtos
│   │   ├── categories/     # Gestão de categorias
│   │   └── users/          # Gestão de usuários (admin)
│   └── layout/             # Componentes de layout
```

## Funcionalidades

- Autenticação de usuários
- Controle de acesso baseado em roles (admin/user)
- Gestão de produtos (CRUD)
- Gestão de categorias (CRUD)
- Gestão de usuários (admin)
- Perfil do usuário
- Alteração de senha

## Tecnologias Utilizadas

- Angular 17
- Angular Material
- RxJS
- TypeScript
- SCSS

## Validações

- Product.name: obrigatório, máx. 100 caracteres
- Product.description: opcional, máx. 255 caracteres
- Product.price: obrigatório, deve ser > 0
- Product.status: obrigatório
- Product.category: obrigatório
- Category.name: máx. 100 caracteres
- Category.description: opcional, máx. 255 caracteres

## Desenvolvimento

1. Crie uma branch para sua feature:
```bash
git checkout -b feature/nome-da-feature
```

2. Faça commit das alterações:
```bash
git commit -m 'feat: descrição da feature'
```

3. Faça push para a branch:
```bash
git push origin feature/nome-da-feature
```

4. Abra um Pull Request

## Build

Para criar uma build de produção:

```bash
npm run build
```

Os arquivos gerados estarão em `dist/desafio-frontend/`.

## Testes

Para executar os testes:

```bash
npm test
```

## Licença

Este projeto está sob a licença MIT.

# Desafio Frontend – Requisitos

Este documento apresenta os requisitos para implementação do frontend, garantindo compatibilidade com as regras e endpoints definidos no backend.

## 1. Validações

Você deve ajustar as entidades (model e sql) de acordo com as regras abaixo: 

- `Product.name` é obrigatório, não pode ser vazio e deve ter no máximo 100 caracteres.
- `Product.description` é opcional e pode ter no máximo 255 caracteres.
- `Product.price` é obrigatório deve ser > 0.
- `Product.status` é obrigatório.
- `Product.category` é obrigatório.
- `Category.name` deve ter no máximo 100 caracteres.
- `Category.description` é opcional e pode ter no máximo 255 caracteres.

## 2. Refatoração
- Devido às constantes atualizações do Angular e Angular Material, substitua todas as ocorrências de `mat-form-field` por componentes customizados para inputs e textareas, que sejam parametrizáveis e reutilizáveis em todos os formulários.

## 3. Otimização de Performance
- Ajuste as listagens e consultas para suportar paginação, conforme implementado no backend, garantindo o desempenho mesmo com grande volume de dados.

## 4. Refatoração  
- Atualize os componentes de produto para utilizar a nova versão da API:
  - Use o endpoint **`/api/v2/products`