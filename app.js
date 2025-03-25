const { config } = require("dotenv")
const express = require("express")
const { sequelize } = require("./configs/seq.config")
config()
require("./modules/product/product.model")
sequelize.sync({ force: true })
    .then(() => {
        console.log("synced successfully");
    })
    .catch((err) => {
        console.log(err.message);
    })



// consts
const PORT = process.env.PORT ?? 3000

async function main() {
    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // not found route
    app.use((req, res) => {
        return res.status(404).json({
            message: "not found route"
        })
    })
    // error 
    app.use((err, req, res) => {
        const status = err?.status ?? 500
        const message = err?.message ?? "InternalServerError"
        return res.status(status).json({
            message
        })
    })

    // listening
    app.listen(PORT, () => {
        console.log("listening => http://localhost:" + PORT);
    })

}
main()