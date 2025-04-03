const { config } = require("dotenv")
const express = require("express")
const { sequelize } = require("./configs/seq.config")
const { productRoutes } = require("./modules/product/product.routes")
const { authRoutes } = require("./modules/auth/auth.routes")
const { syncDb } = require("./common/utils")
config()
require("./modules/product/product.model")
require("./modules/user/user.model")
require("./modules/auth/refreshToken.model")
syncDb()



// consts
const PORT = process.env.PORT ?? 3000

async function main() {
    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // routes
    app.use("/product", productRoutes)
    app.use("/auth", authRoutes)

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