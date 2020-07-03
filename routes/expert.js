const express = require("express");
const router = express.Router();
const Expert = require("../db/queries/expert.js");
const auth = require("../firebase/authorization");

router.use(auth.checkAuth);


router.post("/", (req, res) => {
  const expert = {
    name: req.body.name,
    last_name: req.body.last_name,
    category: req.body.category,
  }; 
  Expert.createExpert(expert).then(() => {
    res.status(201).end();
  });
});


router.delete("/:id", (req, res) => {
    Expert.getExpertById(req.params.id).then((expert) => {
        if(expert){
            Expert.deleteExpert(req.params.id).then(() => {
                res.status(200).end();
            });
        }else{
            res.status(404).send("EXPERT NOT FOUND");
        }
    });
  });
  

router.get("/:id", (req, res) => {
  Expert.getExpertById().then((expert) => {
    if(expert){
      res.status(200).json(expert);
    }else{
      res.status(404).send("EXPERT NOT FOUND");
    }
  });
});


router.delete("/:id", (req, res) => {
    Expert.getExpertById(req.params.id).then((expert) => {
      if(expert){
        Expert.deleteExpert(req.params.id).then(() => {
          res.status(200).end();
  
        });
      }else{
        res.status(404).send("EXPERT NOT FOUND");
      }
    });
  });
  
router.put("/:id", (req, res) => {
  Expert.updateExpert(req.params.id, req.body).then((info) => {
    res.status(200).json(info);
  });
});

module.exports = router;
