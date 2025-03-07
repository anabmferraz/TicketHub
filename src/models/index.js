const User = require("./User");
const Ticket = require("./Ticket");
const Purchase = require("./Purchase");
const sequelize = require("../config/db");

User.hasMany(Purchase);
Ticket.hasMany(Purchase);
Purchase.belongsTo(User);
Purchase.belongsTo(Ticket);

module.exports = {
  User,
  Ticket,
  Purchase,
  sequelize,
};
