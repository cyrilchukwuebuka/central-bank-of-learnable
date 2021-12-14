const app = require('./app')
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// configure dotenv and port
dotenv.config()
const port = 8800

// Mongoose and Server start up
mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => app.listen(port, () => console.log(`Server is running on Port: ${port}`)))
    .catch(err => console.log(err))
