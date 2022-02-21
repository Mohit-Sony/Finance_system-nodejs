const express = require('express');
const routes = express.Router();

const homeController = require("../controllers/home-controller")

routes.get('/',homeController.home);

module.exports = routes;