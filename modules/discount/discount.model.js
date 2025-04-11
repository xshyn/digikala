const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configs/seq.config");
const { Product } = require("../product/product.model");

const Discount = sequelize.define(
  "dsiscount",
  {
    productId: { type: DataTypes.INTEGER, allowNull: true },
    code: { type: DataTypes.STRING },
    type: { type: DataTypes.ENUM("basket", "product") },
    amount: { type: DataTypes.INTEGER },
    percent: { type: DataTypes.INTEGER },
    limit: { type: DataTypes.INTEGER, allowNull: true },
    usage: { type: DataTypes.INTEGER, allowNull: true },
    expires_in: { type: DataTypes.DATE, allowNull: true },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    tableName: "discount",
  }
);

Product.hasMany(Discount);
Discount.belongsTo(Product);

module.exports = {
  Discount,
};
