const bcrypt = require('bcrypt');
const prisma = require('../models/prismaClient');

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Verifica se o e-mail já está em uso
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
      },
    });

    return res.status(201).json({ message: 'Usuário criado com sucesso!', user: newUser });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!existingUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    let hashedPassword = existingUser.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
    });

    return res.status(200).json({ message: 'Usuário atualizado com sucesso!', user: updatedUser });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!existingUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    await prisma.user.delete({ where: { id: Number(id) } });

    return res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser
};



