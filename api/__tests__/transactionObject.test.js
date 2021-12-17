const { getTransactionObject } = require('../utility/transactionObjectBuilder')

describe('Transaction Object Builder', () => {

    let receiver = {
        firstName: 'chukwuebuka',
        lastName: 'cyril'
    }

    let sender = {
        firstName: 'chukwuebuka',
        lastName: 'cyril'
    }

    let amount = 2000;

    let type = 'CREDIT';

    let id = 1234567890

    let createdValue = {
        type: type,
        id: id,
        sender: { name: `${sender?.firstName} ${sender?.lastName}` },
        receiver: { name: `${receiver?.firstName} ${receiver?.lastName}` },
        amount: amount
    }
    let value;

    beforeAll(() => {
        value = getTransactionObject(receiver, amount, sender, type, id)
        delete value.receiver.account
        delete value.sender.account
        delete value.date
        // console.log(value)
    })

    it('Checks for the return of the function to be an Object', () => {
        // console.log(value)
        expect(typeof value).toBe('object')
        expect(value).not.toStrictEqual({})
    })
    

    it('Checks for the properties of the Object', () => {
        expect(value).toHaveProperty('sender')
        expect(value).toHaveProperty('receiver')
        expect(value).toHaveProperty('amount')
        expect(value).toHaveProperty('id')
        expect(value).toHaveProperty('type')
    })

    it('Checks for the Object value', () => {
        expect(value).toMatchObject(createdValue)
    })
})
