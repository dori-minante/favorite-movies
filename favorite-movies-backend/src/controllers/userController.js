const bcrypt = require('bcrypt');
const prisma = require('../models/prismaClient');

// Usamos req.user que vem do middleware authenticateToken (decodificado do token)

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

  const userId = Number(id);
  const loggedUser = req.user;

  // Permitir que apenas admins ou o próprio usuário atualizem os dados
  if (loggedUser.role !== 'admin' && loggedUser.id !== userId) {
    return res.status(403).json({ message: 'Você não tem permissão para atualizar este usuário.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    let hashedPassword = existingUser.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        password: hashedPassword,
        role: loggedUser.role === 'admin' ? role : existingUser.role // só admin pode alterar role
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
  const userId = Number(id);
  const loggedUser = req.user;

  // Permitir que apenas admins ou o próprio usuário deletem
  if (loggedUser.role !== 'admin' && loggedUser.id !== userId) {
    return res.status(403).json({ message: 'Você não tem permissão para deletar este usuário.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    await prisma.user.delete({ where: { id: userId } });

    return res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getMyProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getMyProfile
};




