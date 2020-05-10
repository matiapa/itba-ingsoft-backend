const express = require("express");
const router = express.Router();
const User = require("../db/queries/user.js");

router.get("/:id/user_info", (req, res) => {
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

router.delete("/:id", (req, res) => {
  const result = User.deleteUser(req.params.id).then(() => {
    res.json({
      result,
    });
  });
});

module.exports = router;
