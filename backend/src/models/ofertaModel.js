// Importamos a conexão com o MySQL.
const { con } = require("../config/database");

// Criamos a função para listar ofertas.
const listarOfertas = async () => {
  const [ofertas] = await con.query(
    `SELECT o.*, p.nome AS produto
    FROM oferta o
    INNER JOIN produto p ON o.id_produto = p.id_produto
    ORDER BY o.id_oferta DESC`
  );

  // Retornamos as ofertas encontradas.
  return ofertas;
};

// Criamos a função para buscar um produto pelo ID.
const buscarProdutoPorId = async (id) => {
  const [produtos] = await con.query(
    `SELECT id_produto, preco_original
    FROM produto
    WHERE id_produto = ?
    LIMIT 1`,
    [id]
  );

  // Retornamos o produto encontrado ou null.
  return produtos[0] || null;
};

// Criamos a função para cadastrar ofertas.
const cadastrarOferta = async (oferta) => {
  const {
    id_produto,
    percentual_desconto,
    preco_promocional,
    data_inicio,
    data_fim,
    status
  } = oferta;

  // Inserimos a oferta no banco de dados.
  const [resultado] = await con.query(
    `INSERT INTO oferta
    (id_produto, percentual_desconto, preco_promocional, data_inicio, data_fim, status)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id_produto,
      percentual_desconto ?? null,
      preco_promocional,
      data_inicio,
      data_fim,
      status ?? "Ativa"
    ]
  );

  // Retornamos o resultado da inserção.
  return resultado;
};

// Criamos a função para atualizar ofertas.
const atualizarOferta = async (id, oferta) => {
  const {
    id_produto,
    percentual_desconto,
    preco_promocional,
    data_inicio,
    data_fim,
    status
  } = oferta;

  // Atualizamos os dados da oferta no banco.
  const [resultado] = await con.query(
    `UPDATE oferta SET
    id_produto = ?,
    percentual_desconto = ?,
    preco_promocional = ?,
    data_inicio = ?,
    data_fim = ?,
    status = ?
    WHERE id_oferta = ?`,
    [
      id_produto,
      percentual_desconto ?? null,
      preco_promocional,
      data_inicio,
      data_fim,
      status ?? "Ativa",
      id
    ]
  );

  // Verificamos se a oferta existe.
  const [ofertas] = await con.query(
    `SELECT id_oferta
    FROM oferta
    WHERE id_oferta = ?
    LIMIT 1`,
    [id]
  );

  // Retornamos o resultado da atualização.
  return {
    resultado,
    existe: ofertas.length > 0
  };
};

// Criamos a função para excluir ofertas.
const excluirOferta = async (id) => {
  const [resultado] = await con.query(
    "DELETE FROM oferta WHERE id_oferta = ?",
    [id]
  );

  // Retornamos o resultado da exclusão.
  return resultado;
};

// Exportamos as funções para o Controller utilizar.
module.exports = {
  listarOfertas,
  buscarProdutoPorId,
  cadastrarOferta,
  atualizarOferta,
  excluirOferta
};