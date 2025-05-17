const { DataTypes } = require("sequelize")
const { sequelize } = require("./db")

const Usuario = sequelize.define("usuarios", {

    nome: {

        type: DataTypes.STRING,
        allowNull: false
    },

    email: {

        type: DataTypes.STRING,
        allowNull: false
    },

    senha: {

        type: DataTypes.STRING,
        allowNull: false
    },

    telefone: {

        type: DataTypes.STRING,
        allowNull: false
    },

    cep: {

        type: DataTypes.STRING,
        allowNull: false
    },

    cidade: {

        type: DataTypes.STRING,
        allowNull: false
    },

    endereco: {

        type: DataTypes.STRING,
        allowNull: false
    },

    admin: {

        type: DataTypes.BOOLEAN
    }
})

// sequelize.sync()
//     .then(() => console.log("Tabela usuarios criada"))
//     .catch((error) => console.log("Erro ao criar tabela " + error))

module.exports = Usuario