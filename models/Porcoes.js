const { DataTypes } = require("sequelize")
const { sequelize } = require("./db")

const Porcoes = sequelize.define("porcoes", {

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
//     .then(() => console.log("Tabela porcoes criada"))
//     .catch((error) => console.log("Erro ao criar tabela porcoes " + error))

module.exports = Porcoes