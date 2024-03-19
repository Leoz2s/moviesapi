const kenx = require("../database/knex");
const AppError = require("../utils/AppError");
const {compare} = require('bcryptjs');

const authConfig = require("../configs/auth");
const {sign} = require('jsonwebtoken');

class SessionsController {
  async create(request, response) {
    const {email, password} = request.body;

    if(!email || !password) {
      throw new AppError("You need to insert the e-mail and password to Login.", 400);
    };

    const user = await kenx("users").where({email}).first();
    if(!user) {
      throw new AppError("Wrong e-mail and/or password.", 400);
    };

    const passwordsMatched = await compare(password, user.password);
    if(!passwordsMatched) {
      throw new AppError("Wrong e-mail and/or password.", 400);
    };

    const {secret, expiresIn} = authConfig.jwt;
    const token = sign(
      {}, secret, {
      subject: String(user.id),
      expiresIn
    });

    return response.json({user, token});
  };
};

module.exports = SessionsController;