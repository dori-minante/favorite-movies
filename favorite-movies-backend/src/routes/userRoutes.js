const express = require('express');
const router = express.Router();

const { createUser, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');

router.post('/', createUser);
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser); 

module.exports = router;
