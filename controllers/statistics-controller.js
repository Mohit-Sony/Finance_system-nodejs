const User = require('../models/user');

module.exports.list = async function(req,res){
    try {
        let user = await User.findById(req.user._id);
        if(user){
            console.log(user);
            res.render('statistics',{
                "page-title":"statistics",
                "user_info":user
            });

        }
        else{
            req.flash(`error`,`User not found`)
            console.log(`user not found`)
        }
    } catch (error) {
        console.log(error);
        req.flash(`error`,`Error : ${error}`)
        res.redirect('back')
    }

}