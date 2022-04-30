const User = require('../models/user');
const Creditor = require('../models/creditors');
const Debitor = require('../models/debitors');
const Transaction = require('../models/transactions');
const Statistics = require('./statistics-controller');
const mongoose = require('mongoose');
const Debit = require('../models/debit');




module.exports.list = async function(req,res){
    try {
        // let user = await User.findById(req.user.id).populate('debitors');
        // console.log(user);
        // console.log(`${Debitors}`);

        let list = await Debit.aggregate([{$match: {
            user_id: mongoose.Types.ObjectId(req.user.id),
            Status: 'ongoing'
           }}, {$project: {
            _id: 1,
            user_id: 1,
            debitor_id: 1,
            debit_after_intrest: 1,
            installment_amount: 1,
            debit_init_date: 1,
            type: 1,
            transactions: 1,
            debit_end_date_init: 1
           }}, {$lookup: {
            from: 'transactions',
            localField: 'transactions',
            foreignField: '_id',
            pipeline: [
             {
              $match: {
               $or: [
                {
                 type: 'Recived Debitor'
                },
                {
                 type: 'Discount'
                }
               ]
              }
             },
             {
              $group: {
               _id: '$type',
               amount: {
                $sum: '$amount'
               },
               last_date: {
                $max: '$date'
               }
              }
             },
             {
              $project: {
               _id: 0,
               amount: 1,
               last_date: {
                $cond: [
                 {
                  $eq: [
                   '$_id',
                   'Recived Debitor'
                  ]
                 },
                 '$last_date',
                 0
                ]
               }
              }
             },
             {
              $group: {
               _id: '',
               amount: {
                $sum: '$amount'
               },
               last_date: {
                $max: '$last_date'
               }
              }
             }
            ],
            as: 'tran'
           }}, {$unwind: {
            path: '$tran',
            preserveNullAndEmptyArrays: true
           }}, {$addFields: {
            expected_return: {
             $multiply: [
              '$installment_amount',
              {
               $toInt: {
                $divide: [
                 {
                  $subtract: [
                   '$$NOW',
                   '$debit_init_date'
                  ]
                 },
                 {
                  $multiply: [
                   24,
                   60,
                   60,
                   1000
                  ]
                 }
                ]
               }
              }
             ]
            }
           }}, {$project: {
            expected_return: {
             $cond: [
              {
               $eq: [
                '$type',
                'fixed_amount'
               ]
              },
              {
               $cond: [
                {
                 $gte: [
                  '$expected_return',
                  '$debit_after_intrest'
                 ]
                },
                '$debit_after_intrest',
                '$expected_return'
               ]
              },
              {
               $cond: [
                {
                 $gte: [
                  '$$NOW',
                  '$debit_end_date_init'
                 ]
                },
                0,
                '$debit_after_intrest'
               ]
              }
             ]
            },
            _id: 1,
            debitor_id: 1,
            type: 1,
            debit_after_intrest: 1,
            returned: {
             $cond: [
              {
               $gte: [
                '$tran.amount',
                0
               ]
              },
              '$tran.amount',
              0
             ]
            },
            installment_amount: 1,
            user_id: 1
           }}, {$addFields: {
            due_installments: {
             $toInt: {
              $divide: [
               {
                $subtract: [
                 '$expected_return',
                 '$returned'
                ]
               },
               '$installment_amount'
              ]
             }
            },
            due_amount: {
             $subtract: [
              '$expected_return',
              '$returned'
             ]
            }
           }}, {$group: {
            _id: '$debitor_id',
            debit_after_intrest: {
             $sum: '$debit_after_intrest'
            },
            returned: {
             $sum: '$returned'
            },
            expected_return: {
             $sum: '$expected_return'
            },
            due_installments: {
             $sum: '$due_installments'
            },
            due_installments_array: {
             $push: '$due_installments'
            },
            due_installment_amount: {
             $sum: '$due_amount'
            },
            due_installment_amount_array: {
             $push: '$due_amount'
            },
            user_id: {
             $first: '$user_id'
            }
           }}, {$lookup: {
            from: 'debitors',
            localField: '_id',
            foreignField: '_id',
            pipeline: [
             {
              $project: {
               name: '$general_info.name',
               number: '$general_info.number',
               guarentor_name: '$general_info.guarentor_name'
              }
             }
            ],
            as: 'general_info'
           }}, {$unwind: {
            path: '$general_info',
            preserveNullAndEmptyArrays: true
           }}, {$unionWith: {
            coll: 'debitors',
            pipeline: [
             {
              $match: {
                user_id: mongoose.Types.ObjectId(req.user.id),
            }
             }
            ]
           }}, {$group: {
            _id: '$_id',
            debit_after_intrest: {
             $sum: '$debit_after_intrest'
            },
            returned: {
             $sum: '$returned'
            },
            expected_return: {
             $sum: '$expected_return'
            },
            due_installments: {
             $sum: '$due_installments'
            },
            due_installments_array: {
             $push: '$due_installments_array'
            },
            due_installment_amount: {
             $sum: '$due_installment_amount'
            },
            due_installment_amount_array: {
             $push: '$due_installment_amount_array'
            },
            name: {
             $first: '$general_info.name'
            },
            number: {
             $first: '$general_info.number.1'
            },
            guarentor_name: {
             $first: '$general_info.guarentor_name'
            }
           }}])

        // let list_2 = await Debitor.aggregate();

        console.log('data : ', list )
        return res.render('debitors' , {
            "page_title":"Debitors",
            "current_date":new Date(),
            // "debitors_info":user.debitors,
            data:list
        });
        
    } catch (error) {
        console.log(`error debitor list : ${error}`)
        req.flash(`error`,`Error : ${error}`)
        return res.redirect('back');        
    }
}//done with user
module.exports.profile = async function(req,res){
    try {
        // console.log(req.params.id , `new ObjectId("${req.params.id}")` );

        let list = await Debit.aggregate([{$match: {
            user_id: mongoose.Types.ObjectId(req.user.id),
            debitor_id: mongoose.Types.ObjectId(req.params.id)
           }}, {$lookup: {
            from: 'transactions',
            localField: 'transactions',
            foreignField: '_id',
            as: 'tran'
           }}, {$unwind: {
            path: '$tran',
            preserveNullAndEmptyArrays: true,
           }}, {$group: {
            _id: {
             id: '$_id',
             tran_type: '$tran.type'
            },
            amount: {
             $sum: '$tran.amount'
            },
            to_collect: {
             $first: '$debit_after_intrest'
            },
            installments: {
             $first: '$days_given_init'
            },
            init_date: {
             $first: '$debit_init_date'
            },
            end_date_exp: {
             $first: '$debit_end_date_init'
            },
            debit_type: {
             $first: '$type'
            },
            Status: {
             $first: '$Status'
            }
           }}, {$project: {
            _id: 0,
            id: '$_id.id',
            type: '$_id.tran_type',
            recived: {
             $cond: {
              'if': {
               $eq: [
                '$_id.tran_type',
                'Recived Debitor'
               ]
              },
              then: '$amount',
              'else': 0
             }
            },
            debit_amount: {
             $cond: {
              'if': {
               $eq: [
                '$_id.tran_type',
                'Loan Given Actual Amount'
               ]
              },
              then: '$amount',
              'else': 0
             }
            },
            discount: {
             $cond: {
              'if': {
               $eq: [
                '$_id.tran_type',
                'Discount'
               ]
              },
              then: '$amount',
              'else': 0
             }
            },
            penalty_recived: {
             $cond: {
              'if': {
               $eq: [
                '$_id.tran_type',
                'Penalty Collected'
               ]
              },
              then: '$amount',
              'else': 0
             }
            },
            penalty_imposed: {
             $cond: {
              'if': {
               $eq: [
                '$_id.tran_type',
                'Penalty Imposed'
               ]
              },
              then: '$amount',
              'else': 0
             }
            },
            amount: 1,
            to_collect: 1,
            installments: 1,
            init_date: 1,
            end_date_exp: 1,
            debit_type: 1,
            Status: 1
           }}, {$group: {
            _id: '$id',
            to_collect: {
             $first: '$to_collect'
            },
            installments: {
             $first: '$installments'
            },
            init_date: {
             $first: '$init_date'
            },
            end_date_exp: {
             $first: '$end_date_exp'
            },
            recived: {
             $sum: '$recived'
            },
            debit_amount: {
             $sum: '$debit_amount'
            },
            discount: {
             $sum: '$discount'
            },
            penalty_recived: {
             $sum: '$penalty_recived'
            },
            penalty_imposed: {
             $sum: '$penalty_imposed'
            },
            debit_type: {
             $first: '$debit_type'
            },
            Status: {
             $first: '$Status'
            }
           }}, {$addFields: {
            profit: {
             $cond: {
              'if': {
               $eq: [
                '$Status',
                'closed'
               ]
              },
              then: {
               $subtract: [
                {
                 $add: [
                  '$recived',
                  '$penalty_recived'
                 ]
                },
                '$debit_amount'
               ]
              },
              'else': 0
             }
            }
           }}, {$group: {
            _id: '',
            debits: {
             $push: '$$ROOT'
            },
            ov_given_amount: {
             $sum: '$debit_amount'
            },
            ov_to_collect: {
             $sum: '$to_collect'
            },
            ov_recived: {
             $sum: '$recived'
            },
            ov_discount: {
             $sum: '$discount'
            },
            ov_penalty_recived: {
             $sum: '$penalty_recived'
            },
            ov_penalty_imposed: {
             $sum: '$penalty_imposed'
            },
            ov_profit: {
             $sum: '$profit'
            },
            ov_last_debit_date:{
            $max:'$init_date'
            },

           }}]);


        debitor_info = await Debitor.findById(req.params.id).populate('transactions');
    

        if(debitor_info.user_id == req.user.id){
            console.log(`debitor profile : ${debitor_info}`);

            return res.render('debitor_profile',{
                "debitor_info":debitor_info,
                "current_date": new Date(),
                data:list

            });

        }
        else{
            req.flash(`error`,`Error : Unauthorised request`)
            return res.end('unautorised request');
        }
    } catch (error) {
        console.log(`error ${error}`)
        req.flash(`error`,`Error : ${error}`)
        return res.redirect('/');
    }
} //done with user
module.exports.edit = async function(req,res){
    try {
        let debitor = await Debitor.findById(req.params.id);
        if( !debitor || debitor_info.user_id == req.user.id){

            console.log(debitor);
            return res.render('edit_debitor',{
                "page-title":"Edit Debitor",
                "debitor_info":debitor
            });
        }
        else{
            req.flash(`error`,`Error : Unauthorised request`)
            return res.end('unautorised request');
        }
    } catch (error) {
        console.log(`error ${error}`);
        return(res.redirect('/'));
    }
    
}//done with user
module.exports.initialise = function(req,res){
    res.render('initialiseCredit_debitors');
}//done with user
module.exports.new_debitor = function(req,res){
    res.render('new_debitor');
}//done with user
module.exports.post_new_info_init = async function(req,res){
    //to initialise debitor information from form to database
    try {
        console.log(req.body);
        //check if same username exists
        let deb = await Debitor.findOne({
            "general_info.username":req.body["deb-user-name"]
        });
        if(deb){
            console.log(`username exists`);
            req.flash(`error`,`Error : Username already exists`)
            return res.redirect('back');
        }
        else{
            let debitor = await Debitor.create({
                user_id:req.user.id,
                general_info:{
                    username: req.body["deb-user-name"],
                    name:req.body["deb-name"] ,
                    number:{
                        1: req.body["deb-mob-1"],
                        2: req.body["deb-mob-2"],
                        3: req.body["deb-mob-3"],
                    },
            
                    shop:req.body["deb-shop"],
                    address:req.body["deb-address"],
                    guarentor_name: req.body["deb-guar-name"] ,
                    guarentor_number: {
                        1: req.body["deb-guar-mob-1"],
                        2: req.body["deb-guar-mob-2"],
                        3: req.body["deb-guar-mob-3"],
                    },
                    comment: req.body["deb-comment"],
                    initialised: false ,
                },
            });
            console.log(debitor);
            let user = await User.findById(req.user.id);
            user.debitors.unshift(debitor);
            user.save();
            console.log(`sucessfully added to debitors in user`)
            req.flash(`sucess`,`${req.body["deb-name"]} sucessfully Added to debitors`);
            return res.redirect('/debitor')


        }


    } catch (error) {
        console.log(`error ${error}`)
        req.flash(`error`,`Error : ${error}`)
        return(res.redirect('/'))
    }


}//done with user


