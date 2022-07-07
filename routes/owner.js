const router = require("express").Router();
const { json } = require("body-parser");
const Owner = require("../models/owner");
const upload = require("../middlewares/upload-photo");
const product = require("../models/product");

router.post("/owner", upload.single("photo"), async (req, res) => {
  try {
    let owners = new Owner();
    owners.name = req.body.name;
    owners.about = req.body.about;
    owners.photo = req.file.location;
    await owners.save();

    res.json({
      status: true,
      massage: "successfully saved",
    });
  } catch (err) {
    res.json({
      status: false,
      massage: err.massage,
    });
  }
});

router.get("/owner", async (req, res) => {
  try {
    let owners = await Owner.find({});

    res.json({
      status: true,
      owners: owners,
    });
  } catch (err) {
    res.json({
      status: false,
      massage: err.massage,
    });
  }
});

module.exports = router;
