const express = require('express');
const passport = require('passport');

const routes = express.Router();
const dataController = require("../../controllers/api/debitor-api");
// const loginController = require("../controllers/login-controller");

// routes.use('/api',require('./api/index'));
// routes.get('/',homeController.home);
// routes.use('/login',loginController.login );
// routes.use("/user",require('./user'));

// routes.use('/user', require(''));
// routes.use('/admin',require('./admin'));
// routes.use('/debitor',passport.checkAuthentication, require('./debitor'));
// routes.use('/creditor',passport.checkAuthentication, require('./creditor'));
routes.get('/overview', passport.authenticate('jwt',{session:false}) ,dataController.overview);
routes.get('/debitor-list',passport.authenticate('jwt',{session:false}) ,dataController.debitors_list);
routes.get('/creditor-list',passport.authenticate('jwt',{session:false}) , dataController.creditors_list);
routes.get('/debitor-profile',passport.authenticate('jwt',{session:false}) ,dataController.debitor_profile);
// routes.use('/transactions',passport.checkAuthentication ,require('./transactions'));
// routes.use('/statistics',passport.checkAuthentication ,require('./statistics'));
routes.use('/user',require('./user'));
routes.use('/creditor',passport.authenticate('jwt',{session:false}) ,require('./creditor'));





module.exports = routes;

