const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("railway", "root", "sObAoSNiJRwBOZZEVFiZgrszCrazDlqy", {

    host: "ballast.proxy.rlwy.net",
    port: 37245,
    dialect: "mysql"
})

// const sequelize = new Sequelize("xisdahora", "root", "root", {

//     host: "localhost",
//     dialect: "mysql"
// })

sequelize.authenticate()
    .then(() => console.log("Conectado ao banco de dados"))
    .catch((error) => console.log("Erro ao conectar ao banco de dados " + error))

module.exports = { Sequelize, sequelize }