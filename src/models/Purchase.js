const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Purchase = sequelize.define(
  "Purchase",
  {
    quantity: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: true, // Garante que Sequelize adicione createdAt e updatedAt
  }
);

module.exports = Purchase;
