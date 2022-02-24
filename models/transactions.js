const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
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
    person_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Debitor',
        // default:""
    },

}, {
    timestamps: true
});


const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;