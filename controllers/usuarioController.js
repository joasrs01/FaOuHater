const bcrypt = require("bcrypt");
const Usuario = require("../models/usuarioModel");
const tokenService = require("./tokenService");

module.exports = class UsuarioController {
  static abrirCadastroUsuario(req, res) {
    res.render("usuario/cadastrarUsuario");
  }

  static async cadastrarUsuario(req, res) {
    //gera a senha criptografada
    const senhaHash = bcrypt.hashSync(req.body.senha, 10);

    let usuario = {
      nome: req.body.nome,
      email: req.body.email,
      login: req.body.login,
      senha: senhaHash,
    };

    usuario = await Usuario.create(usuario);

    gerarCookieToken(res, usuario);

    res.redirect("/");
  }

  static abrirLogin(req, res) {
    res.render("usuario/login", { esconderMsgInvalido: true });
  }

  static async autenticarUsuario(req, res) {
    const login = req.body.login;
    const senha = req.body.senha;
    let valido = false;

    const usuario = await Usuario.findOne({
      raw: true,
      where: {
        login: login,
      },
    });

    if (usuario && (await bcrypt.compare(senha, usuario.senha))) {
      gerarCookieToken(res, usuario);

      res.redirect("/");
    } else {
      res.render("usuario/login", { esconderMsgInvalido: false });
    }
  }

  static logoffUsuario(req, res) {
    res.clearCookie("token_usuario_foh");
    res.redirect("/");
  }
};

function gerarCookieToken(res, usuario) {
  const token = gerarTokenAutenticado(usuario);

  res.cookie("token_usuario_foh", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000, // 1 hora
  });
}

function gerarTokenAutenticado(usuario) {
  console.log("id usuario:" + usuario.id);
  console.log("nome usuario:" + usuario.nome);

  return tokenService.assinarToken({
    userId: usuario.id,
    userName: usuario.nome,
  });
}
