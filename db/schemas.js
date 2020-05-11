const Joi = require("joi");

const user = {
  name: Joi.string().min(2).max(30).required(),
  last_name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
};

const personal_info = {
  document_type: Joi.string()
    .valid("dni", "ci", "passport")
    .insensitive()
    .required(),
  document: Joi.string().length(8).required(),
  telephone_type: Joi.string()
    .valid("landline", "mobile")
    .insensitive()
    .required(),
  telephone: Joi.number().integer().required(),
  country: Joi.string().required(),
  province: Joi.string().required(),
  location: Joi.string().required(),
  zip: Joi.number().integer().required(),
  street: Joi.string().required(),
  street_number: Joi.string().required(),
};

module.exports = {
  user,
  personal_info,
};
