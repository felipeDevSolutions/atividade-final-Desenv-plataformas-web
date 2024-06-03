const express = require('express');
const router = express.Router();
const { db, auth } = require('../../firebaseConfig');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const authenticateToken = require('../middleware/authMiddleware'); 
const UserController = require('../controllers/UserController');

// Cadastro de usuário
router.post('/signup', UserController.signup);

// Login de usuário
router.post('/login', UserController.login);

// Recuperação de senha
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Envia um email de redefinição de senha
    await auth.sendPasswordResetEmail(email);
    res.status(200).json({ message: 'Email de redefinição de senha enviado com sucesso!' });

  } catch (error) {
    console.error('Erro ao enviar email de redefinição de senha:', error);
    res.status(500).json({ message: 'Erro ao enviar email de redefinição de senha' });
  }
});

// Validar token
router.get('/validate', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Token válido', user: req.user });
});

module.exports = router;