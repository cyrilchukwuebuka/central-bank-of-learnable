const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 20,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    lastName: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 6
    },
    tel: {
        type: String,
        required: true,
        min: 10,
    },
    date: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: true
    },
    transactionId: {
        type: Number,
        default: 0,
        required: true,
        unique: true
    },
    // adminId: {
    //     type: Number,
    //     default: 0,
    //     unique: true,
    //     required: true
    // },
    accounts: {
        type: Array,
        default: []
    },
    disabledAccounts: {
        type: Array,
        default: []
    }
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin