const { db, auth } = require('../../firebaseConfig');
const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');


class User {
  constructor(id, email, password) { 
    this.id = id;
    this.email = email;
    this.password = password; 
}

  static async create(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRecord = await auth.createUser({
      email,
      password,
    });
    await db.collection('users').doc(userRecord.uid).set({
      email,
      password: hashedPassword,
    });
    return new User(userRecord.uid, email);
  }

  static async findById(id) {
    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    const userData = userDoc.data();
    return new User(id, userData.email);
  }

  static async findByEmail(email) {
    const userDoc = await db.collection('users').where('email', '==', email).limit(1).get();
    if (userDoc.empty) {
        return null; 
    }
    const userData = userDoc.docs[0].data();
    return new User(userDoc.docs[0].id, userData.email, userData.password); 
}

  static async findAll() {
    const usersSnapshot = await db.collection('users').get();
    return usersSnapshot.docs.map(doc => new User(doc.id, doc.data().email));
  }

  static async updatePassword(email, oldPassword, newPassword) {
    try {
      // Verifique se o usuário existe
      const userRecord = await admin.auth().getUserByEmail(email);
  
      // Autentique o usuário com o email e a senha antiga
      await admin.auth().signInWithEmailAndPassword(email, oldPassword);
  
      // Atualize a senha do usuário
      await admin.auth().updateUser(userRecord.uid, { password: newPassword });
  
      return { message: 'Senha atualizada com sucesso' };
    } catch (error) {
      console.error('Erro ao atualizar a senha do usuário:', error);
      throw new Error('Falha ao autenticar o usuário ou atualizar a senha');
    }
  }
  
  
  

  static async delete(id) {
    try {
      // Exclui o usuário do Firebase Auth
      await auth.deleteUser(id);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // O usuário não existe no Firebase Auth, então pode ser que ele só exista no Firestore
        // Exclui o usuário do Firestore
        await db.collection('users').doc(id).delete();
      } else {
        throw error; // Lança a exceção caso não seja um erro de usuário não encontrado
      }
    }
    // Exclui o usuário do Firestore
    await db.collection('users').doc(id).delete();
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;
