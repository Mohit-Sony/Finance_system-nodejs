const express = require('express');
const passport = require('passport')
const router = express.Router();
const userapi = require('./../../controllers/api/user');

router.post('/create-session',userapi.createSession);
// router.post('/create-user',userapi.create_user);
// router.get('/logout',userapi.log_out);
// router.get('/check-authentication', passport.authenticate('jwt',{session:false}) ,userapi.check_authentication);


// for a single user{
//     get all playlist(public and private both)
//     add a playlist (public and private both)
//     get all private playlist
//     get all public playlist
//     }
    
    
//     get a specific playlist movies( if public {
//     send}private{
//     user == logged in}

module.exports = router;