const Comentario = require("../models/comentarioModel");
const Usuario = require("../models/usuarioModel");
const tipoComentarioEnum = require("../Lib/enum/tipoComentarioEnum");

module.exports = class comentarioController {
  static async adicionarComentario(req, res) {
    try {
      await adicionarComentario(req, res);
    } catch (error) {
      console.log("erro encontrado ao adicionar o comentario: " + error);
      res.render("valiadacao/404");
    }
  }

  static async removerComentario(req, res) {
    try {
      await removerComentario(req, res);
    } catch (error) {
      console.log("erro encontrado ao buscar comentarios: " + error);
      res.render("valiadacao/404");
    }
  }

  static async buscarComentarios(req, res) {
    try {
      await buscarComentarios(req, res);
    } catch (error) {
      console.log("erro encontrado ao buscar comentarios: " + error);
      res.render("valiadacao/404");
    }
  }

  static async buscarQtdComentarios(req, res) {
    try {
      await buscarQtdComentarios(req, res);
    } catch (error) {
      console.log("erro encontrado ao buscar comentarios: " + error);
      res.render("valiadacao/404");
    }
  }
};

async function buscarQtdComentarios(req, res) {
  let idReview = req.params.idReview;

  let qtdComentarios = await Comentario.count({
    where: { idOrigem: idReview },
  });

  res.status(200).send(await JSON.stringify(qtdComentarios));
}

async function buscarComentarios(req, res) {
  const reviewId = req.params.idReview;

  const comentarios = await Comentario.findAll({
    raw: true,
    where: { idOrigem: reviewId },
    include: { model: Usuario, attributes: ["login"] },
    order: [["createdAt"]],
  });

  // console.log(req.usuario);
  let idUsuario = req.usuario ? req.usuario.userId : 0;
  // console.log(idUsuario);

  comentarios.forEach((e) => {
    let dia = String(e.updatedAt.getDate()).padStart(2, "0");
    let mes = String(e.updatedAt.getMonth() + 1).padStart(2, "0");
    let ano = e.updatedAt.getFullYear();

    let horas = String(e.updatedAt.getHours()).padStart(2, "0");
    let minutos = String(e.updatedAt.getMinutes()).padStart(2, "0");
    let segundos = String(e.updatedAt.getSeconds()).padStart(2, "0");

    e.modDataAtualizacao = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
    e.apresentarOpcoes =
      e.UsuarioId === idUsuario ? true : idUsuario === 1 ? true : false;
  });

  const retorno = {
    comentarios,
    usuarioAutenticado: idUsuario > 0,
  };

  res.status(200).send(await JSON.stringify(retorno));
}

async function adicionarComentario(req, res) {
  const comentario = req.body.comentario;
  const idOrigem = req.body.idOrigem;
  const tipoOrigem = req.body.tipoOrigem;
  const UsuarioId = req.usuario.userId;

  await Comentario.create({
    comentario,
    idOrigem,
    tipoOrigem,
    UsuarioId,
  });

  res.status(201).send("Comentário adicionado com sucesso!");
}

async function removerComentario(req, res) {
  let resultado = await Comentario.destroy({
    where: { id: req.params.idComentario },
  });

  let retorno = resultado === 1 ? 201 : 200;
  let msgRetorno =
    retorno == 201
      ? "Comentário deletado com sucesso!"
      : "Comentário não foi localizado para exclusão";

  res.status(retorno).send(msgRetorno);
}
