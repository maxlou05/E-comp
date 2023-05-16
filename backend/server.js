// This one uses the 'express' framework to help make creating servers quicker and easier
// Just like FastAPI in python, it is a framework

const express = require('express');
var app = express();
const http =  require('http');
const mysql = require('mysql2');
const jose = require('jose');
const fs = require('fs');
const hash = require('object-hash');
// const crypto = require('crypto');  used to generate list of available crypto algorithms



// load environment variables with database information
require('dotenv').config();

// Server settings
const hostname = '0.0.0.0';
const port = 6969;
const db_name = process.env.DB_NAME;

// JWT token settings
const secret = new TextEncoder().encode(process.env.JWK);
const algorithm = 'HS256';

// Creating post body parsers (to read POST data)
// Create application/x-www-form-urlencoded body parser
const urlencodedParser = express.urlencoded({ extended: false })
// Create a application/json body parser
const jsonParser = express.json()



// Function to setup the database if not already
function DBsetup(con) {
    // Create database
    con.query(`DROP DATABASE IF EXISTS ${db_name}`, (err, result) => {
        if (err) throw err;
        else console.log(result);
    });
    con.query(`CREATE DATABASE IF NOT EXISTS ${db_name}`, (err, result) => {
        if (err) throw err;
        else {
            console.log(result);
        }
    });
    con.query(`USE ${db_name}`, (err, result) => {
        if (err) throw err;
        else console.log(result);
    });
    
    // Create tables
    fs.readFile('create_tables.sql', (err, data) => {
        if (err) throw err;
        con.query(data.toString(), (err, result) => {
            if (err) throw err;
            else {
                console.log(result);
                console.log('successfully created all tables');
            }
        });
    });
}

// Create a token, default expiration is in 30 minutes
async function create_token(body, time="30min") {
    return await new jose.SignJWT(body)
                .setProtectedHeader({alg: algorithm})
                .setIssuedAt()
                .setIssuer('e-comp:API')
                .setExpirationTime(time)
                .sign(secret);
}

// Verify a token
async function verify_token(jwt) {
    try {
        // Verify the token is valid
        const {payload, protectedHeader} = await jose.jwtVerify(jwt, secret, {
            issuer: 'e-comp:API'});
        return {"err":null, "data":payload};
    }
    catch (err) {
        // catch any errors if there are 
        if(err.claim == 'iss') return {"err": "Wrong issuer", "data":null};
        if(err.claim == 'exp') return {"err":"Token is expired", "data":null};
        else return {"err":"Other unexpected error with token", "data":null};
    }
}



// Setup the database connection
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
});

// Connect to the database server
con.connect((err) => {
    if (err) throw err;
    else console.log('connected to database server');
});

// Select the correct database
con.query(`USE ${db_name}`, (err, result) => {
    // If there's an error finding the database, then create a new database and set it up 
    if (err) DBsetup(con);
    else console.log("database is ready")
});
// DBsetup(con);

// con.query(`SHOW DATABASES`, (err, result) => {
//     if (err) throw err;
//     console.log(result);
// });

// console.log(crypto.getHashes());  // used to generate list of available crypto algorithms



// Test function for authentiaction only
app.get('/protected', async (req, res) => {
    var payload = await verify_token(req.headers.authorization.slice(7)); // get rid of Bearer at beginning of the string
    if (payload.err) res.status(401).setHeader('Content-type', 'application/json').end(JSON.stringify({"error":payload.err}));
    else res.status(200).setHeader('Content-type', 'application/json').end(JSON.stringify({"message":`authorized! Welcome back, ${payload.data.sub}`}));
});

app.get('/db', (req, res) => {
    dbQuery("SELECT * FROM users", (err, result, fields) => {
        if (err) throw err
        console.log(result)
    })
})

