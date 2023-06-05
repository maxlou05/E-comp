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

describe('Exercising CRUD operations and authentication on activities', () => {
    let eventID
    let setID
    let activityID

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

        // Create an event
        res = await agent.put('/host')
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .send(event_data.complete_event)
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
        eventID = res.body.id

        // Create activity set
        res = await agent.put(`/host/${eventID}/edit/activitySets`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .send(set_data.set1)
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
        setID = res.body.id
    })

    // Add activities
    it('should create activity 1', (done) => {
        agent.put(`/host/${eventID}/edit/activitySets/${setID}/activities`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .send(activity_data.activity1)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should create activity 2', (done) => {
        agent.put(`/host/${eventID}/edit/activitySets/${setID}/activities`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .send({})
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                activityID = res.body.id
                done()
            })
    })

    it('should delete activity', function (done) {
        agent.delete(`/host/${eventID}/edit/activitySets/${setID}/activities/${activityID}`)
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

    it('should return activity sets', (done) => {
        agent.get(`/host/${eventID}/edit/activitySets/${setID}/activities`)
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

    it('should create activity 3', (done) => {
        agent.put(`/host/${eventID}/edit/activitySets/${setID}/activities`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .send({})
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                activityID = res.body.id
                done()
            })
    })

    it('should edit activity 3', (done) => {
        agent.post(`/host/${eventID}/edit/activitySets/${setID}/activities/${activityID}`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .send(activity_data.activity3)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should create activity 4', (done) => {
        agent.put(`/host/${eventID}/edit/activitySets/${setID}/activities`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .send(activity_data.activity2)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should return activities', (done) => {
        agent.get(`/host/${eventID}/edit/activitySets/${setID}/activities`)
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
})