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

describe('Exercising CRUD operations and authentication on events', () => {
    let eventID

    // Before doing the tests, must intialize/setup the database
    before('run setup', async () => {
        try {
            // Init database
            let message = await db.init()
            if(process.env.TEST_LOGS >= 1) console.log(message)
        } catch (err) {
            throw err
        }

        let res = await agent.put('/account')
            .set('Content-type', 'application/json')
            .send(user_data.admin)
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)

        res = await agent.post('/account/login')
            .set('Content-type', 'application/json')
            .send(user_data.admin)
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
    })

    // Creating event and stuff
    it('should create an event draft', (done) => {
        agent.put('/host')
            .set('Content-type', 'application/json')    
            .withCredentials(true)
            .send(event_data.empty_event)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                eventID = res.body.id
                done()
            })
    })

    it('should not publish (unfinished draft)', (done) => {
        agent.post(`/host/${eventID}/publish`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .expect('Content-type', /json/)
            .expect(406)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should return all created events', (done) => {
        agent.get('/host')
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should delete the event', (done) => {
        agent.delete(`/host/${eventID}`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should return all created events', (done) => {
        agent.get('/host')
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should create an event draft', (done) => {
        agent.put('/host')
            .set('Content-type', 'application/json')    
            .withCredentials(true)
            .send(event_data.empty_event)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                eventID = res.body.id
                done()
            })
    })

    it('should edit into a completed event (without any activity sets or activities)', (done) => {
        agent.post(`/host/${eventID}/edit`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .send(event_data.complete_event)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })
})