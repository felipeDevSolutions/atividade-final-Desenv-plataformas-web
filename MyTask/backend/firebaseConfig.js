const admin = require('firebase-admin');

//Para funcionar em ambiente de testes, reativar a linha abaixo e inativar a linha seguinte:
// const serviceAccount = require('./firebase-service-account.json');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://app-fiz.firebaseio.com',
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
