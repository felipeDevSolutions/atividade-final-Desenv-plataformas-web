const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const admin = require('firebase-admin'); // Certifique-se de inicializar o admin corretamente

// Rotas de usuário
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
  ],
  userController.createUser
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
  ],
  userController.loginUser
);

// Aplique o authMiddleware apenas nas rotas que precisam de autenticação
router.get('/users', authMiddleware, userController.getAllUsers); 
router.get('/users/:id', authMiddleware, userController.getUserById);
router.put('/users/:id/password', authMiddleware, [
  body('oldPassword').isLength({ min: 6 }).withMessage('A senha antiga deve ter no mínimo 6 caracteres'),
  body('newPassword').isLength({ min: 6 }).withMessage('A nova senha deve ter no mínimo 6 caracteres'),
  body('confirmPassword').isLength({ min: 6 }).withMessage('A confirmação de senha deve ter no mínimo 6 caracteres')
], userController.updatePassword); 
router.delete('/users/:id', authMiddleware, userController.deleteUser); 

// Rota para validar o token (sem authMiddleware)
router.get('/auth/validate', async (req, res) => {
    console.log('Validando token...');
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        console.log('Token não encontrado');
        return res.status(401).json({ message: 'Token de autenticação não encontrado!' });
      }

      // Verifique se o token é válido
      const decodedToken = await admin.auth().verifyIdToken(token); 

      // Se o token for válido, obtenha o ID do usuário
      const userId = decodedToken.uid;

      // Obter informações do usuário do Firebase Auth
      const userRecord = await admin.auth().getUser(userId); 

      // Retorna informações do usuário se o token for válido
      res.status(200).json({ user: userRecord });
    } catch (error) {
      console.error('Erro ao validar token:', error);
      // Retorna erro se o token for inválido
      res.status(401).json({ message: 'Token inválido!' });
    }
});

// Rota para enviar email de redefinição de senha
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Email inválido')
  ],
  userController.sendPasswordResetEmail
);

module.exports = router;
