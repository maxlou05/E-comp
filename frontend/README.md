# E-comp Frontend Server
Frontend sever hosting the webpages.

## Installation guide

### Starting the frontend server
1. install [node](https://nodejs.org/en/download)
2. run `npm install` to install all dependencies
3. run `npm start` to start the server

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