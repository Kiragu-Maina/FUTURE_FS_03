const admin = require('firebase-admin');
const firebaseConfig = require('../config/firebaseconfig.json');

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig)
 
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
