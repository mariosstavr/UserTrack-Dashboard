const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json'); // Ensure the path is correct

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "URL FIREBASE REALTIME DATABASE.firebaseio.com"
});

const db = admin.database(); 

module.exports = { db };
