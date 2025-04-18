const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configs/seq.config");
const { Order } = require("../order/order.model");

const Payment = sequelize.define(
  "payment",
  {
    status: { type: DataTypes.BOOLEAN, defaultValue: false },
    amount: { type: DataTypes.DECIMAL },
    refId: { type: DataTypes.STRING, allowNull: true },
    authority: { type: DataTypes.STRING, allowNull: true },
  },
  { createdAt: "created_at", updatedAt: "updated_at" }
);

Payment.hasOne(Order)
Order.belongsTo(Payment)

module.exports = {
  Payment,
};
