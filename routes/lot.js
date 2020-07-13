const express = require("express");
const router = express.Router();
const Lot = require("../db/queries/lot.js");
const auth = require("../firebase/authorization");
const schemas = require("../db/schemas.js");
const Joi = require("joi");
const Auction = require("./auction");

//Para testear porque log in esta roto
router.post("/", auth.checkAuth);
router.post("/", (req, res) => {
  Joi.validate(req.body, schemas.lot_required).then(
    async (data) => {
      const lot = {
        owner_id: req.user.uid,
        name: data.name,
        description: data.description,
        state: "POSTED",
        category: data.category,
        initial_price: data.initial_price,
        quantity: data.quantity,
      };
      l = await Lot.createLot(lot);
      l = l[0];
      
      Auction.openAuction(l.id);
      
      await Promise.all(
        data.lot_photos.map(async (photo_id) => {
          await Lot.postPhoto({ lot_id: l.id, photo_id: photo_id });
      }));
      res.status(201).send({id: l.id}); 
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
      Lot.getPhotos(req.params.id).then((photos) => {
        if (photos) {
          const info = {
            id: lot.id,
            owner_id: lot.owner_id,
            name: lot.name,
            description: lot.description,
            state: lot.state,
            category: lot.category,
            initial_price: lot.initial_price,
            quantity: lot.quantity,
            photos_ids: photos,
          };
          res.status(200).json(info);
        } else {
          res.status(404).send("LOT PHOTOS NOT FOUND");
        }
      });
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

Date.prototype.addMinutes = function (mins) {
  var date = new Date(this.valueOf());
  date.setMinutes(date.getMinutes() + mins);
  return date;
};

module.exports = router;
