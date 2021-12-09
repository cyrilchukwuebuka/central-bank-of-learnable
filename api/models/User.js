const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
    isAdmin: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    account: {
        type: Number,
        required: true,
        min: 10,
        default: ''
    },
    credit: {
        type: Array,
        default: []
    },
    debit: {
        type: Array,
        default: []
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User