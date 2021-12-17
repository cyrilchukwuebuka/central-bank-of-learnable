const generateRandomNumber = require('../utility/generateRandomNumber')

describe('Get a number of random number equal to the number length or default to 10', () => {
    it('Checks for an account number with default length of 10', () => {
        expect(generateRandomNumber().toString().length).toEqual(10)
    })

    it('Checks for a random number with length of 20', () => {
        expect(generateRandomNumber(20).toString().length).toEqual(20)
    }) 
})