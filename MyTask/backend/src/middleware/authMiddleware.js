const admin = require('firebase-admin');
const serviceAccount = require('../../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token de autenticação recebido:', token);

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não encontrado' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.userId = decodedToken.uid;
    next();
  } catch (error) {
    console.log('Erro ao verificar o token:', error.message);
    return res.status(401).json({ message: 'Token de autenticação inválido' });
  }
};

module.exports = authMiddleware;

