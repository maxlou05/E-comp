const request = require('supertest')
const db = require('../../database/utils')

// Get the app
const app = require('../../app')

// Create a testing server (or mock server)
const agent = request.agent(app)

// Import environment settings
require('dotenv').config({ path: './.env' })

// Import test data
const user_data = require('../mock_data/users.json')

describe('Exercising CRUD operations and authentication on users table', () => {
    // Before doing the tests, must intialize/setup the database
    before('init db', async () => {
        try {
            let message = await db.init()
            if(process.env.TEST_LOGS >= 1) console.log(message)
        } catch (err) {
            throw err
        }
    })

    // Create a new user
    it('should create a new account', (done) => {
        agent.put('/account')
            .set('Content-Type', 'application/json')
            .send(user_data.admin)
            .expect('Content-Type', /json/)  // /json/ is a regexp for anything with 'json' in it
            .expect(201)  // Expect the status code to be 201
            // At the end, must call done() to indicate to mocha that this test is completed
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if (err) return done(err)
                return done()
            })
    })

    // Login to the new account (should save token in cookie)
    it('should obtain a token', (done) => {
        agent.post('/account/login')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send(user_data.admin)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if (err) return done(err)
                return done()
            })
    })

    it('should get username', function (done) {
        agent.get('/account')
            .set('Content-Type', 'application/json')
            .withCredentials(true)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if (err) return done(err)
                return done()
            })
    })

    // Logout
    it('should log out', (done) => {
        agent.post('/account/logout')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if (err) return done(err)
                return done()
            })
    })

    // Token error
    it('should give token error', (done) => {
        agent.post('/account')
            .set('Content-Type', 'application/json')
            .withCredentials(true)
            .send({'password': user_data.admin.password, 'new_password': user_data.new_password})
            .expect('Content-Type', /json/)
            .expect(406)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if (err) return done(err)
                return done()
            })
    })

    // Login
    it('should obtain a token', (done) => {
        agent.post('/account/login')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send(user_data.admin)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if (err) return done(err)
                return done()
            })
    })

    // Change the password
    it('should change the password', (done) => {
        agent.post('/account')
            .set('Content-Type', 'application/json')
            .withCredentials(true)
            .send({'password': user_data.admin.password, 'new_password': user_data.new_password})
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if (err) return done(err)
                return done()
            })
    })

    // Login with old password (note that there is no logout so old token will still work, token discarding must be done on frontend/client side)
    it('should return password error', (done) => {
        agent.post('/account/login')
            .set('Content-Type', 'application/json')
            .send(user_data.admin)
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if (err) return done(err)
                return done()
            })
    })

    // Login with new password
    it('should obtain a new token', (done) => {
        agent.post('/account/login')
            .set('Content-Type', 'application/json')
            .send({'username': user_data.admin.username, 'password': user_data.new_password})
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if (err) return done(err)
                return done()
            })
    })

    // Attempt to create a user with same username
    it('should return duplicate user error', (done) => {
        agent.put('/account')
            .set('Content-Type', 'application/json')
            .send(user_data.admin)
            .expect('Content-Type', /json/)
            .expect(406)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if (err) return done(err)
                return done()
            })
    })

    // Delete user
    it('should delete the user', (done) => {
        agent.delete('/account')
            .set('Content-Type', 'application/json')
            .withCredentials(true)
            .send({'password': user_data.new_password})
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if (err) return done(err)
                return done()
            })
    })

    // Try to access deleted user
    it('should return user does not exist error', (done) => {
        agent.post('/account/login')
            .set('Content-Type', 'application/json')
            .send(user_data.admin)
            .expect('Content-Type', /json/)
            .expect(406)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if (err) return done(err)
                return done()
            })
    })
})