const Joi = require('joi')

const userSchema = Joi.object({
    FirstName: Joi.string().required(),
    LastName: Joi.string().required(),
    UserEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    UserPasswordHash: Joi.string().min(6).required(), 
    UserCPassword: Joi.string().valid(Joi.ref('UserPasswordHash')).required(),
}).with('UserPasswordHash', 'UserCPassword');


module.exports = userSchema;
