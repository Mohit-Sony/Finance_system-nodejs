const User = require('../models/user');
const Creditor = require('../models/creditors');
const Debitor = require('../models/debitors');
const Transaction = require('../models/transactions');
const mongoose = require('mongoose');
const Statistics = require('./statistics-controller');
const Credit = require('../models/credit');
const Debit = require('../models/debit');



module.exports.list = async function(req,res){
    try {
        // let user = await User.findById(req.user.id).populate('creditors');
        // console.log(user);

        let list = await Creditor.aggregate([{$match: {
            user_id: mongoose.Types.ObjectId(req.user.id)
           }}, {$project: {
            name: '$general_info.name',
            number: '$general_info.number.1',
            transactions: '$transactions',
            credits: '$credits'
           }}, {$lookup: {
            from: 'credits',
            localField: 'credits',
            foreignField: '_id',
            as: 'cred'
           }}, {$unwind: {
            path: '$cred',
            preserveNullAndEmptyArrays: true
           }}, {$group: {
            _id: '$_id',
            name: {
             $first: '$name'
            },
            number: {
             $first: '$number'
            },
            init_date: {
             $min: '$cred.credit_init_date'
            },
            end_date_exp: {
             $max: '$cred.credit_end_date_init'
            },
            credit_after_intrest: {
             $sum: '$cred.credit_after_intrest'
            },
            transactions: {
             $first: '$transactions'
            }
           }}, {$lookup: {
            from: 'transactions',
            localField: 'transactions',
            foreignField: '_id',
            pipeline: [
             {
              $group: {
               _id: '$type',
               amount: {
                $sum: '$amount'
               }
              }
             }
            ],
            as: 'tran'
           }}, {$unwind: {
            path: '$tran'
           }}, {$project: {
            _id: 1,
            name: 1,
            init_date: 1,
            end_date_exp: 1,
            credit_after_intrest: 1,
            loan_taken: {
             $cond: {
              'if': {
               $eq: [
                '$tran._id',
                'Loan Taken'
               ]
              },
              then: '$tran.amount',
              'else': 0
             }
            },
            returned: {
             $cond: {
              'if': {
               $eq: [
                '$tran._id',
                'Returned to Creditor'
               ]
              },
              then: '$tran.amount',
              'else': 0
             }
            },
            number: 1
           }}, {$group: {
            _id: '$_id',
            credit_after_intrest: {
             $first: '$credit_after_intrest'
            },
            name: {
             $first: '$name'
            },
            loan_taken: {
             $sum: '$loan_taken'
            },
            returned: {
             $sum: '$returned'
            },
            number: {
             $first: '$number'
            },
            init_date: {
             $first: '$init_date'
            },
            end_date_exp: {
             $first: '$end_date_exp'
            }
           }}])



        return res.render('creditors' , {
            "page_title":"Credtors",
            // "creditors_info":user.creditors,
            data:list
        });
        
    } catch (error) {
        console.log(`error creditor list : ${error}`)
        req.flash(`error`,`Error : ${error}`)

        return res.redirect('back');        
    }
}//done



