# Smart API - Busca Inteligente de Produtos

API REST em Node.js com Express e SQLite projetada para funcionar como uma base de dados inteligente para consulta por IA (OpenAI), focada em interpretação de pedidos e geração de orçamentos.

## 🚀 Funcionalidades

- **Busca por Relevância**: Prioriza correspondências exatas em sinônimos, seguidas por parciais e descrição.
- **Normalização de Texto**: Ignora acentos, maiúsculas/minúsculas e caracteres especiais.
- **Sinônimos Inteligentes**: Possui uma tabela de sinônimos para vincular termos populares a produtos técnicos (ex: "perfex" -> "esponja").
- **Auto-Seeding**: Popula o banco de dados automaticamente ao iniciar com a lista de produtos fornecida.
- **Pronta para IA**: Endpoints otimizados para sistemas que utilizam LLMs para extrair termos de pedidos.

## 🛠️ Tecnologias

- **Node.js** & **Express**
- **better-sqlite3**: Para alta performance e simplicidade no gerenciamento do banco local.
- **CORS**: Habilitado para integração com sistemas externos.

## 📂 Estrutura do Projeto

```text
smart-api/
├── src/
│   ├── controllers/ # Lógica de busca e CRUD
│   ├── db/          # Configuração e inicialização do banco
│   ├── routes/      # Definição dos endpoints
│   ├── utils/       # Utilitários (Normalização)
│   └── index.js     # Ponto de entrada
├── database.sqlite  # Banco de dados (gerado automaticamente)
└── package.json
```

## 🚦 Como Rodar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Iniciar o servidor**:
   ```bash
   npm start
   ```
   A API estará disponível em `http://localhost:3000`.

## 📡 Endpoints

### 🔍 Buscar Produtos (Inteligente)
`GET /buscar?q=termo`

Retorna produtos ordenados por relevância.
Exemplo: `GET /buscar?q=perfex`

### 📦 Listar Todos
`GET /produtos`

### ➕ Inserir Produto
`POST /produtos`
```json
{
  "codigo": "123",
  "descricao": "Novo Produto",
  "unidade": "UN",
  "preco": 10.50
}
```

### 🔗 Inserir Sinônimo
`POST /sinonimos`
```json
{
  "termo": "apelido",
  "produto_id": 1
}
```

## 🧠 Diferencial Inteligente

A busca utiliza uma lógica de pesos para garantir que o resultado mais próximo da intenção do usuário apareça primeiro:
1. **Peso 3**: Correspondência exata no termo do sinônimo.
2. **Peso 2**: Correspondência parcial no termo do sinônimo.
3. **Peso 1**: Correspondência na descrição do produto.
