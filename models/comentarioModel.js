const { DataTypes } = require("sequelize");
const conexao = require("../DB/conn");
const Usuario = require("./usuarioModel");
const Review = require("./reviewModel");

const Comentario = conexao.define("Comentario", {
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  idOrigem: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipoOrigem: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Comentario.belongsTo(Usuario);

Usuario.hasMany(Comentario, {
  onDelete: "CASCADE",
});

Comentario.sync()
  //.sync({ force: true })
  .then(() => console.log("Tabela Comentario Sincronizada com sucesso!"))
  .catch((err) =>
    console.log("erro ao sincronizar a tabela Comentario: " + err)
  );

module.exports = Comentario;
