const { DataTypes } = require("sequelize");
const conexao = require("../DB/conn");
const Usuario = require("./usuarioModel");
const Review = require("./reviewModel");

const Reacoes = conexao.define("Reacoes", {
  like: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  dislike: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
});

Reacoes.belongsTo(Usuario);
Reacoes.belongsTo(Review);

Usuario.hasMany(Reacoes, {
  onDelete: "CASCADE",
});
Review.hasMany(Reacoes, {
  onDelete: "CASCADE",
});

Reacoes.sync()
  //.sync({ force: true })
  .then(() => console.log("Tabela Reacoes Sincronizada com sucesso!"))
  .catch((err) => console.log("erro ao sincronizar a tabela Reacoes: " + err));

module.exports = Reacoes;
