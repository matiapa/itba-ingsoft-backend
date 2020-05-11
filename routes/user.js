const express = require("express");
const router = express.Router();
const User = require("../db/queries/user.js");

router.get("/", (req, res) => {
  User.getAllUsers().then((users) => {
    res.status(200).json(users);
  });
});

router.get("/:id", (req, res) => {
  User.getUserById(req.params.id).then((user) => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).send("USER NOT FOUND");
    }
  });
});

router.get("/:id/personal_info", (req, res) => {
  User.getPersonalInfo(req.params.id).then((personal_info) => {
    if (personal_info) {
      res.status(200).json(personal_info);
    } else {
      res.status(400).send("USER NOT FOUND");
    }
  });
});

router.delete("/id/:id", (req, res) => {
  User.getUserById(req.params.id).then((user) => {
    if (user) {
      User.deleteUser(req.params.id).then(() => {
        res.status(200).end();
      });
    } else {
      res.status(404).send("USER NOT FOUND");
    }
  });
});

router.post("/:id", (req, res) => {
  const schema = {
    name: Joi.string().min(2).max(30).required(),
    last_name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  } else {
    User.updateUser(req.params.id, req.body);
    res.status(200).end();
  }
});

router.post("/:id/personal_info", (req, res) => {
  const schema = {
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
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  } else {
    User.updatePersonalInfo(req.params.id, req.body);
    res.status(200).end();
  }
});
router.update;
module.exports = router;
