# Sistema de Upload de CSV

Este é um sistema desenvolvido para realizar o upload de arquivos CSV, onde os dados são salvos em um banco de dados PostgreSQL e exibidos em uma tabela na interface do usuário. Além disso, permite a edição e exclusão dos dados através de um modal.

## Tecnologias Utilizadas

- **Backend:**
  - Node.js
  - TypeScript
  - Express.js
  
- **Banco de Dados:**
  - PostgreSQL

- **Frontend:**
  - React.js
  - TypeScript
  - Ant Design
  - Next.js

## Formato de CSV Aceito

O sistema aceita arquivos CSV com o seguinte formato:

- O arquivo CSV deve conter 5 colunas, conforme listado abaixo:
  1. `code` (string)
  2. `description` (string)
  3. `quantity` (number)
  4. `price` (number)
  5. `total_price` (number)

- A primeira linha do arquivo CSV é ignorada, pois é considerada como cabeçalho.

## Funcionalidades

- **Upload de CSV:** Os usuários podem fazer o upload de arquivos CSV através da interface do usuário.
- **Armazenamento de Dados:** Os dados contidos nos arquivos CSV são salvos no banco de dados PostgreSQL.
- **Exibição em Tabela:** Os dados importados são exibidos em uma tabela na interface do usuário.
- **Edição de Dados:** Os usuários podem editar os dados diretamente na tabela, abrindo um modal com os campos preenchidos para edição.
- **Exclusão de Dados:** Os usuários podem excluir os dados diretamente na tabela, abrindo um modal de confirmação.

## Configuração

Antes de iniciar o sistema, é necessário configurar o ambiente:

### Backend

1. Clone o repositório.
2. Navegue até a pasta do backend.
3. Execute `npm install` para instalar as dependências.
4. Configure as variáveis de ambiente no arquivo `.env`, incluindo as credenciais do banco de dados.
5. Execute `npm run dev` para iniciar o servidor.

### Frontend

1. Navegue até a pasta do frontend.
2. Execute `npm install` para instalar as dependências.
3. Execute `npm run dev` para iniciar o servidor de desenvolvimento.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.
