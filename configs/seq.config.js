const { default: Sequelize } = require("@sequelize/core");
const { config } = require("dotenv");
config()

const options = {
    dialect: "mariadb",
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    logging: false
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