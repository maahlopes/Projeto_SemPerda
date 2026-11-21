// Importa o MySQL
const mysql = require("mysql2/promise");

// Carrega as configurações do arquivo .env.
require("dotenv").config();

// Cria a conexão com o banco de dados.
const con = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Testa a conexão com o banco de dados.
const testarConexao = async () => {
  try {
    await con.query("SELECT 1");
    console.log("Conexão com MySQL estabelecida!");
  } catch (erro) {
      console.error("Erro ao conectar ao MySQL:", erro.message);
  }
};

// Exporta a conexão e a função de teste.
module.exports = {
  con,
  testarConexao
};