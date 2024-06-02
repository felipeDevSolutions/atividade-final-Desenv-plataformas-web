const User = require('../models/user');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

const createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifique se o usuário já existe
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: 'O email informado já está cadastrado. Por favor, escolha outro.' });
    }

    // Crie o usuário
    const user = await User.create(email, password);

    // Retorne a resposta para o frontend
    res.status(201).json({ id: user.id, email: user.email });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
      const userRecord = await admin.auth().getUserByEmail(email);
      const user = await User.findByEmail(email);

      if (!user) {
          return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Use a senha correta
      const isMatch = await User.comparePassword(password, user.password); 
      if (!isMatch) {
          return res.status(400).json({ message: 'Senha incorreta' });
      }

      const token = await admin.auth().createCustomToken(userRecord.uid);
      res.json({ token, user: { id: userRecord.uid, email: email } });
  } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ message: 'Erro ao fazer login', error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários', error });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário', error });
  }
};

const updatePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    // Encontrar o usuário pelo email
    const user = await User.findByEmail(email);

    // Verificar se o usuário existe
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar a senha antiga
    const isMatch = await User.comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha antiga incorreta' });
    }

    // Atualizar a senha do usuário no Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(userRecord.uid, { password: newPassword });

    // Atualizar a senha do usuário no Firestore
    await db.collection('users').doc(user.id).update({ password: newPassword });

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar a senha do usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar a senha do usuário', error });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await User.delete(id);
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário', error });
  }
};

const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    await admin.auth().generatePasswordResetLink(email);
    res.json({ message: 'Email de redefinição de senha enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar email de redefinição de senha:', error);
    res.status(500).json({ message: 'Erro ao enviar email de redefinição de senha', error });
  }
};

module.exports = {
  createUser: [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),
    (req, res, next) => {
      handleValidationErrors(req, res);
      next();
    },
    createUser
  ],
  loginUser: [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),
    (req, res, next) => {
      handleValidationErrors(req, res);
      next();
    },
    loginUser
  ],
  getAllUsers,
  getUserById,
  
  updatePassword,
  
  deleteUser,
  sendPasswordResetEmail: [
    body('email').isEmail().withMessage('Email inválido'),
    (req, res, next) => {
      handleValidationErrors(req, res);
      next();
    },
    sendPasswordResetEmail
  ]
};
