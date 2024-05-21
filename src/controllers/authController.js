// authController.js

const generateFirebaseToken = require('../utils/generateFirebaseToken')

const register = async (req, res) => {
    const { firebaseApp } = req.headers;
    const { name, email, password } = req.body;

    try {
        const userRecord = await firebaseApp.auth().createUser({
            email,
            password,
            displayName: name,
        });
        
        // Generate JWT token if needed
        // const jwToken = await generateJWT(userRecord.uid);

        // Send back the created user record
        res.status(201).json({ message: 'User created', user: userRecord });
    } catch (error) {
        console.error(`Error on register function: ${error.message}`);
        res.status(500).send('Server error');
    }
};

const login = async (req, res) => {
    const { firebaseApp } = req.headers;
    const authHeader = req.headers.authorization;
    const firebaseIDToken = authHeader.split('Bearer ')[1];

    try {
        const userData = await firebaseApp.auth().verifyIdToken(firebaseIDToken);
        if (!userData || !userData.uid){
            return res.status(401).send('Unauthorized');
        }
        const [jwToken, firebaseAuthToken] = await Promise.all([
            generateJWT(userData.uid),
            generateFirebaseToken(firebaseApp, userData.uid)
        ]);

        res.json({ jwToken, firebaseAuthToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

const deleteUser = async (req, res) => {
    const { firebaseApp } = req.headers;
    const authHeader = req.headers.authorization;
    const firebaseIDToken = authHeader.split('Bearer ')[1];

    try {
        const userData = await firebaseApp.auth().verifyIdToken(firebaseIDToken);
        if (!userData || !userData.uid){
            return res.status(401).send('Unauthorized');
        }
        
        await firebaseApp.auth().deleteUser(userData.uid);
        res.status(200).send('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
};

const updateUserEmail = async (req, res) => {
    const { firebaseApp } = req.headers;
    const authHeader = req.headers.authorization;
    const firebaseIDToken = authHeader.split('Bearer ')[1];

    try {
        const userData = await firebaseApp.auth().verifyIdToken(firebaseIDToken);
        if (!userData || !userData.uid){
            return res.status(401).send('Unauthorized');
        }

        await firebaseApp.auth().updateUser(userData.uid, {email: userData.email } );
        res.status(200).send('User updated successfully');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
};

const socialLogin = async (req, res) => {
    const { idToken } = req.body

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        let user = await User.findOne({ firebaseId: decodedToken.uid });

        if (!user) {
            user = new User({
                firebaseId: decodedToken.uid,
                name: decodedToken.name,
                email: decodedToken.email,
                userType: 'candidate', // TODO Default userType, could be set dynamically
                socialLogin: true,
            });

            await user.save();
        }

        const jwToken = generateJWT(user._id);
        
        res.json({ jwToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

module.exports = { register, login, deleteUser, updateUserEmail, socialLogin };