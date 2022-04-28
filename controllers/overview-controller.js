const User = require('../models/user');
const Creditor = require('../models/creditors');
const Debitor = require('../models/debitors');
const Debit = require('../models/debit');
const mongoose = require('mongoose');

const Transaction = require('../models/transactions');


module.exports.list = async function(req,res){
    try {
        let user = await User.findById(req.user.id).populate('debitors');
        // console.log(`${user.debitors}`);

        let data = await Debit.aggregate([{$match: {
            user_id: mongoose.Types.ObjectId(req.user.id),
            Status: 'ongoing'
           }}, {$lookup: {
            from: 'debitors',
            localField: 'debitor_id',
            foreignField: '_id',
            pipeline: [
             {
              $project: {
               name: '$general_info.name'
              }
             }
            ],
            as: 'debitor'
           }}, {$unwind: {
            path: '$debitor',
            preserveNullAndEmptyArrays: false
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
            recived: {
             $cond: {
              'if': {
               $eq: [
                '$tran._id',
                'Recived Debitor'
               ]
              },
              then: '$tran.amount',
              'else': 0
             }
            },
            debit_amount: {
             $cond: {
              'if': {
               $eq: [
                '$tran._id',
                'Loan Given Actual Amount'
               ]
              },
              then: '$tran.amount',
              'else': 0
             }
            },
            discount: {
             $cond: {
              'if': {
               $eq: [
                '$tran._id',
                'Discount'
               ]
              },
              then: '$tran.amount',
              'else': 0
             }
            },
            penalty_recived: {
             $cond: {
              'if': {
               $eq: [
                '$tran._id',
                'Penalty Collected'
               ]
              },
              then: '$tran.amount',
              'else': 0
             }
            },
            penalty_imposed: {
             $cond: {
              'if': {
               $eq: [
                '$tran._id',
                'Penalty Imposed'
               ]
              },
              then: '$tran.amount',
              'else': 0
             }
            },
            debit_after_intrest: 1,
            type: 1,
            debit_init_date: 1,
            debitor_name: '$debitor.name',
            debitor_id: '$debitor._id',
            debit_end_date_init: 1
           }}, {$group: {
            _id: '$_id',
            to_collect: {
             $first: '$debit_after_intrest'
            },
            init_date: {
             $first: '$debit_init_date'
            },
            end_date_exp: {
             $first: '$debit_end_date_init'
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
             $first: '$type'
            },
            debitor_name: {
             $first: '$debitor_name'
            },
            debitor_id: {
             $first: '$debitor_id'
            }
           }}])

        console.log('data :', data )

        return res.render('overview_list' , {
            "page_title":"Overview",
            "debitors_info":user.debitors,
            data:data,
        });
    } catch (error) {
        console.log(`error : ${error}`)
        req.flash(`error`,`Error : ${error}`)
        return res.redirect('back');        
    }
};


