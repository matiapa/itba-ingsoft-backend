const express = require("express");
const router = express.Router();
const Bid = require("../db/queries/bid.js");
const auth = require("../firebase/authorization");

const Joi = require("joi");
const schemas = require("../db/schemas.js");

router.get("/byAuction/:auc_id", (req, res) => {
  Bid.getBidsByAuctionId(
    req.params.auc_id,
    req.query.offset,
    req.query.limit
  ).then((bid) => {
    if (bid) {
      res.status(200).json(bid);
    } else {
      res.status(404).send("BID NOT FOUND");
    }
  });
});

router.get("/byUser/:user_id", (req, res) => {
  Bid.getBidByUserId(
    req.params.user_id,
    req.query.offset,
    req.query.limit
  ).then((bid) => {
    if (bid) {
      res.status(200).json(bid);
    } else {
      res.status(404).send("BID NOT FOUND");
    }
  });
});

/*  
router.delete("/:ar_id", (req, res) => {
    Bid.getBidById(req.params.ar_id).then((bid) =>{
        if(bid){
            Bid.deleteBid(req.params.ar_id).then(() => {
                res.status(200).end();
            });
        }else{
            res.status(404).send("BID NOT FOUND");
        }
    });
});
*/

router.use("/", auth.checkAuth);

router.post("/", (req, res) => {
  const bid = {
    user_id: req.user.uid,
    auc_id: req.body.auc_id,
    amount: req.body.amount,
    time: req.body.time, //nodejs server time iso8601
  };
  //   Bid.createBid(bid).then(() => {
  //     res.status(201).end();
  //   });
  Joi.validate(bid, schemas.bid).then(
    (data) => {
      Bid.createBid(data).then(
        () => {
          res.status(201).end();
        },
        (err) => {
          res.status(400).send(err.details[0].message);
        }
      );
    },
    (err) => {
      res.status(400).send(err.details[0].message);
    }
  );
});
/*
router.put("/:ar_id", (req, res) => {
    Bid.updateBid(req.params.ar_id, req.body).then((info) => {
        res.status(200).json(info);
    });
});
*/
module.exports = router;
