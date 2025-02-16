const jwt = require("jsonwebtoken");

// Middleware para autenticação do usuário
const authMiddleware = (req, res, next) => {
  try {
    // Verifica se o token está no cabeçalho 'Authorization'
    const token = req.headers.authorization?.split(" ")[1];

    // Se não houver token, retorna erro 401 (Não autorizado)
    if (!token) {
      return res
        .status(401)
        .json({ error: "Acesso negado. Faça login primeiro." });
    }

    // Verifica e decodifica o token usando a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Anexa os dados do usuário decodificados à requisição
    req.user = decoded;
    next(); // Prossegue para a próxima função/controller
  } catch (error) {
    // Se houver erro na verificação do token, retorna erro 403 (Proibido)
    res.status(403).json({ error: "Token inválido ou expirado." });
  }
};

// Middleware para verificar se o usuário é admin
const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res
      .status(403)
      .json({ error: "Acesso negado! Apenas admins podem acessar esta rota." });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
