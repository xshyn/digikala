const { Router } = require("express");
const { createProductValidation } = require("./product.validation");
const { createProduct } = require("./product.controller");

const router = Router()

router.post("/" , createProductValidation , createProduct)

module.exports = {
    productRoutes :router
}