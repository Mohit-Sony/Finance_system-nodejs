const User = require('../models/user');
const Creditor = require('../models/creditors');
const Debitor = require('../models/debitors');
const Transaction = require('../models/transactions');


module.exports.list = async function(req,res){
    try {
        let transactions = await Transaction.find({}).populate('person_id');
        console.log(`${transactions}`);
        return res.render('transactions' , {
            "page_title":"Transactions",
            "transactions_info": transactions
        });
        
    } catch (error) {
        console.log(`error : ${error}`)  
        return res.redirect('/');      
    }
}