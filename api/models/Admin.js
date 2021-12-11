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
    accounts: {
        type: Array,
        default: []
    },
    adminID: {
        type: Number,
        default: 0,
        required: true,
        unique: true
    },
    disabledAccounts: {
        type: Array,
        default: []
    }
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin