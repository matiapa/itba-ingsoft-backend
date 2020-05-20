const express = require("express");
const router = express.Router();
const Lot = require("../db/queries/lot.js");
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

router.post("/:id", (req, res) => {
    const lot = {
        id: req.params.id,
        name: req.body.name,
        description: req.body.description
      };
    Lot.createLot(lot).then((id) => {
        const lot_photos = {
            lot_id = req.body.lot_id,
            url = req.body.url,
        };
        Lot.createLotPhotos(lot_photos).then(() => {
            res.status(201).end();
        })
    });
    res.status(400).end();
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
      Lot.updateLot(req.params.id, req.body).then((info) => {
          res.status(200).json(info);
      });
  });

  router.get("/:id/status", (req, res) => {
      Lot.getLotStatus(req.params.id).then((status) => {
        if(status){
            res.status(200).json(status);
        }else{
            res.status(404).send("STATUS NOT FOUND");
        }
      });
  });

  

module.exports = router;