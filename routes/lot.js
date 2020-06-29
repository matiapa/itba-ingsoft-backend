const express = require("express");
const router = express.Router();
const Lot = require("../db/queries/lot.js");
const auth = require("../firebase/authorization");
const schemas = require("../db/schemas.js");
const Joi = require("joi");

router.use(auth.checkAuth);

router.post("/", (req, res) => {
  Joi.validate(req.body, schemas.lot_required)
  .then((data) => {
    const lot = {
      owner_id: req.user.uid,
      name: data.name,
      description: data.description,
      state: "POSTED",
      category: data.category
    };
    Lot.createLot(lot).then(() => {
      res.status(201).end();
    });
  }, (err) => {
    console.log(err);
    res.status(400).send(err.details[0].message);
  });
});

router.get("/byMe", (req,res) => {
  Lot.getLotsByOwner(req.user.uid).then((lots) => {
    res.status(200).json(lots);
  })
});

router.get("/:id", (req,res) => {
  Lot.getLotById(req.params.id).then((lot) => {
      if(lot){
          res.status(200).json(lot);
      }else{
          res.status(404).send("LOT NOT FOUND");
      }
  });
});

router.delete("/:id", (req, res) => {
  Lot.getLotById(req.params.id).then((lot) => {
      if(lot) {
          Lot.deleteLot(req.params.id).then(() => {
              res.status(200).end();
          });
      }else{
          res.status(404).send("LOT NOT FOUND");
      }
  });
});

router.put("/:id", (req,res) => {
  Joi.validate(req.body, schemas.lot)
  .then((data) => {
    Lot.updateLot(req.params.id, data).then((info) => {
      res.status(200).json(info);
    })
  }, (err) => {
    res.status(400).send(err.details[0].message);
  });
});

/*
router.get("/:id/status", (req, res) => {
  Lot.getLotStatus(req.params.id).then((status) => {
    if(status){
        res.status(200).json(status);
    }else{
        res.status(404).send("STATUS NOT FOUND");
    }
  });
});
*/
module.exports = router;