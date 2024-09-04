const { DataTypes } = require("sequelize");
const conexao = require("../DB/conn");
const Usuario = require("./usuarioModel");

const Review = conexao.define("Review", {
  artista: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  musica: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  like: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dislike: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Usuario.hasMany(Review, {
  onDelete: "CASCADE",
});
Review.belongsTo(Usuario);

Review.sync()
  //.sync({ force: true })
  .then(() => console.log("Tabela Reviews Sincronizada com sucesso!"))
  .catch((err) => console.log("erro ao sincronizar a tabela Review: " + err));

module.exports = Review;
