const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        // default:""
    },
    amount:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        // default:new date()
    },
    comment:{
        type:String,
    },
    from:{
        type:String,
    },
    person_id_debitor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Debitor',
            // default:""
    },
    debit_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Debit',
    },
    person_id_creditor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Creditor',
            // default:""
        },
    credit_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Credit',
    },


}, {
    timestamps: true
});


const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;