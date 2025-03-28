const { config } = require("dotenv")
const express = require("express")
const { sequelize } = require("./configs/seq.config")
const { productRoutes } = require("./modules/product/product.routes")
config()
require("./modules/product/product.model")
// sequelize.sync({ alter: true })
//     .then(() => {
//         console.log("synced successfully");
//     })
//     .catch((err) => {
//         console.log(err.message);
//     })



// consts
const PORT = process.env.PORT ?? 3000

async function main() {
    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // routes
    app.use("/product", productRoutes)

    // not found route
    app.use((req, res, next) => {
        return res.status(404).json({
            message: "not found route"
        })
    })
    // error 
    app.use((err, req, res, next) => {
        const status = err?.status ?? err?.statusCode ?? 500
        let message = err?.message ?? "InternalServerError"

        if (err?.name === 'ValidationError') {
            const { details } = err
            message = details?.body?.[0]?.message ?? "InternalServerError"
        }

        return res.status(status).json({
            message,
        })
    })

    // listening
    app.listen(PORT, () => {
        console.log("listening => http://localhost:" + PORT);
    })

}
main()