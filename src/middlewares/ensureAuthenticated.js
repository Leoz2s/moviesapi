const AppError = require("../utils/AppError");
const {verify} = require('jsonwebtoken');
const authConfig = require("../configs/auth");

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  if(!authHeader) {
    throw new AppError("JWT token not informed", 401);
  };

  try {
    const [, token] = authHeader.split(" ");
    const {sub: user_id} = verify(token, authConfig.jwt.secret);

    request.user = { id: Number(user_id), };

    return next();
  } catch {
    throw new AppError("Invalid JWT token", 401);
  };

};

module.exports = ensureAuthenticated;