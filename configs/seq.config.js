const { config } = require("dotenv");
const { Sequelize } = require("sequelize");
config()

const options = {
    dialect: "mariadb",
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    logging: false,
    define: {   
        freezeTableName: true
    }
}

const sequelize = new Sequelize(options)

sequelize.authenticate().then(() => {
    console.log("Connected To MARIADB");
}).catch((err) => {
    console.log("Cannot Connect To MARIADB => ERROR: " + err?.message);
})

module.exports = {
    sequelize
}