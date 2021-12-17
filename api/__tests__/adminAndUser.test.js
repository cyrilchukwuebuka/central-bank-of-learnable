const request = require('supertest')
const app = require('../app');
const mongoose = require('mongoose')
const dotenv = require('dotenv');

// configure dotenv and port
dotenv.config()
const port = 8800

describe('Testing Admin Route Endpoints 1', () => {
    let appServer;
    let token1;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URL_TEST,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => appServer = app.listen(port))
            .catch(async (err) => await console.log(err))
    }, 500000)

    afterAll(async () => {
        await appServer.close(async () => await mongoose.connection.close())
    })

    it('Should Register Admin', async () => {
        const res = await request(app).post('/api/admin/register')
            .send({
                username: "Cyril1",
                firstName: "Cyril1",
                lastName: "Chukwuebuka1",
                tel: "08138579992",
                email: "muofunanya31@gmail.com",
                password: "1234567"
            })
        expect(res.statusCode).toEqual(200)
    }, 30000)

    describe('Testing Admin Route Endpoints 2', () => {
        it('Should login Admin', async () => {
            const res = await request(app).post('/api/admin/login')
                .send({
                    email: "muofunanya31@gmail.com",
                    password: "1234567"
                })
            token1 = res.headers['authentication-token']
            console.log('token', token1)
            expect(res.statusCode).toEqual(200)
        }, 30000)
    })

    describe('Testing Auth Route Endpoints 1', () => {
        it('Should Register User', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .set("authentication-token", token1)
                .send({
                    username: "Cyril2",
                    firstName: "Cyril2",
                    lastName: "Chukwuebuka2",
                    tel: "08138579993",
                    email: "muofunanya32@gmail.com",
                    password: "12345678"
                })
            expect(res.statusCode).toEqual(200)

        }, 100000)
        
        describe('Testing Auth Route Endpoints 1', () => {
            it('Should login User', async () => {
                const res = await request(app).post('/api/auth/login')
                    .send({
                        email: "muofunanya32@gmail.com",
                        password: "12345678"
                    })
                expect(res.statusCode).toEqual(200)
            })
        }, 30000)
    })
})