// module.exports.post_debit_init = async function(req,res){
//     //to initialise debit info - amount amount after intrest from form to database
//     try {
//         console.log(req.body);
//         let user = await User.findById(req.user.id);

//         console.log(user.counter.self_input + user.counter.market_borrow + user.counter.collection_alltime - user.counter.market_return - user.counter.invested_all_time - user.counter.withdraw ) ;
//         if((user.counter.self_input + user.counter.market_borrow + user.counter.collection_alltime - user.counter.market_return - user.counter.invested_all_time - user.counter.withdraw )< parseInt(req.body['credit-amount'])){
//             req.flash(`error`,`Error : Not Sufficient balance in counter please add money to counter`);
//             return res.redirect('back');


//         }
//         else{
//             let debitor = await Debitor.findByIdAndUpdate(req.params.id,{
//                 "general_info.initialised":true,          
//                 "money.real_debit":req.body['credit-amount'],
//                 "money.debit_after_intrest":req.body.amount,
//                 "money.daily_installment_amount": parseInt(parseInt(req.body.amount)/parseInt(req.body.days)) ,
//                 "money.days_given_init":req.body.days,
//                 "money.debit_init_date": new Date(req.body['init_date']),
    
                
//             });
//             console.log(`debitor initialised : ${debitor}`);
//             let transaction = await Transaction.create({
//                 user_id:req.user.id,
//                 amount:req.body['credit-amount'],
//                 type:"Loan Given Actual Amount",
//                 date: new Date(req.body['init_date']) ,
//                 comment:req.body.comment,
//                 from: "debitor",
//                 "person_id_debitor":req.params.id,
//                 "general_info.closed" : false,

