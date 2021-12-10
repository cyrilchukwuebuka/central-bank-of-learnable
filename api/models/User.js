const { string } = require('joi');
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
    tel: {
        type: String,
        required: true,
        min: 10,
    },
    password: {
        type: String,
        require: true,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    },
    account: {
        type: String,
        required: true,
        min: 10,
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