const express = require('express');
const routes = express.Router();
const passport = require('passport');
const userController = require('../controllers/user-controller');


routes.get('/',function(req,res){
    res.end('in user');
});
routes.get('/sign-in',userController.sign_in);
routes.get('/sign-up',userController.sign_up);
routes.get('/sign-out',userController.log_out);
routes.get('/profile',passport.checkAuthentication ,userController.profile);
routes.get('/initialise-money',passport.checkAuthentication,userController.initialise_money);
routes.post('/create-user',userController.create_user);
routes.post('/init-money',passport.checkAuthentication,userController.init_money);
routes.post('/withdraw-money',passport.checkAuthentication,userController.withdraw_money);
routes.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect : '/user/sign-in'},
    ) ,userController.create_session)
;

routes.get('/log-out',userController.log_out);




module.exports = routes;

