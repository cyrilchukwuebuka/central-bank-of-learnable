const Joi = require('joi')

const userRegistrationValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).require(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        account: Joi.number().min(10).required(),
    });

    return schema.validate(data);
}

const userLoginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    })

    return schema.validate(data)
}

module.exports = { 
    userRegistrationValidation, 
    userLoginValidation
}