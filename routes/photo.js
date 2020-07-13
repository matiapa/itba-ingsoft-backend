const express = require("express");
const router = express.Router();
const auth = require("../firebase/authorization");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mv = require('mv');
const Photo = require('../db/queries/photo');

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .send(err)
    .end();
};

const upload = multer({
  dest: "/tmp"
});

const photoDir = path.join(__dirname, "../uploads/");

const deleteTmp = (file, callback) => {
  fs.unlink(file, (err) => {        
    callback(err);
  });
};

router.get("/:id.jpg", async (req, res) => {
  var photo = await Photo.getPhoto(req.params.id);
  res.write(photo.data, 'binary');
  res.end(null, 'binary');
});

router.post("/", auth.checkAuth, upload.single("image"), (req, res) => {
    const tempPath = req.file.path;
    if (!fs.existsSync(photoDir)){
      fs.mkdirSync(photoDir);
    }
    if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
      Photo.addPhoto(req.user.uid, tempPath).then((id) => {
        id = id[0];
        res.status(201).send({id: id});
      }).catch((err) => {
        console.log(err);
        deleteTmp(tempPath, (e) => {
          return handleError(e ? e : err, res);
        });
      });
    } else {
      deleteTmp(tempPath, (e) => {
        if (e)
          return handleError(e, res);
        else
          res.status(403).end("Only .jpg files are allowed!");
      });
    }
  }
);

router.delete("/:id", auth.checkAuth, (req, res) => {
  const id = req.params.id;
  const path = photoDir + id + ".jpg";
  Photo.searchPhoto(id).then((photo) => {
    if(photo.owner_id == req.user.uid)
      fs.unlink(path, (err) => {
        if(err)
          handleError(err, res);
        else
          Photo.deletePhoto(id).then(() => {
            res.status(201).end();
          });
      });
    else
      res.status(403).end();
  }, (err) => {
    console.log(err);
    res.status(404).end();
  });
});

module.exports = router;
