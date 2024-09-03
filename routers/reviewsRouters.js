const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const tokenService = require("../controllers/tokenService");

function verificarToken(req, res, next) {
  const token = req.cookies ? req.cookies.token_usuario_foh : undefined;
  if (token) {
    const dadosToken = tokenService.validarToken(token);
    req.usuario = dadosToken;
  }

  next();
}

function verificarTokenThrow(req, res, next) {
  const token = req.cookies ? req.cookies.token_usuario_foh : undefined;
  console.log("verifica token throw");

  if (!token) {
    return res.status(401).send("Acesso negado: Nenhum token fornecido.");
  }

  let dadosToken = tokenService.validarToken(token);

  if (!dadosToken) {
    return res.status(401).send("Acesso negado: Token Inválido.");
  }

  req.usuario = dadosToken;
  next();
}

router.get("/", verificarToken, reviewController.exibirHome);
router.get("/add", verificarTokenThrow, reviewController.exibirCadastro);
router.post("/add", verificarTokenThrow, reviewController.adicionarReview);
router.post("/like", verificarTokenThrow, reviewController.like);
router.post("/dislike", verificarTokenThrow, reviewController.dislike);

module.exports = router;
