// Importamos o Express.
const express = require("express");

// Criamos um roteador.
const router = express.Router();

// Importamos o Controller de produtos.
const produtoController = require("../controllers/produtoController");

// Criamos a rota para listar os produtos.
router.get("/", produtoController.listarProdutos);

// Exportamos as rotas.
module.exports = router;