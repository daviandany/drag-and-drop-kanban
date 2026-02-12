import jwt from 'jsonwebtoken'
import User from '../models'

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const isEmailExist = await User.findOne({ where: { email } });
        if (isEmailExist) {
            return res.status(409).json({ error: 'E-mail já cadastrado' })
        };


        const user = await User.create({ name, email, password });

        const token = generateToken(user.id);

        return res.status(201).json({
            message: 'Usuário criado com sucesso',
            token,
            user:  user.toSafeJSON(),
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
           const messages = error.errors.map((e) => e.message);
           return res.status(400).json({ errors: messages }); 
        }
        console.error(error);
        return res.status(500).json({ error: 'Erro interno no servidor' })
    }
};

    const login = async (req, res) => {
        try {
            const {email, password} = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
            }

            const user = User.findOne({ where: { email }});

            if (!user) {
                res.status(401).json({ error: 'E-mail ou senha incorretos' });
            }

            const isPasswordCorrect = await user.checkPassword(password);
            if (!isPasswordCorrect) {
                res.status(401).json({ error: 'E-mail ou senha incorretos' });
            }

            const token = generateToken(user.id);

            return res.status(200).json({ 
                message: 'Login realizado com sucesso',
                token,
                user: user.toSafeJSON(),
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro interno no servidor' })
        }
    };

    const me = async (req, res) => {
        res.status(200).json({ user: req.user.toSafeJSON() });
    };

    module.exports = { register, login, me }