app.put('/test', jsonParser, async (req, res) => {
    console.log(req.body.EventDescription);
    con.query(`INSERT INTO users (HashedPassword, Username) VALUES ("asdf", "jkl;")`);
    con.query(`SELECT * FROM users`, (err, result) => {
        console.log(result);
    });
    con.query(`INSERT INTO events VALUES (1, 'admin', 'event name', NULL, NULL,'${new Date().toISOString().slice(0,19)}', '2022-04-13 17:20:36', NULL, NULL, true, '[]', 4)`, (err, result) => {
        if (err) throw err;
    });
    res.status(201).type('application/json').end(JSON.stringify({"message":"successfully inserted!"}));
});

// Landing/home page
app.get('/', (req, res) => {
    if(req.params.skip) {
        res.type('application/json').status(200).json({'message': 'Welcome to EventHost backend API!'}, null, 2);
        return;
    }
    con.query(`SELECT * FROM users`, (err, result) => {
        console.log(result);
    });
    console.log("bruh");
    res.json({"message":"another one?"});
});

// ***TODO*** return documentation when complete, or at least give the link to the docs
app.get('/docs', (req, res) => {
    res.end("TODO: documentation");
});

// *NOTE req.query is in query string of URL, req.body is form data
app.put('/account', jsonParser, (req, res) => {
    // Hash the password 
    const hashed_password = hash(req.body.password, {algorithm:'RSA-SHA256'});
    
    con.query(`INSERT INTO users VALUES ('${req.body.username}', '${hashed_password}')`, (err, result) => {
        if (err) {
            if (err.code = 'ER_DUP_ENTRY') res.status(406).setHeader('Content-type', 'application/json').end(JSON.stringify({"error": "username already exists"}, null, 2));
            console.log(err);
        }
        else {
            res.status(201).setHeader('Content-type', 'application/json').end(JSON.stringify({"message": "successfully added user"}, null, 2));
        }
    });
});

app.post('/account/login', urlencodedParser, async (req, res) => {
    const hashed_password = hash(req.body.password, {algorithm:'RSA-SHA256'});
    con.query(`SELECT * FROM users WHERE Username='${req.body.username}'`, async (err, result) => {
        if (err) throw err;
        // Check if the requested user exists
        if (result.length == 0) res.status(401).setHeader('Content-type', 'application/json').end(JSON.stringify({"message": "this username doesn't exist"}, null, 2));
        // Check if the password was correct
        else if (result[0].HashedPassword != hashed_password) res.status(401).setHeader('Content-type', 'application/json').end(JSON.stringify({"message": "incorrect password"}, null, 2));
        // If pass, then return the session token
        else  {
            // Generate and sign a token (needs to have 'sub' property for subject)
            const jwt = await create_token({"sub":result[0].Username});
            res
                .status(200)
                .setHeader('Content-type', 'application/json')
                .end(JSON.stringify({"message": "Login success!","access_token": `Bearer ${jwt}`}));
        }
    });
});

function delete_event(event_id) {
    // Get all activitysetIDs
    con.query(`SELECT ActivitysetID FROM activitysets WHERE EventID=${event_id}`, (err, result) => {
        if (err) throw err;
        // Delete all activities under each activity set
        result.forEach((value, index, array) => {
            con.query(`DELETE FROM activities WHERE activitysetID=${value}`, (err, result) => {
                if (err) throw err;
            });
        });
    });
    // Delete all the activity sets under the event
    con.query(`DELETE FROM activitysets WHERE EventID=${event_id}`, (err, result) => {
        if (err) throw err;
    });
    // Delete the event
    con.query(`DELETE FROM events WHERE EventID=${event_id}`, (err, result) => {
        if (err) throw err;
    });
}

app.delete('/account', async (req, res) => {
    // Verfiy the token to find identity of user
    var payload = await verify_token(req.headers.authorization.slice(7));
    if (payload.err) res.status(401).type('application/json').json({"error":payload.err});
    var username = payload.data.sub;
    
    // Delete from 'participants' table
    con.query(`DELETE FROM participants WHERE Username="${username}"`, (err, result) => {
        if (err) throw err;
    });
    // Delete from 'submissions' table
    con.query(`DELETE FROM submissions WHERE Username="${username}"`, (err, result) => {
        if (err) throw err;
    });
    // Delete owned events ('activities', 'activitysets', and 'events' tables)
    con.query(`SELECT EventID FROM events WHERE Host="${username}"`, (err, result) => {
        if (err) throw err;
        result.forEach((value, index, array) => {
            delete_event(value);
        });
    });
    // Delete from 'users' table
    con.query(`DELETE FROM users WHERE Username="${username}"`, (err, result) => {
        if (err) throw err;
    });

    res.status(200).setHeader('Content-type', 'application/json').end(JSON.stringify({"message":"succesfully deleted your account"}));
});

