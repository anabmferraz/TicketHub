const Ticket = require("../models/Ticket");

// Listar todos os tickets (GET /api/tickets)
exports.listTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar ingressos" });
  }
};

// Criar novo ticket (POST /api/tickets)
exports.createTicket = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    // Validação básica
    if (!name || !price || !quantity) {
      return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const ticket = await Ticket.create({ name, price, quantity });
    res.status(201).json(ticket);
  } catch (error) {
    console.error("Erro ao criar ticket:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// Atualizar ticket (PUT /api/tickets/:id)
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ingresso não encontrado" });
    }

    await ticket.update(req.body);
    res.json(ticket);
  } catch (error) {
    console.error("Erro ao atualizar ticket:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

// Deletar ticket (DELETE /api/tickets/:id)
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ingresso não encontrado" });
    }

    await ticket.destroy();
    res.json({ message: "Ingresso excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir ticket:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
