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

// Criamos a função para cadastrar produtos.
const cadastrarProduto = async (req, res) => {
  try {
    // Recebemos os dados enviados pelo usuário.
    const produto = req.body;

    // Verificamos se os campos obrigatórios foram preenchidos.
    if (
      produto.id_estabelecimento == null ||
      produto.id_categoria  == null ||
      !produto.nome?.trim() ||
      produto.preco_original == null ||
      !produto.data_validade
    ) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos obrigatórios."
      });
    }

    // Verificamos se os IDs são números inteiros positivos.
    if (
      !Number.isInteger(Number(produto.id_estabelecimento)) ||
      Number(produto.id_estabelecimento) <= 0 
      ||
      !Number.isInteger(Number(produto.id_categoria)) ||
      Number(produto.id_categoria) <= 0
    ) {
      return res.status(400).json({
        mensagem: "Os IDs de estabelecimento e categoria devem ser números inteiros positivos."
      });
    }

    // Verificamos se o preço é um número válido e positivo.
    if (
      !Number.isFinite(Number(produto.preco_original)) ||
      Number(produto.preco_original) <= 0
    ) {
      return res.status(400).json({
        mensagem: "O preço original deve ser um número maior que zero."
      });
    }

    // Verificamos se a quantidade é um número inteiro igual ou maior que zero.
    if (
      produto.quantidade != null &&
      (
        !Number.isInteger(Number(produto.quantidade)) ||
        Number(produto.quantidade) < 0
      )
    ) {
      return res.status(400).json({
        mensagem: "A quantidade deve ser um número inteiro igual ou maior que zero."
      });
    }

    // Chamamos a função de cadastro do Model.
    const resultado = await produtoModel.cadastrarProduto(produto);

    // Retornamos uma mensagem de sucesso.
    res.status(201).json({
      mensagem: "Produto cadastrado com sucesso!",
      id_produto: resultado.insertId
    });
    
  } catch (erro) {
     // Exibimos o erro no terminal.
    console.error("Erro ao cadastrar produto:", erro);

    // Retornamos uma mensagem de erro.
    res.status(500).json({
      mensagem: "Erro ao cadastrar produto."
    });
  }
};

// Exportamos a função para as rotas utilizarem.
module.exports = {
  listarProdutos,
  cadastrarProduto
};