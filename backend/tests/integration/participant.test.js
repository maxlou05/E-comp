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

describe('Exercising CRUD operations and authentication on participants', () => {
    let eventID
    let setID
    let activityID
    let participantID

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

        // Create activity
        res = await agent.put(`/host/${eventID}/edit/activitySets/${setID}/activities`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .send(activity_data.activity1)
        if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
        activityID = res.body.id
    })

    it('should create a team', (done) => {
        agent.put(`/host/${eventID}/team`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .send({team: 'team1'})
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should delete a team', (done) => {
        agent.delete(`/host/${eventID}/team/team1`)
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

    it('should create a team', (done) => {
        agent.put(`/host/${eventID}/team`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .send({team: 'team1'})
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should publish event', (done) => {
        agent.post(`/host/${eventID}/publish`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should find event', (done) => {
        agent.get(`/events/find`)
            .set('Content-type', 'application/json')
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should get teams', (done) => {
        agent.get(`/events/${eventID}/teams`)
            .set('Content-type', 'application/json')
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should get number of participants', (done) => {
        agent.get(`/events/${eventID}/participants`)
            .set('Content-type', 'application/json')
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should get current activities', (done) => {
        agent.get(`/events/${eventID}/activities`)
            .set('Content-type', 'application/json')
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should already be published', (done) => {
        agent.post(`/host/${eventID}/publish`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should create participant account', (done) => {
        agent.put(`/account`)
            .set('Content-type', 'application/json')
            .send(user_data.user1)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should login to participant account', (done) => {
        agent.post(`/account/login`)
            .set('Content-type', 'application/json')
            .send(user_data.user1)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                participant_token = res.body.access_token
                done()
            })
    })

    it('should join event', (done) => {
        agent.put(`/participant/join/${eventID}`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .send({team: 'team1'})
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                participantID = res.body.id
                done()
            })
    })

    it('should list joined events', (done) => {
        agent.get(`/participant/events`)
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

    it('should create a submission', (done) => {
        agent.put(`/participant/${participantID}/submit/${activityID}`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .send({"answer": "hamburger"})
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    it('should get my stats', (done) => {
        agent.get(`/participant/${participantID}/my_stats`)
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

    it('should get team stats', (done) => {
        agent.get(`/participant/${participantID}/team/stats`)
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

    it('should get leaderboards', (done) => {
        agent.get(`/events/${eventID}/leaderboards`)
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

    it('should get team stats for activity', (done) => {
        agent.get(`/participant/${participantID}/team/stats/activity/${activityID}`)
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

    it('should leave event', (done) => {
        agent.delete(`/participant/${participantID}/leave`)
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

    it('should list joined events', (done) => {
        agent.get(`/participant/events`)
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

    it('should fail because using user token and not host token', (done) => {
        agent.get(`/host/${eventID}/grading/submissions/activity/${setID}/${activityID}`)
            .set('Content-type', 'application/json')
            .withCredentials(true)
            .expect('Content-type', /json/)
            .expect(403)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if(err) return done(err)
                done()
            })
    })

    // Re-obtain the host token
    it('should obtain a token', (done) => {
        agent.post('/account/login')
            .set('Content-Type', 'application/json')
            .send(user_data.admin)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if(process.env.TEST_LOGS >= 1) console.log('response: ', res.body)
                if (err) return done(err)
                return done()
            })
    })

    it('should list all submissions by activity (empty to prove cascades delete)', (done) => {
        agent.get(`/host/${eventID}/grading/submissions/activity/${setID}/${activityID}`)
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