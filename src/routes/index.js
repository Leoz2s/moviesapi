const {Router} = require("express");
const routes = Router();

const usersRoutes = require("./users.routes.js");
const sessionsRoutes = require("./sessions.routes.js");
const moviesRoutes = require("./movies.routes.js");
const tagsRoutes = require("./tags.routes.js");

const uploadConfig = require("../configs/upload");
const express = require('express');

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/movies", moviesRoutes);
routes.use("/tags", tagsRoutes);

routes.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

module.exports = routes;