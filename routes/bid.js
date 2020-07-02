const express = require("express");
const router = express.Router();
const Bid = require("../db/queries/bid.js");
const auth = require("../firebase/authorization");

router.use(auth.checkAuth);

router.get("/:user_id", (req, res) => {
  Bid.getBidByUserId(req.params.user_id).then((bid) => {
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

router.post("/", (req, res) => {
  const bid = {
    user_id: req.user.uid,
    auc_id: req.body.auc_id,
    amount: req.body.amount,
    time: req.body.time, //nodejs server time iso8601
  };
  Bid.createBid(bid).then(() => {
    res.status(201).end();
  });
});
/*
router.put("/:ar_id", (req, res) => {
    Bid.updateBid(req.params.ar_id, req.body).then((info) => {
        res.status(200).json(info);
    });
});
*/
module.exports = router;
