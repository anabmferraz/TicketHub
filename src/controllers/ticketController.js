const Ticket = require("../models/Ticket");

exports.createTicket = async (req, res) => {
  const { name, price, quantity } = req.body;
  const ticket = await Ticket.create({ name, price, quantity });
  res.status(201).json(ticket);
};

exports.updateTicket = async (req, res) => {
  const ticket = await Ticket.findByPk(req.params.id);
  if (!ticket)
    return res.status(404).json({ error: "Ingresso não encontrado" });
  await ticket.update(req.body);
  res.json(ticket);
};
const listTickets = (req, res) => {
  res.json({ message: "Listar todos os tickets" });
};

const createTicket = (req, res) => {
  res.json({ message: "Criar um novo ticket" });
};

const updateTicket = (req, res) => {
  res.json({ message: `Atualizar o ticket com ID ${req.params.id}` });
};

const deleteTicket = (req, res) => {
  res.json({ message: `Deletar o ticket com ID ${req.params.id}` });
};

module.exports = {
  listTickets,
  createTicket,
  updateTicket,
  deleteTicket,
};
