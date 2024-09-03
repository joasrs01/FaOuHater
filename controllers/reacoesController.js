const Reacoes = require("../models/reacoesModel");
const Sequelize = require("sequelize");

module.exports = class reacoesController {
  static async likeDislike(UsuarioId, ReviewId, like, res) {
    try {
      let reacao = await Reacoes.findOne({ where: { UsuarioId, ReviewId } });

      console.log("review:" + reacao);
      if (reacao) {
        if (like) {
          reacao.like = !reacao.like;
          if (reacao.like) reacao.dislike = false;
        } else {
          reacao.dislike = !reacao.dislike;
          if (reacao.dislike) reacao.like = false;
        }

        await reacao.save();
      } else {
        reacao = await Reacoes.create({
          like,
          dislike: !like,
          UsuarioId,
          ReviewId,
        });
      }

      let qtds = await Reacoes.findOne({
        raw: true,
        attributes: [
          "ReviewId", // Campo para agrupar
          [
            Sequelize.fn(
              "COUNT",
              Sequelize.literal(`CASE WHEN "like" = '1' THEN 1 END`)
            ),
            "qtdLikes",
          ], // Contagem de likes
          [
            Sequelize.fn(
              "COUNT",
              Sequelize.literal(`CASE WHEN "dislike" = '1' THEN 1 END`)
            ),
            "qtdDislikes",
          ], // Contagem de dislikes
        ],
        where: {
          ReviewId,
        },
        group: ["ReviewId"], // Agrupa pelo código da review
      });

      let jsnRetorno = {
        qtds: qtds,
        like: reacao.like,
        dislike: reacao.dislike,
      };

      console.log(jsnRetorno);

      res.json({ jsnRetorno });
    } catch (error) {
      console.log(`erro ao ${!like ? "des" : ""}curtir a review: ` + error);
      res.status(500).send(`erro ao ${!like ? "des" : ""}curtir a review: `);
    }
  }
};
