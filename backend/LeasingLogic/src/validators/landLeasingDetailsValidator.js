const Joi = require('joi')

const leasingLandDetailsSchema = Joi.object({
	UserID: Joi.string().required(),
    County: Joi.string().required(),
    SubCounty: Joi.string().required(),
    Constituency: Joi.string().required(),
    LandSize: Joi.number().required()
})

module.exports = leasingLandDetailsSchema