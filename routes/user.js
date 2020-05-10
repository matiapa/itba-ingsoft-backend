const express = require("express");
const router = express.Router();
const User = require("../db/queries/user.js");

router.get("/", (req, res) => {
  User.getAllUsers().then((users) => {
    res.status(200).json(users);
  });
});

router.get("/id/:id", (req, res) => {
  User.getUserById(req.params.id).then((user) => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).send("USER NOT FOUND");
    }
  });
});
/*
router.get("/id/:id/personal_info", (req, res) => {
  User.getPersonalInfo(req.params.id).then((personal_info) => {
    if (personal_info) {
      res.status(200).json(personal_info);
    } else {
      res.status(400).send("USER NOT FOUND");
    }
  });
});
*/
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

module.exports = router;
