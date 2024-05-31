const { db, auth } = require('../../firebaseConfig');
const bcrypt = require('bcryptjs');

class User {
  constructor(id, email, password) {
    this.id = id;
    this.email = email;
    this.password = password;
  }

  // Cria um novo usuário
  static async create(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Criar usuário no Authentication
      const createdUser = await auth.createUser({
        email: email,
        password: password
      });

      console.log(`Usuário criado no Firebase Auth: ${createdUser.uid}`);

      // Salvar no Firestore
      const userRef = db.collection('users').doc(createdUser.uid);
      await userRef.set({
        email,
        password: hashedPassword
      });

      return new User(userRef.id, email, hashedPassword);
    } catch (error) {
      console.error("Erro ao criar usuário no Firebase Authentication:", error);
      throw error;
    }
  }

  // Busca um usuário pelo email
  static async findByEmail(email) {
    const userRef = db.collection('users').where('email', '==', email);
    const snapshot = await userRef.get();

    if (snapshot.empty) {
      return null;
    }

    let user;
    snapshot.forEach(doc => {
      user = new User(doc.id, doc.data().email, doc.data().password);
    });

    return user;
  }

  // Busca todos os usuários
  static async findAll() {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      return [];
    }

    const users = [];
    snapshot.forEach(doc => {
      users.push(new User(doc.id, doc.data().email, doc.data().password));
    });

    return users;
  }

  // Atualiza um usuário
  static async update(id, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = db.collection('users').doc(id);

    try {
      // Atualizar no Firestore
      await userRef.update({
        email,
        password: hashedPassword
      });

      console.log(`Usuário atualizado no Firestore: ${id}`);

      // Atualizar na autenticação do Firebase
      await auth.updateUser(id, {
        email: email,
        password: password
      });

      console.log(`Usuário atualizado no Firebase Auth: ${id}`);

      const updatedDoc = await userRef.get();
      const updatedUser = updatedDoc.data();

      return new User(id, updatedUser.email, updatedUser.password);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  }

  // Deleta um usuário
  static async delete(id) {
    const userRef = db.collection('users').doc(id);

    try {
      await userRef.delete();
      console.log(`Usuário deletado do Firestore: ${id}`);

      try {
        // Tentar deletar da autenticação do Firebase
        await auth.deleteUser(id);
        console.log(`Usuário deletado do Firebase Auth: ${id}`);
      } catch (authError) {
        if (authError.code === 'auth/user-not-found') {
          console.warn(`Usuário não encontrado no Firebase Auth: ${id}`);
        } else {
          throw authError;
        }
      }
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw error;
    }
  }

  // Compara a senha fornecida com a senha armazenada
  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;