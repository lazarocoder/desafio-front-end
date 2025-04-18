# A interface tem como finalidade integração com back-end e a gestão de produtos, onde também podemos gerenciar os usuários - Frontend Angular

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

#### 3. Produtos
```typescript
// Listagem de Produtos
GET /api/products
Query Params: {
    page: number,
    size: number,
    sort: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    search?: string
}
Response: {
    content: Product[],
    totalElements: number,
    totalPages: number,
    size: number,
    number: number
}

// Obter Produto por ID
GET /api/products/:id
Response: Product

// Criar Produto
POST /api/products
Body: {
    name: string,
    description: string,
    price: number,
    category: string,
    stock: number,
    imageUrl?: string
}

// Atualizar Produto
PUT /api/products/:id
Body: {
    name?: string,
    description?: string,
    price?: number,
    category?: string,
    stock?: number,
    imageUrl?: string
}

// Excluir Produto
DELETE /api/products/:id

// Atualizar Estoque
PATCH /api/products/:id/stock
Body: {
    quantity: number,
    operation: 'add' | 'subtract'
}

// Upload de Imagem
POST /api/products/:id/images
Body: FormData com arquivo de imagem

// Listar Categorias
GET /api/products/categories
Response: string[]

// Produtos com Estoque Baixo
GET /api/products/low-stock
Query Params: { threshold?: number }

// Relatório de Produtos
GET /api/products/report
Query Params: { format: 'csv' | 'pdf' | 'excel' }
```

#### 4. Estatísticas
```typescript
// Dashboard
GET /api/dashboard/stats
Response: {
    totalUsers: number,
    totalProducts: number,
    lowStockProducts: number,
    activeUsers: number,
    totalCategories: number,
    recentSales: {
        date: string,
        amount: number
    }[],
    topProducts: {
        id: number,
        name: string,
        sales: number
    }[]
}
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
# Tela inicial de login: 
![image](https://github.com/user-attachments/assets/94d7a3c7-b3fa-4e67-a0ec-1ef0d3f74d6c)
- demonstração de validação: 

![image](https://github.com/user-attachments/assets/65813ed5-83af-491e-82a7-7aa5c1539b5f)

![image](https://github.com/user-attachments/assets/5ae74791-3da8-4f2e-a5d1-611eeeff7d06)

![image](https://github.com/user-attachments/assets/6aa0ada2-e9e8-4e5f-a2d0-2fd9af0ce762)

- Demonstração de responsividade: 

![image](https://github.com/user-attachments/assets/9d823835-a885-4734-b2af-05691d3cb8a0)

![image](https://github.com/user-attachments/assets/9538d3ca-f83a-4874-8860-00d5dccdbd8d)

![image](https://github.com/user-attachments/assets/3ed03b38-fea8-45d1-96f6-349d70821800)





## Licença
N/A.

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
