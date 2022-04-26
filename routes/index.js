const express = require('express');
const passport = require('passport');

const routes = express.Router();
const homeController = require("../controllers/home-controller")
const loginController = require("../controllers/login-controller");

routes.use('/api',require('./api/index'));
routes.get('/',homeController.home);
routes.use('/login',loginController.login );
routes.use("/user",require('./user'));

// routes.use('/user', require(''));
routes.use('/admin',require('./admin'));
routes.use('/debitor',passport.checkAuthentication, require('./debitor'));
routes.use('/creditor',passport.checkAuthentication, require('./creditor'));
routes.use('/overview',passport.checkAuthentication, require('./overview'));
routes.use('/transactions',passport.checkAuthentication ,require('./transactions'));
routes.use('/statistics',passport.checkAuthentication ,require('./statistics'));




module.exports = routes;

