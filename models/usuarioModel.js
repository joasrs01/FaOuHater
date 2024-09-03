const { DataTypes } = require("sequelize");
const conexao = require("../DB/conn");

const Usuario = conexao.define("Usuario", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Usuario.sync()
  //.sync({ force: true })
  .then(() => console.log("Tabela Usuario Sincronizada com sucesso!"))
  .catch((err) => console.log("erro ao sincronizar a tabela Usuario: " + err));

module.exports = Usuario;
