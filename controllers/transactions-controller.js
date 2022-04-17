const User = require('../models/user');
const Creditor = require('../models/creditors');
const Debitor = require('../models/debitors');
const Transaction = require('../models/transactions');
const Mongoose  = require('mongoose');


module.exports.list = async function(req,res){
    try {
        let transactions = await Transaction.find({ user_id : req.user._id }).
        populate('person_id_debitor','general_info.name').
        populate('person_id_creditor','general_info.name').
        populate('user_id','name').
        sort({'date': -1 });

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

module.exports.delete_transaction = async function(req,res){
    try {
        let transaction = await Transaction.findById(req.params.tid);
        console.log(transaction);
        if(transaction.type == "Loan Given Actual Amount" || transaction.type == "Loan Taken" ){
            req.flash(`error`,`initialising loan transaction cannot be deleted`);
            return res.redirect('back');
        }

        if(transaction['person_id_debitor'] && transaction['person_id_debitor'] != "" ){

            //if transaction is initialise money as loan 


            console.log(`transaction id debt :`,transaction._id);
            let debitor = await Debitor.findByIdAndUpdate(transaction['person_id_debitor']._id,{
                $pull:{
                    "transactions" : transaction._id 
                }
            })

            transaction.remove();

        }else if(transaction['person_id_creditor'] && transaction['person_id_creditor'] != ""){
            //if creditor
            console.log(`transaction id cred :`,transaction._id);
            let creditor = await Creditor.findByIdAndUpdate(transaction['person_id_creditor']._id,{
                $pull:{
                    "transactions" : transaction._id 
                }
            })

            transaction.remove();

        }else if(transaction.type == "Self Input" || transaction.type == "Withdraw"){
            console.log(`transaction id cred :`,transaction._id);
            let user = await User.findByIdAndUpdate(req.user.id,{
                $pull:{
                    "transactions" : transaction._id 
                }
            })

            transaction.remove();
        }
        return res.redirect('back');


    } catch (error) {
        console.log(`error : ${error}`)  
        req.flash(`error`,`Error : ${error}`)
        return res.redirect('/');  
    }
}