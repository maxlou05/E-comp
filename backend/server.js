// This one uses the 'express' framework to help make creating servers quicker and easier
// Just like FastAPI in python, it is a framework

const express = require('express');
var app = express();
const http =  require('http');
const mysql = require('mysql2');
const jose = require('jose');
const fs = require('fs');

// load environment variables with database information
require('dotenv').config();

// Server settings
const hostname = '0.0.0.0';
const port = 6969;
const db_name = process.env.DB_NAME;

// JWT token settings
const secret = new TextEncoder().encode(process.env.JWK);
const algorithm = 'HS256';



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
    else console.log(result);
});
DBsetup(con);

con.query(`SHOW DATABASES`, (err, result) => {
    if (err) throw err;
    console.log(result);
});



// Making get methods:
app.get('/', (req, res) => {
    const payload = {message: 'Welcome to EventHost backend API!'};

    req.headers.authorization

    res.setHeader('Content-type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(payload, null, 2));
});

// Create a token
app.get('/token', async (req, res) => {
    // Generate and sign a token
    const jwt = await new jose.SignJWT({sub: "user", "my_property": 69})
        .setProtectedHeader({alg: algorithm})
        .setIssuedAt()
        .setIssuer('e-comp:API')
        .setExpirationTime('30min')
        .sign(secret);
    
    console.log(jwt);

    var body = {};
    
    try {
        // Verify the token is valid
        const {payload, protectedHeader} = await jose.jwtVerify(jwt, secret, {
            issuer: 'e-comp:API'});
        console.log(payload);
        console.log(protectedHeader);
        message = {'access_token': jwt};
        res.statusCode = 200;
    }
    catch (err) {
        // catch any errors if there are 
        if(err.claim == 'iss') console.log('wrong issuer, whatever');
        if(err.claim == 'exp') {
            res.statusCode = 401;
            body = {"error": "JWT is expired"};
        }
        else throw err;
    }
    
    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify(body, null, 2));
});



// starting server at port 6969, on open host (so anyone can connect)
http.createServer(app).listen(port, hostname, () => {
    console.log(`server started at http://${hostname}:${port}`)
});
