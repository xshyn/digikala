const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configs/seq.config");
const { OrderStatus } = require("../../common/constants");
const { Payment } = require("../payment/payment.model");

const Order = sequelize.define("order", {
  status: {
    type: DataTypes.ENUM(...Object.values(OrderStatus)),
    defaultValue: OrderStatus.PENDING,
  },
  address: { type: DataTypes.TEXT },
  total_amount: { type: DataTypes.DECIMAL },
  final_amount: { type: DataTypes.DECIMAL },
  discount_amount: { type: DataTypes.DECIMAL },
});
const OrderItem = sequelize.define("order_item", {
  count
});



Order.hasOne(Payment)
Payment.belongsTo(Order)

Order.hasMany(OrderItem)
OrderItem.belongsTo(Order)



module.exports = {
    Order,
    OrderItem
}
