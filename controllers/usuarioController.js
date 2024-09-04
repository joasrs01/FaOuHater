const bcrypt = require("bcrypt");
const Usuario = require("../models/usuarioModel");
const tokenService = require("./tokenService");
const reviewController = require("./reviewController");
const { Sequelize } = require("sequelize");

module.exports = class UsuarioController {
  static abrirCadastroUsuario(req, res) {
    res.render("usuario/cadastrarUsuario");
  }

  static async cadastrarUsuario(req, res) {
    let msgEmail = undefined;
    let msgLogin = undefined;

    const nome = req.body.nome;
    const email = req.body.email;
    const login = req.body.login;
    const senha = req.body.senha;

    if (
      (await Usuario.count({
        where: {
          email,
        },
      })) > 0
    ) {
      msgEmail = "E-mail já está sendo utilizado.";
    }

    if (
      (await Usuario.count({
        where: {
          login,
        },
      })) > 0
    ) {
      msgLogin = "User já está sendo utilizado.";
    }

    console.log(msgEmail);
    console.log(msgLogin);

    if (msgEmail || msgLogin) {
      res.render("usuario/cadastrarUsuario", { msgEmail, msgLogin });
    } else {
      //gera a senha criptografada
      const senhaHash = bcrypt.hashSync(senha, 10);

      let usuario = {
        nome: nome,
        email: email,
        login: login,
        senha: senhaHash,
      };

      usuario = await Usuario.create(usuario);

      gerarCookieToken(res, usuario);

      res.redirect("/");
    }
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

  static async perfilUsuario(req, res) {
    console.log(req.params.id);
    //console.log(req.params.id ?? req.usuario ? req.usuario.userId : 0);

    let idUsuario = req.params.id;
    if (!idUsuario) {
      idUsuario = req.usuario ? req.usuario.userId : undefined;
    }

    if (isNaN(idUsuario)) {
      res.render("validacao/perfilNaoEncontrado");
    } else {
      const reviews = await reviewController.buscarReviewsDoUsuario(idUsuario);

      const perfil = await Usuario.findOne({
        raw: true,
        attributes: {
          include: [
            Sequelize.literal(
              `( SELECT COUNT(1) FROM "Reviews" WHERE "Reviews"."UsuarioId" = ${idUsuario} ) AS qtdReviews`
            ),
          ],
        },
        where: { id: idUsuario },
      });

      if (perfil) {
        res.render("usuario/perfilUsuario", {
          usuarioAutenticado: req.usuario,
          reviews,
          perfil,
        });
      } else {
        res.render("validacao/perfilNaoEncontrado");
      }
    }
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
  return tokenService.assinarToken({
    userId: usuario.id,
    userName: usuario.nome,
  });
}
