const { Sequelize } = require("sequelize");
const conexao = new Sequelize(
  "postgres://postgres:joaS12012022@localhost:5432/DB_Node",
  {
    host: "localhost",
    dialect: "postgres",
    timezone: "-03:00", // Fuso horário de Brasília (sem horário de verão)
    dialectOptions: {
      useUTC: false, // Evita usar UTC no PostgreSQL
      dateStrings: true, // Garante que os timestamps sejam tratados como strings, preservando o fuso horário
    },
    logging: false,
  }
);

try {
  conexao.authenticate();
  console.log("conexao estabelecida");
} catch (error) {
  console.log("erro ao testar a conexão:" + error);
}

module.exports = conexao;
