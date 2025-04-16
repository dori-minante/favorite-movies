const express = require('express');
const router = express.Router();

const { createUser, getAllUsers, getMyProfile, updateUser, deleteUser } = require('../controllers/userController');

const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cadastrar um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Maria Silva
 *               email:
 *                 type: string
 *                 example: maria@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Email já cadastrado
 */

router.post('/', createUser); //cadastro aberto

//protegidas com token + admin
router.get('/', authenticateToken, isAdmin, getAllUsers);
router.get('/me', authenticateToken, getMyProfile);
router.put('/:id', authenticateToken, isAdmin, updateUser);
router.delete('/:id', authenticateToken, isAdmin, deleteUser);

module.exports = router;
