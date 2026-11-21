// Carrega as configurações do .env.
require("dotenv").config();

// Importa a aplicação Express que acabamos de criar.
const app = require("./src/app");

// Importa a função de teste do banco de dados.
const { testarConexao } = require("./src/config/database");

// Testa a conexão com o MySQL.
testarConexao();

// Define a porta do servidor. Se não houver uma no .env, usa 3000.
const PORT = process.env.PORT || 3000;

// Inicia o servidor.
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});