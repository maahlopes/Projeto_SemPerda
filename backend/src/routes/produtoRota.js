// Importamos o Express.
const express = require("express");

// Criamos um roteador.
const router = express.Router();

// Importamos o Controller de produtos.
const produtoController = require("../controllers/produtoController");

// (GET: /produtos) Criamos a rota para listar os produtos.
router.get("/", produtoController.listarProdutos);

// (POST: /produtos) Criamos a rota para cadastrar produtos.
router.post("/", produtoController.cadastrarProduto);

// Exportamos as rotas.
module.exports = router;