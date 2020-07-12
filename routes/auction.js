const express = require("express");
const router = express.Router();
const Auction = require("../db/queries/auction.js");
const auth = require("../firebase/authorization");
const schemas = require("../db/schemas.js");
const Joi = require("joi");
const Bid = require("../db/queries/bid.js");
const Lot = require("../db/queries/lot.js");

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
  Auction.getAuctionsBiddingOn(
    req.user.uid,
    req.query.offset,
    req.query.limit
  ).then(
    async (auctions) => {
      var result = await Promise.all(
        auctions.map(async (auction) => {
          var photos = await Lot.getPhotos(auction.lot_id);
          var photos_ids = photos.map((element) => element.photo_id);
          if (photos) {
            const info = {
              owner_id: auction.owner_id,
              lot_id: auction.lot_id,
              name: auction.name,
              description: auction.description,
              state: auction.state,
              category: auction.category,
              initial_price: auction.initial_price,
              quantity: auction.quantity,
              creation_date: auction.creation_date,
              deadline: auction.deadline,
              photos_ids: photos_ids,
            };
            console.log(info);
            return info;
          } else {
            return auction;
          }
        })
      );

      res.status(200).json(result);
    },
    (err) => {
      res.status(404).send("AUCTION NOT FOUND");
    }
  );
});

router.get("/list", (req, res) => {
  Joi.validate(req.query, schemas.auction_list).then(
    (data) => {
      var sort = data.sort;

      switch (sort) {
        case "popularity":
          Auction.getAuctionsOrderByPopularity(
            data.category,
            data.offset,
            data.limit
          ).then(
            async (auctions) => {
              var result = await Promise.all(
                auctions.map(async (auction) => {
                  var photos = await Lot.getPhotos(auction.lot_id);
                  var photos_ids = photos.map((element) => element.photo_id);
                  if (photos) {
                    const info = {
                      owner_id: auction.owner_id,
                      lot_id: auction.lot_id,
                      name: auction.name,
                      description: auction.description,
                      state: auction.state,
                      category: auction.category,
                      initial_price: auction.initial_price,
                      quantity: auction.quantity,
                      creation_date: auction.creation_date,
                      deadline: auction.deadline,
                      photos_ids: photos_ids,
                    };
                    console.log(info);
                    return info;
                  } else {
                    return auction;
                  }
                })
              );

              res.status(200).json(result);
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
            async (auctions) => {
              var result = await Promise.all(
                auctions.map(async (auction) => {
                  var photos = await Lot.getPhotos(auction.lot_id);
                  var photos_ids = photos.map((element) => element.photo_id);
                  if (photos) {
                    const info = {
                      owner_id: auction.owner_id,
                      lot_id: auction.lot_id,
                      name: auction.name,
                      description: auction.description,
                      state: auction.state,
                      category: auction.category,
                      initial_price: auction.initial_price,
                      quantity: auction.quantity,
                      creation_date: auction.creation_date,
                      deadline: auction.deadline,
                      photos_ids: photos_ids,
                    };
                    console.log(info);
                    return info;
                  } else {
                    return auction;
                  }
                })
              );

              res.status(200).json(result);
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
            async (auctions) => {
              var result = await Promise.all(
                auctions.map(async (auction) => {
                  var photos = await Lot.getPhotos(auction.lot_id);

                  if (photos) {
                    var photos_ids = photos.map((element) => element.photo_id);

                    const info = {
                      owner_id: auction.owner_id,
                      lot_id: auction.lot_id,
                      name: auction.name,
                      description: auction.description,
                      state: auction.state,
                      category: auction.category,
                      initial_price: auction.initial_price,
                      quantity: auction.quantity,
                      creation_date: auction.creation_date,
                      deadline: auction.deadline,
                      photos_ids: photos_ids,
                    };
                    console.log(info);
                    return info;
                  } else {
                    return auction;
                  }
                })
              );

              res.status(200).json(result);
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
  Auction.getAuctionById(req.params.id).then(
    async (auctions) => {
      var result = await Promise.all(
        auctions.map(async (auction) => {
          var photos = await Lot.getPhotos(auction.lot_id);
          var photos_ids = photos.map((element) => element.photo_id);
          if (photos) {
            const info = {
              owner_id: auction.owner_id,
              lot_id: auction.lot_id,
              name: auction.name,
              description: auction.description,
              state: auction.state,
              category: auction.category,
              initial_price: auction.initial_price,
              quantity: auction.quantity,
              creation_date: auction.creation_date,
              deadline: auction.deadline,
              photos_ids: photos_ids,
            };
            console.log(info);
            return info;
          } else {
            return auction;
          }
        })
      );

      res.status(200).json(result);
    },

    (err) => {
      res.status(404).send("AUCTION NOT FOUND");
    }
  );
});

router.get("/byUser/:uid", (req, res) => {
  Auction.getAuctionByOwnerId(req.params.uid).then(
    async (auctions) => {
      var result = await Promise.all(
        auctions.map(async (auction) => {
          var photos = await Lot.getPhotos(auction.lot_id);
          var photos_ids = photos.map((element) => element.photo_id);
          if (photos) {
            const info = {
              owner_id: auction.owner_id,
              lot_id: auction.lot_id,
              name: auction.name,
              description: auction.description,
              state: auction.state,
              category: auction.category,
              initial_price: auction.initial_price,
              quantity: auction.quantity,
              creation_date: auction.creation_date,
              deadline: auction.deadline,
              photos_ids: photos_ids,
            };
            console.log(info);
            return info;
          } else {
            return auction;
          }
        })
      );

      res.status(200).json(result);
    },

    (err) => {
      res.status(404).send("AUCTION NOT FOUND");
    }
  );
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
      Bid.getBidsByAuctionId(data.auc_id).then(
        (bids) => {
          // if (bids.length > 0 && bids[0].user_id == bid.user_id) {
          //   res.status(400).send("USER HAS ALREADY THE HIGHEST BID");
          // } else
          if (
            bids.length == 0 ||
            (bids.length > 0 && bids[0].amount < bid.amount)
          ) {
            Bid.createBid(bid).then(
              (bid) => {
                bid = bid[0];
                res.status(201).end();
                io.to(bid.auc_id).emit("bidPublished", bid.amount);
              },
              (err) => {
                res.status(400).send(err.detail);
              }
            );
          } else {
            res.status(400).send("AMOUNT IS NOT HIGHER THAN HIGHEST BID");
          }
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

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

var io;

module.exports = function (server) {
  io = require("socket.io")(server).of("/auction");
  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      // console.log("user disconnected");
    });
    socket.on("subscribe", function (msg) {
      socket.join(msg);
      // console.log(msg);
    });
  });
  return router;
};
