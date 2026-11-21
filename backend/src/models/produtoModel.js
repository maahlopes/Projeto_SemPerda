// Importamos a conexão com o MySQL.
const { con } = require("../config/database");

// Criamos a função listarProdutos().
// Depois utilizamos SELECT * FROM produto para buscar os registros.
const listarProdutos = async () => {
  const [produtos] = await con.query(
    "SELECT * FROM produto"
  );

  // Retornamos os produtos encontrados.
  return produtos;                                   
};

// Exportamos a função para o Controller utilizar.
module.exports = {
  listarProdutos
};