app.get('/events/hosting', async (req, res) => {
    // Verfiy the token to find identity of user
    var payload = await verify_token(req.headers.authorization.slice(7));
    if (payload.err) res.status(401).setHeader('Content-type', 'application/json').end(JSON.stringify({"error":payload.err}));
    var username = payload.data.sub;

    // Return EventID for all the events hosted by this user
    con.query(`SELECT EventID FROM events WHERE Host=${username}`, (err, result) => {
        if (err) throw err;
        res.status(200).setHeader('Content-type', 'application/json').end(JSON.stringify(result));
    });
});

app.put('events/hosting', jsonParser, async (req, res) => {
    // Verfiy the token to find identity of user
    var payload = await verify_token(req.headers.authorization.slice(7));
    if (payload.err) res.status(401).setHeader('Content-type', 'application/json').end(JSON.stringify({"error":payload.err}));
    var username = payload.data.sub;

    /*
    The object to send to this API function
    {
        EventName : str(128)
        EventDescription : str(512) | null
        EventIcon : binary (16MB)
        EventStart : timestamp ('YYYY-MM-DD HH:MM:SS')
        EventEnd : timestamp
        ResultsDate : timestamp | null
        Announcement : str(256)
        Team : bool
        Teams : [str]
        ActivitySets : [{
            SetName : str(128)
            SetStart : timestamp
            SetEnd : timestamp
            MaxSubmissions : int
            Activities : [{
                ActivityName : str(128)
                ActivityDescription : str(512) | null
                InputType : ENUM("num", "str", "pdf", "jpg", "png")
                GradingType : ENUM("points", "answer", "judge")
                PointValue : int | null
                Answer : str(512) | null
                MaxMark : int | null
            }]
        }]
    }
    */
    
    // Add associated activity sets to 'activitysets' table
    if (req.body.ActivitySets) {
        req.body.ActivitySets.forEach((value, index, array) => {
            con.query(`INSERT INTO activitysets (SetName) VALUES ()`, (err, result) => {
                if (err) throw err;
            });
        });
    }
    
    // Add associated activities to 'activities' table
    con.query(`INSERT INTO activities VALUES ()`, (err, result) => {
        if (err) throw err;
    });

    // Adding to 'events' table
    // Required fields
    var fields = "Username, EventName, EventStart, EventEnd, Team";
    // Check the required fields
    if (!req.body.EventName) res.status(403).type('application/json').end(JSON.stringify({"error":"EventName field is missing"}));
    if (!req.body.EventStart) res.status(403).type('application/json').end(JSON.stringify({"error":"EventStart field is missing"}));
    if (!req.body.EventEnd) res.status(403).type('application/json').end(JSON.stringify({"error":"EventEnd field is missing"}));
    if (!req.body.Team) res.status(403).type('application/json').end(JSON.stringify({"error":"Team field is missing"}));
    var values =  `"${username}", "${req.body.EventName}", "${req.body.EventStart}", "${req.body.EventEnd}", ${req.body.Team}`;
    // Add in optional fields
    if (req.body.EventDescription) {
        fields = fields.concat(", EventDescription");
        values = values.concat(`, ${req.body.EventDescription}`);
    }
    if (req.body.EventIcon) {
        fields = fields.concat(", EventIcon");
        values = values.concat(`, ${req.body.EventIcon}`);
    }
    if (req.body.ResultsDate) {
        fields = fields.concat(", ResultsDate");
        values = values.concat(`, ${req.body.ResultsDate}`);
    }
    if (req.body.Announcement) {
        fields = fields.concat(", Announcement");
        values = values.concat(`, ${req.body.Announcement}`);
    }
    if (req.body.Teams) {
        fields = fields.concat(", Teams");
        values = values.concat(`, ${req.body.Teams}`);
    }
    // ***LATER***
    if (req.body.ActivitySets) {
        fields = fields.concat(", CurrentActivitySet");
        values = values.concat(`, ${req.body.ActivitySets}`);
    }
    // Add event to 'events' table
    con.query(`INSERT INTO events (${fields}) VALUES (${values})`, (err, result) => {
            if (err) throw err;
        });
    
    res.status(201).setHeader('Content-type', 'application/json').end(JSON.stringify({"message":"successfully added event"}));
});

