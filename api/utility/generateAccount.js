/**
 * @param {number} accountLength 
 * @returns number
 */
const generateAccount = (accountLength = 10) => {
    let accountNo = []

    for (let i = 0; i < accountLength; i++) {
        accountNo.push(Math.floor(Math.random()*10))
    }

    return Number(accountNo.join(''));
}

module.exports = generateAccount