//                 // person_id_Creditor: req.body.:
//             })
//             debitor.transactions.push(transaction);
//             debitor.save();
//             user = await User.findByIdAndUpdate(req.user.id,{
//                 $inc:{
//                     "counter.invested_all_time":req.body['credit-amount']
//                 }
//             });
//             user.transactions.push(transaction);
//             user.save();
//             req.flash(`sucess`,`Debit of rupees ${req.body['credit-amount']} sucessfully initiated`);
    
//             return res.redirect('/debitor');
    
//         }


//     } catch (error) {
//         console.log(`error :${error}`)
//         req.flash(`error`,`Error : ${error}`)
//         return res.redirect('/debitor');

//     }
    

// }//done with user

//
module.exports.post_debit_init = async function(req,res){
    //to initialise debit info - amount amount after intrest from form to database
    try {
        console.log(req.body);
        let user = await User.findById(req.user.id);

        let counter = Statistics.user_counter(req.user.id);
        // console.log(counter);
        let debt ;
        // check if money enough to give loan is available or not 
        if((counter.self_input + counter.market_borrow + counter.collection_alltime - counter.market_return - counter.invested_all_time - counter.withdraw )< parseInt(req.body['credit-amount'])){
            req.flash(`error`,`Error : Not Sufficient balance in counter please add money to counter`);
            return res.redirect('back');


        }
        else{
            if(req.body["debit-type"]=='fixed_amount'){
                 
                let d = new Date(req.body["init_date"]) ;
                let debit_end = new Date(d.setDate(d.getDate() + parseInt(req.body["days"]) )).toISOString();
                console.log("d" , d  , "debit end " , debit_end);

                debt = await Debit.create({
                    user_id:req.user.id,
                    debitor_id: mongoose.Types.ObjectId(`${req.params.id}`),
                    type:req.body["debit-type"],
                    Installment_type : 'daily',
                    real_debit:req.body["credit-amount"],
                    debit_after_intrest:req.body["amount"],
                    debit_init_date: new Date(req.body["init_date"]),
                    days_given_init:req.body["days"],
                    debit_end_date_init: d,
                    installment_amount: eval( parseInt( req.body["amount"]) / parseInt(req.body["days"]) ),
                    Status:'ongoing'
                });

            }else if(req.body["debit-type"]=='holayati'){
                debt = await Debit.create({
                    user_id:req.user.id,
                    debitor_id: mongoose.Types.ObjectId(`${req.params.id}`),
                    type:req.body["debit-type"],
                    Installment_type : 'once',
                    real_debit:req.body["credit-amount"],
                    debit_after_intrest:req.body["amount"],
                    debit_init_date: new Date(req.body["init_date"]),
                    debit_end_date_init:new Date(req.body["return_date"]),
                    days_given_init:eval((new Date(req.body["return_date"]) - new Date(req.body["init_date"])  )/(1000*3600*24)),
                    installment_amount: req.body["amount"],
                    Status:'ongoing'

                });
            }else{
                res.flash('error','currently not dealing with this type of debit');
                return res.redirect('back');
            }
            let transaction = await Transaction.create({
                user_id:req.user.id,
                amount:req.body['credit-amount'],
                type:"Loan Given Actual Amount",
                date: new Date(req.body['init_date']) ,
                from: "debitor",
                "person_id_debitor":req.params.id,
                debit_id: debt._id,

                // person_id_Creditor: req.body.:
            });

            let debitor = await Debitor.findById(req.params.id);

            console.log(transaction);

            //save debt to debitor 
            debitor.debits.push(debt);
            //save transaction to debitor
            debitor.transactions.push(transaction);
            debitor.save();

            //save transaction to debt
            debt.transactions.push(transaction);
            debt.save();

            return res.redirect('back');
    
        }


    } catch (error) {
        console.log(`error :${error}`)
        req.flash(`error`,`Error : ${error}`)
        return res.redirect('/debitor');

    }
    

}//done with user debit array 


