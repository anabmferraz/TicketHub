const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Purchase = sequelize.define(
  "Purchase",
  {
    quantity: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: true,
  }
);

module.exports = Purchase;