module.exports.profile = async function(req,res){
    try {
        creditor_info = await Creditor.findById(req.params.id).populate('transactions');
        if(creditor_info.user_id == req.user.id){


            let data = await Credit.aggregate([{
                $match: {
                    user_id: mongoose.Types.ObjectId(req.user.id),
                    creditor_id: mongoose.Types.ObjectId(req.params.id)
                   }
            }, {$lookup: {
                from: 'transactions',
                localField: 'transactions',
                foreignField: '_id',
                as: 'tran'
               }}, {$unwind: {
                path: '$tran',
                preserveNullAndEmptyArrays: false
               }}, {$group: {
                _id: {
                 id: '$_id',
                 tran_type: '$tran.type'
                },
                status: {
                 $first: '$Status'
                },
                amount: {
                 $sum: '$tran.amount'
                },
                installment_type: {
                 $first: '$Installment_type'
                },
                credit_after_intrest: {
                 $first: '$credit_after_intrest'
                },
                days_given: {
                 $first: '$days_given_init'
                },
                init_date: {
                 $first: '$credit_init_date'
                },
                credit_end_date_init: {
                 $first: '$credit_end_date_init'
                },
                Status: {
                 $first: '$Status'
                }
               }}, {$project: {
                _id: 0,
                id: '$_id.id',
                status: 1,
                type: '$_id.tran_type',
                returned: {
                 $cond: {
                  'if': {
                   $eq: [
                    '$_id.tran_type',
                    'Returned to Creditor'
                   ]
                  },
                  then: '$amount',
                  'else': 0
                 }
                },
                credit_amount: {
                 $cond: {
                  'if': {
                   $eq: [
                    '$_id.tran_type',
                    'Loan Taken'
                   ]
                  },
                  then: '$amount',
                  'else': 0
                 }
                },
                installment_type: 1,
                credit_after_intrest: 1,
                days_given: 1,
                init_date: 1,
                credit_end_date_init: 1,
                Status: 1
               }}, {$group: {
                _id: '$id',
                returned: {
                 $sum: '$returned'
                },
                credit_amount: {
                 $sum: '$credit_amount'
                },
                installment_type: {
                 $first: '$installment_type'
                },
                credit_after_intrest: {
                 $first: '$credit_after_intrest'
                },
                days_given: {
                 $first: '$days_given'
                },
                init_date: {
                 $first: '$init_date'
                },
                credit_end_date_init: {
                 $first: '$credit_end_date_init'
                },
                Status: {
                 $first: '$Status'
                }
               }}, {$addFields: {
                Loss: {
                 $cond: {
                  'if': {
                   $eq: [
                    '$Status',
                    'closed'
                   ]
                  },
                  then: {
                   $subtract: [
                    '$returned',
                    '$credit_amount'
                   ]
                  },
                  'else': 0
                 }
                }
               }}, {$group: {
                _id: '',
                credits: {
                 $push: '$$ROOT'
                },
                ov_credit_amount: {
                 $sum: '$credit_amount'
                },
                ov_credit_after_intrest: {
                 $sum: '$credit_after_intrest'
                },
                ov_returned: {
                 $sum: '$returned'
                },
                to_return: {
                 $sum: {
                  $subtract: [
                   '$credit_after_intrest',
                   '$returned'
                  ]
                 }
                },
                to_return_array: {
                 $push: {
                  $subtract: [
                   '$credit_after_intrest',
                   '$returned'
                  ]
                 }
                },
                ov_loss: {
                 $sum: '$Loss'
                }
               }}]);

            console.log(data[0]);
            // console.log(`creditor profile : ${creditor_info}`);
            return res.render('creditor_profile',{
                "creditor_info":creditor_info,
                "data":data[0],
                "current_date": new Date()
            });
        }
        else{
            req.flash(`error`,`Error : Unauthorised request`)
            return res.end('unautorised request');
        }

    } catch (error) {
        console.log(`error ${error}`)
        req.flash(`error`,`Error : ${error}`)
        return res.redirect('/')
    }
}//done with user

module.exports.edit_profile = async function(req,res){
    try {
        let creditor = await Creditor.findById(req.params.id);
        if(creditor_info.user_id == req.user.id){
            console.log(creditor);
            return res.render('edit_creditor',{
                "page-title":"Edit Creditor",
                "creditor_info":creditor
            });
        }
        else{
            req.flash(`error`,`Unauthorised Request`)
            return res.redirect('back');
        }
    } catch (error) {
        console.log(`error ${error}`);
        return res.redirect('/') ;
    }
}//done with user


module.exports.initialise = function(req,res){
    res.render('initialiseCredit_creditors');
}//done with user

