const AppError = require("../utils/AppError.js");

class UsersController {
  create(request, response) {
    const {name, email, password} = request.body;

    if(!name){
      throw new AppError("Name is obligatory.");
    };

    response.status(201).json({name, email, password});
  };
};

module.exports = UsersController;