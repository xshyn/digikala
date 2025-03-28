const { sequelize } = require("../configs/seq.config");

function syncDb() {
    sequelize.sync({ alter: true })
        .then(() => {
            console.log("synced successfully");
        })
        .catch((err) => {
            console.log(err.message);
        })
}
module.exports = { syncDb }