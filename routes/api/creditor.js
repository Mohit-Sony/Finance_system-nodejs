const express = require('express');
const routes = express.Router();
const passport = require('passport');

const creditorController = require("../../controllers/api/creditor-api")

routes.get('/',creditorController.list);
routes.get('/profile/:id',creditorController.profile);
routes.get('/profile/:id/edit-profile',creditorController.edit_profile);
routes.post('/new-info-init',creditorController.post_new_info_init);
routes.post('/profile/:id/post-init-credit-fixed',creditorController.post_credit_init_fixed_amount);
routes.post('/profile/:id/edit-profile',creditorController.edit_info_req);
routes.post('/profile/:id/make-payment',creditorController.make_payment);


module.exports = routes;