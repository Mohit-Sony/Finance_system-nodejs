const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({

    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        // default:""
    },

    creditor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Creditor',
        // default:""
    },

    type:{
        type:String,
        required:true,
    },//types -> normal_credit , holayati , credit with intrest rate

    Installment_type:{
        type:String,
        required:true,    
    },
    Status:{
        type:String,
        enum:['ongoing','closed'],
        required:true, 
    },

    real_credit:{
        type:Number,
        required:true,
    },

    credit_after_intrest:{
        type:Number,
    },

    credit_init_date:{
        type: Date,
        required:true,

    },
    credit_end_date_init:{
        type: Date,

    },
    credit_settlement_date_real:{
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


const Credit = mongoose.model('Credit', creditSchema);

module.exports = Credit ;