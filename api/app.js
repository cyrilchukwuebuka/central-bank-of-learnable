const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// create an express app
const app = express()

// routes
const adminRoute = require('./routes/admin')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const homeRoute = require('./routes/home')
const pageNotFound = require('./routes/pageNotFound')

//middlewares
app.use(express.json());
// app.use(express.urlencoded({ extended: true}))
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api', homeRoute);
app.use('/api/admin', adminRoute);
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use(pageNotFound)

module.exports = app;