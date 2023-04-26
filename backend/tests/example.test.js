const { describe, it } = require('node:test')
const assert = require('assert')
const { expect } = require('chai')
const { should } = require('chai').should()

const isTrue = true

// This creates a test set (node)
describe('Simple math test', () => {
    // Each on of these 'it' is a test
    it('Should return 2', () => {
        assert.equal(1+1, 2)  // Using normal mocha 
        expect(1+1).to.equal(2)  // Using chai
    })
    it('Should return 9', () => {
        // Failing this means this whole test set ends, does not check further tests
        assert.equal(3*2, 9)  // Using normal mocha
        expect(3*3).to.equal(9)  // Usimg chai
    })
    it('Should be true', () => {
        expect(isTrue).to.be.true  // Using expect
        isTrue.should.equal(true)  // Using should (just use expect, no need for this)
    })
})