const Joi = require('joi');
const jwt = require('jsonwebtoken');

/**
 * @param {object} data 
 * @returns boolean
 */
const userRegistrationValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        tel: Joi.string().min(10).required(),
    });

    return schema.validate(data);
}

/**
 * @param {object} data
 * @returns boolean
 */
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

/**
 * @param {object} data
 * @returns boolean
 */
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    })

    return schema.validate(data)
}

/**
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const userAccess = (req, res, next) => {
    // fetch the token from the request header
    const token = res.header('authentication-token');
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

/**
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
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
        next()
    } catch (err) {
        console.log(err)
    }
}

module.exports = { 
    adminRegistrationValidation,
    userRegistrationValidation, 
    loginValidation,
    userAccess,
    adminAccess
}