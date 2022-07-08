const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const port = 8080;

dotenv.config();
const app = express();

mongoose.connect(process.env.DATABASE, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Everything is okay");
  }
});

//middleware use
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const ownerRoutes = require("./routes/owner");
const userRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/review");
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", ownerRoutes);
app.use("/api", userRoutes);
app.use("/api", reviewRoutes);

app.listen(process.env.PORT || port, (err) => {
  if (err) {
    console.log(err);
  } else console.log(`server is running on ${port}`);
});
