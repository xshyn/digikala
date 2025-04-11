const { sequelize } = require("../../configs/seq.config");
const { User } = require("../user/user.model");
const {
  Product,
  ProductColor,
  ProductSize,
} = require("../product/product.model");
const { DataTypes } = require("sequelize");

const Basket = sequelize.define(
  "basket",
  {
    userId: { type: DataTypes.INTEGER },
    productId: { type: DataTypes.INTEGER, allowNull: true },
    sizeId: { type: DataTypes.INTEGER, allowNull: true },
    colorId: { type: DataTypes.INTEGER, allowNull: true },
    discountId: { type: DataTypes.INTEGER, allowNull: true },
    count: { type: DataTypes.INTEGER },
  },
  { timestamps: false }
);

User.hasMany(Basket);
Basket.belongsTo(User);

Product.hasMany(Basket);
Basket.belongsTo(Product);

ProductColor.hasMany(Basket);
Basket.belongsTo(ProductColor);

ProductSize.hasMany(Basket);
Basket.belongsTo(ProductSize);

module.exports = {
  Basket,
};
