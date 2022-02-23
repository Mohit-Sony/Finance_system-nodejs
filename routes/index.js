const express = require('express');

const routes = express.Router();
const homeController = require("../controllers/home-controller")
const loginController = require("../controllers/login-controller");


routes.get('/',homeController.home);
routes.use('/login',loginController.login );
routes.use("/user",require('./user'));

// routes.use('/user', require(''));
routes.use('/admin',require('./admin'));
routes.use('/debitor', require('./debitor'));
routes.use('/creditor', require('./creditor'));
routes.use('/overview', require('./overview'));
routes.use('/transactions',require('./transactions'));
routes.use('/statistics',require('./statistics'));




module.exports = routes;

