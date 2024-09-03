const { Sequelize } = require("sequelize");
const conexao = new Sequelize(process.env.DATABASE_URL, {
  // host: "localhost",
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
});

try {
  conexao.authenticate();
  console.log("conexao estabelecida");
} catch (error) {
  console.log("erro ao testar a conexão:" + error);
}

module.exports = conexao;
