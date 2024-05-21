const request = require('supertest');
const { app } = require('../../src/server');
const User = require('../../src/models/user');

// register test
describe('POST /api/auth/register', () => {
    beforeEach(async () => {
        // Clear users collection before each test
        await User.deleteMany({});
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                userType: 'candidate',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        
        // await request(app)
        //     .post('/api/auth/deleteAccount')
        //     .send({
        //         email: 'test@example.com',
        //     });
    });
});

// login test
describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        // Clear users collection before each test
        await User.deleteMany({});
    });
    it('should login an existing user', async () => {
        const registerResponse = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                userType: 'candidate',
            });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
        });
        
        expect(loginResponse.statusCode).toEqual(200);
        expect(loginResponse.body).toHaveProperty('token');
        
        // await request(app)
        //     .post('/api/auth/deleteAccount')
        //     .send({
        //         email: 'test@example.com',
        //     });
    });
});

// updateUserEmail test
describe('POST /api/auth/updateEmail', () => { // TODO improve routers names
    beforeEach(async () => {
        // Clear users collection before each test
        await User.deleteMany({});
    });
    it('should update existing user e-mail', async () => {
        const registerResponse = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                userType: 'candidate',
            });

        const loginResponse = await request(app)
            .post('/api/auth/updateEmail')
            .send({
                email: 'test@example.com',
                password: 'password123',
        });
        
        expect(loginResponse.statusCode).toEqual(200);
        expect(loginResponse.body).toHaveProperty('token');
        
        // await request(app)
        //     .post('/api/auth/deleteAccount')
        //     .send({
        //         email: 'test@example.com',
        //     });
    });
});

// TODO implement social login test