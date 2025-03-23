const { config } = require("dotenv")
const express = require("express")
config()

// consts
const PORT = process.env.PORT ?? 3000

async function main(){
    const app = express()
    require("./configs/seq.config")
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))

    // not found route
    app.use((req , res) => {
        return res.status(404).json({
            message: "not found route"
        })
    })
    // error 
    app.use((err , req , res) => {
        const status = err?.status ?? 500
        const message = err?.message ?? "InternalServerError"
        return res.status(status).json({
            message
        })
    })

    // listening
    app.listen(PORT , () => {
        console.log("listening => http://localhost:" + PORT);
    })

}
main()