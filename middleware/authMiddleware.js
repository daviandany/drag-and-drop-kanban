import jwt from 'jsonwebtoken';
import { User } from '../models/foreignKeyModels.js';

const auth = async (req, res, next) => { 
   try { 
    const authHeader = req.headers.authorization;

    if (!authHeader){
        return res.status(401).json({ error: 'Token não fornecido' })
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
        return res.status(401).json({ error: 'Usuário. não encontrado' })
    }

    req.user = user;

    next();
} catch (error) {
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado. Faça o login novamente' })
    }
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token inválido' })
    }
    return res.status(500).json({ error: 'Erro interno de autenticação' })
 }
};
   
export default auth;