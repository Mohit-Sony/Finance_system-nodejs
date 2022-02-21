const express = require('express');
const routes = express.Router();

const creditorController = require("../controllers/creditor-controller")

routes.get('/',creditorController.list);
routes.get('/profile/',creditorController.profile);
routes.get('/edit-profile',creditorController.edit_profile);
routes.get('/init',creditorController.initialise);

module.exports = routes;