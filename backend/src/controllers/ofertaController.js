// Importamos as funções do Model de ofertas.
const ofertaModel = require("../models/ofertaModel");

// Criamos a função para validar os dados da oferta.
const validarOferta = async (oferta) => {
  // Verificamos se os dados recebidos são válidos.
  if (!oferta || typeof oferta !== "object" || Array.isArray(oferta)) {
    return "Envie os dados da oferta em um formato válido.";
  }

  // Verificamos se os campos obrigatórios foram preenchidos.
  if (
    oferta.id_produto == null ||
    oferta.preco_promocional == null ||
    !oferta.data_inicio ||
    !oferta.data_fim
  ) {
    return "Preencha todos os campos obrigatórios.";
  }

  // Verificamos se o ID do produto é válido.
  if (
    !Number.isSafeInteger(Number(oferta.id_produto)) ||
    Number(oferta.id_produto) <= 0
  ) {
    return "O ID do produto deve ser um número inteiro positivo.";
  }

  // Verificamos se o preço promocional é válido.
  if (
    !/^\d+(\.\d{1,2})?$/.test(String(oferta.preco_promocional)) ||
    !Number.isFinite(Number(oferta.preco_promocional)) ||
    Number(oferta.preco_promocional) <= 0 ||
    Number(oferta.preco_promocional) > 99999999.99
  ) {
    return "O preço promocional deve ser positivo e ter até duas casas decimais.";
  }

  // Verificamos se o percentual de desconto é válido.
  if (
    oferta.percentual_desconto != null &&
    (
      !/^\d+(\.\d{1,2})?$/.test(String(oferta.percentual_desconto)) ||
      !Number.isFinite(Number(oferta.percentual_desconto)) ||
      Number(oferta.percentual_desconto) < 0 ||
      Number(oferta.percentual_desconto) > 100
    )
  ) {
    return "O desconto deve estar entre 0 e 100 e ter até duas casas decimais.";
  }

  // Verificamos se as datas possuem o formato correto.
  if (
    typeof oferta.data_inicio !== "string" ||
    typeof oferta.data_fim !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(oferta.data_inicio) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(oferta.data_fim)
  ) {
    return "Informe datas válidas no formato AAAA-MM-DD.";
  }

  // Verificamos se as datas realmente existem.
  const dataInicio = new Date(`${oferta.data_inicio}T00:00:00Z`);
  const dataFim = new Date(`${oferta.data_fim}T00:00:00Z`);

  if (
    Number.isNaN(dataInicio.getTime()) ||
    Number.isNaN(dataFim.getTime()) ||
    dataInicio.toISOString().slice(0, 10) !== oferta.data_inicio ||
    dataFim.toISOString().slice(0, 10) !== oferta.data_fim
  ) {
    return "Informe datas válidas no formato AAAA-MM-DD.";
  }

  // Verificamos se a data final não é anterior à inicial.
  if (dataFim < dataInicio) {
    return "A data final não pode ser anterior à data inicial.";
  }

  // Verificamos se o status pertence às opções permitidas.
  const statusPermitidos = ["Ativa", "Encerrada", "Cancelada"];

  if (
    oferta.status != null &&
    !statusPermitidos.includes(oferta.status)
  ) {
    return "O status deve ser Ativa, Encerrada ou Cancelada.";
  }

  // Buscamos o produto relacionado à oferta.
  const produto = await ofertaModel.buscarProdutoPorId(
    Number(oferta.id_produto)
  );

  // Verificamos se o produto existe.
  if (!produto) {
    return "O produto informado não existe.";
  }

  // Verificamos se o preço promocional é menor que o original.
  const precoOriginal = Number(produto.preco_original);
  const precoPromocional = Number(oferta.preco_promocional);

  if (precoPromocional >= precoOriginal) {
    return "O preço promocional deve ser menor que o preço original.";
  }

  // Verificamos se o percentual informado corresponde ao desconto.
  if (oferta.percentual_desconto != null) {
    const descontoCalculado = Math.round(
      ((precoOriginal - precoPromocional) / precoOriginal) * 10000
    ) / 100;

    if (
      Number(oferta.percentual_desconto) !== descontoCalculado
    ) {
      return "O percentual de desconto não corresponde aos preços informados.";
    }
  }

  // Retornamos null quando todos os dados são válidos.
  return null;
};

