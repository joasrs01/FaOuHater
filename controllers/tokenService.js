const jwt = require("jsonwebtoken");
const chaveToken = "1wish-you-were-here2";

function assinarToken(dadosToken) {
  const token = jwt.sign(dadosToken, chaveToken, {
    expiresIn: "7d",
  });

  return token;
}

function validarToken(token) {
  let dadosToken;

  jwt.verify(token, chaveToken, (err, decoded) => {
    if (err) {
      console.log("erro ao validar o token: " + err);
      return [];
    }

    dadosToken = decoded;
  });

  return dadosToken;
}

function verificarToken(req, res, next) {
  const token = req.cookies ? req.cookies.token_usuario_foh : undefined;
  if (token) {
    const dadosToken = validarToken(token);
    req.usuario = dadosToken;
  }

  next();
}

function verificarTokenThrow(req, res, next) {
  const token = req.cookies ? req.cookies.token_usuario_foh : undefined;

  if (!token) {
    return res.status(401).send("Acesso negado: Nenhum token fornecido.");
  }

  let dadosToken = validarToken(token);

  if (!dadosToken) {
    return res.status(401).send("Acesso negado: Token Inválido.");
  }

  req.usuario = dadosToken;
  next();
}

module.exports = {
  assinarToken,
  verificarToken,
  verificarTokenThrow,
};
