# E-comp Backend Server
Backend server hosting the API.

## Installation guide

### Configuring the database
There are many ways to get a MySQL server, one of which is [MySQL windows](https://dev.mysql.com/downloads/).
An alternative is to set the `TEST` environment variable to `1`, but that uses RAM is not recommended for production.
Once a server is obtained, set the appropriate environment variables.

### Starting the backend server
1. create a file named `.env` in `/backend` with all the specified environment variables in the next section
2. install [node](https://nodejs.org/en/download)
3. run `npm install` to install all dependencies
4. run `npm start` to start the server

## Environment Variables
- `DB_HOST`: ip of database server
- `DB_PORT`: port of database server
- `DB_NAME`: name of the database
- `DB_USERNAME`: username for database
- `DB_PASSWORD`: password for database
- `JWK`: 256-bit secret key (hex string)
- `JWT_ALG`: algorithm for JWT encoding
- `HASH_ALG`: hasing algorithm for password
- `SERVER_HOST`: ip of the API server
- `SERVER_PORT`: port of the API server
- `TEST`: 
    - 0 for running using the database (MySQL, uses the DB environment variables)
    - 1 for running in test environment (SQLite memory)
- `TEST_LOGS`:
    - 0 for no logs
    - 1 for responses only
    - 2 for all logs (includes db server actions)

## Testing
- `npm run unit-test`: unit test (internal server tests)
- `npm run it-test`: integration test (tests http requests to the server)