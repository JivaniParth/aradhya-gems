const request = require('supertest');
const app = require('../main');
const mongoose = require('mongoose');

jest.setTimeout(30000); // Allow Mongoose to connect to Atlas

describe('Products API', () => {
    beforeAll(async () => {
        // Wait for mongoose to connect if it's currently connecting
        if (mongoose.connection.readyState !== 1) { // 1 = connected
            console.log('Waiting for Mongoose to connect...');
            await mongoose.connection.asPromise();
        }
    });

    afterAll(async () => {
        // Close the DB connection so Jest can exit cleanly
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    });

    describe('GET /api/products', () => {
        it('should return 200 and a list of products', async () => {
            const res = await request(app).get('/api/products');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body.data).toHaveProperty('products');
            expect(Array.isArray(res.body.data.products)).toBeTruthy();
            expect(res.body.data.pagination).toBeDefined();
        });
    });
});
