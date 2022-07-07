const router = require("express").Router();
const Review = require("../models/review");
const Product = require("../models/product");
const verifyToken = require("../middlewares/verify-token");
const upload = require("../middlewares/upload-photo");

router.post(
  "/reviews/:productID",
  verifyToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      let review = new Review();
      (review.headline = req.body.headline), (review.body = req.body.boby);
      review.rating = req.body.rating;
      review.photo = file.location;
      review.productID = req.params.productID;
      review.user = req.decoded._id;

      await Product.update({ $push: review._id });

      const saveReview = await review.save();

      if (saveReview) {
        res.json({
          success: true,
          message: "Successfully Added a review",
        });
      }
    } catch {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

router.get("/review/:productID", async (req, res) => {
  try {
    const productReviews = await Review.find({
      productID: req.params.productID,
    })
      .populate("user")
      .exec();

    res.json({
      success: true,
      reviews: productReviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = router;
