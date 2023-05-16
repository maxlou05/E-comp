const { describe, it } = require('node:test')
const { expect } = require('chai')
const User = require('../../database/models/user')
const { init } = require('../../database/utils')
const hash = require('object-hash')

async function user_test() {
    const admin = User.build({Username:'admin', HashedPassword:hash('adminpw', {algorithm:'RSA-SHA256'})})
    await admin.save()
    const users = await User.findAll()  // This actually returns more than just the retrieved data, has all metadata in it too
    // console.log(users)  // Is a list of User objects
    // console.log(JSON.stringify(users, null, 2))  // Has a special stringify? Not sure how they did that (list of User.dataValues)
    const content = JSON.parse(JSON.stringify(users, null, 2))  // Take advantage of stringify only returning the data portion (User.dataValues)
    return content
}

describe('Create and query user', () => {
    it('should return list with one user', async () => {
        await init()
        const users = await user_test()
        expect(users).to.include.deep.members([{"Username":"admin", "HashedPassword":hash('adminpw', {algorithm:'RSA-SHA256'})}])
    })
})