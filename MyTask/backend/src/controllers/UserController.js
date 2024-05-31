const User = require('../models/user');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

// Criar usuário
const createUser = async (req, res) => {
  const { email, password, authorizationCode } = req.body;

  if (authorizationCode !== process.env.AUTHORIZATION_CODE) {
    return res.status(403).json({ message: 'Código de autorização inválido' });
  }

  try {
    const user = await User.create(email, password);
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
};

// Login de usuário
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Token recebido no backend:", token);

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
};

// Obter todos os usuários
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter usuários', error });
  }
};

// Atualizar usuário
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  try {
    // Atualizar no Firestore
    const user = await User.update(id, email, password);

    // Atualizar na autenticação do Firebase
    await admin.auth().updateUser(id, {
      email: email,
      password: password,
    });

    res.json({ message: 'Usuário atualizado com sucesso', user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário', error });
  }
};

// Deletar usuário
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Deletar do Firestore
    await User.delete(id);

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      res.status(404).json({ message: 'Usuário não encontrado no Firebase Auth', error });
    } else {
      res.status(500).json({ message: 'Erro ao deletar usuário', error });
    }
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
};