const { DataTypes } = require("sequelize");
const { sequelize } = require("../../configs/seq.config");
const { User } = require("../user/user.model");

const RefreshToken = sequelize.define("refreshToken", {
    token: { type: DataTypes.TEXT, allowNull: false },
})

User.hasOne(RefreshToken)
RefreshToken.belongsTo(User)

module.exports = {
    RefreshToken
}