app.get('/events/hosting/:eventID', async (req, res) => {
    // Verfiy the token to find identity of user
    var payload = await verify_token(req.headers.authorization.slice(7));
    if (payload.err) res.status(401).setHeader('Content-type', 'application/json').end(JSON.stringify({"error":payload.err}));
    var username = payload.data.sub;

    // Return all event metadata for the host
    con.query(`SELECT * FROM events WHERE EventID=${req.params.eventID}`, (err, result) => {
        if (err) throw err;
        // Check if this user is the host
        if (result[0].Host != username) {
            res.status(401).setHeader('Content-type', 'application/json').end(JSON.stringify({"error":"you are not the owner of this event"}));
        }
        // Return all metadata
        else {
            res.status(200).setHeader('Content-type', 'application/json').end(JSON.stringify(result[0]));
        }
    });
});

app.delete('/events/hosting/:eventID', async (req, res) => {
    // Verfiy the token to find identity of user
    var payload = await verify_token(req.headers.authorization.slice(7));
    if (payload.err) res.status(401).setHeader('Content-type', 'application/json').end(JSON.stringify({"error":payload.err}));
    var username = payload.data.sub;

    // Check if this user is the host
    con.query(`SELECT Host FROM events WHERE EventID=${req.params.eventID}`, (err, result) => {
        if (err) throw err;
        if (result[0] != username) {
            res.status(401).setHeader('Content-type', 'application/json').end(JSON.stringify({"error":"you are not the owner of this event"}));
        }
    });

    // Delete the event
    delete_event(req.params.eventID);
    res.status(200).setHeader('Content-type', 'application/json').end(JSON.stringify({"message":"succesfully deleted your account"}));
});

app.get('/events/hosting/:eventID/grading/status', async (req, res) => {
    // Verfiy the token to find identity of user
    var payload = await verify_token(req.headers.authorization.slice(7));
    if (payload.err) res.status(401).setHeader('Content-type', 'application/json').end(JSON.stringify({"error":payload.err}));
    var username = payload.data.sub;

    // Check if this user is the host
    con.query(`SELECT Host FROM events WHERE EventID=${req.params.eventID}`, (err, result) => {
        if (err) throw err;
        if (result[0] != username) {
            res.status(401).setHeader('Content-type', 'application/json').end(JSON.stringify({"error":"you are not the owner of this event"}));
        }
    });

    // Add all activities from this event
    var activity_list = [];
    con.query(`SELECT ActivitysetID FROM activitysets WHERE EventID="${req.params.eventID}"`, (err, result) => {
        if (err) throw err;
        result.forEach((value, index, array) => {
            con.query(`SELECT ActivityID FROM activities WHERE ActivitysetID=${value}`, (err, result) => {
                if (err) throw err;
                activity_list = activity_list.concat(result);
            });
        });
    });

    // Count how many submissions are graded and not
    var total_submissions = 0;
    var graded = 0;
    activity_list.forEach((value, index, array) => {
        con.query(`SELECT Graded FROM submissions WHERE ActivityID=${value}`, (err, result) => {
            if (err) throw err;
            result.forEach((value, index, array) => {
                if (value) graded += 1;
                total_submissions += 1;
            });
        });
    });

    res.status(200).setHeader('Content-type', 'application/json').end(JSON.stringify({"graded":graded/total_submissions}));
});



// starting server at port 6969, on open host (so anyone can connect)
http.createServer(app).listen(port, hostname, () => {
    console.log(`server started at http://${hostname}:${port}`)
})
