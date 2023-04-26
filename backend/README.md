# E-comp Backend Server
Backend server hosting the API

## Backend Environment Variables
- DB_HOST: ip of database server
- DB_PORT: port of database server
- DB_NAME: name of the database
- DB_USERNAME: username for database
- DB_PASSWORD: password for database
- JWK: 256-bit secret key

## Testing
- npm run unit-test: unit test (internal server tests)
- npm run it-test: integration test (tests http requests to the server)