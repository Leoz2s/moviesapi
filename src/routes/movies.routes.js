const {Router} = require('express');
const moviesRoutes = Router();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const MoviesController = require("../controllers/MoviesController.js");
const moviesController = new MoviesController();

moviesRoutes.use(ensureAuthenticated);
moviesRoutes.post("/", moviesController.create);
moviesRoutes.put("/", moviesController.update);
moviesRoutes.get("/:movie_id", moviesController.show);
moviesRoutes.get("/", moviesController.index);
moviesRoutes.delete("/:movie_id", moviesController.delete);

module.exports = moviesRoutes;