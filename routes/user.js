const express = require("express");
const router = express.Router();
const User = require("../db/queries/user.js");
const schemas = require("../db/schemas.js");
const Joi = require("joi");
const auth = require("../firebase/authorization");

function userInfoAuthorization(req, res, next) {
  if(req.user.uid == req.params.id)
    next();
  else
    res.sendStatus(403);
}

router.use(auth.checkAuth);

router.get("/", (req, res) => {
  User.getAllUsers().then((users) => {
    res.status(200).json(users);
  });
});

router.get("/id", (req, res) => {
  res.status(200).json({uid: req.user.uid});
});

router.use("/:id", userInfoAuthorization);

router.get("/:id", (req, res) => {
  User.getUserById(req.params.id).then((user) => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("USER NOT FOUND");
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

router.delete("/:id", (req, res) => {
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

router.put("/:id", (req, res) => {
  const result = Joi.validate(req.body, schemas.user);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  } else {
    User.updateUser(req.params.id, req.body).then((info) => {
      res.status(200).json(info);
    });
  }
});

router.put("/:id/personal_info", (req, res) => {
  const result = Joi.validate(req.body, schemas.personal_info);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  } else {
    User.updatePersonalInfo(req.params.id, req.body).then((info) => {
      res.status(200).json(info);
    });
  }
});

module.exports = router;
