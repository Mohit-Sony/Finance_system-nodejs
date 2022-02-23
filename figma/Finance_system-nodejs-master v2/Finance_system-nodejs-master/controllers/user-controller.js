const User = require('../models/user');


module.exports.user = function(req,res){
    res.end('in user controller');
}

module.exports.sign_in = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }
    
    res.render('signin',{
        title:"signin|site name"
    })
};

module.exports.sign_up = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }

    res.render('signup',{
        title :"signup | site name"
    })
}

module.exports.profile = function(req,res){
    res.render('profile',{
        title:"profile | site name"
    })
}

module.exports.create_user = function(req,res){
    //if password and confirm password doesnot match
    if(req.body.password != req.body.confirm_password){
        console.log(`password and confirm password does not match`)
        return res.redirect("back");
    }
    //if matches then
    else{
        //check if user already exists or not 
        User.findOne({email:req.body.email},function(err,user){
            if(err){
                console.log(`error in finding user from database : ${err}`);
                return res.redirect('back');
            }
            if(user){
                console.log(`user already exist with same email address`);
                return res.redirect('back')
            }
            //if no user is present with this email
            //create new user
            if(!user){
                User.create({
                    email:req.body.email,
                    password:req.body.password,
                    name : req.body.name,
                    number : req.body.number
                });
                return res.redirect('/user/sign-in');
            }
        })
    } 
}

module.exports.create_session = function(req,res){
//todo
    return res.redirect('/');
}

module.exports.log_out = function(req,res){
    req.logout();
    return res.redirect('back');
    
}


