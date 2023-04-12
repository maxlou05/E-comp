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
const bodyParser = require('body-parser');



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
const urlencodedParser = bodyParser.urlencoded({ extended: false })
// Create a application/json body parser
const jsonParser = bodyParser.json()



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

// Landing/home page
app.get('/', (req, res) => {
    res.setHeader('Content-type', 'application/json').status(200).end(JSON.stringify({'message': 'Welcome to EventHost backend API!'}, null, 2));
});

// ***TODO*** return documentation when complete, or at least give the link to the docs
app.get('/docs', (req, res) => {
    res.end("TODO: documentation");
});

// *NOTE req.query is in query string of URL, req.body is form data
app.put('/account', jsonParser, (req, res) => {
    // Hash the password 
    const hashed_password = hash(req.body.password, {algorithm:'RSA-SHA256'});
    
    con.query(`INSERT INTO users VALUES ('${req.body.username}', '${hashed_password}');`, (err, result) => {
        if (err) {
            if (err.code = 'ER_DUP_ENTRY') res.status(403).setHeader('Content-type', 'application/json').end(JSON.stringify({"error": "username already exists"}, null, 2));
            console.log(err);
        }
        else {
            res.status(201).setHeader('Content-type', 'application/json').end(JSON.stringify({"message": "successfully added user"}, null, 2));
        }
    });
});

app.post('/login', urlencodedParser, async (req, res) => {
    const hashed_password = hash(req.body.password, {algorithm:'RSA-SHA256'});
    con.query(`SELECT * FROM users WHERE Username='${req.body.username}';`, async (err, result) => {
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
    var payload = await verify_token(req.headers.authorization.slice(7));
    if (payload.err) res.status(401).setHeader('Content-type', 'application/json').end(JSON.stringify({"error":payload.err}));
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



// starting server at port 6969, on open host (so anyone can connect)
http.createServer(app).listen(port, hostname, () => {
    console.log(`server started at http://${hostname}:${port}`);
});
