const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === "mysecrettoken") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = auth;
