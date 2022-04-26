const User = require('../../models/user');
const Creditor = require('../../models/creditors');
const Debitor = require('../../models/debitors');
const Transaction = require('../../models/transactions');
const Statistics = require('../statistics-controller');
const mongoose = require('mongoose');
const Debit = require('../../models/debit');
const req = require('express/lib/request');


// incoming req.user.id user id 
module.exports.overview = async function(req,res){
    try {
        let debits = await Debit.aggregate([
            {
                $match : { user_id : mongoose.Types.ObjectId(req.user.id) },
            },

            {
                $lookup:
                {
                    from: "transactions",
                    localField: "transactions",
                    foreignField: "_id",
                    as: "inventory"
                }
            },
            {
                $unwind:'$inventory'
            },
            {
                $lookup:
                {
                    from: "debitors",
                    localField: "debitor_id",
                    foreignField: "_id",
                    as: "debitor_info"
                }
            },

            {
                $unwind:'$debitor_info'
            },

            {
                $group : { 
                    _id : {id: '$_id', type : '$inventory.type'},
                    debit_after_int : { "$first" : '$debit_after_intrest'},
                    kist_type :   { "$first" : '$type'},
                    kist_start_date: { "$first" : '$debit_init_date'},
                    debitor: { "$first" : '$debitor_info.general_info'},
                    // $group:{
                    //     _id : '$inventory.type',
                    amount:{'$sum': '$inventory.amount'} 
                    // } 
                    
                },
            },

            {
                $project : { 
                    _id: 0,
                    id : '$_id.id',
                    debit_after_int : 1 ,
                    amt: { type :  '$_id.type' , amount : '$amount' },
                    kist_type :  1,
                    kist_start_date: 1,
                    debitor: 1,
                    amount:'$amount' 
                    } 
            },
            {
                $group : { 
                    _id : '$id',
                    debit_after_int : { "$first" : '$debit_after_int'},
                    kist_type :   { "$first" : '$kist_type'},
                    kist_start_date: { "$first" : '$kist_start_date'},
                    debitor_name: { "$first" : '$debitor.name'},
                    debitor_whatsapp: {"$first" : '$debitor.number.1'},
                    data: {$push : '$amt'},
                    
                },
            },
            {
                $addFields:{
                    recived:0,
                    debit_amount:0,
                    discount:0,
                    penalty_recived:0,
                    penalty_imposed:0
                }
            }


        ]);

    //     await Debitor.populate(debits, 
    //         'debitor' 
    //    );


        for (let s = 0; s < debits.length; s++) {
            for (let i = 0; i < debits[s].data.length; i++) {
            if (debits[s].data[i].type === "Loan Given Actual Amount") {
                debits[s].debit_amount = debits[s].data[i].amount;
            } else if (debits[s].data[i].type === "Recived Debitor") {
                debits[s].recived = debits[s].data[i].amount;
            }
            }
        }



        let list = await Debitor.aggregate(
            [
                {
                    $match : { user_id : mongoose.Types.ObjectId(req.user.id) },
                }, {
                  '$lookup': {
                    'from': 'transactions', 
                    'localField': 'transactions', 
                    'foreignField': '_id', 
                    'as': 'tran'
                  }
                }, {
                  '$unwind': {
                    'path': '$tran'
                  }
                }, {
                  '$group': {
                    '_id': {
                      'id': '$_id', 
                      'tran_type': '$tran.type'
                    }, 
                    'debits': {
                      '$first': '$debits'
                    }, 
                    'name': {
                      '$first': '$general_info.name'
                    }, 
                    'number': {
                      '$first': '$general_info.number.1'
                    }, 
                    'amount': {
                      '$sum': '$tran.amount'
                    }
                  }
                }, {
                  '$project': {
                    '_id': 0, 
                    'id': '$_id.id', 
                    'name': 1, 
                    'number': 1, 
                    'amt': {
                      'type': '$_id.tran_type', 
                      'amount': '$amount'
                    }, 
                    'debits': 1
                  }
                }, {
                  '$group': {
                    '_id': '$id', 
                    'name': {
                      '$first': '$name'
                    }, 
                    'number': {
                      '$first': '$number'
                    }, 
                    'data': {
                      '$push': '$amt'
                    }, 
                    'debits': {
                      '$first': '$debits'
                    }
                  }
                }, {
                  '$lookup': {
                    'from': 'debits', 
                    'localField': 'debits', 
                    'foreignField': '_id', 
                    'as': 'deb'
                  }
                }, {
                  '$unwind': {
                    'path': '$deb'
                  }
                }, {
                  '$group': {
                    '_id': '$_id', 
                    'name': {
                      '$first': '$name'
                    }, 
                    'number': {
                      '$first': '$number'
                    }, 
                    'data': {
                      '$first': '$data'
                    }, 
                    'debit_after_intrest': {
                      '$sum': '$deb.debit_after_intrest'
                    }
                  }
                },{
                    $addFields:{
                        recived:0,
                        debit_amount:0,
                        discount:0,
                        penalty_recived:0,
                        penalty_imposed:0
                    }
                },
                {
                    $sort:{
                        name:1
                    }
                }
              ]
        )

        for (let s = 0; s < list.length; s++) {
            for (let i = 0; i < list[s].data.length; i++) {
            if (list[s].data[i].type === "Loan Given Actual Amount") {
                list[s].debit_amount = list[s].data[i].amount;
            } else if (list[s].data[i].type === "Recived Debitor") {
                list[s].recived = list[s].data[i].amount;
            }else if (list[s].data[i].type === "Penalty Imposed") {
                list[s].penalty_imposed = list[s].data[i].amount;
            }else if (list[s].data[i].type === "Penalty Collected") {
                list[s].penalty_recived = list[s].data[i].amount;
            }
            
            }
        }//function for debitor list


        return res.json('200',{
            data: debits,
            // debitor:list
        });

    } catch (error) {
        return res.json('500',{
            message:`internal server error : ${error}`
        })
    }


}
module.exports.debitors_list = async function(req,res){
    try {
        let list = await Debitor.aggregate([{$match: {
          user_id: mongoose.Types.ObjectId('625562ece60d464e6cd67c8b')
         }}, {$project: {
          _id: 1,
          name: '$general_info.name',
          number: '$general_info.number.1',
          guarentor: '$general_info.guarentor_name',
          transactions: 1,
          debits: 1
         }}, {$lookup: {
          from: 'debits',
          localField: 'debits',
          foreignField: '_id',
          pipeline: [
           {
            $group: {
             _id: '',
             deb_after_int: {
              $sum: '$debit_after_intrest'
             }
            }
           }
          ],
          as: 'deb'
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
          path: '$tran',
          preserveNullAndEmptyArrays: false
         }}, {$unwind: {
          path: '$deb',
          preserveNullAndEmptyArrays: false
         }}, {$project: {
          _id: 1,
          name: 1,
          number: 1,
          guarentor: 1,
          deb_after_intrest: '$deb.deb_after_int',
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
          }
         }}, {$group: {
          _id: '$_id',
          name: {
           $first: '$name'
          },
          number: {
           $first: '$number'
          },
          guarentor: {
           $first: '$guarentor'
          },
          deb_after_intrest: {
           $first: '$deb_after_intrest'
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
          }
         }}])

        return res.json('200',{
            data: list,
        });

    } catch (error) {
        return res.json('500',{
            message:`internal server error : ${error}`
        })
    }
}
module.exports.creditors_list = async function(req,res){
    try {
        let list = await Creditor.aggregate(
            [
                {
                    $match : { user_id : mongoose.Types.ObjectId(req.user.id) },
                },
              ]
        );
        

        // for (let s = 0; s < list.length; s++) {
        //     for (let i = 0; i < list[s].data.length; i++) {
        //     if (list[s].data[i].type === "Loan Given Actual Amount") {
        //         list[s].debit_amount = list[s].data[i].amount;
        //     } else if (list[s].data[i].type === "Recived Debitor") {
        //         list[s].recived = list[s].data[i].amount;
        //     }else if (list[s].data[i].type === "Penalty Imposed") {
        //         list[s].penalty_imposed = list[s].data[i].amount;
        //     }else if (list[s].data[i].type === "Penalty Collected") {
        //         list[s].penalty_recived = list[s].data[i].amount;
        //     }
            
        //     }
        // }//function for creditor list

        return res.json('200',{
            data: list,
        });

    } catch (error) {
        return res.json('500',{
            message:`internal server error : ${error}`
        })
    }
}
module.exports.debitor_profile = async function (req,res){   
    try {
        let list = await Debit.aggregate([{$match: {
            user_id: mongoose.Types.ObjectId('625562ece60d464e6cd67c8b'),
            debitor_id: mongoose.Types.ObjectId('626440e30463d1ceab2391a7')
           }}, {$lookup: {
            from: 'transactions',
            localField: 'transactions',
            foreignField: '_id',
            as: 'tran'
           }}, {$unwind: {
            path: '$tran'
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
            debit_type: 1
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
            }
           }}]);
        



        return res.json('200',{
            data: list,
        });

    } catch (error) {
        return res.json('500',{
            message:`internal server error : ${error}`
        })
    }
}



