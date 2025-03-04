const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const tokenService = require("../controllers/tokenService");
const { imageUpload } = require("../controllers/uploadService");

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
router.get(
  "/alterar",
  tokenService.verificarTokenThrow,
  usuarioController.abrirAlteracaoCadastro
);
router.post(
  "/alterar",
  tokenService.verificarTokenThrow,
  imageUpload.single("image"),
  usuarioController.registrarAlteracao
);
router.post("/add", usuarioController.cadastrarUsuario);
router.post("/login", usuarioController.autenticarUsuario);
router.post(
  "/imagem/upload",
  tokenService.verificarTokenThrow,
  usuarioController.uploadImagem
);

module.exports = router;
