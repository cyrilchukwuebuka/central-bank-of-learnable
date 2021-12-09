const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

// create an express app
const app = express()

// routes
const adminRoute = require('./routes/admin')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const homeRoute = require('./routes/home')

// configure dotenv and port
dotenv.config()
const port = 8800

//middlewares
app.use(express.json());
// app.use(express.urlencoded({ extended: true}))
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/', homeRoute);
// app.use('/admin', adminRoute);
app.use('/auth', authRoute);
// app.use('/user', userRoute);

// Mongoose and Server start up
mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => app.listen(port, () => console.log(`Server is running on Port: ${port}`)))
    .catch(err => console.log(err))


module.exports = app
