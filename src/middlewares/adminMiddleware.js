const adminMiddleware = (req, res, next) => {
  // Verifica se o usuário tem a flag 'isAdmin' como true
  if (!req.user?.isAdmin) {
    return res
      .status(403)
      .json({ error: "Acesso restrito a administradores." });
  }
  next(); // Prossegue se o usuário for admin
};

module.exports = adminMiddleware;
