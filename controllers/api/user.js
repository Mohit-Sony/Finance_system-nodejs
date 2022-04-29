const User = require('./../../models/user');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const env = require('./../../config/environment');
module.exports.createSession = async function(req,res){
    try {
        console.log(req);

        let user = await User.findOne({email:req.body.email});

        if(!user || user.password != req.body.password ){
            return res.json(422,{
                message:'Invalid username or password'
            });

        }

        return res.json(200,{
            message:'Signin sucessful , here is your token , please keep it safe!',
            data:{
                token:jwt.sign(user.toJSON() , env.JWT_key ,{expiresIn:'100000000'})
            }
        }) 

    } catch (error) {
        console.log("Error : ",error);
        return res.json(500,{
            message:`internal server error`
        });
    }
}