const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  let checkBearer = "Bearer";
  if (!req.headers.authorization.startsWith(checkBearer)) {
    res.json({
      success: false,
      message: 'Authorization should be in this format: "Bearer token"',
    });
  }

  token = req.headers.authorization.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        console.log("Failed to auth:", err);
        res.json({
          success: false,
          message: "Failed to Authenticate",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.json({
      success: false,
      message: "No token Provided",
    });
  }
};
