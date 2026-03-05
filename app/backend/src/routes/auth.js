const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

// Public routes
router.get('/config', AuthController.getKeycloakConfig);
router.get('/check', AuthController.checkAuth);

// Protected routes (require Keycloak middleware)
router.post('/callback', AuthController.handleKeycloakCallback);
router.get('/profile', AuthController.getProfile);
router.put('/profile', AuthController.updateProfile);
router.post('/complete-registration', AuthController.completeRegistration);
router.post('/logout', AuthController.logout);

module.exports = router;