# E-comp Backend Server
Backend server hosting the API

## Backend Environment Variables
- DB_HOST: ip of database server
- DB_PORT: port of database server
- DB_NAME: name of the database
- DB_USERNAME: username for database
- DB_PASSWORD: password for database
- JWK: 256-bit secret key
- JWT_ALG: algorithm for JWT encoding
- HAHS_ALG: hasing algorithm for password
- SERVER_HOST: ip of the API server
- SERVER_PORT: port of the API server
- TEST: 1 for running in test environment (local memory), 0 for running using the database
- TEST_LOGS: 1 for some extra logs during tests, 0 for less logs

## Testing
- npm run unit-test: unit test (internal server tests)
- npm run it-test: integration test (tests http requests to the server)