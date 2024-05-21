// middlewares/firebaseAuth.js

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader.startswith('Bearer ')) {
    return res.status(401).send('Unauthorized');
  }
    next();
};