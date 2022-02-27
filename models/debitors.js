const mongoose = require('mongoose');

const debitorSchema = new mongoose.Schema({

    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        // default:""
    },

    general_info:{
        username:{
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        number:{
            1:{ type:String },
            2:{ type:String},
            3:{type:String},
        },
        address: {
            type: String,
        },
        shop: {
            type: String,
        },
        guarentor_name: {
            type: String,
        },
        guarentor_number:{
            1:{ type:String },
            2:{ type:String},
            3:{type:String},
        },
        comment:{
            type:String,
        },
        initialised:{
            type:Boolean,
            default:false,
        }




    },
    money:{
        real_debit:{
            type:Number,
        },
        debit_after_intrest:{
            type:Number,
        },
        discount:{
            type:Number,
            default:0
        },
        penalty:{
            type:Number,
            default:0

        },
        daily_installment_amount:{
            type:Number,
        },
        returned:{
            type:Number,
            default:0

        },
        days_given_init:{
            type:Number,
        },
        last_payment:{
            type: Date,

        },
        debit_init_date:{
            type: Date,
        }

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


const Debitor = mongoose.model('Debitor', debitorSchema);

module.exports = Debitor;