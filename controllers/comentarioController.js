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

  static async buscarComentarios(req, res) {
    try {
      await buscarComentarios(req, res);
    } catch (error) {
      console.log("erro encontrado ao buscar comentarios: " + error);
      res.render("valiadacao/404");
    }
  }
};

async function buscarComentarios(req, res) {
  const reviewId = req.params.idReview;
  console.log("cheegou aqui");

  const comentarios = await Comentario.findAll({
    raw: true,
    where: { idOrigem: reviewId },
    include: { model: Usuario, attributes: ["login"] },
  });

  comentarios.forEach((e) => {
    let dia = String(e.updatedAt.getDate()).padStart(2, "0");
    let mes = String(e.updatedAt.getMonth() + 1).padStart(2, "0");
    let ano = e.updatedAt.getFullYear();

    let horas = String(e.updatedAt.getHours()).padStart(2, "0");
    let minutos = String(e.updatedAt.getMinutes()).padStart(2, "0");
    let segundos = String(e.updatedAt.getSeconds()).padStart(2, "0");

    e.modDataAtualizacao = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
  });

  console.log(comentarios);

  res.status(200).send(await JSON.stringify(comentarios));
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

  res.redirect("/");
}
