const express = require("express");
const router = express.Router();
const Expert = require("../db/queries/expert.js");
const auth = require("../firebase/authorization");
const Joi = require("joi");
const schemas = require("../db/schemas.js");
router.use(auth.checkAuth);

router.get("/auction/:id_auc", (req, res) => {
  Expert.getExpertAsigned(req.params.id_auc).then(
    (data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).send("EXPERT WAS NOT FOUND");
      }
    },
    (err) => {
      res.status(400).send(err.details[0].message);
    }
  );
});

router.get("/", (req, res) => {
  Expert.getExperts().then((data) => {
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).send("EXPERTS NOT FOUND");
    }
  });
});

router.post("/", (req, res) => {
  Joi.validate(req.body, schemas.expert_required).then(
    (data) => {
      Expert.createExpert(data).then(
        () => {
          res.status(201).end();
        },
        (err) => {
          res.status(404).send(err);
        }
      );
    },
    (err) => {
      res.status(400).send(err.details[0].message);
    }
  );
});

router.delete("/:id", (req, res) => {
  Expert.getExpertById(req.params.id).then((expert) => {
    if (expert) {
      Expert.deleteExpert(req.params.id).then(() => {
        res.status(200).end();
      });
    } else {
      res.status(404).send("EXPERT NOT FOUND");
    }
  });
});

router.post("/auction", (req, res) => {
  Joi.validate(req.query, schemas.expert_asign).then(
    (data) => {
      Expert.asignExpert(data).then(
        () => {
          res.status(201).json(data);
        },
        (err) => {
          res.status(404).send(err);
        }
      );
    },
    (err) => {
      res.status(400).send(err.details[0].message);
    }
  );
});

router.get("/:id", (req, res) => {
  Expert.getExpertById().then((expert) => {
    if (expert) {
      res.status(200).json(expert);
    } else {
      res.status(404).send("EXPERT NOT FOUND");
    }
  });
});

router.delete("/:id", (req, res) => {
  Expert.getExpertById(req.params.id).then((expert) => {
    if (expert) {
      Expert.deleteExpert(req.params.id).then(() => {
        res.status(200).end();
      });
    } else {
      res.status(404).send("EXPERT NOT FOUND");
    }
  });
});

router.put("/:id", (req, res) => {
  Expert.updateExpert(req.params.id, req.body).then((info) => {
    res.status(200).json(info);
  });
});

module.exports = router;
