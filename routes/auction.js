const express = require("express");
const router = express.Router();
const Auction = require("../db/queries/auction.js");
const auth = require("../firebase/authorization");
const schemas = require("../db/schemas.js");
const Joi = require("joi");
const Bid = require("../db/queries/bid.js");

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
router.get("/bidding", auth.checkAuth);
router.get("/bidding", (req, res) => {
  Auction.getAuctionsBiddingOn(req.user.uid).then((data) => {
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).send("AUCTION NOT FOUND");
    }
  });
});

router.get("/list", (req, res) => {
  Joi.validate(req.query, schemas.auction_list).then(
    (data) => {
      var sort = data.sort;
      var result;
      switch (sort) {
        case "popularity":
          Auction.getAuctionsOrderByPopularity(
            data.category,
            data.offset,
            data.limit
          ).then(
            (auctions) => {
              res.status(200).json(auctions);
            },
            (err) => {
              res.status(404).send("AUCTION NOT FOUND");
            }
          );

          break;
        case "creation_date":
          Auction.getAuctionsOrderByCreationDate(
            data.category,
            data.offset,
            data.limit
          ).then(
            (auctions) => {
              res.status(200).json(auctions);
            },
            (err) => {
              res.status(404).send("AUCTION NOT FOUND");
            }
          );
          break;
        case "deadline":
          Auction.getAuctionsOrderByDeadline(
            data.category,
            data.offset,
            data.limit
          ).then(
            (auctions) => {
              res.status(200).json(auctions);
            },
            (err) => {
              res.status(404).send("AUCTION NOT FOUND");
            }
          );
          break;
      }
    },

    (err) => {
      res.status(400).send(err.details[0].message);
    }
  );
});
// router.get("/list", (req, res) => {
//   Joi.validate(req.query, schemas.auction_list).then(
//     (data) => {
//       Auction.getAuctions().then(
//         (auctions) => {
//           if (auctions) {
//             Auction.sort(auctions, data.category, data.sort).then(
//               (sorted) => {
//                 if (data.filter != null && data.filter == "bidding") {
//                   Auction.filterBiddingOn(sorted, data.user.uid).then(
//                     (filtered) => {
//                       res.status(200).json(filtered);
//                     }
//                   );
//                 } else {
//                   res.status(200).json(sorted);
//                 }
//               },
//               (err) => {
//                 res.status(400).send(err.details[0].message);
//               }
//             );
//           } else {
//             res.status(404).send("AUCTIONS NOT FOUND");
//           }
//         },
//         (err) => {
//           res.status(400).send(err.details[0].message);
//         }
//       );
//     },

//     (err) => {
//       res.status(400).send(err.details[0].message);
//     }
//   );
// });

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

router.use("/:id/bid", auth.checkAuth);

router.post("/:id/bid", (req, res) => {
  const bid = {
    user_id: req.user.uid,
    auc_id: req.params.id,
    amount: req.body.amount,
    time: new Date(), //nodejs server time iso8601
  };
  Joi.validate(bid, schemas.bid).then(
    (data) => {
      Bid.createBid(data).then(
        () => {
          res.status(201).end();
        },
        (err) => {
          res.status(400).send(err.detail);
        }
      );
    },
    (err) => {
      res.status(400).send(err.details[0].message);
    }
  );
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
