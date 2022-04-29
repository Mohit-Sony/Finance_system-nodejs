const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractionJWT = require('passport-jwt').ExtractJwt;
const env = require('./environment');

const User = require('./../models/user');

//encrypt the text
let opts = {
    jwtFromRequest: ExtractionJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.JWT_key
}

passport.use(new JWTstrategy(opts , function(jwtPayLoad , done){
    User.findById(jwtPayLoad._id , function(err,user){
        if(err){
            console.log(`error in finding user from JWT`);
            return;
        }
        if(user){
            return done(null,user);
        }else{
            return done(null , false);
        }
    })

}));


//check if the user is authenticated
passport.checkAuthentication = function(req,res,next){
    //if the user is signed in,then pass on the request to the next function (controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    //if the user is not signed in
    return res.redirect('/user/sign-in');


}

//add authenticated user data into locals
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session and we are just sending it to locals to the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport ;