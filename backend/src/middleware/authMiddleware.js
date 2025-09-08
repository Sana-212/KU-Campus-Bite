const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // 1) get token
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, msg: "No token,please login" });
    }
    // 2) verify token (throws if invalid/expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) attach user info and continue
    req.user = decoded;
    next();
  } catch (error) {
    // handle invalid/expired token
    return res
      .status(403)
      .json({ success: false, msg: "Invalid or expired token" });
  }
};

module.exports=authMiddleware;
