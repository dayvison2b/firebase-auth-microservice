// authRoute.js

/**
 * @swagger
 * tags:
 *   name: User Authentication
 *   description: Operations related to user management and authentication.
 */

const express = require('express');
const { check, validationResult } = require('express-validator');
const { register, login, socialLogin, deleteUser, updateUserEmail } = require('../controllers/authController');
const { initializeSessions, closeSessions } = require('../middlewares/session');
const firebaseAuth = require('../middlewares/firebaseAuth');

const router = express.Router();

// Apply initializeSessions middleware at the beginning
router.use(initializeSessions);

// Middleware to auth requests
router.use(["/login","/deleteUser","/updateUser"], firebaseAuth);

/**
 * @swagger
 * /v1/user/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with name, email, and password. Requires the Firebase project ID in the headers.
 *     tags:
 *       - User Authentication
 *     parameters:
 *       - $ref: '#/components/parameters/ProjectIdHeader'
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRegisteredResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * components:
 *   schemas:
 *     UserRegistration:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           example: password123
 *       required:
 *         - name
 *         - email
 *         - password
 *     UserRegisteredResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: User created
 *         user:
 *           $ref: '#/components/schemas/User'
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Validation error
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *                 example: 'invalid value'
 *               msg:
 *                 type: string
 *                 example: 'Error message'
 *               param:
 *                 type: string
 *                 example: 'name'
 *               location:
 *                 type: string
 *                 example: 'body'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Internal server error
 *     User:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *           description: The unique identifier of the user.
 *         email:
 *           type: string
 *           description: The email address of the user.
 *         displayName:
 *           type: string
 *           description: The display name of the user.
 *       example:
 *         uid: W7plqto9eXaLoKu19tumyqbDa33
 *         email: johndoe@example.com
 *         displayName: John Doe
 */

router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid e-mail').isEmail(),
        check('password', 'Password must be 6 or more characters').isLength({ min: 6 }), // TODO improve password requirements
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation error', errors: errors.array() });
        }
        await register(req, res);
        next();
    }
);

/**
 * @swagger
 * /v1/user/auth/login:
 *   post:
 *     summary: Log in user
 *     description: Authenticate user with email and password and return a Firebase authentication token.
 *     tags: [User Authentication]
 *     parameters:
 *       - $ref: '#/components/parameters/ProjectIdHeader'
 *     security:
 *       - FirebaseAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '400':
 *         description: Error logging in user
 *     examples:
 *       application/json:
 *         email: johndoe@example.com
 *         password: password123
 */

router.post(
    '/login',
    [
        check('email', 'Please include a valid e-mail').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await login(req, res);
        next(); // Call 'next' to pass control to the next middleware
    }
);

/**
 * @swagger
 * /v1/user/auth/updateUser:
 *   post:
 *     summary: Update user email
 *     description: Update a user's email address.
 *     tags: [User Authentication]
 *     parameters:
 *       - $ref: '#/components/parameters/ProjectIdHeader'
 *     security:
 *       - FirebaseAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User email updated successfully
 *       '400':
 *         description: Error updating user email
 *     examples:
 *       application/json:
 *         uid: 12345
 *         email: newemail@example.com
 */


router.post(
    '/updateUser',
    async (req, res, next) => {
        await updateUserEmail(req, res);
        next();
    }
);

/**
 * @swagger
 * /v1/user/auth/deleteUser:
 *   post:
 *     summary: Delete user account
 *     description: Delete a user account. Requires the Firebase project ID in the headers and the user's ID token in the Authorization header.
 *     tags: [User Authentication]
 *     parameters:
 *       - $ref: '#/components/parameters/ProjectIdHeader'
 *     security:
 *       - FirebaseAuth: []
 *     responses:
 *       '200':
 *         description: User account deleted successfully
 *       '400':
 *         description: Error deleting user account
 */


router.post(
    '/deleteUser',
    async (req, res, next) => {
        await deleteUser(req, res);
        next();
    }
);

router.post('/social-login', socialLogin);

// Apply closeSessions middleware at the end
router.use(closeSessions);

// Middleware for error handling
router.use((err, req, res, next) => {
    console.error(err);
    closeSessions(req, res, () => {
        next(err);
    });
});

module.exports = router;