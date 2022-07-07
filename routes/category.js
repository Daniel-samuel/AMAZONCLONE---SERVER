const router = require("express").Router();
const Category = require("../models/category");
const { route } = require("./product");

router.post("/category", async (req, res) => {
  try {
    let category = new Category();
    category.type = req.body.type;

    await category.save();
    res.json({
      status: true,
      message: "successfully saved",
    });
  } catch (err) {
    res.json({
      status: false,
      message: err.message,
    });
  }
});

router.get("/category", async (req, res) => {
  try {
    let categories = await Category.find({});

    res.json({
      status: true,
      categories: categories,
    });
  } catch (err) {
    res.json({
      status: false,
      massage: err.massage,
    });
  }
});

module.exports = router;
