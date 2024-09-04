const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const tokenService = require("../controllers/tokenService");

router.get("/add", usuarioController.abrirCadastroUsuario);
router.get("/login", usuarioController.abrirLogin);
router.get("/logoff", usuarioController.logoffUsuario);
router.get(
  "/perfil",
  tokenService.verificarTokenThrow,
  usuarioController.perfilUsuario
);
router.get(
  "/perfil/:id",
  tokenService.verificarToken,
  usuarioController.perfilUsuario
);
router.post("/add", usuarioController.cadastrarUsuario);
router.post("/login", usuarioController.autenticarUsuario);

module.exports = router;