module.exports.make_payment = async function(req,res) {
    try {
        if( !req.body.debt || req.body.debt == "" ){
            console.log(`error : debt not declared `)
            req.flash(`error`,`Error : debt not declared `)
            return(res.redirect('back'));
        };

        let debt = await Debit.findById(req.body.debt); 

        if( !debt || debt.user_id != req.user.id){
            console.log(`error : unautharised request `)
            req.flash(`error`,`Error : unautharised request `)
            return(res.redirect('back'));
        };

        //chek weather debitor initialised or not
        // let debitor = await Debitor.findById(req.params.id);
        // if( ! (debitor.general_info.initialised == true && debitor.general_info.closed == false )){
        //     console.log(`error : debit not initialised yet`)
        //     req.flash(`error`,`Debit not initialised yet`)
        //     return res.redirect('back'); 
        // }

        // Debitor.findById(req.params.id);
        console.log(req.body);
        let type = req.body.type;
        console.log(type);
        if(type == "Recived"){
            console.log(`recived money`)
            let debitor = await Debitor.findByIdAndUpdate(req.params.id,{
                
                'money.last_payment':new Date(req.body['pay_date']),
                'money.last_payment_amount':req.body.amount,

                $inc:{
                    'money.returned': parseInt(req.body.amount),
                    
                }
                
            });

            // let debt = await Debit.findById(req.body.debt); 

            let transaction = await Transaction.create({
                user_id:req.user.id,
                amount:req.body.amount,
                type:"Recived Debitor",
                date: new Date(req.body['pay_date']) ,
                comment:req.body.comment,
                from: "debitor",
                "person_id_debitor":req.params.id,
                debit_id:req.body.debt
                // person_id_Creditor: req.body.:
            })
            debitor.transactions.unshift(transaction);
            debitor.save();

            debt.transactions.unshift(transaction);
            debt.save();     
            // post.comments.push(comment);
            // post.save();
            let user = await User.findByIdAndUpdate(req.user.id,{
                $inc:{
                    'counter.collection_alltime' : req.body.amount,
                }
            });
            if(user){
                console.log(user);
            }
            user.transactions.push(transaction);
            user.save();
            req.flash(`sucess`,`Transaction (payment recived) of rupees ${req.body.amount} is successful`)



        }//if payment recived
        else if(type == "penalty-imposed"){
            console.log(`penalty imposed`)

            let debitor = await Debitor.findByIdAndUpdate(req.params.id,{
                
                $inc:{
                    'money.penalty_imposed': parseInt(req.body.amount)
                }
                
            });
            // let debt = await Debit.findById(req.body.debt); 

            let transaction = await Transaction.create({
                user_id:req.user.id,
                amount:req.body.amount,
                type:"Penalty Imposed",
                date: new Date(req.body['pay_date']) ,
                comment:req.body.comment,
                from: "debitor",
                "person_id_debitor":req.params.id,
                debit_id:req.body.debt

                // person_id_Creditor: req.body.:
            })
            debitor.transactions.unshift(transaction);
            debitor.save();

            debt.transactions.unshift(transaction);
            debt.save(); 
            
            // Debitor.aggregate([
            //     {$match:{
            //     $and: [
            //     { "general_info.initialised": true },
            //     {'user_id': req.user._id }
            //     ]
            //     }},
                

            //     { $group: { _id : null , total: { $sum: "$money.penalty" } } },
            //   ]).exec(function (err, doc) {
            //     if (err) {
            //         console.log( `error in aggrigate ${err} `);
            //         return res.redirect('back');
            //     } else {
            //         console.log(doc);
            //         total_pen = doc[0].total;
            //         console.log(total_pen);
            //         User.findByIdAndUpdate(req.user.id, {
            //             $set:{
            //                 "counter.total_penalty" : total_pen
            //             }
            //         });
            //     }
            // });
            // console.log(total_pen);
            // // let user = await User.findByIdAndUpdate(req.user.id, {
            // //     $set:{
            // //         "counter.total_penalty" : total_pen
            // //     }
            // // });

            let user = await User.findByIdAndUpdate(req.user.id,{
                $inc:{
                    "counter.total_penalty_imposed" : req.body.amount,
                    }
            })



            if(user){
                console.log(` user total penalty imposed ${user.counter.total_penalty_imposed} `);
            }
            user.transactions.push(transaction);
            user.save();
            req.flash(`sucess`,`Penalty of rupees ${req.body.amount} is successfully added`)

        }
        else if(type == "penalty-collected"){
            console.log(`penalty collection start`)

            let debitor = await Debitor.findByIdAndUpdate(req.params.id,{
                
                $inc:{
                    'money.penalty_collected': parseInt(req.body.amount)
                }
                
            });

            // let debt = await Debit.findById(req.body.debt); 

            let transaction = await Transaction.create({
                user_id:req.user.id,
                amount:req.body.amount,
                type:"Penalty Collected",
                date: new Date(req.body['pay_date']) ,
                comment:req.body.comment,
                from: "debitor",
                "person_id_debitor":req.params.id,
                debit_id:req.body.debt

                // person_id_Creditor: req.body.:
            })
            debitor.transactions.unshift(transaction);
            debitor.save();

            debt.transactions.unshift(transaction);
            debt.save(); 

         

            let user = await User.findByIdAndUpdate(req.user.id,{
                $inc:{
                    "counter.total_penalty_collected" : req.body.amount,
                    }
            })



            if(user){
                console.log(` user total penalty collected ${user.counter.total_penalty_collected} `);
            }
            user.transactions.push(transaction);
            user.save();
            req.flash(`sucess`,`Penalty of rupees ${req.body.amount} is successfully added`)

        }
        else if(type == "discount"){
            let debitor = await Debitor.findByIdAndUpdate(req.params.id,{
                
                $inc:{
                    'money.discount': parseInt(req.body.amount)
                }
                
            });

            // let debt = await Debit.findById(req.body.debt); 


            let transaction = await Transaction.create({
                user_id:req.user.id,
                amount:req.body.amount,
                type:"Discount",
                date: new Date(req.body['pay_date']) ,
                comment:req.body.comment,
                from: "debitor",
                "person_id_debitor":req.params.id,
                debit_id:req.body.debt

                // person_id_Creditor: req.body.:
            })
            debitor.transactions.unshift(transaction);
            debitor.save();

            debt.transactions.unshift(transaction);
            debt.save(); 

            let user = await User.findByIdAndUpdate(req.user.id,{
                $inc:{
                    "counter.total_discount" : req.body.amount,
                    }
            })           
            user.transactions.push(transaction);
            user.save();
            req.flash(`sucess`,`Discount of rupees ${req.body.amount} is successfully added`)



        }
        console.log('payment sucessful')
        return res.redirect('back');
    } catch (error) {
        console.log(`error : ${error}`)
        req.flash(`error`,`Error : ${error}`)
        return(res.redirect('back'))

    }
}
module.exports.edit_info_req = async function(req,res){
        //to edit debitor information from form to database
        try {
            console.log(req.body);
            //check if same username exists


                let debitor = await Debitor.findByIdAndUpdate(req.params.id,{

                    "general_info.username" : req.body["deb-user-name"],
                    "general_info.name":req.body["deb-name"] ,
                    "general_info.number":{
                            1: req.body["deb-mob-1"],
                            2: req.body["deb-mob-2"],
                            3: req.body["deb-mob-3"],
                        },
                    "general_info.shop":req.body["deb-shop"],
                    "general_info.address":req.body["deb-address"],
                    "general_info.guarentor_name": req.body["deb-guar-name"] ,
                    "general_info.guarentor_number": {
                            1: req.body["deb-guar-mob-1"],
                            2: req.body["deb-guar-mob-2"],
                            3: req.body["deb-guar-mob-3"],
                        },
                    "general_info.comment": req.body["deb-comment"],

                });
                console.log(debitor);
                let id_str = req.params.id.toString() ;
                console.log(id_str);
                req.flash(`sucess`,`Information edited sucessfully`);
                return res.redirect(`/debitor/profile/${req.params.id}`);
    
        } catch (error) {
            console.log(`error ${error}`)
            req.flash(`error`,`Error : ${error}`)
            return(res.redirect('/'))
        }
    
    
    
}

