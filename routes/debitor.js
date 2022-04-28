const express = require('express');
const routes = express.Router();
const passport = require('passport');

const debitorController = require("../controllers/debitor-controller")

routes.get('/',debitorController.list);
routes.get('/profile/:id',debitorController.profile);
routes.get('/profile/:id/edit-profile',debitorController.edit);
routes.get('/profile/:id/close-account',debitorController.close_debitor);
routes.get('/profile/:id/revoke-account',debitorController.revoke_debitor);
routes.get('/init',debitorController.initialise);
routes.get('/new',debitorController.new_debitor);
routes.post('/new-info-init',debitorController.post_new_info_init);
routes.post('/profile/:id/post-init-debit',debitorController.post_debit_init);
routes.post('/profile/:id/make-payment',debitorController.make_payment);
routes.post('/profile/:id/edit-profile',debitorController.edit_info_req);
routes.get('/asdf',debitorController.data);
routes.get('/close-debit/:id',debitorController.close_debit);
routes.get('/reopen-debit/:id',debitorController.reopen_debit);

// routes.get('/',debitorController.)

module.exports = routes;