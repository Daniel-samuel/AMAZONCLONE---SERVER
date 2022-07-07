const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verify-token");

// Sign up route
router.post("/auth/signup", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({
      status: false,
      message: "Emall and password required",
    });
  } else {
    try {
      let user = new User();
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;
      await user.save();
      let token = jwt.sign(user.toJSON(), process.env.SECRET, {
        expiresIn: 1004800, //1week
      });
      res.json({
        success: true,
        token: token,

        message: "Successfully created a new user",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
});

// login route
router.post("/auth/login", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(403).json({
        success: false,
        message: "Authentication failed , User not found",
      });
    } else {
      if (user.comparePassword(req.body.password)) {
        let token = jwt.sign(user.toJSON(), process.env.SECRET, {
          expiresIn: 604800, //1week
        });
        res.json({ success: true, token: token });
      } else {
        res.status(403).json({
          success: false,
          message: "Authentication failed , Wrong password!",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//  profile route
router.get("/auth/user", verifyToken, async (req, res) => {
  try {
    let Users = await User.findOne({ _id: req.decoded._id });
    if (Users) {
      console.log(Users);
      res.json({
        success: true,
        user: Users,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
// update profile
router.put("/auth/user", verifyToken, async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.decoded._id });
    console.log("decoded", req.decoded, "user:", user);

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;

    await user.save();
    res.json({
      success: true,
      message: "Successfully Updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// router.put("/auth/user", verifyToken, async (req, res) => {
//   console.log("here");
//   try {
//     let foundUser = await User.findOne({ _id: req.decoded._id });
//     if (foundUser) {
//       console.log("here1");
//       if (req.body.name) foundUser = req.body.name;
//       if (req.body.email) foundUser = req.body.email;
//       if (req.body.password) foundUser = req.body.password;
//       await foundUser.save();
//       res.json({
//         success: true,
//         message: "successfully updated",
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

module.exports = router;
