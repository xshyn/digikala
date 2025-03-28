const { validate, Joi } = require("express-validation")
const { ProductTypes } = require("../../common/constants")
const createProductValidation = validate({
    body: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().optional().allow(null),
        discount: Joi.number().optional().allow(null),
        active_discount: Joi.boolean().optional().allow(null),
        count: Joi.number().optional().allow(null),
        type: Joi.string().valid(...Object.values(ProductTypes)).required(),
        desc: Joi.string().required(),
        details: Joi.array().items(
            Joi.object({
                key: Joi.string().required(),
                value: Joi.string().required()
            })
        ),
        colors: Joi.array().items(
            Joi.object({
                color_name: Joi.string().required(),
                color_code: Joi.string().required(),
                price: Joi.number().required(),
                discount: Joi.number().optional().allow(null),
                active_discount: Joi.boolean().optional().allow(null),
                count: Joi.number().required(),
            })
        ),
        sizes: Joi.array().items(
            Joi.object({
                size: Joi.string().required(),
                price: Joi.number().required(),
                discount: Joi.number().optional().allow(null),
                active_discount: Joi.boolean().optional().allow(null),
                count: Joi.number().required(),
            })
        ),
    })
})

module.exports = {
    createProductValidation
}