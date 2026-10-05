import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-desenvolvimento-123';

export function middlewareAutenticacao(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload; // { id, perfil }
    next();
  } catch (erro) {
    return res.status(401).json({ mensagem: 'Token inválido' });
  }
}

export function middlewarePermissaoAdmin(req, res, next) {
  if (req.usuario.perfil !== 'ADMIN' && req.usuario.perfil !== 'SUPER_ADMIN') {
    return res.status(403).json({ mensagem: 'Acesso negado. Apenas administradores.' });
  }
  next();
}
