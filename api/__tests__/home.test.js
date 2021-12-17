const request = require('supertest')
const app = require('../app');

describe('Testing auth route', () => {
    it('Should log in User', async () => {
        const res = await request(app).get('/api')
        expect(res.statusCode).toEqual(200)
    })
})