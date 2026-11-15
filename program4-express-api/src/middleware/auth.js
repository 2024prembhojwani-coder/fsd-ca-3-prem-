// JWT authentication middleware
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    const err = new Error("Missing or malformed Authorization header");
    err.status = 401;
    return next(err);
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    const err = new Error("Invalid or expired token");
    err.status = 401;
    next(err);
  }
};
