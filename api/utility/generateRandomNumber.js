/**
 * @param {number} numberLength 
 * @returns number
 */
const generateRandomNumber = (numberLength = 10) => {
    let accountNo = []

    for (let i = 0; i < numberLength; i++) {
        accountNo.push(Math.floor(Math.random() * 10))
    }

    return Number(accountNo.join(''));
}

module.exports = generateRandomNumber