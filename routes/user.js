const express = require("express");
const router = express.Router();
const User = require("../db/queries/user.js");
const schemas = require("../db/schemas.js");
const Joi = require("joi");
const auth = require("../firebase/authorization");

function userInfoAuthorization(req, res, next) {
  if (req.user.uid == req.params.id) next();
  else res.sendStatus(403);
}

//FOLLOWING
router.get("/following", auth.checkAuth, (req, res) => {
  Joi.validate(req.query, schemas.following).then(
    (data) => {
      var body;
      User.getFollowing(req.user.uid, data.followed_id).then((info) => {
        if (info.length > 0) {
          body = { following: true };
        } else {
          body = { following: false };
        }
        res.status(200).json(body);
      });
    },
    (err) => {
      res.status(400).send(err.details[0].message);
    }
  );
});

router.post("/following", auth.checkAuth, (req, res) => {
  Joi.validate(req.query, schemas.following).then(
    (data) => {
      User.postFollowing(req.user.uid, data.followed_id).then(
        () => {
          res.status(200).end();
        },
        (err) => {
          res.status(400).send(err);
        }
      );
    },
    (err) => {
      res.status(400).send(err.details[0].message);
    }
  );
});

router.delete("/following", auth.checkAuth, (req, res) => {
  Joi.validate(req.query, schemas.following).then(
    (data) => {
      User.deleteFollowing(req.user.uid, data.followed_id).then(
        () => {
          res.status(200).end();
        },
        (err) => {
          res.status(400).send(err);
        }
      );
    },
    (err) => {
      res.status(400).send(err.details[0].message);
    }
  );
});

router.get("/", (req, res) => {
  User.getAllUsers().then((users) => {
    res.status(200).json(users);
  });
});

router.get("/id", auth.checkAuth, (req, res) => {
  res.status(200).json({ uid: req.user.uid });
});

//router.get("/:id", userInfoAuthorization);

router.get("/:id", (req, res) => {
  User.getUserById(req.params.id).then((user) => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("USER NOT FOUND");
    }
  });
});

router.get("/:id/personal_info", auth.checkAuth, userInfoAuthorization, (req, res) => {
  User.getPersonalInfo(req.params.id).then((personal_info) => {
    if (personal_info) {
      res.status(200).json(personal_info);
    } else {
      res.status(404).send("USER NOT FOUND");
    }
  });
});

router.delete("/:id", auth.checkAuth, userInfoAuthorization, (req, res) => {
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

router.put("/:id", auth.checkAuth, userInfoAuthorization, (req, res) => {
  const result = Joi.validate(req.body, schemas.user);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  } else {
    User.updateUser(req.params.id, req.body).then((info) => {
      res.status(200).json(info);
    });
  }
});

router.put("/:id/personal_info", auth.checkAuth, userInfoAuthorization, (req, res) => {
  const result = Joi.validate(req.body, schemas.personal_info);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  } else {
    User.updatePersonalInfo(req.params.id, req.body).then((info) => {
      res.status(200).json(info);
    });
  }
});

//RATING
router.get("/:id/rating", (req, res) => {
  User.getProfileRatings(req.params.id).then((info) => {
    res.status(200).json(info);
  });
});
router.post("/:id/rating", auth.checkAuth, (req, res) => {
  const user_rating = {
    to_id: req.params.id,
    from_id: req.user.uid,
    comment: req.body.comment,
    date: new Date(),
    rating: req.body.rating,
  };
  Joi.validate(user_rating, schemas.user_rating).then(
    (data) => {
      if (data) {
        User.postProfileRating(data).then((info) => {
          res.status(200).json(info);
        });
      }
    },
    (err) => {
      res.status(400).send(err.details[0].message);
    }
  );
});
// router.delete("/:id/rating/:rating_id", (req, res) => {
//   User.getProfileRatings(req.params.id).then((info) => {
//     res.status(200).json(info);
//   });
// });

module.exports = router;
