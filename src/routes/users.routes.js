const {Router} = require('express');
const usersRoutes = Router();

const UsersController = require("../controllers/UsersController.js");
const usersController = new UsersController;

function myMiddleware(request, response, next) {
  if(!request.body.isAdmin) {
    return response.json({"message": "User unauthorized."});
  };

  next();
};
// usersRoutes.use(myMiddleware); // For all routes

usersRoutes.post("/", myMiddleware, usersController.create);
usersRoutes.put("/:id", usersController.update);

module.exports = usersRoutes;