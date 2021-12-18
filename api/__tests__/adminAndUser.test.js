const request = require('supertest')
const app = require('../app');
const mongoose = require('mongoose')
const dotenv = require('dotenv');

// configure dotenv and port
dotenv.config()
const port = 8800
let appServer;
let token1;
let token2;
let User2Account;
let transactionId;

describe('Testing Admin Route Endpoints 1', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URL_TEST,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => appServer = app.listen(port))
            .catch(async (err) => await console.log(err))
    }, 100000)

    afterAll(async () => {
        await appServer.close(async () => await mongoose.connection.close())
    }, 10000)

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
    }, 10000)

    describe('Testing Admin Route Endpoints 2', () => {
        it('Should login Admin', async () => {
            const res = await request(app).post('/api/admin/login')
                .send({
                    email: "muofunanya31@gmail.com",
                    password: "1234567"
                })
            token1 = res.headers['authentication-token']
            expect(res.statusCode).toEqual(200)
        }, 10000)
    })

    describe('Testing Auth Route Endpoints 1', () => {
        it('Should Register User1', async () => {
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
        }, 10000)

        it('Should Register User2', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .set("authentication-token", token1)
                .send({
                    username: "Cyril3",
                    firstName: "Cyril3",
                    lastName: "Chukwuebuka3",
                    tel: "08138579994",
                    email: "muofunanya33@gmail.com",
                    password: "123456789"
                })
            User2Account = res.body.account
            expect(res.statusCode).toEqual(200)
        }, 10000)

        describe('Testing Auth Route Endpoints 1', () => {
            it('Should login User', async () => {
                const res = await request(app).post('/api/auth/login')
                    .send({
                        email: "muofunanya32@gmail.com",
                        password: "12345678"
                    })
                token2 = res.headers['authentication-token']
                expect(res.statusCode).toEqual(200)
            }, 10000)

            it('Should Deposit into User Account', async () => {
                const res = await request(app)
                    .post('/api/user/deposit')
                    .query({
                        amount: 4000,
                    })
                    .set("authentication-token", token2)
                expect(res.statusCode).toEqual(200)
            }, 10000)

            it('Should Withdraw from User Account', async () => {
                const res = await request(app)
                    .post('/api/user/withdraw')
                    .query({
                        amount: 2000,
                    })
                    .set("authentication-token", token2)
                expect(res.statusCode).toEqual(200)
            }, 10000)

            it('Should Transfer from User Account to a specified Account', async () => {
                const res = await request(app)
                    .post('/api/user/transfer')
                    .query({
                        amount: 2000,
                        receiver: User2Account
                    })
                    .set("authentication-token", token2)
                transactionId = res.body.transactionId
                expect(res.statusCode).toEqual(200)
            }, 10000)

            it('Should get User transactions', async () => {
                const res = await request(app)
                    .get('/api/user/transactions')
                    .set("authentication-token", token2)
                expect(res.statusCode).toEqual(200)
                expect(res.body).toHaveProperty('credits')
                expect(res.body).toHaveProperty('debits')
            }, 30000)
        }, 100000)

        it('Admin Reverse Transaction By TransactionId', async () => {
            const res = await request(app)
                .get(`/api/admin/reverse-transaction/${transactionId}`)
                .set("authentication-token", token1)
            expect(res.statusCode).toEqual(200)
        }, 30000)

        it('Admin Reverse Transaction By TransactionId', async () => {
            const res = await request(app)
                .get(`/api/admin/reactivate-account/${User2Account}`)
                .set("authentication-token", token1)
            expect(res.statusCode).toEqual(200)
        }, 30000)

        it('Admin Reverse Transaction By TransactionId', async () => {
            const res = await request(app)
                .get(`/api/admin/deactivate-account/${User2Account}`)
                .set("authentication-token", token1)
            expect(res.statusCode).toEqual(200)
        }, 30000)

        it('Should Get All Transactions', async () => {
            const res = await request(app)
                .get('/api/admin/transactions')
                .set("authentication-token", token1)
            expect(res.statusCode).toEqual(200)
            expect(res.body).toHaveProperty('credits')
            expect(res.body).toHaveProperty('debits')
        }, 30000)
        
        it('Gets all registered User on the Platform', async () => {
            const res = await request(app)
                .get('/api/admin/users')
                .set("authentication-token", token1)
            expect(res.statusCode).toEqual(200)
        }, 30000)

        it('Admin Deletes a User', async () => {
            const res = await request(app)
                .get(`/api/admin/delete/${User2Account}`)
                .set("authentication-token", token1)
            expect(res.statusCode).toEqual(200)
        }, 30000)
    }, 150000)
}, 200000)