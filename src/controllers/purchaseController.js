const { Purchase, Ticket, sequelize } = require("../models");

exports.createPurchase = async (req, res) => {
  const { tickets } = req.body;
  const transaction = await sequelize.transaction();

  try {
    for (const item of tickets) {
      const ticket = await Ticket.findByPk(item.ticketId, { transaction });
      if (!ticket) throw new Error(`Ingresso ${item.ticketId} não encontrado`);
      if (ticket.quantity < item.quantity)
        throw new Error("Estoque insuficiente");

      ticket.quantity -= item.quantity;
      await ticket.save({ transaction });

      await Purchase.create(
        {
          userId: req.user.id,
          ticketId: item.ticketId,
          quantity: item.quantity,
        },
        { transaction }
      );
    }

    await transaction.commit();
    res.status(201).json({ message: "Compra realizada" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.listPurchases = async (req, res) => {
  const purchases = await Purchase.findAll({
    where: { userId: req.user.id },
    include: [{ model: Ticket }],
  });
  res.json(purchases);
};
