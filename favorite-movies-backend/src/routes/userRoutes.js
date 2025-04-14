const express = require('express');
const router = express.Router();

const { createUser, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');

const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/', createUser); //cadastro aberto

//protegidas com token + admin
router.get('/', authenticateToken, isAdmin, getAllUsers);
router.put('/:id', authenticateToken, isAdmin, updateUser);
router.delete('/:id', authenticateToken, isAdmin, deleteUser);

module.exports = router;
