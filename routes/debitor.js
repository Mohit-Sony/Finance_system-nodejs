const express = require('express');
const routes = express.Router();
const passport = require('passport');

const debitorController = require("../controllers/debitor-controller")

routes.get('/',debitorController.list);
routes.get('/profile/:id',debitorController.profile);
routes.get('/profile/:id/edit-profile',debitorController.edit);
routes.get('/init',debitorController.initialise);
routes.get('/new',debitorController.new_debitor);
routes.post('/new-info-init',debitorController.post_new_info_init);
routes.post('/profile/:id/post-init-debit',debitorController.post_debit_init);
routes.post('/profile/:id/make-payment',debitorController.make_payment);
routes.post('/profile/:id/edit-profile',debitorController.edit_info_req);

// routes.get('/',debitorController.)

module.exports = routes;