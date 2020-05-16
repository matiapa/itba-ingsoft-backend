const express = require("express");
const router = express.Router();
const User = require("../db/queries/user.js");
const schemas = require("../db/schemas.js");
const Joi = require("joi");
const auth = require("../firebase/authorization");

/*
function userInfoAuthorization(req, res, next) {
  if (req.user.uid == req.params.id) next();
  else res.sendStatus(403);
}

router.use(auth.checkAuth);
*/

router.post("/", (req, res) => {});

module.exports = router;
