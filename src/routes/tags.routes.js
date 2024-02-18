const {Router} = require('express');
const tagsRoutes = Router();

const TagsController = require("../controllers/TagsController.js");
const tagsController = new TagsController();

tagsRoutes.get("/", tagsController.index);
tagsRoutes.get("/:movie_id", tagsController.show);
tagsRoutes.delete("/:tag_id", tagsController.delete);

module.exports = tagsRoutes;