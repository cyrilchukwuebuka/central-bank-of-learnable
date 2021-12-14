const request = require('supertest')
const app = require('../app');

// describe('Testing auth route', () => {
//     it('Should log in User', async () => {
//         await request(app).post('/login')
//             .send({
//                 "email": "muofunanya3@gmail.com",
//                 "password": "123456"
//             })
//             .expect(200)
//     })
// })

test('Should log in User', async () => {
    await request(app).post('/api/auth/login')
        .send({
            email: "muofunanya3@gmail.com",
            password: "123456"
        })
        .expect(200)
 }, 30000)