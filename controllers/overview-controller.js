const User = require('../models/user');
const Creditor = require('../models/creditors');
const Debitor = require('../models/debitors');
const Transaction = require('../models/transactions');


module.exports.list = async function(req,res){
    try {
        let Debitors = await Debitor.find({}).populate('transactions');
        console.log(`${Debitors}`);
        return res.render('overview_list' , {
            "page_title":"Overview",
            "debitors_info":Debitors
        });
        
    } catch (error) {
        console.log(`error : ${error}`)
        return res.redirect('back');        
    }
}
