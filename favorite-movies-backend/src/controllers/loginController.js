const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../models/prismaClient');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se o e-mail existe no banco
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'E-mail ou senha inválidos.' });
    }

    // Compara a senha enviada com a senha criptografada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'E-mail ou senha inválidos.' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = { loginUser };