module.exports.new_creditor = function(req,res){
    res.render('new_creditor');
}//done with user
module.exports.post_new_info_init = async function(req,res){
    //to initialise Creditor information from form to database
    try {
        console.log(req.body);
        //check if same username exists
        let cred = await Creditor.findOne({
            "general_info.username":req.body["cred-user-name"]
        });
        if(cred){
            console.log(`username exists`);
            req.flash(`error`,`Username already exists`)
            return res.redirect('back');
        }
        else{
            let creditor = await Creditor.create({
                user_id:req.user.id,
                general_info:{
                    username: req.body["cred-user-name"],
                    name:req.body["cred-name"] ,
                    number:{
                        1: req.body["cred-mob-1"],
                        2: req.body["cred-mob-2"],
                        3: req.body["cred-mob-3"],
                    },
            
                    shop:req.body["cred-shop"],
                    address:req.body["cred-address"],
                    comment: req.body["cred-comment"],
                    initialised: false ,
                },
            });
            console.log(creditor);
            let user = await User.findById(req.user.id);
            user.creditors.unshift(creditor);
            user.save();
            console.log(`sucessfully added to Creditors in user`)
            req.flash(`sucess`,`sucessfully added to Creditors in user`);

            return res.redirect('/creditor')


        }


    } catch (error) {
        console.log(`error ${error}`)
        req.flash(`error`,`Error : ${error}`)

        return(res.redirect('/'))
        
    }


}////done with user

// module.exports.post_credit_init_fixed_amount = async function(req,res){
//     //to initialise credit info - amount amount after intrest from form to database
//     try {
//         console.log(req.body);
//         let creditor = await Creditor.findByIdAndUpdate(req.params.id,{
//             "general_info.initialised":true,          
//             "money.amount_taken":req.body['credit-amount'],
//             "money.amount_to_be_returned":req.body['amount_return'],
//             "money.date_return": new Date(req.body['return_date']),
//             "money.date_taken": new Date(req.body['taken_date']),
//             "money.type": "fixed_amount",

            
//         });
//         console.log(`creditor initialised : ${creditor}`);
//         let transaction = await Transaction.create({
//             user_id:req.user.id,
//             amount:req.body['credit-amount'],
//             type:"Loan Taken",
//             date: new Date(req.body['taken_date']) ,
//             comment:req.body.comment,
//             from: "creditor",
//             "person_id_creditor":req.params.id,
//             // person_id_Creditor: req.body.:
//         })
//         creditor.transactions.push(transaction);
//         creditor.save();
//         let user = await User.findByIdAndUpdate(req.user.id,{
//             $inc:{
//                 "counter.market_borrow" : req.body['credit-amount']
//             }
//         });
//         user.transactions.push(transaction);
//         user.save();

//         req.flash(`sucess`,`your loan of rupee ${req.body['credit-amount']} sucessfully initialised`);



//         return res.redirect('/creditor');

//     } catch (error) {
//         console.log(`error :${error}`)
//         req.flash(`error`,`Error : ${error}`)
//         return res.redirect('/creditor');

//     }
    

// }//done with user


module.exports.post_credit_init_fixed_amount = async function(req,res){
    //to initialise credit info - amount amount after intrest from form to database
    try {
        
        console.log(req.body);
        let user = await User.findById(req.user.id);

        // console.log(counter);
        let credit_new ;
        // check if money enough to give loan is available or not 

        {
            if(req.body["credit-type"]=='fixed_amount'){
                 

                credit_new = await Credit.create({
                    user_id:req.user.id,
                    creditor_id: mongoose.Types.ObjectId(`${req.params.id}`),
                    type:req.body["credit-type"],
                    Installment_type : 'once',
                    real_credit:req.body["credit-amount"],
                    credit_after_intrest:req.body["amount_return"],
                    credit_init_date: new Date(req.body["taken_date"]),
                    credit_end_date_init:new Date(req.body["return_date"]),
                    days_given_init:eval((new Date(req.body["return_date"]) - new Date(req.body["taken_date"])  )/(1000*3600*24)),
                    Status:'ongoing'
                });


            }else{
                res.flash('error','currently not dealing with this type of credit');
                return res.redirect('back');
            }

            let transaction = await Transaction.create({
                user_id:req.user.id,
                amount:req.body['credit-amount'],
                type:"Loan Taken",
                date: new Date(req.body['taken_date']) ,
                from: "creditor",
                "person_id_creditor":req.params.id,
                credit_id: credit_new._id,

                // person_id_Creditor: req.body.:
            });

            let creditor = await Creditor.findById(req.params.id);
            console.log(credit_new);
            console.log(transaction);

            //save credit_new to creditor 
            creditor.credits.push(credit_new);

            //save transaction to creditor
            creditor.transactions.push(transaction);
            creditor.save();

            //save transaction to credit_new
            credit_new.transactions.push(transaction);
            credit_new.save();

            return res.redirect('back');
    
        }


   
    } catch (error) {
        console.log(`error :${error}`)
        req.flash(`error`,`Error : ${error}`)
        return res.redirect('/creditor');


    }
    

}//done with user // done with credit model


