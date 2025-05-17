const { DataTypes } = require("sequelize")
const { sequelize } = require("./db")

const Bebida = sequelize.define("bebida", {

    nome: {

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
//     .then(() => console.log("Tabela bebida criada"))
//     .catch((error) => console.log("Erro ao criar tabela bebida " + error))

module.exports = Bebida