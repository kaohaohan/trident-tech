const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

exports.verifyToken = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.split(" ")[1]; // Bearer xxx

  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, payload) => {
    if (err) return res.sendStatus(401);
    req.user = payload; // { id, role }
    next();
  });
};
