const express = require("express");
const router = express.Router();
const Auction = require("../db/queries/auction.js");
const auth = require("../firebase/authorization");
const schemas = require("../db/schemas.js");
const Joi = require("joi");

// router.use(auth.checkAuth);

// router.post("/", (req, res) => {
//   const auction = {
//     category: req.body.category,
//     name: req.body.name
//   };
//   Auction.createAuction(auction).then(() => {
//     res.status(201).end();
//   });
// });

router.get("/list", (req, res) => {
  Joi.validate(req.query, schemas.auction_list).then(
    (data) => {
      var auctions = Auction.getAuctions();
      if (auctions) {
        auctions = Auction.sort(auctions, data.category, data.sort);
        if (data.filter != null && data.filter == "bidding") {
          auctions = Auction.filterBiddingOn(auctions, data.user.uid);
        }
        auctions = auctions.limit(data.limit).offset(data.offset);
        res.status(200).json(auctions);
      } else {
        res.status(404).send("AUCTIONS NOT FOUND");
      }
    },

    (err) => {
      res.status(400).send(err.details[0].message);
    }
  );
});

router.get("/:id", (req, res) => {
  Auction.getAuctionById(req.params.id).then((auction) => {
    if (auction) {
      res.status(200).json(auction);
    } else {
      res.status(404).send("AUCTION NOT FOUND");
    }
  });
});

router.get("/byUser/:uid", (req, res) => {
  Auction.getAuctionByOwnerId(req.params.uid).then((auction) => {
    if (auction) {
      res.status(200).json(auction);
    } else {
      res.status(404).send("AUCTION NOT FOUND");
    }
  });
});

/*
router.delete("/:id", (req, res) => {
  Auction.getAutionById(req.params.id).then((auction) => {
    if(auction){
      Auction.deleteAuction(req.params.id).then(() => {
        res.status(200).end();

      });
    }else{
      res.status(404).send("AUCTION NOT FOUND");
    }
  });
});
*/
/*
router.put("/:id", (req, res) => {
  Auction.updateAuction(req.params.id, req.body).then((info) => {
    res.status(200).json(info);
  });
});
*/

module.exports = router;