module.exports.close_debitor = async (req,res)=>{
    try {
        let debitor = await Debitor.findByIdAndUpdate(req.params.id,{
            "general_info.closed" : true,
            "general_info.closed_date" : new Date(),
            
        });

        req.flash('sucess',`debitor ${general_info.name}'s account is closed now `);
        return res.redirect('/debitors');
        
    } catch (error) {
        console.log(`error ${error}`)
        req.flash(`error`,`Error : ${error}`)
        return(res.redirect('/'))
    }
}

module.exports.revoke_debitor = async (req,res)=>{
    try {
        let debitor = await Debitor.findByIdAndUpdate(req.params.id,{
            "general_info.closed" : false,
            
        });

        req.flash('sucess',`debitor ${general_info.name}'s account is revoked now `);
        return res.redirect('/debitors');
        
    } catch (error) {
        console.log(`error ${error}`)
        req.flash(`error`,`Error : ${error}`)
        return(res.redirect('/'))
    }
}

module.exports.data = async function(req,res){
    let debits = await Debit.find().populate('debitor_id').populate('transactions');
    let rd = []; 

    for(i of debits){
        console.log(i.transactions);

        let result = i.transactions.reduce((acc, curr) => {
            let item = acc.find(item => item.type === curr.type);
          
            if (item) {
              item.amount += curr.amount;
            } else {
              acc.push(curr);
            }
          
            return acc;
          }, []);
          
          console.log('result' , result);
          rd.push(result);

    }
    // console.log(real_data);



    return res.json('200',{
        message : 'sucess',
        debits : debits,
        rd : rd
    })
}

module.exports.close_debit = async function(req,res){
    try {
        let debit = await Debit.findById(req.params.id);
        if(debit.user_id == req.user.id){
            debit.Status = 'closed';
            debit.save();
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

module.exports.reopen_debit = async function(req,res){
    try {
        let debit = await Debit.findById(req.params.id);
        if(debit.user_id == req.user.id){
            debit.Status = 'ongoing';
            debit.save();
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
