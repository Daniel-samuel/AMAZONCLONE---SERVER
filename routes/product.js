const router = require("express").Router();
const Product = require("../models/product");
const upload = require("../middlewares/upload-photo");

// POST request - create a new project
router.post("/products", upload.single("photo"), async (req, res) => {
  try {
    let product = new Product();
    product.ownerID = req.body.ownerID;
    product.categoryID = req.body.categoryID;
    product.title = req.body.title;
    product.description = req.body.description;
    product.photo = req.file.location;
    product.price = req.body.price;
    product.stockQuantity = req.body.stockQuantity;

    await product.save();

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

//GET all products
router.get("/products", async (req, res) => {
  try {
    let products = await Product.find({}).populate("owner category").exec();

    res.json({
      status: true,
      products: products,
    });
  } catch (err) {
    res.json({
      status: false,
      massage: err.massage,
    });
  }
});

//GET single product
router.get("/products/:id", async (req, res) => {
  try {
    let product = await Product.findOne({ _id: req.params.id })
      .populate("owner category")
      .exec();

    res.json({
      status: true,
      product: product,
    });
  } catch (err) {
    res.json({
      status: false,
      massage: err.massage,
    });
  }
});

//PUT request for updating a single product
router.put("/products/:id", upload.single("photo"), async (req, res) => {
  try {
    let product = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          price: req.body.price,
          category: req.body.categoryID,
          photo: req.file.location,
          description: req.body.description,
          owner: req.body.ownerID,
          stockQuantity: req.body.stockQuantity,
        },
      },
      { upsert: true }
    );
    res.json({
      status: true,
      updatedproduct: product,
    });
  } catch (err) {
    res.json({
      status: false,
      massage: err.massage,
    });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    let product = await Product.findOneAndDelete({ _id: req.params.id });

    if (product) {
      res.json({
        status: true,
        massage: "successfully deleted",
      });
    }
  } catch (err) {
    res.json({
      status: false,
      massage: err.massage,
    });
  }
});

module.exports = router;
