// Importa o framework.
const express = require("express");

// Cria a aplicação.
const app = express();

// Permite receber dados(informações) no formato JSON.
app.use(express.json());

// Importa as rotas de produtos.
const produtoRota = require("./routes/produtoRota");

// (GET: /produtos) utiliza as rotas de produtos.
app.use("/produtos", produtoRota);

// Importa as rotas da ofertas.
const ofertaRota = require("./routes/ofertaRota");

// (GET: /ofertas) utiliza as rotas de ofertas.
app.use("/ofertas", ofertaRota);

// Disponibiliza a aplicação para o server.js.
module.exports = app;