const express = require("express");
const router = express.Router();
const Auction = require("../db/queries/auction.js");
const auth = require("../firebase/authorization");


router.use(auth.checkAuth);



router.post("/", (req, res) => {
  const auction = {
    category: req.body.category,
    name: req.body.name
  }; 
  Auction.createAuction(auction).then(() => {
    res.status(201).end();
  });
});


router.get("/:id", (req, res) => {
  Auction.getAuctionById().then((auction) => {
    if(auction){
      res.status(200).json(auction);
    }else{
      res.status(404).send("AUCTION NOT FOUND");
    }
  });
});

router.get("/:owner_id", (req, res) => {  
  Auction.getAuctionByOwnerId(req.params.owner_id).then((auction) => {
    if(auction){
      res.status(200).json(auction);
    }else {
      res.status(404).send("AUCTION NOT FOUND");
    }
  });
});

router.get("/:category/:offset/:limit", (req, res) => {
  Auction.getAuctionsOrderByDeadline(req.params.category, req.params.offset, req.params.limit)
  .then((auctions) => {
    if(auctions){
      res.status(200).json(auctions);
    }else{
      res.status(404).send("AUCTIONS NOT FOUND");
    }
  });
});

router.get("/:category/:offset/:limit", (req, res) => {
  Auction.getAuctionsOrderByPopularity(req.params.category, req.params.offset, req.params.limit)
  .then((auctions) => {
    if(auctions){
      res.status(200).json(auctions);
    }else{
      res.status(404).send("AUCTIONS NOT FOUND");
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
