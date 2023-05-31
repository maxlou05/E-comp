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
const event_data = require('../mock_data/events.json')
const set_data = require('../mock_data/activitySets.json')
const activity_data = require('../mock_data/activities.json')

describe('Exercising CRUD operations and authentication on activity sets', () => {
    let token
    let eventID
    let setID

    // Before doing the tests, must intialize/setup the database
    before('run setup', async () => {
        try {
            // Init database
            let message = await db.init()
            if(process.env.TEST_LOGS >= 1) console.log(message)
        } catch (err) {
            throw err
        }

        // Create host account
        let res = await agent.put('/account')
            .set('Content-type', 'application/json')
            .send(user_data.admin)
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)

        res = await agent.post('/account/login')
            .set('Content-type', 'application/json')
            .send(user_data.admin)
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
        token = res.body.access_token

        // Create an event
        res = await agent.put('/host')
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .send(event_data.complete_event)
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
        eventID = res.body.id
    })

    // Add activity sets
    it('should create activity set 1', (done) => {
        agent.put(`/host/${eventID}/edit/activitySets`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .send(set_data.set1)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should create activity set 2', (done) => {
        agent.put(`/host/${eventID}/edit/activitySets`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .send({})
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                setID = res.body.id
                done()
            })
    })

    it('should delete activity set', (done) => {
        agent.delete(`/host/${eventID}/edit/activitySets/${setID}`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should return activity sets', (done) => {
        agent.get(`/host/${eventID}/edit/activitySets/`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should create activity set 3', (done) => {
        agent.put(`/host/${eventID}/edit/activitySets`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .send({})
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                setID = res.body.id
                done()
            })
    })

    it('should edit activity set 3', (done) => {
        agent.post(`/host/${eventID}/edit/activitySets/${setID}`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .send(set_data.set2)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should return activity sets', (done) => {
        agent.get(`/host/${eventID}/edit/activitySets/`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })
})