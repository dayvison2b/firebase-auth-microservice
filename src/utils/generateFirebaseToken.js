module.exports = async (firebaseApp, userUID) => {
    try {
        return await firebaseApp.auth().createCustomToken(userUID);
    } catch (error) {
        throw Error('Failed to generate Firebase Custom Token: ', error);
    }
};