const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.get("/add", usuarioController.abrirCadastroUsuario);
router.get("/login", usuarioController.abrirLogin);
router.get("/logoff", usuarioController.logoffUsuario);
router.post("/add", usuarioController.cadastrarUsuario);
router.post("/login", usuarioController.autenticarUsuario);

module.exports = router;
