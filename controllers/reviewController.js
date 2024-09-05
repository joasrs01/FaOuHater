const Reacoes = require("../models/reacoesModel");
const Review = require("../models/reviewModel");
const Usuario = require("../models/usuarioModel");
const reacoesController = require("./reacoesController");
const { Sequelize } = require("sequelize");

module.exports = class ReviewController {
  static exibirCadastro(req, res) {
    let usuarioAutenticado = req.usuario;
    res.render("reviews/cadastrarReview", { usuarioAutenticado });
  }

  static async exibirHome(req, res) {
    res.render("reviews/home", {
      usuarioAutenticado: req.usuario,
      reviews: await buscarTodasReviews(req.usuario ? req.usuario.userId : 0),
    });
  }

  static adicionarReview(req, res) {
    let review = {
      artista: req.body.artista,
      musica: req.body.musica,
      review: req.body.review,
      UsuarioId: req.body.usuario,
    };

    Review.create(review);

    res.redirect("/");
  }

  static async like(req, res) {
    console.log(req.body);

    reacoesController.likeDislike(
      req.body.usuarioId,
      req.body.reviewId,
      true,
      res
    );
  }

  static async dislike(req, res) {
    console.log(req.body);
    reacoesController.likeDislike(
      req.body.usuarioId,
      req.body.reviewId,
      false,
      res
    );
  }

  static async buscarReviewsDoUsuario(usuarioId, idUsuarioAutenticado) {
    return buscarReviewsDoUsuario(usuarioId, idUsuarioAutenticado);
  }

  static async removerReview(req, res) {
    Review.destroy({ where: { id: req.body.idReview } });

    res.redirect(req.get("Referer"));
  }
};

async function buscarTodasReviews(usuarioId) {
  let reviews = await Review.findAll({
    raw: true,
    include: [
      {
        model: Usuario,
        attributes: ["nome", "login", "id"],
      },
      {
        model: Reacoes,
        attributes: [],
      },
    ],
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT "R"."like"
            FROM "Reacoes" AS "R"
            WHERE "R"."UsuarioId" = ${usuarioId}
            AND "R"."ReviewId" = "Review"."id"
          )`),
          "usuarioLike",
        ],
        [
          Sequelize.literal(`(
            SELECT "R"."dislike"
            FROM "Reacoes" AS "R"
            WHERE "R"."UsuarioId" = ${usuarioId}
            AND "R"."ReviewId" = "Review"."id"
          )`),
          "usuarioDislike",
        ],
        // Contagem de likes
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.literal(`CASE WHEN "Reacoes"."like" = '1' THEN 1 END`)
          ),
          "qtdLikes",
        ],
        // Contagem de dislikes
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.literal(`CASE WHEN "Reacoes"."dislike" = '1' THEN 1 END`)
          ),
          "qtdDislikes",
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT(1)
            FROM "Comentarios"
            WHERE "Comentarios"."idOrigem" = "Review"."id" 
          )`),
          "qtdComentarios",
        ],
      ],
    },
    group: ["Review.id", "Usuario.id"],
    order: [["updatedAt", "DESC"]],
  });

  return prepararReviews(reviews, usuarioId);
}

function prepararReviews(reviews, usuarioId) {
  reviews.forEach((e) => {
    let dia = String(e.updatedAt.getDate()).padStart(2, "0");
    let mes = String(e.updatedAt.getMonth() + 1).padStart(2, "0");
    let ano = e.updatedAt.getFullYear();

    let horas = String(e.updatedAt.getHours()).padStart(2, "0");
    let minutos = String(e.updatedAt.getMinutes()).padStart(2, "0");
    let segundos = String(e.updatedAt.getSeconds()).padStart(2, "0");

    e.modDataAtualizacao = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
    e.nomeUsuario = e["Usuario.login"];
    e.idUsuario = e["Usuario.id"];
    e.apresentarOpcoes =
      usuarioId === e.idUsuario ? true : usuarioId === 1 ? true : false;
  });

  return reviews;
}

async function buscarReviewsDoUsuario(usuarioId, idUsuarioAutenticado) {
  let reviews = await Review.findAll({
    raw: true,
    include: [
      {
        model: Usuario,
        attributes: ["nome", "login", "id"],
      },
      {
        model: Reacoes,
        attributes: [],
      },
    ],
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT "R"."like"
            FROM "Reacoes" AS "R"
            WHERE "R"."UsuarioId" = ${idUsuarioAutenticado}
            AND "R"."ReviewId" = "Review"."id"
          )`),
          "usuarioLike",
        ],
        [
          Sequelize.literal(`(
            SELECT "R"."dislike"
            FROM "Reacoes" AS "R"
            WHERE "R"."UsuarioId" = ${idUsuarioAutenticado}
            AND "R"."ReviewId" = "Review"."id"
          )`),
          "usuarioDislike",
        ],
        // Contagem de likes
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.literal(`CASE WHEN "Reacoes"."like" = '1' THEN 1 END`)
          ),
          "qtdLikes",
        ],
        // Contagem de dislikes
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.literal(`CASE WHEN "Reacoes"."dislike" = '1' THEN 1 END`)
          ),
          "qtdDislikes",
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT(1)
            FROM "Comentarios"
            WHERE "Comentarios"."idOrigem" = "Review"."id" 
          )`),
          "qtdComentarios",
        ],
      ],
    },
    where: {
      UsuarioId: usuarioId,
    },
    group: ["Review.id", "Usuario.id"],
    order: [["updatedAt", "DESC"]],
  });

  return prepararReviews(reviews, idUsuarioAutenticado);
}
