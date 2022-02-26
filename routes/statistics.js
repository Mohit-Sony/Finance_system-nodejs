const express = require('express');
const routes = express.Router();
const passport = require('passport');

const statisticsController = require("../controllers/statistics-controller");

routes.get('/',statisticsController.list);

module.exports = routes;