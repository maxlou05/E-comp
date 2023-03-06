// This one uses the framework express to help make creating servers quicker and easier
// Just like FastAPI in python, it is a framework

var express = require('express');
var app = express();
const http =  require('http');
const fs = require('fs');
const mysql = require('mysql2');

// load environment variables with database information
require('dotenv').config();

// Server settings
const hostname = '0.0.0.0';
const port = 6969;

// Set-up the connection parameters
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

const db_name = 'my_first_db';

// Connect to the database server
con.connect((err) => {
    if (err) throw err;
    console.log('connected!');
});

// Create database if not exists, and select it
con.query(`CREATE DATABASE ${db_name}`, (err, result) => {
    if (err) console.log(`database '${db_name}' already exists, continuing`);
    else console.log(`created database '${db_name}'`);
    con.query(`USE ${db_name}`, (err, result) => {
        if (err) throw err;
    });
    console.log(`selected database '${db_name}'`);
});

// Making get methods:
app.get('/', (req, res) => {
    const message = {message: 'Welcome to EventHost backend API!'};

    res.setHeader('Content-type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(message, null, 2));
});

// Query everything!
app.get('/all', (req, res) => {
    // con.query('USE my')
});

// starting server at port 6969, on open host (so anyone can connect)
http.createServer(app).listen(6969, '0.0.0.0', () => {
    console.log(`server started at http://localhost:${port}`)
});
