const createHttpError = require("http-errors")
const { ProductTypes } = require("../../common/constants")
const { Product, ProductDetail, ProductColor, ProductSize } = require("./product.model")

async function createProduct(req, res, next) {
    try {
        const {
            title,
            price = undefined,
            discount = undefined,
            active_discount = undefined,
            count = undefined,
            type,
            desc,
            details,
            sizes,
            colors
        } = req.body
        if (!Object.values(ProductTypes).includes(type)) throw createHttpError(400, "Invalid Product Type")

        const product = await Product.create({
            title,
            price,
            discount,
            active_discount,
            type,
            count,
            desc,
        })

        if (details && Array.isArray(details)) {
            let detailsList = []
            for (const item of details) {
                detailsList.push({
                    key: item?.key,
                    value: item?.value,
                    productId: product.id,
                })
            }
            if (detailsList.length > 0) {
                await ProductDetail.bulkCreate(detailsList)
            }
        }

        switch (type) {
            case ProductTypes.COLORING:
                if (colors && Array.isArray(colors)) {
                    let colorsList = []
                    for (const item of colors) {
                        colorsList.push({
                            color_name: item.color_name,
                            color_code: item.color_code,
                            productId: product.id,
                            price: item.price,
                            discount: item.discount,
                            active_discount: item.active_discount,
                            count: item.count,
                        })
                    }
                    if (colorsList.length > 0) {
                        await ProductColor.bulkCreate(colorsList)
                    }
                }
                break;
            case ProductTypes.SIZING:
                if (sizes && Array.isArray(sizes)) {
                    let sizesList = []
                    for (const item of sizes) {
                        sizesList.push({
                            size: item.size,
                            productId: product.id,
                            price: item.price,
                            discount: item.discount,
                            active_discount: item.active_discount,
                            count: item.count,
                        })
                    }
                    if (sizesList.length > 0) {
                        await ProductSize.bulkCreate(sizesList)
                    }
                    break;
                }
        }
        return res.json({
            message: "Product Created Successfully"
        })
    } catch (error) {
        next(error)
    }
}
async function getAllProducts(req, res, next) {
    try {
        const products = await Product.findAll()
        return res.json(products)
    } catch (error) {
        next(error)
    }

}
async function getProductDetailById(req, res, next) {
    try {
        const { id } = req.params
        const product = await Product.findOne({ where: { id }, include: [{ all: true }] })
        if (!product) throw createHttpError(404, "product not found")
        return res.json(product)
    } catch (error) {
        next(error)
    }

}
async function deleteProductById(req, res, next) {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)
        if (!product) throw createHttpError(404, "product not found")
        await product.destroy()
        res.json({
            message: "Product Deleted Successfully"
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductDetailById,
    deleteProductById
}