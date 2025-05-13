function verifyAdmin(req, res, next) {
  console.log(req.user.roles);
    if (req.user?.roles !== "admin") {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
  }
  module.exports = verifyAdmin;