const { DataTypes } = require("sequelize")
const { sequelize } = require("./db")

const Hamburguer = sequelize.define("hamburguers", {

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
//     .then(() => console.log("Tabela hamburguer criada"))
//     .catch((error) => console.log("Erro ao criar tabela hamburguer " + error))

module.exports = Hamburguer