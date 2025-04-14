const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/loginController');

router.post('/', loginUser); // POST /api/login

module.exports = router;
