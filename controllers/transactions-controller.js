const User = require('../models/user');
const Creditor = require('../models/creditors');
const Debitor = require('../models/debitors');
const Transaction = require('../models/transactions');


module.exports.list = async function(req,res){
    try {
        let transactions = await Transaction.find({ user_id : req.user._id }).
        populate('person_id_debitor','general_info.name').
        populate('person_id_creditor','general_info.name').
        populate('person_id_user','name');

        console.log(`${transactions}`);
        return res.render('transactions' , {
            "page_title":"Transactions",
            "transactions_info": transactions
        });
        
    } catch (error) {
        console.log(`error : ${error}`)  
        req.flash(`error`,`Error : ${error}`)
        return res.redirect('/');      
    }
}

module.exports.add_comment = async function(req,res){
    try {
        let transaction = await Transaction.findByIdAndUpdate(req.body.transaction_id,{
            comment:req.body["transaction-comment"]
        });
        req.flash(`sucess`,`comment ${req.body["transaction-comment"]} sucessfully added `)
        return res.redirect('back');
        
    } catch (error) {
        console.log(`error : ${error}`)  
        req.flash(`error`,`Error : ${error}`)
        return res.redirect('/');    
    }
}