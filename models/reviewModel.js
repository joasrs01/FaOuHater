const { DataTypes } = require("sequelize");
const conexao = require("../DB/conn");

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
});

Review.sync()
  //.sync({ force: true })
  .then(() => console.log("Tabela Reviews Sincronizada com sucesso!"))
  .catch((err) => console.log("erro ao sincronizar a tabela Review: " + err));

module.exports = Review;
