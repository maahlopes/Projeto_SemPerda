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
    
    // Verificamos se os dados recebidos são um objeto válido.
    if (!produto || typeof produto !== "object" || Array.isArray(produto)) {
      return res.status(400).json({
        mensagem: "Envie os dados do produto em um formato válido."
      });
    }

    // Verificamos se os campos obrigatórios foram preenchidos.
    if (
      produto.id_estabelecimento == null ||
      produto.id_categoria  == null ||
      typeof produto.nome !== "string" ||
      !produto.nome.trim() ||
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

    // Verificamos se o ID do fornecedor é válido, caso seja informado.
    if (
      produto.id_fornecedor != null &&
      (
        !Number.isInteger(Number(produto.id_fornecedor)) ||
        Number(produto.id_fornecedor) <= 0
      )
    ) {
      return res.status(400).json({
        mensagem: "O ID do fornecedor deve ser um número inteiro positivo."
      });
    }

    // Verificamos se o preço é válido, positivo e possui até duas casas decimais.
    if (
      !Number.isFinite(Number(produto.preco_original)) ||
      Number(produto.preco_original) <= 0 ||
      Number(produto.preco_original) > 99999999.99 ||
      !/^\d+(\.\d{1,2})?$/.test(String(produto.preco_original))
    ) {
      return res.status(400).json({
        mensagem: "O preço deve ser positivo, ter até duas casas decimais e não ultrapassar 99999999.99."
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

    // Convertemos a data recebida para o formato Date.
    const dataValidade = new Date(produto.data_validade);
    
    // Verificamos se a data de validade é válida.
    if (
      Number.isNaN(dataValidade.getTime()) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(produto.data_validade) ||
      dataValidade.toISOString().slice(0,10) !== produto.data_validade
    ) {
      return res.status(400).json({
        mensagem: "Informe uma data de validade válida no formato AAAA-MM-DD (ex: 2026-11-22)."
      });
    }

    // Verificamos se o nome possui até 100 caracteres.
    if (produto.nome.length > 100) {
      return res.status(400).json({
        mensagem: "O nome do produto deve ter até 100 caracteres."
      });
    }

    // Verificamos se a marca é um texto com até 100 caracteres.
    if (
      produto.marca != null &&
      (
        typeof produto.marca !== "string" ||
        produto.marca.length > 100
      )
    ) {
      return res.status(400).json({
        mensagem: "A marca deve ser um texto com até 100 caracteres."
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

// Criamos a função para atualizar produtos.
const atualizarProduto = async (req, res) => {
  try {
    // Recebemos o ID pela URL.
    const id = Number(req.params.id);

    // Verificamos se o ID é um número inteiro positivo.
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "Informe um ID de um produto válido."
      });
    }

    // Recebemos os novos dados do produto.
    const produto = req.body;

    // Verificamos se os dados recebidos são um objeto válido.
    if (!produto || typeof produto !== "object" || Array.isArray(produto)) {
      return res.status(400).json ({
        mensagem: "Envie os dados do produto em um formato válido."
      });
    }
    
    // Verificamos se os campos obrigatórios foram preenchidos.
    if (
      produto.id_estabelecimento == null ||
      produto.id_categoria == null ||
      typeof produto.nome !== "string" ||
      !produto.nome.trim() ||
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
      Number(produto.id_estabelecimento) <= 0 ||
      !Number.isInteger(Number(produto.id_categoria)) ||
      Number(produto.id_categoria) <= 0 
    ) {
      return res.status(400).json({
        mensagem: "Os IDs de estabelecimento e categoria devem ser números inteiros positivos."
      });
    }

    // Verificamos se o ID do fornecedor é válido, caso informado.
    if (
      produto.id_fornecedor != null &&
      (
        !Number.isInteger(Number(produto.id_fornecedor)) ||
        Number(produto.id_fornecedor) <= 0
      )
    ) {
      return res.status(400).json({
        mensagem: "O ID do fornecedor deve ser um número inteiro positivo."
      });
    }

    // Verificamos se o preço é válido.
    if (
      !Number.isFinite(Number(produto.preco_original)) ||
      Number(produto.preco_original) <= 0 ||
      Number(produto.preco_original) > 99999999.99 ||
      !/^\d+(\.\d{1,2})?$/.test(String(produto.preco_original))
    ) {
      return res.status(400).json({
        mensagem: "O preço deve ser positivo, ter até duas casas decimais e não ultrapassar 99999999.99."
      });
    }

    // Verificamos se a quantidade é válida.
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

    // Convertemos a data recebida para o formato Date.
    const dataValidade = new Date(produto.data_validade);

    // Verificamos se a data de validade é válida.
    if (
      Number.isNaN(dataValidade.getTime()) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(produto.data_validade) ||
      dataValidade.toISOString().slice(0, 10) !== produto.data_validade
    ) {
      return res.status(400).json({
        mensagem: "Informe uma data de validade válida no formato AAAA-MM-DD (ex: 2026-11-22)."
      });
    }

    // Verificamos se o nome possui até 100 caracteres.
    if (produto.nome.length > 100) {
      return res.status(400).json({
        mensagem: "O nome do produto deve ter até 100 caracteres."
      });
    }

    // Verificamos se a marca é um texto com até 100 caracteres.
    if (
      produto.marca != null &&
      (
        typeof produto.marca !== "string" ||
        produto.marca.length > 100
      )
    ) {
      return res.status(400).json({
        mensagem: "A marca deve ser um texto com até 100 caracteres."
      });
    }

    // Chamamos a função de atualização do Model.
    const resultado = await produtoModel.atualizarProduto(id, produto);

    // Verificamos se o produto existe.
    if (!resultado.existe) {
      return res.status(404).json({
        mensagem: "Produto não encontrado."
      });
    }

    // Retornamos uma mensagem de sucesso.
    res.status(200).json({
      mensagem: "Produto atualizado com sucesso!"
    });

  } catch (erro) {
    // Exibimos o erro no terminal.
    console.error("Erro ao atualizar produto:", erro);

    // Retornamos uma mensagem de erro.
    res.status(500).json({
      mensagem: "Erro ao atualizar produto."
    });
  }
};


// Criamos a função para excluir produtos.
const excluirProduto = async (req, res) => {
  try {
    // Recebemos o ID pela URL.
    const id = Number(req.params.id);

    // Verificamos se o ID é um número inteiro positivo.
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "Informe um ID de produto válido."
      });
    }

    // Chamamos a função de exclusão do Model.
    const resultado = await produtoModel.excluirProduto(id);

    // Verificamos se algum produto foi excluído.
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Produto não encontrado."
      });
    }

    // Retornamos uma mensagem de sucesso.
    res.status(200).json({
      mensagem: "Produto excluído com sucesso!"
    });

  } catch (erro) {
    // Exibimos o erro no terminal.
    console.error("Erro ao excluir produto:", erro);

    // Retornamos uma mensagem de erro.
    res.status(500).json({
      mensagem: "Erro ao excluir produto."
    });
  }
};

// Exportamos a função para as rotas utilizarem.
module.exports = {
  listarProdutos,
  cadastrarProduto,
  atualizarProduto,
  excluirProduto
};