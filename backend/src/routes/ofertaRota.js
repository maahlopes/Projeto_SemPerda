
// Importamos o Express.
const express = require("express");

// Criamos um roteador.
const router = express.Router();

// Importamos o Controller de ofertas.
const ofertaController = require("../controllers/ofertaController");

// (GET: /ofertas) Criamos a rota para listar as ofertas.
router.get("/", ofertaController.listarOfertas);

// (POST: /ofertas) Criamos a rota para cadastrar ofertas.
router.post("/", ofertaController.cadastrarOferta);

// (PUT: /ofertas/:id) Criamos a rota para atualizar uma oferta.
router.put("/:id", ofertaController.atualizarOferta);

// (DELETE: /ofertas/:id) Criamos a rota para excluir uma oferta.
router.delete("/:id", ofertaController.excluirOferta);

// Exportamos o roteador.
module.exports = router;