// Criamos a função para listar ofertas.
const listarOfertas = async (req, res) => {
  try {
    // Chamamos a função do Model.
    const ofertas = await ofertaModel.listarOfertas();

    // Retornamos as ofertas em formato JSON.
    return res.status(200).json(ofertas);

  } catch (erro) {
    console.error("Erro ao listar ofertas:", erro);

    return res.status(500).json({
      mensagem: "Erro ao buscar ofertas."
    });
  }
};

// Criamos a função para cadastrar ofertas.
const cadastrarOferta = async (req, res) => {
  try {
    // Recebemos os dados enviados pelo usuário.
    const oferta = req.body;

    // Validamos os dados da oferta.
    const erroValidacao = await validarOferta(oferta);

    if (erroValidacao) {
      return res.status(400).json({
        mensagem: erroValidacao
      });
    }

    // Chamamos a função de cadastro do Model.
    const resultado = await ofertaModel.cadastrarOferta(oferta);

    // Retornamos uma mensagem de sucesso.
    return res.status(201).json({
      mensagem: "Oferta cadastrada com sucesso!",
      id_oferta: resultado.insertId
    });

  } catch (erro) {
    console.error("Erro ao cadastrar oferta:", erro);

    // Tratamos erros de chave estrangeira.
    if (erro.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        mensagem: "O produto informado não existe."
      });
    }

    return res.status(500).json({
      mensagem: "Erro ao cadastrar oferta."
    });
  }
};

// Criamos a função para atualizar ofertas.
const atualizarOferta = async (req, res) => {
  try {
    // Recebemos o ID pela URL.
    const id = Number(req.params.id);

    // Verificamos se o ID é válido.
    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "Informe um ID de oferta válido."
      });
    }

    // Recebemos os novos dados da oferta.
    const oferta = req.body;

    // Validamos os dados da oferta.
    const erroValidacao = await validarOferta(oferta);

    if (erroValidacao) {
      return res.status(400).json({
        mensagem: erroValidacao
      });
    }

    // Chamamos a função de atualização do Model.
    const resultado = await ofertaModel.atualizarOferta(id, oferta);

    // Verificamos se a oferta existe.
    if (!resultado.existe) {
      return res.status(404).json({
        mensagem: "Oferta não encontrada."
      });
    }

    // Retornamos uma mensagem de sucesso.
    return res.status(200).json({
      mensagem: "Oferta atualizada com sucesso!"
    });

  } catch (erro) {
    console.error("Erro ao atualizar oferta:", erro);

    // Tratamos erros de chave estrangeira.
    if (erro.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        mensagem: "O produto informado não existe."
      });
    }

    return res.status(500).json({
      mensagem: "Erro ao atualizar oferta."
    });
  }
};

// Criamos a função para excluir ofertas.
const excluirOferta = async (req, res) => {
  try {
    // Recebemos o ID pela URL.
    const id = Number(req.params.id);

    // Verificamos se o ID é válido.
    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "Informe um ID de oferta válido."
      });
    }

    // Chamamos a função de exclusão do Model.
    const resultado = await ofertaModel.excluirOferta(id);

    // Verificamos se alguma oferta foi excluída.
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Oferta não encontrada."
      });
    }

    // Retornamos uma mensagem de sucesso.
    return res.status(200).json({
      mensagem: "Oferta excluída com sucesso!"
    });

  } catch (erro) {
    console.error("Erro ao excluir oferta:", erro);

    return res.status(500).json({
      mensagem: "Erro ao excluir oferta."
    });
  }
};

// Exportamos as funções para as rotas utilizarem.
module.exports = {
  listarOfertas,
  cadastrarOferta,
  atualizarOferta,
  excluirOferta
};