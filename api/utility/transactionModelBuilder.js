
/**
 * @param {object} receiver
 * @param {number} amount
 * @param {object} sender
 * @returns object
 */
const getTransactionObject = (receiver, amount, sender) => {
    return {
        sender : sender,
        receiver : receiver,
        amount : amount
    }
}

module.exports = getTransactionObject