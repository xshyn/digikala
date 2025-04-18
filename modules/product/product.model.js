const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configs/seq.config");
const { ProductTypes } = require("../../common/constants");
const { OrderItem } = require("../order/order.model");

const Product = sequelize.define("product", {
    title: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL, allowNull: true },
    discount: { type: DataTypes.INTEGER, allowNull: true },
    active_discount: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
    type: { type: DataTypes.ENUM(...Object.values(ProductTypes)) },
    count: { type: DataTypes.INTEGER, defaultValue: 0 },
    desc: { type: DataTypes.TEXT },

}, {
    updatedAt: "updated_at",
    createdAt: "created_at",
})

const ProductDetail = sequelize.define("product_detail", {
    key: { type: DataTypes.STRING },
    value: { type: DataTypes.STRING },
    productId: { type: DataTypes.INTEGER }
}, {
    timestamps: false,
})
const ProductColor = sequelize.define("product_color", {
    color_name: { type: DataTypes.STRING },
    color_code: { type: DataTypes.STRING },
    productId: { type: DataTypes.INTEGER },
    count: { type: DataTypes.INTEGER, defaultValue: 0 },
    price: { type: DataTypes.DECIMAL },
    discount: { type: DataTypes.INTEGER, allowNull: true },
    active_discount: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
}, {
    timestamps: false
})
const ProductSize = sequelize.define("product_size", {
    size: { type: DataTypes.STRING },
    productId: { type: DataTypes.INTEGER },
    count: { type: DataTypes.INTEGER, defaultValue: 0 },
    price: { type: DataTypes.DECIMAL },
    discount: { type: DataTypes.INTEGER, allowNull: true },
    active_discount: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
}, {
    timestamps: false
})

// Associations
Product.hasMany(ProductDetail)
ProductDetail.belongsTo(Product)

Product.hasMany(ProductColor)
ProductColor.belongsTo(Product)

Product.hasMany(ProductSize)
ProductSize.belongsTo(Product)

Product.hasMany(OrderItem)
OrderItem.belongsTo(Product)

ProductColor.hasMany(OrderItem)
OrderItem.belongsTo(ProductColor)

ProductSize.hasMany(OrderItem)
OrderItem.belongsTo(ProductSize)

module.exports = {
    Product,
    ProductDetail,
    ProductColor,
    ProductSize,
}