const bcrypt = require("bcrypt");
const Usuario = require("../models/usuarioModel");
const tokenService = require("./tokenService");
const reviewController = require("./reviewController");
const { Sequelize } = require("sequelize");

module.exports = class UsuarioController {
  static async registrarAlteracao(req, res) {
    if (req.file) {
      const fs = require("fs");
      const axios = require("axios");
      const FormData = require("form-data");
      const streamImagem = fs.createReadStream(req.file.path);

      const form = new FormData();
      form.append("key", "0979c634786da63602e9149f8be8e0dc");
      form.append("image", streamImagem);

      const headers = form.getHeaders();

      const resposta = await axios.post(
        "https://api.imgbb.com/1/upload",
        form,
        {
          headers: {
            headers,
          },
        }
      );

      Usuario.update(
        { urlImagemPerfil: resposta.data.data.display_url },
        { where: { id: req.usuario.userId } }
      );

      streamImagem.destroy();
      fs.unlinkSync(req.file.path);
    }

    res.redirect("perfil");
  }

  static uploadImagem(req, res) {}

  static abrirCadastroUsuario(req, res) {
    res.render("usuario/cadastrarUsuario", { esconderCadastro: true });
  }

  static async cadastrarUsuario(req, res) {
    let msgEmail = undefined;
    let msgLogin = undefined;

    const nome = req.body.nome;
    const email = req.body.email;
    const login = req.body.login;
    const senha = req.body.senha;

    const validacao = {
      validacaoEmail: undefined,
      validacaoUsuario: undefined,
    };

    if (
      (await Usuario.count({
        where: {
          email,
        },
      })) > 0
    ) {
      validacao.validacaoEmail = "E-mail já está sendo utilizado.";
    }

    if (
      (await Usuario.count({
        where: {
          login,
        },
      })) > 0
    ) {
      validacao.validacaoUsuario = "Usuário já está sendo utilizado.";
    }

    if (validacao.validacaoEmail || validacao.validacaoUsuario) {
      res.render("usuario/cadastrarUsuario", { validacao });
    } else {
      //gera a senha criptografada
      const salt = bcrypt.genSaltSync();
      const senhaHash = bcrypt.hashSync(senha, salt);

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
    res.render("usuario/login", { esconderLogin: true });
  }

  static async autenticarUsuario(req, res) {
    const login = req.body.login;
    const senha = req.body.senha;

    let validacao = { loginInvalido: false, senhaInvalida: false };

    const usuario = await Usuario.findOne({
      raw: true,
      where: {
        login: login,
      },
    });

    validacao.loginInvalido = usuario ? false : true;
    validacao.senhaInvalida =
      validacao.loginInvalido || !(await bcrypt.compare(senha, usuario.senha));

    if (!validacao.loginInvalido && !validacao.senhaInvalida) {
      gerarCookieToken(res, usuario);

      res.redirect("/");
    } else {
      res.render("usuario/login", { validacao });
    }
  }

  static logoffUsuario(req, res) {
    res.clearCookie("token_usuario_foh");
    res.redirect("/");
  }

  static async abrirAlteracaoCadastro(req, res) {
    const usuario = await Usuario.findOne({
      raw: true,
      where: { id: req.usuario.userId },
    });

    usuario.urlImagemPerfil = usuario.urlImagemPerfil
      ? usuario.urlImagemPerfil
      : "https://i.ibb.co/yqMZctK/noprofileimage.jpg";

    res.render("usuario/alterarPerfil", {
      usuarioAutenticado: req.usuario,
      usuario,
    });
  }

  static async perfilUsuario(req, res) {
    //console.log(req.params.id ?? req.usuario ? req.usuario.userId : 0);

    let idUsuario = req.params.id;
    let idUsuarioAutenticado = req.usuario ? req.usuario.userId : 0;

    if (!idUsuario) {
      idUsuario = idUsuarioAutenticado;
    }

    if (isNaN(idUsuario)) {
      res.render("validacao/perfilNaoEncontrado");
    } else {
      const reviews = await reviewController.buscarReviewsDoUsuario(
        idUsuario,
        idUsuarioAutenticado
      );

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
        perfil.urlImagemPerfil = perfil.urlImagemPerfil
          ? perfil.urlImagemPerfil
          : "https://i.ibb.co/yqMZctK/noprofileimage.jpg";

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
  usuario.urlImagemPerfil = usuario.urlImagemPerfil
    ? usuario.urlImagemPerfil
    : "https://i.ibb.co/yqMZctK/noprofileimage.jpg";

  const token = gerarTokenAutenticado(usuario);

  res.cookie("token_usuario_foh", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 hora
  });
}

function gerarTokenAutenticado(usuario) {
  return tokenService.assinarToken({
    userId: usuario.id,
    userName: usuario.nome,
    userIcone: usuario.urlImagemPerfil,
  });
}
