
/**
 * @param {object} receiver
 * @param {number} amount
 * @param {object} sender
 * @param {string} type
 * @param {number} id
 * @returns object
 */
const getTransactionObject = (receiver, amount, sender, type, id) => {
    let senderObj = {
        name: `${sender?.firstName} ${sender?.lastName}`,
        account: `${sender?.account}`
    }

    let receiverObj = {
        name: `${receiver?.firstName} ${receiver?.lastName}`,
        account: `${receiver?.account}`
    }
    
    return {
        type: type,
        id: id,
        sender: senderObj,
        receiver: receiverObj,
        amount: amount,
        date: Date.now()
    }
}

// console.log(getTransactionObject())

module.exports = { getTransactionObject }