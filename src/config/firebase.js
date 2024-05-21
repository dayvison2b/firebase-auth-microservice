const admin = require('firebase-admin');
const serviceAccount = require('../../firebaseServiceAccountKey.json');

const initializeFirebaseApp = async (projectId) => {
    const projectServiceAccount = {
        ...serviceAccount,
        project_id: projectId
    };

    const firebaseApp = await admin.initializeApp({
        credential: admin.credential.cert(projectServiceAccount),
    }, projectId);
    console.log('Firebase APP initialized');
    return firebaseApp;
}; 

const closeFirebaseApp = async (firebaseApp) => {
    await firebaseApp.delete().then(() => {
        console.log(`Firebase app deleted successfully`);
    }).catch((err) => {
        console.error(`Error deleting Firebase app:`, err);
    });
};

module.exports = { initializeFirebaseApp, closeFirebaseApp };