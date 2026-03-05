const express = require('express');
const AuthController = require('../controllers/AuthController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login',    AuthController.login);
router.post('/logout',   AuthController.logout);
router.get('/me',        authenticate, AuthController.getMe);
router.put('/profile',   authenticate, AuthController.updateProfile);

module.exports = router;