module.exports.edit_info_req = async function(req,res){
    //to edit creditor information from form to database
    try {
        console.log(req.body);
        //check if same username exists


            let creditor = await Creditor.findByIdAndUpdate(req.params.id,{

                "general_info.username" : req.body["cred-user-name"],
                "general_info.name":req.body["cred-name"] ,
                "general_info.number":{
                        1: req.body["cred-mob-1"],
                        2: req.body["cred-mob-2"],
                        3: req.body["cred-mob-3"],
                    },
                "general_info.shop":req.body["cred-shop"],
                "general_info.address":req.body["cred-address"],
                "general_info.comment": req.body["cred-comment"],

            });
            console.log(creditor);
            let id_str = req.params.id.toString() ;
            console.log(id_str);
            req.flash(`sucess`,`creditor information updated`);
            return res.redirect(`/creditor/profile/${req.params.id}`);

    } catch (error) {
        console.log(`error ${error}`)
        req.flash(`error`,`Error : ${error}`)
        return(res.redirect('/'))
    }



}//done

module.exports.make_payment = async function(req,res) {
    try {

        // Creditor.findById(req.params.id);
        console.log(req.body);
            console.log(`returned money`)
            let creditor = await Creditor.findByIdAndUpdate(req.params.id,{
                
                'money.last_payment':new Date(),

                $inc:{
                    'money.amount_returned': parseInt(req.body.amount),
                    
                }
                
            });

            let credit = await Credit.findById(req.body.credit); 


            let transaction = await Transaction.create({
                user_id:req.user.id,
                amount:req.body.amount,
                type:"Returned to Creditor",
                date: new Date(req.body.pay_date) ,
                comment:req.body.comment,
                from: "creditor",
                "person_id_creditor":req.params.id,
                credit_id:req.body.credit

            });
            
            creditor.transactions.unshift(transaction);
            creditor.save();

            credit.transactions.unshift(transaction);
            credit.save();

            
            let user = await User.findByIdAndUpdate(req.user.id,{
                
                $inc:{
                    'counter.market_return': req.body.amount
                }

            });
            user.transactions.push(transaction);
            user.save();
            req.flash(`sucess`,`payment of rupees ${req.body.amount} successfully returned to creditor`);

        console.log('Sucessfully payment completed')
        console.log
        return res.redirect('back');
    } catch (error) {
        console.log(`error : ${error}`)
        req.flash(`error`,`Error : ${error}`)
        return(res.redirect('back'))
    }
}//done with user

module.exports.close_credit = async function(req,res){
    try {
        let credit = await Credit.findById(req.params.id);
        if(credit.user_id == req.user.id){
            credit.Status = 'closed';
            credit.save();
            return(res.redirect('back'))

        }else{
            console.log(`error : unauthorised request `)
            req.flash(`error`,`Error : unauthorised request `)
            return(res.redirect('back'))
        }
        
    } catch (error) {
        console.log(`error : ${error}`)
        req.flash(`error`,`Error : ${error}`)
        return(res.redirect('back'))
    }
};

module.exports.reopen_credit = async function(req,res){
    try {
        let credit = await Credit.findById(req.params.id);
        if(credit.user_id == req.user.id){
            credit.Status = 'ongoing';
            credit.save();
            return(res.redirect('back'))

        }else{
            console.log(`error : unauthorised request `)
            req.flash(`error`,`Error : unauthorised request `)
            return(res.redirect('back'))
        }
        
    } catch (error) {
        console.log(`error : ${error}`)
        req.flash(`error`,`Error : ${error}`)
        return(res.redirect('back'))
    }
};
