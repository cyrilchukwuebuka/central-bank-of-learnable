const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    // transactionId: {
    //     type: Number,
    //     required: true,
    //     unique: true
    // },
    credits: {
        type: Array,
        default: []
    },
    debits: {
        type: Array,
        default: []
    }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction