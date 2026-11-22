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

// Criamos a função cadastrarProduto().
const cadastrarProduto = async (produto) => {
  const {
    id_estabelecimento,
    id_fornecedor,
    id_categoria,
    nome,
    quantidade,
    marca,
    preco_original,
    data_validade,
  } = produto;

  // Inserimos o produto no banco de dados.
  const [resultado] = await con.query(
    `INSERT INTO produto
    (id_estabelecimento, id_fornecedor, id_categoria, nome, quantidade, marca, preco_original, data_validade)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id_estabelecimento,
      id_fornecedor ?? null,
      id_categoria,
      nome,
      quantidade ?? 0,
      marca ?? null,
      preco_original,
      data_validade
    ]
  );

  // Retornamos o resultado da inserção.
  return resultado;
};

// Exportamos a função para o Controller utilizar.
module.exports = {
  listarProdutos,
  cadastrarProduto
};