const User = require('../models/user');
const Creditor = require('../models/creditors');
const Debitor = require('../models/debitors');
const Transaction = require('../models/transactions');


module.exports.list = async function(req,res){
    try {
        let user = await User.findById(req.user.id).populate('debitors');
        console.log(`${user.debitors}`);
        return res.render('overview_list' , {
            "page_title":"Overview",
            "debitors_info":user.debitors
        });
        
    } catch (error) {
        console.log(`error : ${error}`)
        return res.redirect('back');        
    }
};


