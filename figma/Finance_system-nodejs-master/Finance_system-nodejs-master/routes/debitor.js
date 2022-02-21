const express = require('express');
const routes = express.Router();

const debitorController = require("../controllers/debitor-controller")

routes.get('/',debitorController.list);
routes.get('/profile/',debitorController.profile);
routes.get('/edit-profile',debitorController.edit);
routes.get('/init',debitorController.initialise);
// routes.get('/',debitorController.)

module.exports = routes;