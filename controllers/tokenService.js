const jwt = require("jsonwebtoken");
const chaveToken = "1wish-you-were-here2";

function assinarToken(dadosToken) {
  const token = jwt.sign(dadosToken, chaveToken, {
    expiresIn: "1h",
  });

  console.log("token gerado: " + token);

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

module.exports = {
  assinarToken,
  validarToken,
};
