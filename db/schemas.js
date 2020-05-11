const Joi = require("joi");

function makeRequired(schema) {
  return Object.keys(schema).reduce(function(result, key) {
    result[key] = schema[key].required();
    return result
  }, {});
}

const user = {
  name: Joi.string().min(2).max(30),
  last_name: Joi.string().min(2).max(30),
  email: Joi.string().email({ minDomainSegments: 2 }),
};

const user_required = makeRequired(user);

const personal_info = {
  document_type: Joi.string()
    .valid("dni", "ci", "passport")
    .insensitive(),
  document: Joi.string().length(8),
  telephone_type: Joi.string()
    .valid("landline", "mobile")
    .insensitive(),
  telephone: Joi.number().integer(),
  country: Joi.string(),
  province: Joi.string(),
  location: Joi.string(),
  zip: Joi.number().integer(),
  street: Joi.string(),
  street_number: Joi.string(),
};

const personal_info_required = makeRequired(personal_info);

module.exports = {
  user,
  user_required,
  personal_info,
  personal_info_required
};
