const express = require('express');
const routes = express.Router();

const debitorController = require("../controllers/debitor-controller")

routes.get('/',debitorController.list);
routes.get('/profile/:id',debitorController.profile);
routes.get('/edit-profile',debitorController.edit);
routes.get('/init',debitorController.initialise);
routes.get('/new',debitorController.new_debitor);
routes.post('/new-info-init',debitorController.post_new_info_init);
routes.post('/post-init-debit',debitorController.post_debit_init);
// routes.get('/',debitorController.)

module.exports = routes;