const express = require("express");
const router = express.Router();
const Auction = require("../db/queries/auction.js");


router.get("/:id", (req, res) => {  
  Auction.getAutionById(req.params.id).then((auction) => {
    if(auction){
      res.status(200).json(auction);
    }else {
      res.status(404).send("AUCTION NOT FOUND");
    }
  });
});

router.post("/:id", (req, res) => {
  const auction = {
    id: req.params.id,
    category: req.body.category,
    name: req.body.name
  }; 
  Auction.createAuction(auction).then(() => {
    res.status(201).end();
  });
});


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

router.put("/:id", (req, res) => {
  Auction.updateAuction(req.params.id, req.body).then((info) => {
    res.status(200).json(info);
  });
});



module.exports = router;

