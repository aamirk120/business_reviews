const MODULE_NAME = '[JWT]';
const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  const { JWT_SECRET, JWT_EXPIRY } = process.env;

  let options = {
    expiresIn: JWT_EXPIRY
  };

  user.id = user._id
  delete user.password
  return jwt.sign(user, JWT_SECRET, options);
};

exports.validateToken = async (request, res, next) => {
  try {
    const { JWT_SECRET } = process.env;

    let bearerToken = request.headers.authorization;

    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      return res.status(401).send({
        error: "authorization token not provided"
      })
    }

    bearerToken = bearerToken.split(' ')[1];

    const decodedToken = jwt.verify(bearerToken, JWT_SECRET);

    request.user = decodedToken
    next();

  } catch (err) {
    console.log(err);
    next(err);
  }
};
