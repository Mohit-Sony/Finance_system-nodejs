const express = require('express');
const routes = express.Router();
const passport = require('passport');
const userController = require('../controllers/user-controller');


routes.get('/',function(req,res){
    res.end('in user');
});
routes.get('/sign-in',userController.sign_in);
routes.get('/sign-up',userController.sign_up);
routes.get('/sign-out',userController.user);
routes.get('/profile',passport.checkAuthentication ,userController.profile);
routes.post('/create-user',userController.create_user);

routes.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect : 'user/sign-in'},
    ) ,userController.create_session)
;

routes.get('/log-out',userController.log_out);




module.exports = routes;

