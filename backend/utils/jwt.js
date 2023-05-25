const jose = require('jose')
const config = require('dotenv').config
const HTTP_Error = require('./HTTP_Error')

// import settings
config({ path: '../.env'})
const secret = new TextEncoder().encode(process.env.JWK)

// Create a token, default expiration is in 30 minutes
async function create_token(body, time='30min') {
    return await new jose.SignJWT(body)
        .setProtectedHeader({alg: process.env.JWT_ALG})
        .setIssuedAt()
        .setIssuer('e-comp:API')
        .setExpirationTime(time)
        .sign(secret)
}

// Verify a token
async function verify_token(jwt) {
    try {
        // Verify the token is valid
        const {payload, protectedHeader} = await jose.jwtVerify(jwt, secret, {
            issuer: 'e-comp:API'})
        return {err: null, "data": payload}
    }
    catch (err) {
        // catch any errors if there are 
        if(err.claim == 'iss') return {err: new HTTP_Error(401, 'wrong issuer'), data: null}
        if(err.claim == 'exp') return {err: new HTTP_Error(401, 'token is expired'), data: null}
        else return {err: new HTTP_Error(401, 'invalid token', err), data: null}
    }
}

// Export functions
module.exports.create = create_token
module.exports.verify = verify_token