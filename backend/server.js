
// Carrega as configurações do .env.
require("dotenv").config();

// Importa a aplicação Express.
const app = require("./src/app");

// Importa a função de teste do banco de dados.
const { testarConexao, con } = require("./src/config/database");

// Define a porta do servidor.
const PORT = process.env.PORT || 3000;

// Criamos a função para iniciar o servidor.
const iniciarServidor = async () => {
  try {
    // Testamos a conexão com o MySQL.
    await testarConexao();

    // Iniciamos o servidor somente após a conexão.
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (erro) {
    // Exibimos o erro caso a conexão falhe.
    console.error("Não foi possível iniciar o servidor.");

    // Encerramos o pool de conexões.
    await con.end();

    // Encerramos a aplicação.
    process.exit(1);
  }
};

// Executamos a função para iniciar o servidor.
iniciarServidor();
