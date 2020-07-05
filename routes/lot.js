const express = require("express");
const router = express.Router();
const Lot = require("../db/queries/lot.js");
const auth = require("../firebase/authorization");
const schemas = require("../db/schemas.js");
const Joi = require("joi");
const Auction = require("../db/queries/auction.js");

router.post("/", auth.checkAuth);
router.post("/", (req, res) => {
  Joi.validate(req.body, schemas.lot_required).then(
    (data) => {
      const lot = {
        owner_id: req.user.uid,
        name: data.name,
        description: data.description,
        state: "POSTED",
        category: data.category,
        initial_price: data.initial_price,
        quantity: data.quantity,
        lot_photos: data.lot_photos,
      };
      Lot.createLot(lot).then((l) => {
        l = l[0];
        auction = {
          lot_id: l.id,
          creation_date: new Date(),
          deadline: new Date().addDays(7),
        };
        Auction.createAuction(auction).then(() => {
          res.status(201).json({ id: l.id }).end();
        });
        lot.lot_photos.array.forEach((photo_id) => {
          Lot.postPhoto({ lot_id: l.id, photo_id: photo_id }).then((info) => {
            res.status(201).json(info).end();
          });
        });
      });
    },
    (err) => {
      console.log(err);
      res.status(400).send(err.details[0].message);
    }
  );
});

router.get("/byUser/:uid", (req, res) => {
  Lot.getLotsByOwner(req.params.uid).then((lots) => {
    res.status(200).json(lots);
  });
});

router.get("/categories", (req, res) => {
  Lot.getCategories().then((categories) => {
    res.status(200).json(categories);
  });
});

router.get("/:id", (req, res) => {
  Lot.getLotById(req.params.id).then((lot) => {
    if (lot) {
      res.status(200).json(lot);
    } else {
      res.status(404).send("LOT NOT FOUND");
    }
  });
});

router.delete("/:id", auth.checkAuth);
router.delete("/:id", (req, res) => {
  Joi.validate(req.params, { id: Joi.number().integer() }).then(
    Lot.getLotById(req.params.id).then((lot) => {
      if (lot) {
        Lot.deleteLot(lot.id).then(() => {
          res.status(200).end();
        });
      } else {
        res.status(404).send("LOT NOT FOUND");
      }
    }),
    (err) => {
      res.status(400).send(err.details[0].message);
    }
  );
});

router.put("/:id", auth.checkAuth);
router.put("/:id", (req, res) => {
  Joi.validate(req.body, schemas.lot).then(
    (data) => {
      Lot.updateLot(req.params.id, data).then((info) => {
        res.status(200).json(info);
      });
    },
    (err) => {
      res.status(400).send(err.details[0].message);
    }
  );
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
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

module.exports = router;
