const { Sequelize } = require("sequelize");
const conexao = new Sequelize("DB_Node", "postgres", "joaS12012022", {
  host: "localhost",
  dialect: "postgres",
});

try {
  conexao.authenticate();
  console.log("conexao estabelecida");
} catch (error) {
  console.log("erro ao testar a conexão:" + error);
}

module.exports = conexao;
