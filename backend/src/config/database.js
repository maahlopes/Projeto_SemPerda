const mysql = require('mysql2/promise');
require('dotenv').config();

const con = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = con;

// Testa a conexão com o banco de dados.
const testarConexao = async () => {
  try {
    await con.query("SELECT 1");
    console.log("Conexão com MySQL estabelecida!");
  } catch (erro) {
    console.error("Erro ao conectar ao MySQL:", erro.mensage);
  }
};

module.exports = {
  con,
  testarConexao
};