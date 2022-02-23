const express = require('express');
const routes = express.Router();

const statisticsController = require("../controllers/statistics-controller");

routes.get('/',statisticsController.list);

module.exports = routes;