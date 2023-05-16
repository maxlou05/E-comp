// 1. Run server in development mode
// 2. Make requests to server with axios
// 3. Test!

const chai = require("chai");
const expect = chai.expect;

const supertest = require('supertest')
// Get the app
const app = require('../../app')
// Create a testing server (or mock server)
const agent = supertest.agent(app)

describe('Create accout with (PUT /account)', () => {
    it('should return 201 and create a new account', async () => {
        const payload = {"username":"admin", "password":"adminpw"}
        const res = await agent.put('/account')
            .set('Content-Type', 'application/json')
            .send(payload)
        expect(res).to.be.a('object')
        console.log('res', res.text)
    })
})