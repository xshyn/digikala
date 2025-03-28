const { Router } = require("express");
const { createProductValidation } = require("./product.validation");
const { createProduct, getAllProducts, getProductDetailById, deleteProductById } = require("./product.controller");

const router = Router()

router.post("/", createProductValidation, createProduct)
router.get("/", getAllProducts)
router.get("/:id", getProductDetailById)
router.delete("/:id", deleteProductById)

module.exports = {
    productRoutes: router
}