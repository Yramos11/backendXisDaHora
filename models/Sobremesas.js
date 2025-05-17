const { DataTypes } = require("sequelize")
const { sequelize } = require("./db")

const Sobremesas = sequelize.define("sobremesas", {

    nome: {

        type: DataTypes.STRING
    },

    ingredientes: {

        type: DataTypes.STRING
    },

    valor: {

        type: DataTypes.FLOAT
    },

    categoria: {

        type: DataTypes.STRING
    },

    imagem: {

        type: DataTypes.STRING
    }
})

// sequelize.sync()
//     .then(() => console.log("Tabela sobremesas criada"))
//     .catch((error) => console.log("Erro ao criar tabela sobremesas " + error))

module.exports = Sobremesas