const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
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

module.exports = router;
