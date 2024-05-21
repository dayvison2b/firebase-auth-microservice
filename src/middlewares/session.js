// middlewares/session.js
const { initializeFirebaseApp, closeFirebaseApp } = require('../config/firebase');

let firebaseApp;

const initializeSessions = async (req, res, next) => {
    const projectID = req.headers['project-id'];

    if (!projectID) {
        return res.status(401).json({ error: 'Firebase project ID is required in headers.' });
    }
    try {
        firebaseApp = await initializeFirebaseApp(projectID);
    } catch (error) {
        console.error(`Could not open sessions: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
        process.exit(1);
    }

    req.headers.firebaseApp = firebaseApp; // Adding firebaseApp to the req for the controllers
    next(); // Continue...
};

const closeSessions = async (req, res, next) => {
    // Run both async functions concurrently
    try {
        await closeFirebaseApp(firebaseApp);
    } catch (error) {
        console.error(`Could not open sessions: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
        process.exit(1);
    }

    next();
};


module.exports = { initializeSessions, closeSessions };
