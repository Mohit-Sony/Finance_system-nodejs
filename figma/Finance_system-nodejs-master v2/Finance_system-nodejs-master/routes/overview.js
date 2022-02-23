const express = require('express');
const routes = express.Router();

const overviewController = require("../controllers/overview-controller")

routes.get('/',overviewController.list);

module.exports = routes;