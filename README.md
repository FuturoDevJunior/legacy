# Verificador de Preço de Ações (Stock Price Checker)

## Descrição
Projeto full stack JavaScript que permite consultar o preço de ações da NASDAQ e registrar likes únicos por IP (anonimizados), conforme o desafio do freeCodeCamp.

## Funcionalidades
- Consulta de preço de uma ou duas ações simultaneamente.
- Registro de likes únicos por IP anonimizados.
- Cálculo de rel_likes ao comparar duas ações.
- Políticas de segurança CSP restritivas (apenas scripts e CSS do próprio servidor).
- Testes funcionais automatizados.

## Como executar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Execute o servidor:
   ```bash
   npm start
   ```
   O app estará disponível em http://localhost:3000

3. Para rodar os testes funcionais:
   ```bash
   npm test
   ```

## Deploy

1. Faça o push do código para o repositório indicado:
   https://github.com/FuturoDevJunior/legacy

2. Certifique-se de que o deploy está rodando em ambiente Node.js e porta 3000 (ou defina a variável de ambiente PORT).

## Observações
- O projeto utiliza um banco de dados em memória para likes, conforme escopo do desafio.
- Para produção, recomenda-se persistência em banco de dados.
- O proxy utilizado para consulta de preços é: https://stock-price-checker-proxy.freecodecamp.rocks/

## Requisitos atendidos
- Consulta de preço de ações via rota `/api/stock-prices`.
- Likes únicos por IP anonimizados.
- rel_likes para comparação de duas ações.
- CSP restritivo.
- Testes funcionais completos em `tests/2_functional-tests.js`.

---

Desenvolvido para o desafio freeCodeCamp.
