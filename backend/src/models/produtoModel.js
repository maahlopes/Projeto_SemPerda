// Importamos a conexão com o MySQL.
const { con } = require("../config/database");

// Criamos a função para listar os produtos.
const listarProdutos = async () => {
  const [produtos] = await con.query(
    "SELECT * FROM produto ORDER BY id_produto DESC"
  );

  // Retornamos os produtos encontrados.
  return produtos;
};

// Criamos a função para cadastrar produtos.
const cadastrarProduto = async (produto) => {
  const {
    id_estabelecimento,
    id_fornecedor,
    id_categoria,
    nome,
    quantidade,
    marca,
    preco_original,
    data_validade
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

// Criamos a função para atualizar produtos.
const atualizarProduto = async (id, produto) => {
  const {
    id_estabelecimento,
    id_fornecedor,
    id_categoria,
    nome,
    quantidade,
    marca,
    preco_original,
    data_validade
  } = produto;

  // Atualizamos os dados do produto no banco.
  const [resultado] = await con.query(
    `UPDATE produto SET
    id_estabelecimento = ?,
    id_fornecedor = ?,
    id_categoria = ?,
    nome = ?,
    quantidade = ?,
    marca = ?,
    preco_original = ?,
    data_validade = ?
    WHERE id_produto = ?`,
    [
      id_estabelecimento,
      id_fornecedor ?? null,
      id_categoria,
      nome,
      quantidade ?? 0,
      marca ?? null,
      preco_original,
      data_validade,
      id
    ]
  );

  // Verificamos se o produto existe.
  const [produtos] = await con.query(
    "SELECT id_produto FROM produto WHERE id_produto = ?",
    [id]
  );

  // Retornamos o resultado da atualização.
  return {
    resultado,
    existe: produtos.length > 0
  };
};

// Criamos a função para excluir produtos.
const excluirProduto = async (id) => {
  // Excluímos o produto pelo seu ID.
  const [resultado] = await con.query(
    "DELETE FROM produto WHERE id_produto = ?",
    [id]
  );

  // Retornamos o resultado da exclusão.
  return resultado;
};

// Exportamos as funções para o Controller utilizar.
module.exports = {
  listarProdutos,
  cadastrarProduto,
  atualizarProduto,
  excluirProduto
};