const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configs/seq.config");
const { Order } = require("../order/order.model");

const User = sequelize.define("user", {
    fullname: { type: DataTypes.STRING, allowNull: true },
    mobile: { type: DataTypes.STRING, allowNull: false },
}, {
    updatedAt: false,
    createdAt: "created_at"
})
const Otp = sequelize.define("otp", {
    code: { type: DataTypes.STRING, allowNull: false },
    expires: { type: DataTypes.DATE, defaultValue: new Date(Date.now() + (1000 * 60)) }
}, {
    timestamps: false
})

User.hasMany(Otp, {onDelete:'CASCADE'})
Otp.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

module.exports = {
    User,
    Otp
}