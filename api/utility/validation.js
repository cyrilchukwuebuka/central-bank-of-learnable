const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userRegistrationValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        account: Joi.number().min(10).required(),
        tel: Joi.string().min(10).required(),
    });

    return schema.validate(data);
}
const adminRegistrationValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        tel: Joi.string().min(10).required(),
    });

    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    })

    return schema.validate(data)
}

const tokenValidation = (req, res, next) => {
    // fetch the token from the request header
    const token = req.header('authentication-token');
    if(!token){
        return res.status(400).json('Access denied!')
    }

    // verify the user
    try{
        const verifiedUser = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
        req.user = verifiedUser;
        console.log(verifiedUser)
        next()
    } catch (err) {
        console.log(err)
    }
}

const adminAccess = (req, res, next) => {
    // fetch the token from the request header
    const token = req.header('authentication-token');
    if (!token) {
        return res.status(400).json('Access denied!')
    }

    // verify the admin
    try {
        const verifiedAdmin = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
        req.admin = verifiedAdmin;
        console.log(verifiedAdmin)
        next()
    } catch (err) {
        console.log(err)
    }
}

module.exports = { 
    adminRegistrationValidation,
    userRegistrationValidation, 
    loginValidation,
    tokenValidation,
    adminAccess
}