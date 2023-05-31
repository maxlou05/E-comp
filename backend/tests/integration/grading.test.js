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

describe('Test all the grading functions', () => {
    let token
    let eventID
    let setID
    let activityID
    let token1
    let token2
    let participantID
    let submissionID

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

        // Create activity set
        res = await agent.put(`/host/${eventID}/edit/activitySets`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .send(set_data.set1)
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
        setID = res.body.id

        // Create activity
        res = await agent.put(`/host/${eventID}/edit/activitySets/${setID}/activities`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .send(activity_data.activity3)
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
        activityID = res.body.id

        // Create teams
        res = await agent.put(`/host/${eventID}/team`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .send({team: "team1"})
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)

        res = await agent.put(`/host/${eventID}/team`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .send({team: "team2"})
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)

        // Publish
        res = await agent.post(`/host/${eventID}/publish`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)

        // Create participant 1
        res = await agent.put('/account')
            .set('Content-type', 'application/json')
            .send(user_data.user1)
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)

        res = await agent.post('/account/login')
            .set('Content-type', 'application/json')
            .send(user_data.user1)
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
        token1 = res.body.access_token

        res = await agent.put(`/participant/join/${eventID}`)
            .set('Content-type', 'application/json')
            .set('Authorization', token1)
            .send({team: "team1"})
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
        participantID = res.body.id

        res = await agent.put(`/participant/${participantID}/submit/${activityID}`)
            .set('Content-type', 'application/json')
            .set('Authorization', token1)
            .send({answer: "team 1 rocks"})
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)

        // Create participant 2
        res = await agent.put('/account')
            .set('Content-type', 'application/json')
            .send(user_data.user2)
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)

        res = await agent.post('/account/login')
            .set('Content-type', 'application/json')
            .send(user_data.user2)
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
        token2 = res.body.access_token

        res = await agent.put(`/participant/join/${eventID}`)
            .set('Content-type', 'application/json')
            .set('Authorization', token2)
            .send({team: "team2"})
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
        participantID = res.body.id

        res = await agent.put(`/participant/${participantID}/submit/${activityID}`)
            .set('Content-type', 'application/json')
            .set('Authorization', token2)
            .send({answer: "team 2 is lit"})
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
    })

    it('should get grading status', function (done) {
        agent.get(`/host/${eventID}/grading/status`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) done(err)
                done()
            })
    })

    it('should get grading activities', function (done) {
        agent.get(`/host/${eventID}/grading/activities`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) done(err)
                done()
            })
    })

    it('should get grading participants', function (done) {
        agent.get(`/host/${eventID}/grading/participants`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) done(err)
                done()
            })
    })

    it('should list all submissions by activity', (done) => {
        agent.get(`/host/${eventID}/grading/submissions/activity/${setID}/${activityID}`)
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

    it('should list all submissions by participant', (done) => {
        agent.get(`/host/${eventID}/grading/submissions/participant/${participantID}`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                submissionID = res.body[0].id
                done()
            })
    })

    it('should get leaderboards', (done) => {
        agent.get(`/events/${eventID}/leaderboards`)
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

    it('grade submission', (done) => {
        agent.post(`/host/${eventID}/grading/submissions/${submissionID}`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .send({mark: 6})
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should get leaderboards', (done) => {
        agent.get(`/events/${eventID}/leaderboards`)
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

    it('should get grading status', function (done) {
        agent.get(`/host/${eventID}/grading/status`)
            .set('Content-type', 'application/json')
            .set('Authorization', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) done(err)
                done()
            })
    })
})