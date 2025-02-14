const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Extrai o token do cookie ou do header 'Authorization'
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  // Se não houver token, retorna erro 401
  if (!token) {
    return res
      .status(401)
      .json({ error: "Acesso negado. Faça login primeiro." });
  }

  try {
    // Verifica e decodifica o token usando a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Anexa os dados do usuário decodificados à requisição
    req.user = decoded;
    next(); // Prossegue para a próxima função/controller
  } catch (error) {
    // Trata erros de token inválido ou expirado
    res.status(403).json({ error: "Token inválido ou expirado." });
  }
};

module.exports = authMiddleware;
