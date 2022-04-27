const mongoose = require('mongoose');

const debitSchema = new mongoose.Schema({

    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        // default:""
    },

    debitor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Debitor',
        // default:""
    },

    type:{
        type:String,
        required:true,
    },//types -> normal_debit , holayati , debit with intrest rate

    Installment_type:{
        type:String,
        required:true,    
    },
    Status:{
        type:String,
        enum:['ongoing','closed'],
        required:true, 
    },

    real_debit:{
        type:Number,
        required:true,
    },

    debit_after_intrest:{
        type:Number,
    },

    debit_init_date:{
        type: Date,
        required:true,

    },
    debit_end_date_init:{
        type: Date,

    },
    debit_settlement_date_real:{
        type: Date,

    },

    days_given_init:{
        type:Number,
    },

    installment_amount:{
        type:Number,
    },
   
    last_payment:{
        type: Date,

    },
    last_payment_amount:{
        type: Number,

    },
    Intrest_rate_yearly:{
        type: Number,
    },

    transactions:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Transaction"
        }
    ]

}, {
    timestamps: true
});


const Debit = mongoose.model('Debit', debitSchema);

module.exports = Debit ;