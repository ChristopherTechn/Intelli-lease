const Joi = require('joi')

const loginSchema = Joi.object({
	UserEmail: Joi.string().email({ minDomainSegments: 2, tlds: {allow: ['com', 'net']}}).required(),
    UserPasswordHash: Joi.string().pattern(new RegExp("^[A-Za-z0-9]")).required(),
})

module.exports = loginSchema