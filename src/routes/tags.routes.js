const {Router} = require('express');
const tagsRoutes = Router();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const TagsController = require("../controllers/TagsController.js");
const tagsController = new TagsController();

tagsRoutes.use(ensureAuthenticated);
tagsRoutes.get("/", tagsController.index);
tagsRoutes.get("/:movie_id", tagsController.show);
tagsRoutes.delete("/:tag_id", tagsController.delete);

module.exports = tagsRoutes;