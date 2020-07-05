const express = require("express");

const router = express.Router();
const Lot = require("../db/queries/lot.js");
router.post("/notifications", (req, res) => {
  res.status(201).json(req.query).end();
  Lot.postPhoto({ lot_id: 1, photo_id: 2 });
  console.log("MP NOTIFICATION");
});

module.exports = router;
