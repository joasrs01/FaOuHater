const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const comentarioController = require("../controllers/comentarioController");
const tokenService = require("../controllers/tokenService");

router.get("/", tokenService.verificarToken, reviewController.exibirHome);
router.get(
  "/add",
  tokenService.verificarTokenThrow,
  reviewController.exibirCadastro
);
router.post(
  "/add",
  tokenService.verificarTokenThrow,
  reviewController.adicionarReview
);
router.post("/like", tokenService.verificarTokenThrow, reviewController.like);
router.post(
  "/dislike",
  tokenService.verificarTokenThrow,
  reviewController.dislike
);
router.post(
  "/remover",
  tokenService.verificarTokenThrow,
  reviewController.removerReview
);
router.post(
  "/comentario/add",
  tokenService.verificarTokenThrow,
  comentarioController.adicionarComentario
);
router.get("/comentarios/:idReview", comentarioController.buscarComentarios);

module.exports = router;
