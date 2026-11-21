// Importamos as funções do Model de produtos.
const produtoModel = require("../models/produtoModel");

// Criamos a função para listar os produtos.
const listarProdutos = async (req, res) => {
  try {
    // Chamamos a função do Model.
    const produtos = await produtoModel.listarProdutos();

    // Retornamos os produtos em formato JSON.
    res.status(200).json(produtos);
    
  } catch (erro) {
    // Exibimos o erro no terminal.
    console.error("Erro ao listar produtos:", erro);

    // Retornamos uma mensagem de erro.
    res.status(500).json({
      mensagem: "Erro ao buscar produtos."
    });
  }
};

// Exportamos a função para as rotas utilizarem.
module.exports = {
  listarProdutos
};