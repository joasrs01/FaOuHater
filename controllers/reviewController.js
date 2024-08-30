const { raw } = require("express");
const Review = require("../models/reviewModel");

module.exports = class ReviewController {
  static exibirCadastro(req, res) {
    res.render("reviews/cadastrarReview");
  }

  static async exibirHome(req, res) {
    let reviews = await Review.findAll({
      raw: true,
      order: [["updatedAt", "DESC"]],
    });

    reviews.forEach((e) => {
      console.log(e.updatedAt.getDate());
      let dia = String(e.updatedAt.getDate()).padStart(2, "0");
      let mes = String(e.updatedAt.getMonth() + 1).padStart(2, "0");
      let ano = e.updatedAt.getFullYear();

      let horas = String(e.updatedAt.getHours()).padStart(2, "0");
      let minutos = String(e.updatedAt.getMinutes()).padStart(2, "0");
      let segundos = String(e.updatedAt.getSeconds()).padStart(2, "0");

      e.modDataAtualizacao = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
    });

    res.render("reviews/home", { reviews });
  }

  static adicionarReview(req, res) {
    let review = {
      artista: req.body.artista,
      musica: req.body.musica,
      review: req.body.review,
    };

    Review.create(review);

    res.redirect("/");
  }
};
